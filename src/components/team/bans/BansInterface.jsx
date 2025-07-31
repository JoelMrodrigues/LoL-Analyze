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
  Swords
} from 'lucide-react';

// Composant principal pour la gestion des Bans
const BansInterface = ({ 
  teamData,
  onBack = () => {} 
}) => {
  const [currentView, setCurrentView] = useState('selector'); // 'selector', 'our-bans', 'enemy-bans'
  const [urlProjects, setUrlProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [bansData, setBansData] = useState({
    ourBans: [],
    enemyBans: []
  });

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

    const savedBansData = localStorage.getItem('lol_analyzer_bans_data');
    if (savedBansData) {
      try {
        setBansData(JSON.parse(savedBansData));
      } catch (error) {
        console.error('Erreur chargement données bans:', error);
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
    localStorage.setItem('lol_analyzer_bans_data', JSON.stringify(bansData));
  }, [bansData]);

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
    // Simulation du traitement - dans la réalité, vous appelleriez votre script
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

      const mockBansData = {
        team1Name: 'Équipe Bleue',
        team2Name: 'Équipe Rouge',
        team1: ['Yasuo', 'Jinx', 'Thresh', 'Lee Sin', 'Ahri'],
        team2: ['Zed', 'Caitlyn', 'Leona', 'Graves', 'Syndra']
      };

      // Ajouter aux données de bans
      setBansData(prev => ({
        ...prev,
        ourBans: [...prev.ourBans, {
          id: generateId(),
          url: urlItem.url,
          date: new Date().toISOString(),
          ...mockBansData
        }]
      }));

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
              <FileText className="w-5 h-5 text-green-400 ml-2" />
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
                <div className="font-medium text-white">{item.name}</div>
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
    const bans = type === 'our' ? bansData.ourBans : bansData.enemyBans;
    const title = type === 'our' ? 'Nos Bans' : 'Bans Ennemies';
    const icon = type === 'our' ? <Shield className="w-6 h-6 text-blue-400" /> : <Swords className="w-6 h-6 text-red-400" />;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <div className="text-sm text-gray-400">
            {bans.length} draft(s) analysée(s)
          </div>
        </div>

        {bans.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl mb-4">Aucune donnée de bans</p>
            <p>Traitez des URLs pour voir les bans apparaître ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bans.map(ban => (
              <div key={ban.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Draft du {new Date(ban.date).toLocaleDateString()}</h3>
                  <a 
                    href={ban.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Voir la draft →
                  </a>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-3">{ban.team1Name}</h4>
                    <div className="space-y-2">
                      {ban.team1.map((champion, index) => (
                        <div key={index} className="flex items-center gap-2 text-white">
                          <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          {champion}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-400 mb-3">{ban.team2Name}</h4>
                    <div className="space-y-2">
                      {ban.team2.map((champion, index) => (
                        <div key={index} className="flex items-center gap-2 text-white">
                          <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          {champion}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
              <div className="text-sm opacity-80">{bansData.ourBans.length} draft(s)</div>
            </button>
            
            <button
              onClick={() => setCurrentView('enemy-bans')}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-colors"
            >
              <Swords className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Bans Ennemies</div>
              <div className="text-sm opacity-80">{bansData.enemyBans.length} draft(s)</div>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-white mb-2">💡 Instructions</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Ajoutez vos URLs de draft drafter.lol</li>
              <li>• Organisez-les dans des projets</li>
              <li>• Cliquez sur le bouton violet pour traiter une URL</li>
              <li>• Les bans apparaîtront automatiquement dans les sections correspondantes</li>
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
                onClick={() => setCurrentView('selector')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
            )}
            <h1 className="text-2xl font-bold text-white">
              {currentView === 'selector' ? 'Gestion des Bans' : 
               currentView === 'our-bans' ? 'Nos Bans' : 'Bans Ennemies'}
            </h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 overflow-hidden">
        {currentView === 'selector' && <SelectorView />}
        {currentView === 'our-bans' && <BansView type="our" />}
        {currentView === 'enemy-bans' && <BansView type="enemy" />}
      </div>
    </div>
  );
};

export default BansInterface;