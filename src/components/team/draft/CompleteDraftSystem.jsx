import React, { useState } from 'react';
import DraftSystemManager from './DraftSystemManager';
import DraftInterface from './DraftInterface';
import ChampionSelector from './ChampionDatabase';

// Version mise à jour de l'interface de draft avec le vrai sélecteur de champions
const EnhancedDraftInterface = ({ draftData, onSave, onBack }) => {
  const [currentDraft, setCurrentDraft] = useState(draftData);

  // Séquence de draft classique (à la LoL)
  const DRAFT_SEQUENCE = [
    { type: 'ban', side: 'blue', phase: 1 },
    { type: 'ban', side: 'red', phase: 1 },
    { type: 'ban', side: 'blue', phase: 1 },
    { type: 'ban', side: 'red', phase: 1 },
    { type: 'ban', side: 'blue', phase: 1 },
    { type: 'ban', side: 'red', phase: 1 },
    { type: 'pick', side: 'blue', phase: 1 },
    { type: 'pick', side: 'red', phase: 1 },
    { type: 'pick', side: 'red', phase: 1 },
    { type: 'pick', side: 'blue', phase: 1 },
    { type: 'pick', side: 'blue', phase: 1 },
    { type: 'pick', side: 'red', phase: 1 },
    { type: 'ban', side: 'red', phase: 2 },
    { type: 'ban', side: 'blue', phase: 2 },
    { type: 'ban', side: 'red', phase: 2 },
    { type: 'ban', side: 'blue', phase: 2 },
    { type: 'pick', side: 'red', phase: 2 },
    { type: 'pick', side: 'blue', phase: 2 },
    { type: 'pick', side: 'blue', phase: 2 },
    { type: 'pick', side: 'red', phase: 2 }
  ];

  const getCurrentStep = () => currentDraft?.data?.currentStep || 0;
  const getCurrentPhase = () => DRAFT_SEQUENCE[getCurrentStep()] || { type: 'completed', side: 'none', phase: 0 };

  const selectChampion = (championName) => {
    if (!championName) return;

    const currentStep = getCurrentStep();
    const currentPhase = getCurrentPhase();
    
    if (currentPhase.type === 'completed') return;

    const newDraft = { ...currentDraft };
    const side = currentPhase.side === 'blue' ? 'blueSide' : 'redSide';
    
    if (currentPhase.type === 'ban') {
      const banIndex = newDraft.data[side].bans.findIndex(ban => ban === null);
      if (banIndex !== -1) {
        newDraft.data[side].bans[banIndex] = championName;
        if (currentStep < DRAFT_SEQUENCE.length - 1) {
          newDraft.data.currentStep = currentStep + 1;
        }
      }
    } else if (currentPhase.type === 'pick') {
      const pickIndex = newDraft.data[side].picks.findIndex(pick => pick === null);
      if (pickIndex !== -1) {
        newDraft.data[side].picks[pickIndex] = championName;
        if (currentStep < DRAFT_SEQUENCE.length - 1) {
          newDraft.data.currentStep = currentStep + 1;
        }
      }
    }
    
    setCurrentDraft(newDraft);
  };

  const nextStep = () => {
    const currentStep = getCurrentStep();
    if (currentStep < DRAFT_SEQUENCE.length - 1) {
      setCurrentDraft(prev => ({
        ...prev,
        data: { ...prev.data, currentStep: currentStep + 1 }
      }));
    }
  };

  const previousStep = () => {
    const currentStep = getCurrentStep();
    if (currentStep > 0) {
      setCurrentDraft(prev => ({
        ...prev,
        data: { ...prev.data, currentStep: currentStep - 1 }
      }));
    }
  };

  const handleSave = () => {
    const updatedDraft = {
      ...currentDraft,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedDraft);
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir recommencer la draft ?')) {
      setCurrentDraft({
        ...currentDraft,
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
          currentStep: 0
        }
      });
    }
  };

  const currentPhase = getCurrentPhase();
  const currentStep = getCurrentStep();
  const isCompleted = currentPhase.type === 'completed';

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header de la draft */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Retour
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">{currentDraft?.name}</h1>
              <div className="text-sm text-gray-400">
                {isCompleted ? (
                  <span className="text-green-400">✅ Draft terminée</span>
                ) : (
                  <span>
                    Étape {currentStep + 1}/20 - 
                    <span className={`ml-1 font-semibold ${
                      currentPhase.type === 'ban' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {currentPhase.type === 'ban' ? 'BAN' : 'PICK'}
                    </span>
                    <span className={`ml-1 ${
                      currentPhase.side === 'blue' ? 'text-blue-400' : 'text-red-400'
                    }`}>
                      ({currentPhase.side === 'blue' ? 'ÉQUIPE BLEUE' : 'ÉQUIPE ROUGE'})
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
            >
              ↶
            </button>
            
            <button
              onClick={nextStep}
              disabled={isCompleted}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
            >
              ↷
            </button>

            <div className="w-px h-6 bg-gray-600 mx-2"></div>

            <button
              onClick={handleReset}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              🔄
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
            >
              💾 Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Interface principale de draft */}
      <div className="flex-1 flex">
        {/* Panneau de draft (équipes) */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Équipe Bleue */}
          <div className="flex-1 p-4">
            <div className="bg-blue-600 text-white text-center py-2 rounded-t-lg font-bold">
              BLUE SIDE
            </div>
            
            {/* Bans équipe bleue */}
            <div className="bg-gray-900 p-3 border-l-4 border-blue-500">
              <div className="text-sm text-gray-400 mb-2">BANS</div>
              <div className="flex gap-2">
                {currentDraft?.data?.blueSide?.bans?.map((ban, index) => (
                  <ChampionSlot
                    key={`blue-ban-${index}`}
                    champion={ban}
                    isEmpty={!ban}
                    isBan={true}
                    isActive={
                      currentPhase.type === 'ban' && 
                      currentPhase.side === 'blue' && 
                      currentDraft.data.blueSide.bans.filter(Boolean).length === index
                    }
                  />
                ))}
              </div>
            </div>

            {/* Picks équipe bleue */}
            <div className="bg-gray-900 p-3 border-l-4 border-blue-500">
              <div className="text-sm text-gray-400 mb-2">PICKS</div>
              <div className="space-y-2">
                {currentDraft?.data?.blueSide?.picks?.map((pick, index) => (
                  <div key={`blue-pick-${index}`} className="flex items-center gap-2">
                    <div className="w-8 text-xs text-blue-400 font-semibold">
                      {currentDraft.data.blueSide.roles[index]}
                    </div>
                    <ChampionSlot
                      champion={pick}
                      isEmpty={!pick}
                      isBan={false}
                      isActive={
                        currentPhase.type === 'pick' && 
                        currentPhase.side === 'blue' && 
                        currentDraft.data.blueSide.picks.filter(Boolean).length === index
                      }
                      size="large"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="h-8 bg-gray-700 flex items-center justify-center">
            <div className="text-gray-400 text-sm font-bold">VS</div>
          </div>

          {/* Équipe Rouge */}
          <div className="flex-1 p-4">
            <div className="bg-red-600 text-white text-center py-2 rounded-t-lg font-bold">
              RED SIDE
            </div>
            
            {/* Picks équipe rouge */}
            <div className="bg-gray-900 p-3 border-l-4 border-red-500">
              <div className="text-sm text-gray-400 mb-2">PICKS</div>
              <div className="space-y-2">
                {currentDraft?.data?.redSide?.picks?.map((pick, index) => (
                  <div key={`red-pick-${index}`} className="flex items-center gap-2">
                    <div className="w-8 text-xs text-red-400 font-semibold">
                      {currentDraft.data.redSide.roles[index]}
                    </div>
                    <ChampionSlot
                      champion={pick}
                      isEmpty={!pick}
                      isBan={false}
                      isActive={
                        currentPhase.type === 'pick' && 
                        currentPhase.side === 'red' && 
                        currentDraft.data.redSide.picks.filter(Boolean).length === index
                      }
                      size="large"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bans équipe rouge */}
            <div className="bg-gray-900 p-3 border-l-4 border-red-500">
              <div className="text-sm text-gray-400 mb-2">BANS</div>
              <div className="flex gap-2">
                {currentDraft?.data?.redSide?.bans?.map((ban, index) => (
                  <ChampionSlot
                    key={`red-ban-${index}`}
                    champion={ban}
                    isEmpty={!ban}
                    isBan={true}
                    isActive={
                      currentPhase.type === 'ban' && 
                      currentPhase.side === 'red' && 
                      currentDraft.data.redSide.bans.filter(Boolean).length === index
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sélecteur de champions complet */}
        <div className="flex-1 bg-gray-900">
          <ChampionSelector 
            onSelectChampion={selectChampion}
            bannedChampions={[
              ...(currentDraft?.data?.blueSide?.bans || []),
              ...(currentDraft?.data?.redSide?.bans || [])
            ].filter(Boolean)}
            pickedChampions={[
              ...(currentDraft?.data?.blueSide?.picks || []),
              ...(currentDraft?.data?.redSide?.picks || [])
            ].filter(Boolean)}
            currentPhase={currentPhase}
            disabled={isCompleted}
          />
        </div>
      </div>
    </div>
  );
};

// Composant pour les slots de champions
const ChampionSlot = ({ champion, isEmpty, isBan, isActive, size = 'small' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className={`w-full h-full rounded border-2 flex items-center justify-center ${
        isActive 
          ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 animate-pulse' 
          : isEmpty 
          ? 'border-gray-600 bg-gray-800' 
          : isBan 
          ? 'border-red-500 bg-red-900' 
          : 'border-blue-500 bg-blue-900'
      }`}>
        {champion ? (
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.replace(/[^a-zA-Z0-9]/g, '')}.png`}
            alt={champion}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/64x64/374151/9CA3AF?text=' + champion.charAt(0);
            }}
          />
        ) : (
          <div className="text-gray-500 text-xs text-center">
            {isActive ? '?' : ''}
          </div>
        )}
      </div>
      
      {isBan && champion && (
        <div className="absolute inset-0 bg-red-600 bg-opacity-60 flex items-center justify-center rounded">
          <div className="text-white text-xl font-bold">❌</div>
        </div>
      )}

      {isActive && (
        <div className="absolute -inset-1 border-2 border-yellow-400 rounded animate-pulse"></div>
      )}
    </div>
  );
};

// Composant principal qui gère l'état de l'application
const CompleteDraftSystem = () => {
  const [currentView, setCurrentView] = useState('manager'); // 'manager' ou 'draft'
  const [currentDraft, setCurrentDraft] = useState(null);
  const [projects, setProjects] = useState([]);

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
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleBackToManager = () => {
    setCurrentView('manager');
    setCurrentDraft(null);
  };

  if (currentView === 'draft' && currentDraft) {
    return (
      <EnhancedDraftInterface
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