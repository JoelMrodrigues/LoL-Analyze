import React, { useState } from 'react';

const InvitePlayerModal = ({ 
    showInvitePlayer, 
    setShowInvitePlayer, 
    invitePlayer, 
    addPlayerMode, 
    setAddPlayerMode 
}) => {
    const [playerInput, setPlayerInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!showInvitePlayer) return null;

    const handleInvite = async () => {
        setIsLoading(true);
        try {
            await invitePlayer(playerInput, addPlayerMode);
            setPlayerInput(''); // Reset form
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                <button
                    onClick={() => setShowInvitePlayer(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >
                    ✕
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-white">Ajouter un joueur</h2>
                
                {/* Sélection du mode */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mode d'ajout
                    </label>
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => setAddPlayerMode('riot')}
                            className={`flex-1 p-3 rounded-lg font-medium transition-colors ${
                                addPlayerMode === 'riot' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            🎮 Compte LoL
                        </button>
                        <button
                            onClick={() => setAddPlayerMode('manual')}
                            className={`flex-1 p-3 rounded-lg font-medium transition-colors ${
                                addPlayerMode === 'manual' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            ✏️ Manuel
                        </button>
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {addPlayerMode === 'riot' ? 'Pseudo League of Legends' : 'Nom du joueur'}
                    </label>
                    <input
                        type="text"
                        placeholder={addPlayerMode === 'riot' ? 'Ex: PlayerName ou PlayerName#TAG' : 'Ex: Benoit'}
                        value={playerInput}
                        onChange={(e) => setPlayerInput(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        disabled={isLoading}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleInvite()}
                    />
                    <div className="mt-3 text-sm text-gray-400 space-y-1">
                        {addPlayerMode === 'riot' ? (
                            <>
                                <p><strong>Exemples:</strong></p>
                                <p>• PlayerName (utilisera #EUW par défaut)</p>
                                <p>• PlayerName#TAG (avec tag personnalisé)</p>
                                <p className="text-yellow-400">⚠️ Récupère automatiquement le rang et niveau</p>
                            </>
                        ) : (
                            <>
                                <p><strong>Mode manuel:</strong></p>
                                <p>• Ajout simple par nom (ex: Benoit)</p>
                                <p>• Pas de données LoL récupérées</p>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={handleInvite}
                        disabled={!playerInput.trim() || isLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-medium transition-colors text-white flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                {addPlayerMode === 'riot' ? 'Recherche...' : 'Ajout...'}
                            </>
                        ) : (
                            'Ajouter'
                        )}
                    </button>
                    <button
                        onClick={() => setShowInvitePlayer(false)}
                        disabled={isLoading}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 p-3 rounded-lg font-medium transition-colors text-white"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitePlayerModal;