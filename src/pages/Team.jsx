import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { teamService, apiUtils } from '../services/api';
import AuthModal from '../components/team/modals/AuthModal';
import CreateTeamModal from '../components/team/modals/CreateTeamModal';
import InvitePlayerModal from '../components/team/modals/InvitePlayerModal';
import ImportMatchModal from '../components/team/modals/ImportMatchModal';
import TeamMembersView from '../components/team/views/TeamMembersView';

const Team = () => {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  
  // États principaux
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamView, setTeamView] = useState('team');
  
  // États des modals
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInvitePlayer, setShowInvitePlayer] = useState(false);
  const [showImportMatch, setShowImportMatch] = useState(false);
  const [addPlayerMode, setAddPlayerMode] = useState('riot');
  
  // États de chargement
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les équipes au démarrage
  useEffect(() => {
    if (isAuthenticated) {
      loadTeams();
    }
  }, [isAuthenticated]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await teamService.getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Erreur chargement équipes:', error);
      setError(apiUtils.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (type, email, password) => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setError('');
      let result;
      
      if (type === 'login') {
        result = await login({ email, password });
      } else {
        result = await register({ 
          username: email.split('@')[0], 
          email, 
          password 
        });
      }

      if (result.success) {
        setShowAuth(false);
        await loadTeams();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(apiUtils.handleError(error));
    }
  };

  const handleGoogleAuth = () => {
    setError('Authentification Google pas encore implémentée');
  };

  const createTeam = async (teamName) => {
    if (!teamName.trim()) {
      setError('Veuillez entrer un nom d\'équipe');
      return;
    }

    try {
      setError('');
      const response = await teamService.createTeam({ 
        name: teamName,
        description: `Équipe créée par ${user.username}`
      });
      
      await loadTeams();
      setSelectedTeam(response.data.team);
      setShowCreateTeam(false);
    } catch (error) {
      setError(apiUtils.handleError(error));
    }
  };

  const deleteTeam = async (teamId) => {
    const teamToDelete = teams.find(t => t._id === teamId);
    if (!teamToDelete) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${teamToDelete.name}" ? Cette action est irréversible.`)) {
      try {
        await teamService.deleteTeam(teamId);
        await loadTeams();
        
        if (selectedTeam && selectedTeam._id === teamId) {
          setSelectedTeam(null);
          setTeamView('team');
        }
      } catch (error) {
        setError(apiUtils.handleError(error));
      }
    }
  };

  const invitePlayer = async (playerInput, mode = 'riot') => {
    if (!playerInput.trim()) {
      setError('Veuillez entrer un pseudo');
      return;
    }

    if (!selectedTeam) {
      setError('Aucune équipe sélectionnée');
      return;
    }
    
    try {
      setError('');
      let memberData = {};
      
      if (mode === 'manual') {
        memberData = {
          gameName: playerInput,
          tagLine: 'TEMP'
        };
      } else {
        const [gameName, tagLine] = playerInput.split('#');
        if (!gameName || !tagLine) {
          setError('Format invalide. Utilisez: Pseudo#TAG');
          return;
        }
        memberData = { gameName, tagLine };
      }
      
      await teamService.addMember(selectedTeam._id, memberData);
      
      // Recharger les détails de l'équipe
      const updatedTeam = await teamService.getTeam(selectedTeam._id);
      setSelectedTeam(updatedTeam.team);
      setShowInvitePlayer(false);
      
    } catch (error) {
      setError(apiUtils.handleError(error));
    }
  };

  const removePlayer = async (memberId) => {
    if (!selectedTeam) return;
    
    const member = selectedTeam.members?.find(m => m._id === memberId);
    if (!member) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir retirer ce joueur ?`)) {
      try {
        await teamService.removeMember(selectedTeam._id, memberId);
        
        // Recharger les détails de l'équipe
        const updatedTeam = await teamService.getTeam(selectedTeam._id);
        setSelectedTeam(updatedTeam.team);
        
      } catch (error) {
        setError(apiUtils.handleError(error));
      }
    }
  };

  const importMatch = async (matchId) => {
    if (!selectedTeam) {
      setError('Aucune équipe sélectionnée');
      return;
    }
    
    try {
      setError('');
      await teamService.importMatch(selectedTeam._id, {
        matchId,
        autoDetectMembers: true
      });
      
      // Recharger les détails de l'équipe
      const updatedTeam = await teamService.getTeam(selectedTeam._id);
      setSelectedTeam(updatedTeam.team);
      setShowImportMatch(false);
      
      alert('Partie importée avec succès !');
      
    } catch (error) {
      setError(apiUtils.handleError(error));
    }
  };

  // Composant de rendu du contenu selon la vue
  const TeamContent = () => {
    switch(teamView) {
      case 'team':
        return (
          <TeamMembersView 
            selectedTeam={selectedTeam}
            setShowInvitePlayer={setShowInvitePlayer}
            setShowImportMatch={setShowImportMatch}
            removePlayer={removePlayer}
          />
        );

      case 'match-history':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Historique des parties</h2>
              <button
                onClick={() => setShowImportMatch(true)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-white font-medium"
              >
                Importer une partie
              </button>
            </div>
            
            {selectedTeam?.matches && selectedTeam.matches.length > 0 ? (
              <div className="space-y-4">
                {selectedTeam.matches.map(match => (
                  <div key={match._id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">Match {match.matchId}</h3>
                        <p className="text-sm text-gray-400">
                          {match.gameMode} • {new Date(match.gameCreation).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          match.result === 'WIN' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {match.result === 'WIN' ? 'VICTOIRE' : 'DÉFAITE'}
                        </p>
                        <p className="text-sm text-gray-400">
                          Durée: {Math.floor(match.gameDuration / 60)}:{String(match.gameDuration % 60).padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-xl mb-4">Aucune partie importée</p>
                <p className="mb-6">Importez vos parties pour voir l'historique</p>
                <button
                  onClick={() => setShowImportMatch(true)}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors text-white font-medium"
                >
                  Importer une partie
                </button>
              </div>
            )}
          </div>
        );

      case 'stats':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Statistiques de l'équipe</h2>
            {selectedTeam?.statistics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Parties jouées</h3>
                  <p className="text-3xl font-bold text-blue-400">{selectedTeam.statistics.totalGames}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Victoires</h3>
                  <p className="text-3xl font-bold text-green-400">{selectedTeam.statistics.wins}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Défaites</h3>
                  <p className="text-3xl font-bold text-red-400">{selectedTeam.statistics.losses}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Winrate</h3>
                  <p className="text-3xl font-bold text-yellow-400">{selectedTeam.statistics.winRate}%</p>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl mb-4">Aucune statistique disponible</p>
                <p>Les statistiques apparaîtront après l'import de parties</p>
              </div>
            )}
          </div>
        );

      case 'pool-champ':
        return (
          <div className="text-gray-400 text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-xl mb-4">Pool de champions de l'équipe</p>
            <p>Gérez les champions maîtrisés par chaque membre</p>
          </div>
        );

      case 'drafts':
        return (
          <div className="text-gray-400 text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl mb-4">Historique des drafts</p>
            <p>Analysez vos stratégies de draft et compositions d'équipe</p>
          </div>
        );

      default:
        return (
          <div className="text-gray-400 text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <p className="text-xl mb-4">Section en développement</p>
            <p>Cette fonctionnalité sera bientôt disponible</p>
          </div>
        );
    }
  };

  // Interface non connecté
  if (!isAuthenticated) {
    return (
      <Layout className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-8xl mb-8">🛡️</div>
          <h1 className="text-4xl font-bold mb-4 text-white">Team Management</h1>
          <p className="text-xl text-gray-400 mb-8">
            Gérez vos équipes, analysez vos performances et optimisez vos stratégies
          </p>
          {error && (
            <div className="mb-4 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
              {error}
            </div>
          )}
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-medium transition-colors text-white text-lg"
          >
            Se connecter / S'inscrire
          </button>
        </div>
        <AuthModal 
          showAuth={showAuth}
          setShowAuth={setShowAuth}
          handleAuth={handleAuth}
          handleGoogleAuth={handleGoogleAuth}
          error={error}
        />
      </Layout>
    );
  }

  // Interface principale
  return (
    <Layout className="h-screen overflow-hidden">
      {/* Header de la page */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Team Management</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">Welcome, {user.username}</span>
          </div>
          <button
            onClick={logout}
            className="text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-300 hover:text-red-100"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="flex h-full">
        {/* Sidebar gauche */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
          {/* Sélection d'équipe */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-semibold text-white">Équipe</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="text-green-400 hover:text-green-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  + Créer
                </button>
                {selectedTeam && selectedTeam.isOwner && (
                  <button
                    onClick={() => deleteTeam(selectedTeam._id)}
                    className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    title="Supprimer cette équipe"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
            <select
              value={selectedTeam?._id || ''}
              onChange={async (e) => {
                if (e.target.value) {
                  try {
                    const teamData = await teamService.getTeam(e.target.value);
                    setSelectedTeam(teamData.team);
                    setTeamView('team');
                  } catch (error) {
                    setError(apiUtils.handleError(error));
                  }
                } else {
                  setSelectedTeam(null);
                }
              }}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Sélectionner une équipe</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>
                  {team.name} ({team.membersCount} membres)
                </option>
              ))}
            </select>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Navigation
            </h3>
            {[
              { id: 'team', label: 'Team', icon: '👥' },
              { id: 'match-history', label: 'Match History', icon: '🎮' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'pool-champ', label: 'Pool Champ', icon: '🏆' },
              { id: 'drafts', label: 'Drafts', icon: '🎯' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setTeamView(view.id)}
                disabled={!selectedTeam}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  teamView === view.id && selectedTeam
                    ? 'bg-blue-600 text-white' 
                    : selectedTeam
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="text-xl">{view.icon}</span>
                <span className="font-medium">{view.label}</span>
              </button>
            ))}
          </nav>

          {/* Info équipe sélectionnée */}
          {selectedTeam && (
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-white mb-2">{selectedTeam.name}</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>👥 {selectedTeam.membersCount || selectedTeam.members?.length || 0} membres</p>
                <p>🎮 {selectedTeam.matchesCount || selectedTeam.matches?.length || 0} parties</p>
                <p>📅 Créée le {new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
                {selectedTeam.statistics && (
                  <p>🏆 {selectedTeam.statistics.winRate}% winrate</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <TeamContent />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateTeamModal 
        showCreateTeam={showCreateTeam}
        setShowCreateTeam={setShowCreateTeam}
        createTeam={createTeam}
        error={error}
      />
      <InvitePlayerModal 
        showInvitePlayer={showInvitePlayer}
        setShowInvitePlayer={setShowInvitePlayer}
        invitePlayer={invitePlayer}
        addPlayerMode={addPlayerMode}
        setAddPlayerMode={setAddPlayerMode}
        error={error}
      />
      <ImportMatchModal 
        showImportMatch={showImportMatch}
        setShowImportMatch={setShowImportMatch}
        importMatch={importMatch}
        error={error}
      />
    </Layout>
  );
};

export default Team;