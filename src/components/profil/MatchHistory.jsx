import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Trophy, Target, TrendingUp } from 'lucide-react';

const EnhancedMatchHistory = ({ selectedTeam }) => {
  const [expandedMatch, setExpandedMatch] = useState(null);
  
  // Simuler des données de match basées sur votre script
  const matches = selectedTeam?.matches || [];

  const toggleMatchDetails = (matchIndex) => {
    setExpandedMatch(expandedMatch === matchIndex ? null : matchIndex);
  };

  const getChampionImage = (championName) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`;
  };

  const getItemImage = (itemId) => {
    if (!itemId || itemId === 0) return null;
    return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${itemId}.png`;
  };

  const MatchCard = ({ match, index }) => {
    const isExpanded = expandedMatch === index;
    const teamMembers = match.teamData || [];
    
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-4">
        <div 
          className="p-4 cursor-pointer hover:bg-gray-750 transition-colors"
          onClick={() => toggleMatchDetails(index)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">
                Partie {index + 1}
              </div>
              
              <div className="text-white">
                <div className="font-semibold">Match #{match.gameId || 'N/A'}</div>
                <div className="text-sm text-gray-400">
                  Durée: {Math.round((match.gameDuration || 0) / 60)}min
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{teamMembers.length} joueurs</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-semibold">
                  {match.result === 'WIN' ? '🏆 Victoire' : '💀 Défaite'}
                </div>
                <div className="text-sm text-gray-400">
                  Side: {match.side || 'Unknown'}
                </div>
              </div>
              
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-700 bg-gray-900 p-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <Target className="mr-2" />
              Statistiques détaillées - Partie {index + 1}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {teamMembers.map((player, playerIndex) => (
                <div key={playerIndex} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                  <div className="text-center mb-3">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold mb-2">
                      {player.role}
                    </div>
                    <div className="text-white font-semibold">{player.pseudo}</div>
                  </div>

                  <div className="flex justify-center mb-3">
                    <img 
                      src={getChampionImage(player.championName)}
                      alt={player.championName}
                      className="w-16 h-16 rounded-full border-2 border-gray-600"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64x64/374151/9CA3AF?text=?';
                      }}
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">KDA:</span>
                      <span className="text-white font-semibold">
                        {player.kills}/{player.deaths}/{player.assists}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ratio:</span>
                      <span className={`font-semibold ${
                        player.kda >= 3 ? 'text-green-400' : 
                        player.kda >= 2 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {player.kda}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Dégâts:</span>
                      <span className="text-white">
                        {(player.totalDamageDealtToChampions / 1000).toFixed(1)}k
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Gold:</span>
                      <span className="text-yellow-400">
                        {(player.goldEarned / 1000).toFixed(1)}k
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">CS:</span>
                      <span className="text-white">{player.cs}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Vision:</span>
                      <span className="text-purple-400">{player.visionScore}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Wards:</span>
                      <span className="text-blue-400">{player.wardsPlaced}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Pinks:</span>
                      <span className="text-pink-400">{player.visionWardsBought || 0}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">Items:</div>
                    <div className="grid grid-cols-3 gap-1">
                      {[player.item0, player.item1, player.item2, player.item3, player.item4, player.item5].map((itemId, i) => (
                        <div key={i} className="w-8 h-8 bg-gray-700 rounded border">
                          {itemId && itemId !== 0 ? (
                            <img 
                              src={getItemImage(itemId)}
                              alt="Item"
                              className="w-full h-full rounded"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé de la partie */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
              <h5 className="text-lg font-semibold text-white mb-3">📊 Résumé de l'équipe</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-400">Total Kills</div>
                  <div className="text-white font-bold text-xl">
                    {teamMembers.reduce((sum, p) => sum + (p.kills || 0), 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Total Gold</div>
                  <div className="text-yellow-400 font-bold text-xl">
                    {(teamMembers.reduce((sum, p) => sum + (p.goldEarned || 0), 0) / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Total Dégâts</div>
                  <div className="text-red-400 font-bold text-xl">
                    {(teamMembers.reduce((sum, p) => sum + (p.totalDamageDealtToChampions || 0), 0) / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Vision Score</div>
                  <div className="text-purple-400 font-bold text-xl">
                    {teamMembers.reduce((sum, p) => sum + (p.visionScore || 0), 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!matches.length) {
    return (
      <div className="text-center text-gray-400 py-12">
        <div className="text-6xl mb-4">🎮</div>
        <p className="text-xl mb-4">Aucune partie importée</p>
        <p>Importez vos parties JSON pour voir l'historique détaillé</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Trophy className="mr-3 text-blue-600" />
          Historique des matchs ({matches.length})
        </h2>
      </div>
      
      <div className="space-y-4">
        {matches.map((match, index) => (
          <MatchCard key={index} match={match} index={index} />
        ))}
      </div>
    </div>
  );
};

export default EnhancedMatchHistory;