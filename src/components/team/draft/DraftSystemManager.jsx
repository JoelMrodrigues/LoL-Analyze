import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  FolderOpen,
  Save,
  X,
  Search,
  MoreVertical,
  Copy,
  Move
} from 'lucide-react';

// Composant pour gérer les projets et drafts
const DraftSystemManager = ({ onSelectDraft }) => {
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedProjects = localStorage.getItem('lol_analyzer_draft_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (error) {
        console.error('Erreur chargement projets:', error);
      }
    } else {
      // Créer un projet par défaut
      const defaultProject = createProject('Mes Drafts');
      setProjects([defaultProject]);
    }
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('lol_analyzer_draft_projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Fonctions utilitaires
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createProject = (name) => ({
    id: generateId(),
    name,
    type: 'project',
    drafts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const createDraft = (name, projectId = null) => ({
    id: generateId(),
    name,
    type: 'draft',
    projectId,
    data: {
      blueSide: {
        bans: [null, null, null, null, null],
        picks: [null, null, null, null, null],
        roles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT']
      },
      redSide: {
        bans: [null, null, null, null, null],
        picks: [null, null, null, null, null],
        roles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT']
      },
      currentPhase: 'ban', // ban, pick
      currentSide: 'blue', // blue, red
      currentStep: 0
    },
    createdAt: new Date().toISOString(),  
    updatedAt: new Date().toISOString()
  });

  // Actions sur les projets/drafts
  const handleCreateProject = () => {
    const newProject = createProject('Nouveau Projet');
    setProjects([...projects, newProject]);
    setEditingItem(newProject.id);
    setEditingName(newProject.name);
    setShowCreateMenu(false);
  };

  const handleCreateDraft = (projectId = null) => {
    const newDraft = createDraft('Nouvelle Draft', projectId);
    
    if (projectId) {
      // Ajouter la draft à un projet
      setProjects(projects.map(project => 
        project.id === projectId
          ? { ...project, drafts: [...project.drafts, newDraft], updatedAt: new Date().toISOString() }
          : project
      ));
    } else {
      // Créer une draft indépendante
      setProjects([...projects, newDraft]);
    }
    
    setEditingItem(newDraft.id);
    setEditingName(newDraft.name);
    setShowCreateMenu(false);
  };

  const handleRename = (id, newName) => {
    if (!newName.trim()) return;
    
    setProjects(projects.map(project => {
      if (project.id === id) {
        return { ...project, name: newName.trim(), updatedAt: new Date().toISOString() };
      }
      
      if (project.drafts) {
        const updatedDrafts = project.drafts.map(draft =>
          draft.id === id 
            ? { ...draft, name: newName.trim(), updatedAt: new Date().toISOString() }
            : draft
        );
        
        if (updatedDrafts !== project.drafts) {
          return { ...project, drafts: updatedDrafts, updatedAt: new Date().toISOString() };
        }
      }
      
      return project;
    }));
    
    setEditingItem(null);
    setEditingName('');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    setProjects(projects.filter(project => {
      if (project.id === id) return false;
      
      if (project.drafts) {
        project.drafts = project.drafts.filter(draft => draft.id !== id);
      }
      
      return true;
    }));
  };

  const handleDuplicate = (item) => {
    if (item.type === 'project') {
      const duplicatedProject = {
        ...item,
        id: generateId(),
        name: `${item.name} (Copie)`,
        drafts: item.drafts.map(draft => ({
          ...draft,
          id: generateId(),
          name: `${draft.name} (Copie)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProjects([...projects, duplicatedProject]);
    } else {
      const duplicatedDraft = {
        ...item,
        id: generateId(),
        name: `${item.name} (Copie)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (item.projectId) {
        setProjects(projects.map(project => 
          project.id === item.projectId
            ? { ...project, drafts: [...project.drafts, duplicatedDraft], updatedAt: new Date().toISOString() }
            : project
        ));
      } else {
        setProjects([...projects, duplicatedDraft]);
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

  // Filtrage par recherche
  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const matchesProject = project.name.toLowerCase().includes(query);
    
    if (project.drafts) {
      const matchesDraft = project.drafts.some(draft => 
        draft.name.toLowerCase().includes(query)
      );
      return matchesProject || matchesDraft;
    }
    
    return matchesProject;
  });

  // Composant Item (projet ou draft)
  const ItemComponent = ({ item, isInProject = false, projectId = null }) => {
    const isEditing = editingItem === item.id;
    const isProject = item.type === 'project';
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
              <div 
                className={`cursor-pointer ${!isProject ? 'hover:text-blue-300' : ''}`}
                onClick={() => {
                  if (!isProject) {
                    onSelectDraft(item);
                  }
                }}
              >
                <div className="font-medium text-white">{item.name}</div>
                <div className="text-xs text-gray-400">
                  {isProject 
                    ? `${item.drafts?.length || 0} draft(s)`
                    : `Modifié le ${new Date(item.updatedAt).toLocaleDateString()}`
                  }
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isProject && (
              <button
                onClick={() => handleCreateDraft(item.id)}
                className="p-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
                title="Créer une draft"
              >
                <Plus className="w-4 h-4 text-white" />
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
              className="p-1 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
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

        {/* Sous-éléments (drafts dans un projet) */}
        {isProject && isExpanded && item.drafts && (
          <div className="ml-4">
            {item.drafts.map(draft => (
              <ItemComponent 
                key={draft.id} 
                item={draft} 
                isInProject={true}
                projectId={item.id}
              />
            ))}
            {item.drafts.length === 0 && (
              <div className="ml-8 p-2 text-gray-500 text-sm italic">
                Aucune draft dans ce projet
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header avec recherche et création */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestionnaire de Drafts</h2>
        
        <div className="flex items-center gap-3">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none w-64"
            />
          </div>

          {/* Menu de création */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-48">
                <button
                  onClick={handleCreateProject}
                  className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white flex items-center gap-2"
                >
                  <Folder className="w-4 h-4 text-blue-400" />
                  Nouveau Projet
                </button>
                <button
                  onClick={() => handleCreateDraft()}
                  className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-green-400" />
                  Nouvelle Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des projets et drafts */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Aucun projet trouvé</p>
            <p className="text-sm mb-4">Créez votre premier projet ou draft pour commencer</p>
            <button
              onClick={handleCreateProject}
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
        <span>{projects.filter(p => p.type === 'project').length} projet(s)</span>
        <span>
          {projects.reduce((acc, p) => 
            acc + (p.type === 'draft' ? 1 : (p.drafts?.length || 0)), 0
          )} draft(s)
        </span>
      </div>
    </div>
  );
};

export default DraftSystemManager;