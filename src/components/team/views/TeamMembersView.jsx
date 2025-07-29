import React from 'react';
import { UserPlus, Crown, User, Trash2 } from 'lucide-react';

const TeamMembersView = ({ selectedTeam, setShowInvitePlayer, setShowImportMatch, removePlayer }) => {
  if (!selectedTeam) {
    return (
      <div className="text-center text-gray-400 py-12">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-bold mb-2">Aucune équipe sélectionnée</h2>
        <p>Sélectionnez ou créez une équipe pour voir les membres</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Membres de l'équipe</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowInvitePlayer(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-white font-medium flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter un joueur
          </button>
          <button
            onClick={() => setShowImportMatch(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white font-medium"
          >
            Importer une partie
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedTeam.players.map(player => (
          <div key={player.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  {player.role === 'owner' ? (
                    <Crown className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{player.username}</h3>
                  <p className="text-sm text-gray-400 capitalize">{player.role}</p>
                </div>
              </div>
              
              {player.role !== 'owner' && (
                <button
                  onClick={() => removePlayer(player.id)}
                  className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Retirer ce joueur"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Riot ID:</span>
                <span className="text-white">{player.riotId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rang:</span>
                <span className="text-white">{player.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Statut:</span>
                <span className={`capitalize ${
                  player.status === 'active' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {player.status}
                </span>
              </div>
              {player.isManual && (
                <div className="mt-2 px-2 py-1 bg-yellow-600 bg-opacity-20 rounded text-yellow-400 text-xs">
                  Ajouté manuellement
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTeam.players.length === 1 && (
        <div className="text-center text-gray-400 py-8">
          <UserPlus className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg mb-2">Équipe vide</p>
          <p className="mb-4">Invitez des joueurs pour commencer l'analyse</p>
          <button
            onClick={() => setShowInvitePlayer(true)}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors text-white font-medium"
          >
            Ajouter le premier joueur
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamMembersView;