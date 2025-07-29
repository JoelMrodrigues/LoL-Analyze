import React from 'react';
import { Search, User, Gamepad2 } from 'lucide-react';
import { queueTypes } from '../../utils/statsCalculator';

const SearchForm = ({ 
  pseudo, 
  setPseudo, 
  queue, 
  setQueue, 
  onSearch, 
  loading, 
  error 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="h-6 w-6 text-white" />
          <h2 className="text-xl font-bold text-white">Rechercher un profil</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <User className="inline h-4 w-4 mr-1" />
              Pseudo Riot
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="MonPseudo#TAG"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                  #TAG requis
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-64">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Gamepad2 className="inline h-4 w-4 mr-1" />
              Type de file
            </label>
            <select
              value={queue}
              onChange={(e) => setQueue(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-lg cursor-pointer"
            >
              {Object.entries(queueTypes).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          
          <div className="lg:w-40">
            <label className="block text-sm font-semibold text-gray-700 mb-3 opacity-0">
              Action
            </label>
            <button
              onClick={onSearch}
              disabled={loading || !pseudo.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Recherche...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Analyser</span>
                </div>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Erreur de recherche</h4>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">💡 Conseils</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Utilisez votre Riot ID complet avec le #TAG (ex: MonPseudo#FR1)</li>
            <li>• Les données sont mises à jour en temps réel via l'API Riot</li>
            <li>• Cliquez sur un match pour voir tous les joueurs de la partie</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;