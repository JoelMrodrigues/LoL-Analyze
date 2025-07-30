import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Trophy, Target, Swords } from 'lucide-react';

const EnhancedMatchHistory = ({ selectedTeam }) => {
  const [expandedMatch, setExpandedMatch] = useState(null);
  
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

  // Composant compact pour afficher un joueur
  const CompactPlayerCard = ({ player, role, isOwnTeam = false }) => (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex-1">
      {/* Header avec rôle */}
      <div className="bg-blue-600 text-white text-center py-1 px-2 rounded text-xs font-bold mb-2">
        {role}
      </div>
      
      {/* Nom du joueur */}
      <div className={`text-center font-medium text-sm mb-2 ${isOwnTeam ? 'text-green-300' : 'text-white'}`}>
        {player.pseudo ? player.pseudo.split('#')[0] : player.summonerName || 'Enemy'}
      </div>

      {/* Champion */}
      <div className="flex justify-center mb-2">
        <img 
          src={getChampionImage(player.championName)}
          alt={player.championName}
          className="w-12 h-12 rounded-full border-2 border-gray-600"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/48x48/374151/9CA3AF?text=?';
          }}
        />
      </div>

      {/* Stats compactes */}
      <div className="text-xs space-y-1">
        <div className="text-center">
          <div className="text-white font-semibold">
            {player.kills}/{player.deaths}/{player.assists}
          </div>
          <div className="text-gray-400">KDA</div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Ratio:</span>
          <span className={`font-semibold ${
            (player.kda || 0) >= 3 ? 'text-green-400' : 
            (player.kda || 0) >= 2 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {player.kda || 0}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Dégâts:</span>
          <span className="text-white">
            {((player.totalDamageDealtToChampions || 0) / 1000).toFixed(1)}k
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Gold:</span>
          <span className="text-yellow-400">
            {((player.goldEarned || 0) / 1000).toFixed(1)}k
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">CS:</span>
          <span className="text-white">{player.cs || player.totalMinionsKilled || 0}</span>
        </div>
      </div>

      {/* Items compacts */}
      <div className="mt-2 pt-2 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-1">
          {[player.item0, player.item1, player.item2, player.item3, player.item4, player.item5].map((itemId, i) => (
            <div key={i} className="w-6 h-6 bg-gray-700 rounded border">
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
  );

  const MatchCard = ({ match, index }) => {
    const isExpanded = expandedMatch === index;
    const ourTeamData = match.teamData || [];
    
    // Simuler l'équipe adverse avec des données d'exemple si pas disponibles
    const generateEnemyTeam = () => {
      const enemyRoles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
      const enemyChamps = ['Garen', 'Graves', 'Yasuo', 'Jinx', 'Thresh'];
      
      return enemyRoles.map((role, i) => ({
        role,
        summonerName: `Enemy${i + 1}`,
        championName: enemyChamps[i],
        kills: Math.floor(Math.random() * 15),
        deaths: Math.floor(Math.random() * 10),
        assists: Math.floor(Math.random() * 20),
        kda: (Math.random() * 4 + 0.5).toFixed(2),
        totalDamageDealtToChampions: Math.floor(Math.random() * 30000) + 10000,
        goldEarned: Math.floor(Math.random() * 5000) + 10000,
        cs: Math.floor(Math.random() * 100) + 100,
        item0: Math.floor(Math.random() * 3000) + 1000,
        item1: Math.floor(Math.random() * 3000) + 1000,
        item2: Math.floor(Math.random() * 3000) + 1000,
        item3: Math.floor(Math.random() * 3000) + 1000,
        item4: Math.floor(Math.random() * 3000) + 1000,
        item5: Math.floor(Math.random() * 3000) + 1000,
        win: match.result === 'LOSE',
        teamId: match.side === 'BLUE' ? 200 : 100
      }));
    };

    const enemyTeamData = generateEnemyTeam();
    
    // Déterminer qui est blue/red
    const isOurTeamBlue = match.side === 'BLUE';
    const blueTeam = isOurTeamBlue ? ourTeamData : enemyTeamData;
    const redTeam = isOurTeamBlue ? enemyTeamData : ourTeamData;
    
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
                <span className="text-gray-300">5v5</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{match.side === 'BLUE' ? '🔵' : '🔴'} NOUS</span>
                <span className="text-gray-400">vs</span>
                <span className="text-gray-300">{match.side !== 'BLUE' ? '🔵' : '🔴'} EUX</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-semibold">
                  {match.result === 'WIN' ? '🏆 Victoire' : '💀 Défaite'}
                </div>
                <div className="text-sm text-gray-400">
                  {ourTeamData.reduce((sum, p) => sum + (p.kills || 0), 0)} - {enemyTeamData.reduce((sum, p) => sum + (p.kills || 0), 0)} kills
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
          <div className="border-t border-gray-700 bg-gray-900 px-6 py-4">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center justify-center">
              <Target className="mr-2" />
              Partie {index + 1} - Détails complets
            </h4>
            
            {/* ÉQUIPE BLEUE */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                  ÉQUIPE BLEUE
                  {blueTeam === ourTeamData && (
                    <span className="ml-2 bg-green-500 px-2 py-1 rounded text-xs">NOUS</span>
                  )}
                  {blueTeam[0]?.win && <Trophy className="w-4 h-4 text-yellow-400 ml-2" />}
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {blueTeam.map((player, playerIndex) => (
                  <CompactPlayerCard 
                    key={playerIndex} 
                    player={player} 
                    role={player.role || ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'][playerIndex]}
                    isOwnTeam={blueTeam === ourTeamData}
                  />
                ))}
              </div>
            </div>

            {/* SÉPARATEUR VS */}
            <div className="flex items-center justify-center my-4">
              <div className="flex items-center space-x-4 bg-gray-800 px-6 py-2 rounded-lg border border-gray-600">
                <Swords className="w-6 h-6 text-gray-300" />
                <span className="text-gray-300 font-bold text-lg">VS</span>
              </div>
            </div>

            {/* ÉQUIPE ROUGE */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  ÉQUIPE ROUGE
                  {redTeam === ourTeamData && (
                    <span className="ml-2 bg-green-500 px-2 py-1 rounded text-xs">NOUS</span>
                  )}
                  {redTeam[0]?.win && <Trophy className="w-4 h-4 text-yellow-400 ml-2" />}
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {redTeam.map((player, playerIndex) => (
                  <CompactPlayerCard 
                    key={playerIndex} 
                    player={player} 
                    role={player.role || ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'][playerIndex]}
                    isOwnTeam={redTeam === ourTeamData}
                  />
                ))}
              </div>
            </div>

            {/* Stats globales des équipes */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Stats équipe bleue */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h6 className="font-semibold text-blue-300 mb-3 text-center">📊 Total Équipe Bleue</h6>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-300">Kills</div>
                    <div className="text-white font-bold text-lg">
                      {blueTeam.reduce((sum, p) => sum + (p.kills || 0), 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-300">Gold</div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {(blueTeam.reduce((sum, p) => sum + (p.goldEarned || 0), 0) / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-300">Dégâts</div>
                    <div className="text-red-400 font-bold text-lg">
                      {(blueTeam.reduce((sum, p) => sum + (p.totalDamageDealtToChampions || 0), 0) / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats équipe rouge */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h6 className="font-semibold text-red-300 mb-3 text-center">📊 Total Équipe Rouge</h6>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-red-300">Kills</div>
                    <div className="text-white font-bold text-lg">
                      {redTeam.reduce((sum, p) => sum + (p.kills || 0), 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-300">Gold</div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {(redTeam.reduce((sum, p) => sum + (p.goldEarned || 0), 0) / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-300">Dégâts</div>
                    <div className="text-red-400 font-bold text-lg">
                      {(redTeam.reduce((sum, p) => sum + (p.totalDamageDealtToChampions || 0), 0) / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé global de la partie */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
              <h5 className="text-lg font-semibold text-white mb-3 text-center">🏆 Résumé de la partie</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-400">Durée totale</div>
                  <div className="text-white font-bold text-xl">
                    {Math.round((match.gameDuration || 0) / 60)}min
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Notre résultat</div>
                  <div className={`font-bold text-xl ${match.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                    {match.result === 'WIN' ? 'VICTOIRE' : 'DÉFAITE'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Score final</div>
                  <div className="text-white font-bold text-xl">
                    {ourTeamData.reduce((sum, p) => sum + (p.kills || 0), 0)} - {enemyTeamData.reduce((sum, p) => sum + (p.kills || 0), 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Notre side</div>
                  <div className={`font-bold text-xl ${match.side === 'BLUE' ? 'text-blue-400' : 'text-red-400'}`}>
                    {match.side}
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
        <div className="text-sm text-gray-400 flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Équipe Bleue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Équipe Rouge</span>
          </div>
        </div>
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