import React, { useState } from 'react';
import { X, Users } from 'lucide-react';

const CreateTeamModal = ({ showCreateTeam, setShowCreateTeam, createTeam, error }) => {
  const [teamName, setTeamName] = useState('');

  if (!showCreateTeam) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    createTeam(teamName);
    setTeamName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Créer une équipe
          </h2>
          <button
            onClick={() => setShowCreateTeam(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'équipe
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ma Super Équipe"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">ℹ️ Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Vous serez automatiquement propriétaire de l'équipe</li>
              <li>• Vous pourrez inviter d'autres joueurs</li>
              <li>• Seul le propriétaire peut supprimer l'équipe</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Créer l'équipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;