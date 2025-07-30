import React from 'react';
import Layout from '../components/common/Layout';
import useTeamData from '../hooks/useTeamData';
import AuthModal from '../components/team/modals/AuthModal';
import CreateTeamModal from '../components/team/modals/CreateTeamModal';
import InvitePlayerModal from '../components/team/modals/InvitePlayerModal';
import ImportMatchModal from '../components/team/modals/ImportMatchModal';
import TeamMembersView from '../components/team/views/TeamMembersView';
import EnhancedMatchHistory from '../components/team/EnhancedMatchHistory';
import TeamPlayerStats from '../components/team/TeamPlayerStats';
import CompleteDraftSystem from '../components/team/draft/CompleteDraftSystem';



// Composant de rendu du contenu selon la vue
const TeamContent = ({ teamView, selectedTeam, setShowInvitePlayer, setShowImportMatch, removePlayer }) => {
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
        <EnhancedMatchHistory 
          selectedTeam={selectedTeam}
        />
      );

    case 'stats':
      return (
        <TeamPlayerStats 
          selectedTeam={selectedTeam}
        />
      );

    case 'pool-champ':
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">Pool de Champions</h2>
          <div className="text-gray-400 text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-xl mb-4">Pool de champions de l'équipe</p>
            <p>Gérez les champions maîtrisés par chaque membre</p>
            <div className="mt-6 text-sm">
              <p>Cette fonctionnalité analysera automatiquement les champions les plus joués</p>
              <p>par chaque membre de votre équipe basée sur l'historique des parties.</p>
            </div>
          </div>
        </div>
      );

    case 'drafts':
  return <CompleteDraftSystem />;(
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">Drafts</h2>
          <div className="text-gray-400 text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl mb-4">Historique des drafts</p>
            <p>Analysez vos stratégies de draft et compositions d'équipe</p>
          </div>
        </div>
      );

    default:
      return <div>Vue non trouvée</div>;
  }
};

const Team = () => {
  const teamData = useTeamData();
  const {
    user,
    teams,
    selectedTeam,
    teamView,
    showAuth,
    showCreateTeam,
    showInvitePlayer,
    showImportMatch,
    addPlayerMode,
    setSelectedTeam,
    setTeamView,
    setShowAuth,
    setShowCreateTeam,
    setShowInvitePlayer,
    setShowImportMatch,
    setAddPlayerMode,
    handleAuth,
    handleGoogleAuth,
    handleLogout,
    createTeam,
    deleteTeam,
    invitePlayer,
    removePlayer,
    importMatch
  } = teamData;

  // Interface non connecté
  if (!user) {
    return (
      <Layout className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-8xl mb-8">🛡️</div>
          <h1 className="text-4xl font-bold mb-4 text-white">Team Management</h1>
          <p className="text-xl text-gray-400 mb-8">
            Gérez vos équipes, analysez vos performances et optimisez vos stratégies
          </p>
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
        />
      </Layout>
    );
  }

  // Interface principale
  return (
    <Layout className="h-screen overflow-hidden relative">
      {/* Header de la page */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Team Management</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">Welcome, {user.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Sidebar gauche avec hauteur fixe pour éviter les décalages */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-6 flex-1 flex flex-col">
            {/* Sélection d'équipe */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-white">Équipe</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateTeam(true)}
                    className="text-green-400 hover:text-green-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    + Créer
                  </button>
                  {selectedTeam && selectedTeam.owner === user.id && (
                    <button
                      onClick={() => deleteTeam(selectedTeam.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      title="Supprimer cette équipe"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              <select
                value={selectedTeam?.id || ''}
                onChange={(e) => {
                  const team = teams.find(t => t.id === e.target.value);
                  setSelectedTeam(team);
                  if (team) setTeamView('team');
                }}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Sélectionner une équipe</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.players.length} membres)
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation avec espace flexible */}
            <nav className="space-y-2 flex-1 min-h-0">
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

            {/* Info équipe avec hauteur fixe pour éviter les décalages */}
            <div className="mt-4 h-64">
              {selectedTeam ? (
                <div className="p-4 bg-gray-700 rounded-lg h-full">
                  <h4 className="font-semibold text-white mb-2 text-sm">{selectedTeam.name}</h4>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>👥 {selectedTeam.players.length} membres</p>
                    <p>🎮 {selectedTeam.matches?.length || 0} parties</p>
                    <p>📅 Créée le {new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-700/50 rounded-lg h-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Aucune équipe sélectionnée</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal optimisé pour utiliser toute la hauteur */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            <TeamContent 
              teamView={teamView}
              selectedTeam={selectedTeam}
              setShowInvitePlayer={setShowInvitePlayer}
              setShowImportMatch={setShowImportMatch}
              removePlayer={removePlayer}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTeamModal 
        showCreateTeam={showCreateTeam}
        setShowCreateTeam={setShowCreateTeam}
        createTeam={createTeam}
      />
      <InvitePlayerModal 
        showInvitePlayer={showInvitePlayer}
        setShowInvitePlayer={setShowInvitePlayer}
        invitePlayer={invitePlayer}
        addPlayerMode={addPlayerMode}
        setAddPlayerMode={setAddPlayerMode}
      />
      <ImportMatchModal 
        showImportMatch={showImportMatch}
        setShowImportMatch={setShowImportMatch}
        importMatch={importMatch}
      />
    </Layout>
  );
};

export default Team;