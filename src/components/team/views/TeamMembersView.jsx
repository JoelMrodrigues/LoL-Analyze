import React from 'react';

const TeamMembersView = ({ 
    selectedTeam, 
    setShowInvitePlayer, 
    setShowImportMatch, 
    removePlayer 
}) => {
    if (!selectedTeam) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-xl mb-4">Aucune équipe sélectionnée</p>
                    <p className="mb-6">Créez ou sélectionnez une équipe pour commencer</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">{selectedTeam.name}</h2>
                    <p className="text-gray-400 mt-1">
                        {selectedTeam.players.length} membre{selectedTeam.players.length > 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowInvitePlayer(true)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white font-medium flex items-center gap-2"
                    >
                        <span>➕</span> Ajouter un joueur
                    </button>
                    <button
                        onClick={() => setShowImportMatch(true)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-white font-medium flex items-center gap-2"
                    >
                        <span>📤</span> Importer une partie
                    </button>
                </div>
            </div>

            {/* Liste des joueurs */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                    <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        <div>Joueur</div>
                        <div>Rôle</div>
                        <div>Pool champ</div>
                        <div>Riot ID</div>
                        <div>Rang (soloQ)</div>
                        <div>Actions</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-700">
                    {selectedTeam.players.map(player => (
                        <div key={player.id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                            <div className="grid grid-cols-6 gap-4 items-center">
                                {/* Joueur */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {player.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{player.username}</p>
                                        <p className="text-sm text-gray-400">
                                            {player.isManual ? 'Manuel' : `Niveau ${player.summonerLevel || 'N/A'}`}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Rôle */}
                                <div>
                                    <span className="text-sm text-gray-300">
                                        {player.role === 'owner' ? 'Propriétaire' : 'Joueur'}
                                    </span>
                                </div>
                                
                                {/* Pool champ */}
                                <div className="flex items-center gap-1">
                                    <div className="flex -space-x-1">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-8 h-8 bg-yellow-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs">
                                                C{i}
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs text-gray-300">
                                            +5
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Riot ID */}
                                <div>
                                    <span className="text-sm text-blue-400">
                                        {player.riotId || 'N/A'}
                                    </span>
                                </div>
                                
                                {/* Rang */}
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                                    <span className="text-sm text-white">{player.rank}</span>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {!player.isManual && (
                                        <a
                                            href={`https://op.gg/summoners/euw/${player.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                        >
                                            op.gg ↗
                                        </a>
                                    )}
                                    {player.isManual && (
                                        <span className="text-gray-500 text-sm">Manuel</span>
                                    )}
                                    <button
                                        onClick={() => removePlayer(player.id)}
                                        className="text-red-400 hover:text-red-300 p-1 ml-2"
                                        title="Retirer le joueur"
                                    >
                                        🗑️
                                    </button>
                                    {player.status === 'pending' && (
                                        <span className="px-2 py-1 bg-orange-600 rounded text-xs text-white">
                                            Recherche...
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamMembersView;