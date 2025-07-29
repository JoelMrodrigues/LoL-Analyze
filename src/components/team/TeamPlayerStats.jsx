import React, { useState, useMemo } from 'react';
import { User, Trophy, Gamepad2, BarChart3, Target, TrendingUp, Users, Crown } from 'lucide-react';

const TeamPlayerStats = ({ selectedTeam }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  const getChampionImage = (championName) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`;
  };

  // Traitement des données basé sur votre script
  const { playerStats, teamGlobalStats } = useMemo(() => {
    if (!selectedTeam?.matches) return { playerStats: [], teamGlobalStats: {} };

    const stats = {};
    let totalTeamKills = 0;
    let totalTeamDeaths = 0;
    let totalTeamAssists = 0;
    let totalTeamDamage = 0;
    let totalTeamGold = 0;
    let totalTeamVision = 0;
    let totalGames = selectedTeam.matches.length;
    let totalWins = 0;
    
    selectedTeam.matches.forEach(match => {
      if (!match.teamData) return;
      
      let matchWin = match.result === 'WIN';
      if (matchWin) totalWins++;
      
      match.teamData.forEach(player => {
        const key = player.pseudo;
        if (!stats[key]) {
          stats[key] = {
            pseudo: player.pseudo,
            role: player.role,
            totalGames: 0,
            totalWins: 0,
            totalKills: 0,
            totalDeaths: 0,
            totalAssists: 0,
            totalDamage: 0,
            totalGold: 0,
            totalCS: 0,
            totalVisionScore: 0,
            champions: {}
          };
        }

        const playerStat = stats[key];
        playerStat.totalGames++;
        if (player.win) playerStat.totalWins++;
        
        const kills = player.kills || 0;
        const deaths = player.deaths || 0;
        const assists = player.assists || 0;
        const damage = player.totalDamageDealtToChampions || 0;
        const gold = player.goldEarned || 0;
        const vision = player.visionScore || 0;
        
        playerStat.totalKills += kills;
        playerStat.totalDeaths += deaths;
        playerStat.totalAssists += assists;
        playerStat.totalDamage += damage;
        playerStat.totalGold += gold;
        playerStat.totalCS += player.cs || 0;
        playerStat.totalVisionScore += vision;
        
        // Ajout aux totaux de l'équipe
        totalTeamKills += kills;
        totalTeamDeaths += deaths;
        totalTeamAssists += assists;
        totalTeamDamage += damage;
        totalTeamGold += gold;
        totalTeamVision += vision;

        // Regroupement par champion
        const champName = player.championName;
        if (!playerStat.champions[champName]) {
          playerStat.champions[champName] = {
            games: 0,
            wins: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            damage: 0,
            gold: 0,
            cs: 0,
            visionScore: 0
          };
        }

        const champStat = playerStat.champions[champName];
        champStat.games++;
        if (player.win) champStat.wins++;
        champStat.kills += kills;
        champStat.deaths += deaths;
        champStat.assists += assists;
        champStat.damage += damage;
        champStat.gold += gold;
        champStat.cs += player.cs || 0;
        champStat.visionScore += vision;
      });
    });

    const teamGlobalStats = {
      totalGames,
      totalWins,
      winRate: totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0,
      avgKillsPerGame: totalGames > 0 ? (totalTeamKills / totalGames).toFixed(1) : 0,
      avgDeathsPerGame: totalGames > 0 ? (totalTeamDeaths / totalGames).toFixed(1) : 0,
      avgAssistsPerGame: totalGames > 0 ? (totalTeamAssists / totalGames).toFixed(1) : 0,
      avgDamagePerGame: totalGames > 0 ? (totalTeamDamage / totalGames).toFixed(0) : 0,
      avgGoldPerGame: totalGames > 0 ? (totalTeamGold / totalGames).toFixed(0) : 0,
      avgVisionPerGame: totalGames > 0 ? (totalTeamVision / totalGames).toFixed(1) : 0,
      teamKDA: totalTeamDeaths > 0 ? ((totalTeamKills + totalTeamAssists) / totalTeamDeaths).toFixed(2) : 'Perfect'
    };

    return { playerStats: Object.values(stats), teamGlobalStats };
  }, [selectedTeam]);

  // Vue d'ensemble de l'équipe
  const TeamOverview = () => (
    <div className="space-y-6">
      {/* Stats globales de l'équipe */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Users className="mr-3 text-blue-500" />
          Performance globale de l'équipe
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-white mb-2">{teamGlobalStats.totalGames}</div>
            <div className="text-gray-400">Parties jouées</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className={`text-3xl font-bold mb-2 ${
              teamGlobalStats.winRate >= 60 ? 'text-green-400' : 
              teamGlobalStats.winRate >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {teamGlobalStats.winRate}%
            </div>
            <div className="text-gray-400">Taux de victoire</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className={`text-3xl font-bold mb-2 ${
              teamGlobalStats.teamKDA === 'Perfect' ? 'text-yellow-400' :
              parseFloat(teamGlobalStats.teamKDA) >= 3 ? 'text-green-400' : 
              parseFloat(teamGlobalStats.teamKDA) >= 2 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {teamGlobalStats.teamKDA}
            </div>
            <div className="text-gray-400">KDA équipe</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {teamGlobalStats.avgVisionPerGame}
            </div>
            <div className="text-gray-400">Vision/partie</div>
          </div>
        </div>
      </div>

      {/* Stats détaillées par catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Économie */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            Économie
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Or par partie</span>
              <span className="text-yellow-400 font-semibold">
                {(teamGlobalStats.avgGoldPerGame / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Or %</span>
              <span className="text-yellow-400 font-semibold">N/A</span>
            </div>
          </div>
        </div>

        {/* Agression */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
            Agression
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Dégâts/partie</span>
              <span className="text-red-400 font-semibold">
                {(teamGlobalStats.avgDamagePerGame / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Kills/partie</span>
              <span className="text-red-400 font-semibold">{teamGlobalStats.avgKillsPerGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Assists/partie</span>
              <span className="text-red-400 font-semibold">{teamGlobalStats.avgAssistsPerGame}</span>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
            Vision
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Vision score</span>
              <span className="text-purple-400 font-semibold">{teamGlobalStats.avgVisionPerGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vision/min</span>
              <span className="text-purple-400 font-semibold">N/A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de joueurs */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h4 className="text-lg font-bold text-white mb-4">Joueurs</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-gray-700">
                <th className="text-left py-2">Joueur</th>
                <th className="text-center py-2">Parties</th>
                <th className="text-center py-2">Win rate</th>
                <th className="text-center py-2">KDA</th>
                <th className="text-center py-2">KP %</th>
                <th className="text-center py-2">DMG %</th>
                <th className="text-center py-2">Gold %</th>
                <th className="text-center py-2"></th>
              </tr>
            </thead>
            <tbody>
              {playerStats.map(player => {
                const winRate = player.totalGames > 0 ? (player.totalWins / player.totalGames * 100).toFixed(1) : 0;
                const kda = player.totalDeaths > 0 ? 
                  ((player.totalKills + player.totalAssists) / player.totalDeaths).toFixed(2) : 
                  'Perfect';
                
                return (
                  <tr key={player.pseudo} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {player.pseudo ? player.pseudo.split('#')[0] : 'Joueur'}
                          </div>
                          <div className="text-xs text-gray-400">{player.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center text-white">{player.totalGames}</td>
                    <td className="text-center">
                      <span className={`font-semibold ${
                        winRate >= 60 ? 'text-green-400' : 
                        winRate >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {winRate}%
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`font-semibold ${
                        kda === 'Perfect' ? 'text-yellow-400' :
                        parseFloat(kda) >= 3 ? 'text-green-400' : 
                        parseFloat(kda) >= 2 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {kda}
                      </span>
                    </td>
                    <td className="text-center text-blue-400 font-semibold">N/A</td>
                    <td className="text-center text-red-400 font-semibold">N/A</td>
                    <td className="text-center text-yellow-400 font-semibold">N/A</td>
                    <td className="text-center">
                      <button
                        onClick={() => setSelectedPlayer(player.pseudo)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Vue détaillée d'un joueur
  const PlayerDetails = ({ player }) => {
    const winRate = player.totalGames > 0 ? (player.totalWins / player.totalGames * 100).toFixed(1) : 0;
    const avgKDA = player.totalDeaths > 0 ? 
      ((player.totalKills + player.totalAssists) / player.totalDeaths).toFixed(2) : 
      'Perfect';
    const avgDamage = player.totalGames > 0 ? (player.totalDamage / player.totalGames).toFixed(0) : 0;
    const avgGold = player.totalGames > 0 ? (player.totalGold / player.totalGames).toFixed(0) : 0;
    const avgCS = player.totalGames > 0 ? (player.totalCS / player.totalGames).toFixed(1) : 0;
    const avgVision = player.totalGames > 0 ? (player.totalVisionScore / player.totalGames).toFixed(1) : 0;

    return (
      <div className="space-y-6">
        {/* Header du joueur */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {player.pseudo ? player.pseudo.split('#')[0] : 'Joueur'}
                </h3>
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold inline-block">
                  {player.role}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedPlayer(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Retour à l'équipe
            </button>
          </div>

          {/* Stats générales du joueur */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-white">{player.totalGames}</div>
              <div className="text-sm text-gray-400">Parties</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className={`text-2xl font-bold ${winRate >= 60 ? 'text-green-400' : winRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {winRate}%
              </div>
              <div className="text-sm text-gray-400">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className={`text-2xl font-bold ${
                avgKDA === 'Perfect' ? 'text-yellow-400' :
                parseFloat(avgKDA) >= 3 ? 'text-green-400' : 
                parseFloat(avgKDA) >= 2 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {avgKDA}
              </div>
              <div className="text-sm text-gray-400">KDA</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{avgVision}</div>
              <div className="text-sm text-gray-400">Vision/Game</div>
            </div>
          </div>
        </div>

        {/* Stats détaillées par catégorie - Version joueur */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Économie */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-bold text-white mb-4">Économie</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Or par partie</span>
                <span className="text-yellow-400 font-semibold">{(avgGold/1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CS par partie</span>
                <span className="text-white font-semibold">{avgCS}</span>
              </div>
            </div>
          </div>

          {/* Agression */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-bold text-white mb-4">Agression</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Dégâts par partie</span>
                <span className="text-red-400 font-semibold">{(avgDamage/1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kills moyens</span>
                <span className="text-red-400 font-semibold">
                  {(player.totalKills / player.totalGames).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Assists moyens</span>
                <span className="text-red-400 font-semibold">
                  {(player.totalAssists / player.totalGames).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-bold text-white mb-4">Vision</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Vision score</span>
                <span className="text-purple-400 font-semibold">{avgVision}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Champions du joueur */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4">Champions</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2">Champion</th>
                  <th className="text-center py-2">Parties</th>
                  <th className="text-center py-2">Win rate</th>
                  <th className="text-center py-2">KDA</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(player.champions)
                  .sort(([,a], [,b]) => b.games - a.games)
                  .map(([championName, champStats]) => {
                    const champWinRate = champStats.games > 0 ? (champStats.wins / champStats.games * 100).toFixed(1) : 0;
                    const champKDA = champStats.deaths > 0 ? 
                      ((champStats.kills + champStats.assists) / champStats.deaths).toFixed(2) : 
                      'Perfect';

                    return (
                      <tr key={championName} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={getChampionImage(championName)}
                              alt={championName}
                              className="w-8 h-8 rounded-full border border-gray-600"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/32x32/374151/9CA3AF?text=?';
                              }}
                            />
                            <span className="text-white font-medium">{championName}</span>
                          </div>
                        </td>
                        <td className="text-center text-white">{champStats.games}</td>
                        <td className="text-center">
                          <span className={`font-semibold ${
                            champWinRate >= 60 ? 'text-green-400' : 
                            champWinRate >= 50 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {champWinRate}%
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={`font-semibold ${
                            champKDA === 'Perfect' ? 'text-yellow-400' :
                            parseFloat(champKDA) >= 3 ? 'text-green-400' : 
                            parseFloat(champKDA) >= 2 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {champKDA}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedTeam) {
    return (
      <div className="text-center text-gray-400 py-12">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-bold mb-2">Aucune équipe sélectionnée</h2>
        <p>Sélectionnez une équipe pour voir les statistiques des joueurs</p>
      </div>
    );
  }

  if (playerStats.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">Aucune donnée de match</h2>
        <p>Importez des parties pour voir les statistiques des joueurs</p>
      </div>
    );
  }

  const currentPlayer = selectedPlayer ? playerStats.find(p => p.pseudo === selectedPlayer) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <BarChart3 className="mr-3 text-green-600" />
          {currentPlayer ? `Statistiques - ${currentPlayer.pseudo.split('#')[0]}` : 'Statistiques des joueurs'}
        </h2>
        <div className="text-sm text-gray-400">
          {selectedTeam.matches?.length || 0} parties analysées
        </div>
      </div>

      {currentPlayer ? (
        <PlayerDetails player={currentPlayer} />
      ) : (
        <TeamOverview />
      )}
    </div>
  );
};

export default TeamPlayerStats;