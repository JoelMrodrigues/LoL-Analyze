import React, { useState } from 'react';
import DraftSystemManager from './DraftSystemManager';
import PerfectDraftInterface from './PerfectDraftInterface';

// Composant principal qui gère l'état de l'application
const CompleteDraftSystem = () => {
  const [currentView, setCurrentView] = useState('manager'); // 'manager' ou 'draft'
  const [currentDraft, setCurrentDraft] = useState(null);

  const handleSelectDraft = (draft) => {
    setCurrentDraft(draft);
    setCurrentView('draft');
  };

  const handleSaveDraft = (updatedDraft) => {
    // Mettre à jour la draft dans les projets
    const savedProjects = JSON.parse(localStorage.getItem('lol_analyzer_draft_projects') || '[]');
    
    const updatedProjects = savedProjects.map(project => {
      if (project.id === updatedDraft.id) {
        return updatedDraft;
      }
      
      if (project.drafts) {
        const updatedDrafts = project.drafts.map(draft =>
          draft.id === updatedDraft.id ? updatedDraft : draft
        );
        
        if (updatedDrafts !== project.drafts) {
          return { ...project, drafts: updatedDrafts, updatedAt: new Date().toISOString() };
        }
      }
      
      return project;
    });

    localStorage.setItem('lol_analyzer_draft_projects', JSON.stringify(updatedProjects));
    setCurrentDraft(updatedDraft);
    
    // Notification de sauvegarde
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = '✅ Draft sauvegardée !';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleBackToManager = () => {
    setCurrentView('manager');
    setCurrentDraft(null);
  };

  if (currentView === 'draft' && currentDraft) {
    return (
      <PerfectDraftInterface
        draftData={currentDraft}
        onSave={handleSaveDraft}
        onBack={handleBackToManager}
      />
    );
  }

  return (
    <DraftSystemManager 
      onSelectDraft={handleSelectDraft}
    />
  );
};

export default CompleteDraftSystem;