import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Edit3, 
  Trash2, 
  Folder, 
  FolderOpen,
  X,
  Search,
  Copy,
  Move,
  MoreVertical,
  FileText,
  Shield,
  Swords,
  AlertTriangle,
  Check,
  ExternalLink,
  Eye
} from 'lucide-react';

// Composant principal pour la gestion des Bans
const BansInterface = ({ 
  teamData,
  onBack = () => {} 
}) => {
  const [currentView, setCurrentView] = useState('selector'); // 'selector', 'our-bans', 'enemy-bans', 'draft-detail'
  const [urlProjects, setUrlProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [processedDrafts, setProcessedDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [editingTeamNames, setEditingTeamNames] = useState(null);

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedUrlProjects = localStorage.getItem('lol_analyzer_url_projects');
    if (savedUrlProjects) {
      try {
        setUrlProjects(JSON.parse(savedUrlProjects));
      } catch (error) {
        console.error('Erreur chargement projets URL:', error);
      }
    } else {
      // Créer un projet par défaut
      const defaultProject = createUrlProject('Mes URLs de Draft');
      setUrlProjects([defaultProject]);
    }

    const savedProcessedDrafts = localStorage.getItem('lol_analyzer_processed_drafts');
    if (savedProcessedDrafts) {
      try {
        setProcessedDrafts(JSON.parse(savedProcessedDrafts));
      } catch (error) {
        console.error('Erreur chargement drafts traitées:', error);
      }
    }
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    if (urlProjects.length > 0) {
      localStorage.setItem('lol_analyzer_url_projects', JSON.stringify(urlProjects));
    }
  }, [urlProjects]);

  useEffect(() => {
    localStorage.setItem('lol_analyzer_processed_drafts', JSON.stringify(processedDrafts));
  }, [processedDrafts]);

  // Fonctions utilitaires
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createUrlProject = (name) => ({
    id: generateId(),
    name,
    type: 'url-project',
    urls: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const createUrl = (url, projectId = null) => ({
    id: generateId(),
    url,
    name: `Draft ${url.split('/').pop()}`,
    type: 'url',
    projectId,
    processed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Vérifier si une équipe est "Exalty" (avec variantes)
  const isExaltyTeam = (teamName) => {
    if (!teamName) return false;
    const name = teamName.toLowerCase();
    return name.includes('exalty') || name.includes('exal') || name === 'ex';
  };

  // Actions sur les projets/URLs
  const handleCreateUrlProject = () => {
    const newProject = createUrlProject('Nouveau Projet URL');
    setUrlProjects([...urlProjects, newProject]);
    setEditingItem(newProject.id);
    setEditingName(newProject.name);
    setShowCreateMenu(false);
  };

  const handleAddUrl = (projectId = null) => {
    const url = prompt('Entrez l\'URL de la draft:');
    if (!url) return;

    if (!url.includes('drafter.lol/draft/')) {
      alert('URL invalide. Veuillez utiliser une URL drafter.lol valide.');
      return;
    }

    const newUrl = createUrl(url, projectId);
    
    if (projectId) {
      // Ajouter l'URL à un projet
      setUrlProjects(urlProjects.map(project => 
        project.id === projectId
          ? { ...project, urls: [...project.urls, newUrl], updatedAt: new Date().toISOString() }
          : project
      ));
    } else {
      // Créer une URL indépendante
      setUrlProjects([...urlProjects, newUrl]);
    }
  };

  const handleRename = (id, newName) => {
    if (!newName.trim()) return;
    
    setUrlProjects(urlProjects.map(project => {
      if (project.id === id) {
        return { ...project, name: newName.trim(), updatedAt: new Date().toISOString() };
      }
      
      if (project.urls) {
        const updatedUrls = project.urls.map(url =>
          url.id === id 
            ? { ...url, name: newName.trim(), updatedAt: new Date().toISOString() }
            : url
        );
        
        if (updatedUrls !== project.urls) {
          return { ...project, urls: updatedUrls, updatedAt: new Date().toISOString() };
        }
      }
      
      return project;
    }));
    
    setEditingItem(null);
    setEditingName('');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    setUrlProjects(urlProjects.filter(project => {
      if (project.id === id) return false;
      
      if (project.urls) {
        project.urls = project.urls.filter(url => url.id !== id);
      }
      
      return true;
    }));
  };

  const handleDuplicate = (item) => {
    if (item.type === 'url-project') {
      const duplicatedProject = {
        ...item,
        id: generateId(),
        name: `${item.name} (Copie)`,
        urls: item.urls.map(url => ({
          ...url,
          id: generateId(),
          name: `${url.name} (Copie)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUrlProjects([...urlProjects, duplicatedProject]);
    } else {
      const duplicatedUrl = {
        ...item,
        id: generateId(),
        name: `${item.name} (Copie)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (item.projectId) {
        setUrlProjects(urlProjects.map(project => 
          project.id === item.projectId
            ? { ...project, urls: [...project.urls, duplicatedUrl], updatedAt: new Date().toISOString() }
            : project
        ));
      } else {
        setUrlProjects([...urlProjects, duplicatedUrl]);
      }
    }
  };

  const toggleProject = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Traitement des URLs (simulation basée sur votre script)
  const processUrl = async (urlItem) => {
    try {
      // Marquer comme en cours de traitement
      setUrlProjects(prev => prev.map(project => {
        if (project.id === urlItem.id) {
          return { ...project, processing: true };
        }
        if (project.urls) {
          const updatedUrls = project.urls.map(url =>
            url.id === urlItem.id ? { ...url, processing: true } : url
          );
          return { ...project, urls: updatedUrls };
        }
        return project;
      }));

      // Simulation de données de bans (remplacez par votre logique réelle)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation délai

      // Simuler parfois des noms d'équipes manquants
      const hasTeamNames = Math.random() > 0.3; // 70% de chance d'avoir des noms
      
      const mockDraftData = {
        id: generateId(),
        url: urlItem.url,
        urlId: urlItem.id,
        processedAt: new Date().toISOString(),
        team1Name: hasTeamNames ? (Math.random() > 0.5 ? 'Team EXALTY' : 'Enemy Squad') : '',
        team2Name: hasTeamNames ? (Math.random() > 0.5 ? 'Rival Team' : 'EXALTY Gaming') : '',
        team1Bans: ['Yasuo', 'Jinx', 'Thresh', 'Lee Sin', 'Ahri'],
        team2Bans: ['Zed', 'Caitlyn', 'Leona', 'Graves', 'Syndra'],
        hasError: !hasTeamNames,
        errorMessage: !hasTeamNames ? 'Noms d\'équipes manquants' : null
      };

      // Ajouter aux drafts traitées
      setProcessedDrafts(prev => [...prev, mockDraftData]);

      // Marquer comme traité
      setUrlProjects(prev => prev.map(project => {
        if (project.id === urlItem.id) {
          return { ...project, processed: true, processing: false };
        }
        if (project.urls) {
          const updatedUrls = project.urls.map(url =>
            url.id === urlItem.id ? { ...url, processed: true, processing: false } : url
          );
          return { ...project, urls: updatedUrls };
        }
        return project;
      }));

      alert('URL traitée avec succès !');
    } catch (error) {
      console.error('Erreur traitement URL:', error);
      // Retirer le flag de traitement en cas d'erreur
      setUrlProjects(prev => prev.map(project => {
        if (project.id === urlItem.id) {
          return { ...project, processing: false };
        }
        if (project.urls) {
          const updatedUrls = project.urls.map(url =>
            url.id === urlItem.id ? { ...url, processing: false } : url
          );
          return { ...project, urls: updatedUrls };
        }
        return project;
      }));
      alert('Erreur lors du traitement de l\'URL');
    }
  };

  // Modifier les noms d'équipes
  const handleEditTeamNames = (draftId, newTeam1Name, newTeam2Name) => {
    setProcessedDrafts(prev => prev.map(draft => 
      draft.id === draftId 
        ? { 
            ...draft, 
            team1Name: newTeam1Name, 
            team2Name: newTeam2Name,
            hasError: !newTeam1Name || !newTeam2Name,
            errorMessage: (!newTeam1Name || !newTeam2Name) ? 'Noms d\'équipes manquants' : null
          }
        : draft
    ));
    setEditingTeamNames(null);
  };

  // Obtenir les bans de notre équipe
  const getOurBans = () => {
    const ourBans = [];
    processedDrafts.forEach(draft => {
      if (isExaltyTeam(draft.team1Name)) {
        ourBans.push({
          draftId: draft.id,
          teamName: draft.team1Name || 'Équipe sans nom',
          bans: draft.team1Bans,
          date: draft.processedAt,
          url: draft.url,
          hasError: draft.hasError
        });
      }
      if (isExaltyTeam(draft.team2Name)) {
        ourBans.push({
          draftId: draft.id,
          teamName: draft.team2Name || 'Équipe sans nom',
          bans: draft.team2Bans,
          date: draft.processedAt,
          url: draft.url,
          hasError: draft.hasError
        });
      }
    });
    return ourBans;
  };

  // Obtenir les bans ennemis
  const getEnemyBans = () => {
    const enemyBans = [];
    processedDrafts.forEach(draft => {
      if (!isExaltyTeam(draft.team1Name)) {
        enemyBans.push({
          draftId: draft.id,
          teamName: draft.team1Name || 'Équipe sans nom',
          bans: draft.team1Bans,
          date: draft.processedAt,
          url: draft.url,
          hasError: draft.hasError
        });
      }
      if (!isExaltyTeam(draft.team2Name)) {
        enemyBans.push({
          draftId: draft.id,
          teamName: draft.team2Name || 'Équipe sans nom',
          bans: draft.team2Bans,
          date: draft.processedAt,
          url: draft.url,
          hasError: draft.hasError
        });
      }
    });
    return enemyBans;
  };

  // Filtrage par recherche
  const filteredProjects = urlProjects.filter(project => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const matchesProject = project.name.toLowerCase().includes(query);
    
    if (project.urls) {
      const matchesUrl = project.urls.some(url => 
        url.name.toLowerCase().includes(query) || url.url.toLowerCase().includes(query)
      );
      return matchesProject || matchesUrl;
    }
    
    return matchesProject;
  });

  // Composant Item (projet ou URL)
  const ItemComponent = ({ item, isInProject = false, projectId = null }) => {
    const isEditing = editingItem === item.id;
    const isProject = item.type === 'url-project';
    const isExpanded = isProject && expandedProjects.has(item.id);

    // Trouver la draft associée si c'est une URL
    const associatedDraft = !isProject ? processedDrafts.find(draft => draft.urlId === item.id) : null;

    return (
      <div className="group">
        <div className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
          isInProject ? 'ml-6 border-l-2 border-gray-600' : ''
        }`}>
          {/* Icône et toggle pour les projets */}
          <div className="flex items-center mr-3">
            {isProject ? (
              <button
                onClick={() => toggleProject(item.id)}
                className="p-1 hover:bg-gray-600 rounded transition-colors mr-1"
              >
                {isExpanded ? (
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                ) : (
                  <Folder className="w-5 h-5 text-blue-400" />
                )}
              </button>
            ) : (
              <div className="ml-2 flex items-center">
                <FileText className="w-5 h-5 text-green-400" />
                {associatedDraft && (
                  <button
                    onClick={() => {
                      setSelectedDraft(associatedDraft);
                      setCurrentView('draft-detail');
                    }}
                    className="ml-2 p-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    title="Voir les détails de cette draft"
                  >
                    <Eye className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Nom (éditable) */}
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="bg-gray-600 text-white px-2 py-1 rounded text-sm flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRename(item.id, editingName);
                    } else if (e.key === 'Escape') {
                      setEditingItem(null);
                      setEditingName('');
                    }
                  }}
                />
                <button
                  onClick={() => handleRename(item.id, editingName)}
                  className="p-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
                >
                  <Save className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setEditingName('');
                  }}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div>
                <div className="font-medium text-white flex items-center gap-2">
                  {item.name}
                  {associatedDraft?.hasError && (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" title="Erreur dans cette draft" />
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {isProject 
                    ? `${item.urls?.length || 0} URL(s)`
                    : (
                      <div>
                        <div className="truncate">{item.url}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span>Modifié le {new Date(item.updatedAt).toLocaleDateString()}</span>
                          {item.processed && <span className="text-green-400">✅ Traité</span>}
                          {item.processing && <span className="text-yellow-400">🔄 En cours...</span>}
                          {associatedDraft?.hasError && (
                            <span className="text-yellow-400">⚠️ {associatedDraft.errorMessage}</span>
                          )}
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isProject && (
              <button
                onClick={() => handleAddUrl(item.id)}
                className="p-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
                title="Ajouter une URL"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            )}
            
            {!isProject && !item.processed && !item.processing && (
              <button
                onClick={() => processUrl(item)}
                className="p-1 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                title="Traiter cette URL"
              >
                <Shield className="w-4 h-4 text-white" />
              </button>
            )}
            
            <button
              onClick={() => {
                setEditingItem(item.id);
                setEditingName(item.name);
              }}
              className="p-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              title="Renommer"
            >
              <Edit3 className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={() => handleDuplicate(item)}
              className="p-1 bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
              title="Dupliquer"
            >
              <Copy className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Sous-éléments (URLs dans un projet) */}
        {isProject && isExpanded && item.urls && (
          <div className="ml-4">
            {item.urls.map(url => (
              <ItemComponent 
                key={url.id} 
                item={url} 
                isInProject={true}
                projectId={item.id}
              />
            ))}
            {item.urls.length === 0 && (
              <div className="ml-8 p-2 text-gray-500 text-sm italic">
                Aucune URL dans ce projet
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Composant de vue des bans
  const BansView = ({ type }) => {
    const bans = type === 'our' ? getOurBans() : getEnemyBans();
    const title = type === 'our' ? 'Nos Bans' : 'Bans Ennemies';
    const icon = type === 'our' ? <Shield className="w-6 h-6 text-blue-400" /> : <Swords className="w-6 h-6 text-red-400" />;

    // Grouper par équipe
    const groupedBans = bans.reduce((acc, ban) => {
      const teamName = ban.teamName;
      if (!acc[teamName]) {
        acc[teamName] = [];
      }
      acc[teamName].push(ban);
      return acc;
    }, {});

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <div className="text-sm text-gray-400">
            {bans.length} ban(s) de {Object.keys(groupedBans).length} équipe(s)
          </div>
        </div>

        {bans.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl mb-4">Aucune donnée de bans</p>
            <p>Traitez des URLs pour voir les bans apparaître ici</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBans).map(([teamName, teamBans]) => (
              <div key={teamName} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {teamName}
                    {teamBans.some(ban => ban.hasError) && (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" title="Équipe avec erreurs" />
                    )}
                  </h3>
                  <div className="text-sm text-gray-400">
                    {teamBans.length} draft(s)
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamBans.map(ban => (
                    <div key={`${ban.draftId}-${ban.date}`} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-400">
                          {new Date(ban.date).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => {
                            const draft = processedDrafts.find(d => d.id === ban.draftId);
                            setSelectedDraft(draft);
                            setCurrentView('draft-detail');
                          }}
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Voir draft
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {ban.bans.map((champion, index) => (
                          <div key={index} className="flex items-center gap-2 text-white">
                            <span className={`w-6 h-6 ${type === 'our' ? 'bg-blue-600' : 'bg-red-600'} rounded-full flex items-center justify-center text-xs font-bold`}>
                              {index + 1}
                            </span>
                            {champion}
                          </div>
                        ))}
                      </div>
                      
                      {ban.hasError && (
                        <div className="mt-3 p-2 bg-yellow-600 bg-opacity-20 rounded text-yellow-400 text-xs">
                          ⚠️ {processedDrafts.find(d => d.id === ban.draftId)?.errorMessage}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Vue détaillée d'une draft
  const DraftDetailView = ({ draft }) => {
    if (!draft) return null;

    const isTeam1Exalty = isExaltyTeam(draft.team1Name);
    const isTeam2Exalty = isExaltyTeam(draft.team2Name);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Draft du {new Date(draft.processedAt).toLocaleDateString()}
            </h2>
            <div className="flex items-center gap-3">
              <a 
                href={draft.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Voir sur drafter.lol
              </a>
              {draft.hasError && (
                <button
                  onClick={() => setEditingTeamNames(draft.id)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Corriger les noms
                </button>
              )}
            </div>
          </div>

          {draft.hasError && (
            <div className="mb-4 p-4 bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">{draft.errorMessage}</span>
              </div>
              <p className="text-yellow-300 text-sm mt-1">
                Cliquez sur "Corriger les noms" pour spécifier qui est qui.
              </p>
            </div>
          )}
        </div>

        {/* Modal d'édition des noms d'équipes */}
        {editingTeamNames === draft.id && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Corriger les noms d'équipes</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Équipe 1 (Bans: {draft.team1Bans.join(', ')})
                  </label>
                  <input
                    type="text"
                    defaultValue={draft.team1Name}
                    id="team1-name"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Nom de l'équipe 1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Équipe 2 (Bans: {draft.team2Bans.join(', ')})
                  </label>
                  <input
                    type="text"
                    defaultValue={draft.team2Name}
                    id="team2-name"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Nom de l'équipe 2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingTeamNames(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const team1Name = document.getElementById('team1-name').value;
                    const team2Name = document.getElementById('team2-name').value;
                    handleEditTeamNames(draft.id, team1Name, team2Name);
                    // Mettre à jour la draft sélectionnée
                    setSelectedDraft(prev => ({
                      ...prev,
                      team1Name,
                      team2Name,
                      hasError: !team1Name || !team2Name,
                      errorMessage: (!team1Name || !team2Name) ? 'Noms d\'équipes manquants' : null
                    }));
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Affichage des bans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Équipe 1 */}
          <div className={`bg-gray-800 rounded-lg p-6 border-2 ${
            isTeam1Exalty ? 'border-blue-500' : 'border-red-500'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isTeam1Exalty ? 'text-blue-400' : 'text-red-400'}`}>
                {draft.team1Name || 'Équipe 1 (sans nom)'}
              </h3>
              <div className="flex items-center gap-2">
                {isTeam1Exalty && (
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    NOS BANS
                  </div>
                )}
                {!isTeam1Exalty && (
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    BANS ENNEMIS
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {draft.team1Bans.map((champion, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <span className={`w-8 h-8 ${
                    isTeam1Exalty ? 'bg-blue-600' : 'bg-red-600'
                  } rounded-full flex items-center justify-center text-sm font-bold`}>
                    {index + 1}
                  </span>
                  <span className="text-lg">{champion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Équipe 2 */}
          <div className={`bg-gray-800 rounded-lg p-6 border-2 ${
            isTeam2Exalty ? 'border-blue-500' : 'border-red-500'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isTeam2Exalty ? 'text-blue-400' : 'text-red-400'}`}>
                {draft.team2Name || 'Équipe 2 (sans nom)'}
              </h3>
              <div className="flex items-center gap-2">
                {isTeam2Exalty && (
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    NOS BANS
                  </div>
                )}
                {!isTeam2Exalty && (
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    BANS ENNEMIS
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {draft.team2Bans.map((champion, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <span className={`w-8 h-8 ${
                    isTeam2Exalty ? 'bg-blue-600' : 'bg-red-600'
                  } rounded-full flex items-center justify-center text-sm font-bold`}>
                    {index + 1}
                  </span>
                  <span className="text-lg">{champion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">📊 Résumé de cette draft</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-600 bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">
                {(isTeam1Exalty ? draft.team1Bans : []).concat(isTeam2Exalty ? draft.team2Bans : []).length}
              </div>
              <div className="text-sm text-blue-300">Nos bans</div>
            </div>
            <div className="bg-red-600 bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-400">
                {(!isTeam1Exalty ? draft.team1Bans : []).concat(!isTeam2Exalty ? draft.team2Bans : []).length}
              </div>
              <div className="text-sm text-red-300">Bans ennemis</div>
            </div>
            <div className="bg-gray-600 bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">10</div>
              <div className="text-sm text-gray-300">Total bans</div>
            </div>
            <div className="bg-purple-600 bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-400">
                {new Date(draft.processedAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-purple-300">Date</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Vue de sélection principale
  const SelectorView = () => (
    <div className="flex h-full">
      {/* Section gauche: Gestionnaire d'URLs */}
      <div className="w-1/2 pr-4 border-r border-gray-700">
        <div className="space-y-4">
          {/* Header avec recherche et création */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Gestionnaire d'URLs</h3>
            
            <div className="flex items-center gap-3">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none w-48"
                />
              </div>

              {/* Menu de création */}
              <div className="relative">
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Créer
                </button>

                {showCreateMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-48">
                    <button
                      onClick={handleCreateUrlProject}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white flex items-center gap-2"
                    >
                      <Folder className="w-4 h-4 text-blue-400" />
                      Nouveau Projet
                    </button>
                    <button
                      onClick={() => handleAddUrl()}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-green-400" />
                      Nouvelle URL
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Liste des projets et URLs */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Aucun projet trouvé</p>
                <p className="text-sm mb-4">Créez votre premier projet ou ajoutez une URL pour commencer</p>
                <button
                  onClick={handleCreateUrlProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Créer un projet
                </button>
              </div>
            ) : (
              <div className="p-2">
                {filteredProjects.map(project => (
                  <ItemComponent key={project.id} item={project} />
                ))}
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="flex gap-4 text-sm text-gray-400">
            <span>{urlProjects.filter(p => p.type === 'url-project').length} projet(s)</span>
            <span>
              {urlProjects.reduce((acc, p) => 
                acc + (p.type === 'url' ? 1 : (p.urls?.length || 0)), 0
              )} URL(s)
            </span>
            <span>{processedDrafts.length} draft(s) traitée(s)</span>
          </div>
        </div>
      </div>

      {/* Section droite: Aperçu des bans */}
      <div className="w-1/2 pl-4">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Aperçu des Bans</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('our-bans')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
            >
              <Shield className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Nos Bans</div>
              <div className="text-sm opacity-80">{getOurBans().length} ban(s)</div>
            </button>
            
            <button
              onClick={() => setCurrentView('enemy-bans')}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-colors"
            >
              <Swords className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Bans Ennemies</div>
              <div className="text-sm opacity-80">{getEnemyBans().length} ban(s)</div>
            </button>
          </div>

          {/* Dernières drafts traitées */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-white mb-3">📋 Dernières drafts traitées</h4>
            {processedDrafts.length === 0 ? (
              <p className="text-gray-400 text-sm">Aucune draft traitée</p>
            ) : (
              <div className="space-y-2">
                {processedDrafts.slice(-5).reverse().map(draft => (
                  <div 
                    key={draft.id}
                    className="flex items-center justify-between p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      setSelectedDraft(draft);
                      setCurrentView('draft-detail');
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm">
                        {new Date(draft.processedAt).toLocaleDateString()}
                      </span>
                      {draft.hasError && (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-white mb-2">💡 Instructions</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Ajoutez vos URLs de draft drafter.lol</li>
              <li>• Organisez-les dans des projets</li>
              <li>• Cliquez sur le bouton violet 🟣 pour traiter une URL</li>
              <li>• Les équipes avec "Exalty" → Nos bans</li>
              <li>• Les autres équipes → Bans ennemies</li>
              <li>• Cliquez sur l'œil 👁️ pour voir une draft en détail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView !== 'selector' && (
              <button
                onClick={() => {
                  setCurrentView('selector');
                  setSelectedDraft(null);
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
            )}
            <h1 className="text-2xl font-bold text-white">
              {currentView === 'selector' ? 'Gestion des Bans' : 
               currentView === 'our-bans' ? 'Nos Bans' : 
               currentView === 'enemy-bans' ? 'Bans Ennemies' :
               currentView === 'draft-detail' ? 'Détail de la Draft' : 'Gestion des Bans'}
            </h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 overflow-hidden">
        {currentView === 'selector' && <SelectorView />}
        {currentView === 'our-bans' && <BansView type="our" />}
        {currentView === 'enemy-bans' && <BansView type="enemy" />}
        {currentView === 'draft-detail' && <DraftDetailView draft={selectedDraft} />}
      </div>
    </div>
  );
};

export default BansInterface;