import React, { useState } from 'react';
import { X, UserPlus, User, Gamepad2 } from 'lucide-react';

const InvitePlayerModal = ({ 
  showInvitePlayer, 
  setShowInvitePlayer, 
  invitePlayer, 
  addPlayerMode, 
  setAddPlayerMode 
}) => {
  const [playerInput, setPlayerInput] = useState('');

  if (!showInvitePlayer) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    invitePlayer(playerInput, addPlayerMode);
    setPlayerInput('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-green-600" />
            Ajouter un joueur
          </h2>
          <button
            onClick={() => setShowInvitePlayer(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mode d'ajout
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setAddPlayerMode('riot')}
              className={`flex-1 p-3 rounded-lg border transition-colors ${
                addPlayerMode === 'riot'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Gamepad2 className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Riot ID</div>
            </button>
            <button
              onClick={() => setAddPlayerMode('manual')}
              className={`flex-1 p-3 rounded-lg border transition-colors ${
                addPlayerMode === 'manual'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Manuel</div>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {addPlayerMode === 'riot' ? 'Riot ID complet' : 'Pseudo du joueur'}
            </label>
            <input
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={addPlayerMode === 'riot' ? 'Pseudo#TAG' : 'Pseudo'}
              required
            />
          </div>

          <div className={`p-4 rounded-lg ${
            addPlayerMode === 'riot' ? 'bg-blue-50' : 'bg-green-50'
          }`}>
            <h4 className={`font-medium mb-2 ${
              addPlayerMode === 'riot' ? 'text-blue-900' : 'text-green-900'
            }`}>
              {addPlayerMode === 'riot' ? '🎮 Mode Riot API' : '✏️ Mode Manuel'}
            </h4>
            <ul className={`text-sm space-y-1 ${
              addPlayerMode === 'riot' ? 'text-blue-800' : 'text-green-800'
            }`}>
              {addPlayerMode === 'riot' ? (
                <>
                  <li>• Récupère automatiquement les stats du joueur</li>
                  <li>• Format requis: Pseudo#TAG</li>
                  <li>• Vérification en temps réel</li>
                </>
              ) : (
                <>
                  <li>• Ajout rapide sans vérification</li>
                  <li>• Données à remplir manuellement</li>
                  <li>• Idéal pour les tests</li>
                </>
              )}
            </ul>
          </div>

          <button
            type="submit"
            className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
              addPlayerMode === 'riot'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Ajouter le joueur
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvitePlayerModal;