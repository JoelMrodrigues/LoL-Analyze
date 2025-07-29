import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

const ImportMatchModal = ({ showImportMatch, setShowImportMatch, importMatch, error }) => {
  const [matchId, setMatchId] = useState('');

  if (!showImportMatch) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!matchId.trim()) {
      alert('Veuillez entrer un ID de match');
      return;
    }
    importMatch(matchId);
    setMatchId('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Upload className="w-6 h-6 mr-2 text-green-600" />
            Importer une partie
          </h2>
          <button
            onClick={() => setShowImportMatch(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID du Match Riot
            </label>
            <input
              type="text"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="EUW1_1234567890"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Comment trouver l'ID ?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Utilisez un site comme OP.GG ou U.GG</li>
              <li>• L'ID se trouve dans l'URL du match</li>
              <li>• Format: EUW1_1234567890</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!matchId.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Importer la partie
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImportMatchModal;