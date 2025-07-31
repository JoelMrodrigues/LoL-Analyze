import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  User, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertTriangle, 
  Users,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const TeamReportInterface = ({ 
  teamData,
  onBack = () => {} 
}) => {
  // Données par défaut si teamData n'est pas fourni
  const defaultTeamData = {
    players: [
      { id: 1, name: 'Joueur 1', role: 'TOP' },
      { id: 2, name: 'Joueur 2', role: 'JUNGLE' },
      { id: 3, name: 'Joueur 3', role: 'MID' },
      { id: 4, name: 'Joueur 4', role: 'ADC' },
      { id: 5, name: 'Joueur 5', role: 'SUPPORT' }
    ],
    matches: [] // Données de matches pour les stats
  };

  const currentTeamData = teamData || defaultTeamData;
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Calcul des statistiques générales (simulation basée sur les données réelles)
  const calculatePlayerStats = (player) => {
    // Simulation de données réalistes basées sur le rôle
    const roleStats = {
      'TOP': {
        games: Math.floor(Math.random() * 15) + 10,
        winrate: Math.floor(Math.random() * 40) + 50,
        kda: (Math.random() * 3 + 1).toFixed(2),
        avgKills: (Math.random() * 5 + 2).toFixed(1),
        avgDeaths: (Math.random() * 4 + 3).toFixed(1),
        avgAssists: (Math.random() * 8 + 4).toFixed(1),
        cs: Math.floor(Math.random() * 50) + 150,
        goldPerMin: Math.floor(Math.random() * 100) + 350,
        damageShare: Math.floor(Math.random() * 10) + 20,
        visionScore: Math.floor(Math.random() * 20) + 15
      },
      'JUNGLE': {
        games: Math.floor(Math.random() * 15) + 10,
        winrate: Math.floor(Math.random() * 40) + 50,
        kda: (Math.random() * 3 + 1.5).toFixed(2),
        avgKills: (Math.random() * 6 + 3).toFixed(1),
        avgDeaths: (Math.random() * 4 + 3).toFixed(1),
        avgAssists: (Math.random() * 10 + 6).toFixed(1),
        cs: Math.floor(Math.random() * 40) + 120,
        goldPerMin: Math.floor(Math.random() * 80) + 320,
        damageShare: Math.floor(Math.random() * 8) + 18,
        visionScore: Math.floor(Math.random() * 25) + 20
      },
      'MID': {
        games: Math.floor(Math.random() * 15) + 10,
        winrate: Math.floor(Math.random() * 40) + 50,
        kda: (Math.random() * 4 + 1.5).toFixed(2),
        avgKills: (Math.random() * 7 + 4).toFixed(1),
        avgDeaths: (Math.random() * 4 + 3).toFixed(1),
        avgAssists: (Math.random() * 8 + 5).toFixed(1),
        cs: Math.floor(Math.random() * 60) + 160,
        goldPerMin: Math.floor(Math.random() * 120) + 380,
        damageShare: Math.floor(Math.random() * 15) + 25,
        visionScore: Math.floor(Math.random() * 20) + 12
      },
      'ADC': {
        games: Math.floor(Math.random() * 15) + 10,
        winrate: Math.floor(Math.random() * 40) + 50,
        kda: (Math.random() * 3 + 1.8).toFixed(2),
        avgKills: (Math.random() * 6 + 5).toFixed(1),
        avgDeaths: (Math.random() * 3 + 2).toFixed(1),
        avgAssists: (Math.random() * 6 + 3).toFixed(1),
        cs: Math.floor(Math.random() * 70) + 180,
        goldPerMin: Math.floor(Math.random() * 150) + 400,
        damageShare: Math.floor(Math.random() * 20) + 30,
        visionScore: Math.floor(Math.random() * 15) + 8
      },
      'SUPPORT': {
        games: Math.floor(Math.random() * 15) + 10,
        winrate: Math.floor(Math.random() * 40) + 50,
        kda: (Math.random() * 4 + 2).toFixed(2),
        avgKills: (Math.random() * 2 + 1).toFixed(1),
        avgDeaths: (Math.random() * 4 + 4).toFixed(1),
        avgAssists: (Math.random() * 12 + 8).toFixed(1),
        cs: Math.floor(Math.random() * 20) + 30,
        goldPerMin: Math.floor(Math.random() * 80) + 250,
        damageShare: Math.floor(Math.random() * 8) + 8,
        visionScore: Math.floor(Math.random() * 40) + 40
      }
    };

    return roleStats[player.role] || roleStats['MID'];
  };

  // Analyse des forces et faiblesses
  const analyzePlayer = (player, stats) => {
    const strengths = [];
    const weaknesses = [];
    const improvements = [];

    // Analyse basée sur les stats
    if (stats.winrate >= 70) strengths.push("Excellent taux de victoire");
    else if (stats.winrate <= 45) weaknesses.push("Taux de victoire faible");

    if (parseFloat(stats.kda) >= 3) strengths.push("Excellente efficacité (KDA)");
    else if (parseFloat(stats.kda) <= 1.5) weaknesses.push("KDA à améliorer");

    if (stats.cs >= 180) strengths.push("Excellent farm");
    else if (stats.cs <= 140) weaknesses.push("Farm insuffisant");

    if (stats.visionScore >= 35) strengths.push("Bonne vision du jeu");
    else if (stats.visionScore <= 15) weaknesses.push("Vision à améliorer");

    // Recommandations spécifiques par rôle
    if (player.role === 'TOP') {
      improvements.push("Travaillez votre impact en teamfight");
      if (stats.cs < 160) improvements.push("Améliorez votre farm en phase de lane");
    } else if (player.role === 'JUNGLE') {
      improvements.push("Optimisez vos ganks et votre vision");
      improvements.push("Travaillez vos objectifs neutres");
    } else if (player.role === 'MID') {
      improvements.push("Améliorez votre roaming");
      if (stats.damageShare < 25) improvements.push("Augmentez votre impact en dégâts");
    } else if (player.role === 'ADC') {
      improvements.push("Travaillez votre positionnement");
      if (stats.damageShare < 30) improvements.push("Maximisez votre DPS en teamfight");
    } else if (player.role === 'SUPPORT') {
      improvements.push("Optimisez votre vision et vos engages");
      improvements.push("Travaillez la protection de l'ADC");
    }

    return { strengths, weaknesses, improvements };
  };

  // Calcul des stats de l'équipe
  const teamStats = useMemo(() => {
    const playersStats = currentTeamData.players.map(player => ({
      player,
      stats: calculatePlayerStats(player),
      analysis: null
    })).map(playerData => ({
      ...playerData,
      analysis: analyzePlayer(playerData.player, playerData.stats)
    }));

    const avgWinrate = playersStats.reduce((sum, p) => sum + p.stats.winrate, 0) / playersStats.length;
    const avgKDA = playersStats.reduce((sum, p) => sum + parseFloat(p.stats.kda), 0) / playersStats.length;
    
    return {
      players: playersStats,
      team: {
        avgWinrate: avgWinrate.toFixed(1),
        avgKDA: avgKDA.toFixed(2),
        totalGames: playersStats.reduce((sum, p) => sum + p.stats.games, 0),
        strongestRole: playersStats.sort((a, b) => b.stats.winrate - a.stats.winrate)[0],
        weakestRole: playersStats.sort((a, b) => a.stats.winrate - b.stats.winrate)[0]
      }
    };
  }, [currentTeamData]);

  // Vue d'ensemble de l'équipe
  const TeamOverview = () => (
    <div className="space-y-6">
      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Taux de victoire moyen</p>
              <p className={`text-3xl font-bold ${
                teamStats.team.avgWinrate >= 60 ? 'text-green-400' : 
                teamStats.team.avgWinrate >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {teamStats.team.avgWinrate}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">KDA moyen</p>
              <p className={`text-3xl font-bold ${
                teamStats.team.avgKDA >= 2.5 ? 'text-green-400' : 
                teamStats.team.avgKDA >= 2 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {teamStats.team.avgKDA}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Parties totales</p>
              <p className="text-3xl font-bold text-white">{teamStats.team.totalGames}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Meilleur joueur</p>
              <p className="text-lg font-bold text-green-400">
                {teamStats.team.strongestRole?.player.name}
              </p>
              <p className="text-sm text-gray-400">{teamStats.team.strongestRole?.stats.winrate}% WR</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Analyse globale de l'équipe */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
          Analyse de l'équipe
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Points forts */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Points forts
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-green-300">• Bonne synergie globale</li>
              <li className="text-green-300">• {teamStats.team.strongestRole?.player.name} ({teamStats.team.strongestRole?.player.role}) très performant</li>
              <li className="text-green-300">• KDA équipe au-dessus de la moyenne</li>
            </ul>
          </div>

          {/* Points faibles */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-red-300 mb-3 flex items-center">
              <TrendingDown className="w-4 h-4 mr-2" />
              Points faibles
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-red-300">• {teamStats.team.weakestRole?.player.name} ({teamStats.team.weakestRole?.player.role}) en difficulté</li>
              <li className="text-red-300">• Vision globale à améliorer</li>
              <li className="text-red-300">• Coordination en late game</li>
            </ul>
          </div>

          {/* Objectifs */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Objectifs
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-blue-300">• Maintenir un KDA  3.0</li>
              <li className="text-blue-300">• Améliorer le taux de victoire global</li>
              <li className="text-blue-300">• Travailler les macro rotations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Liste des joueurs */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Performances individuelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamStats.players.map(playerData => (
            <div
              key={playerData.player.id}
              onClick={() => setSelectedPlayer(playerData)}
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 cursor-pointer transition-all hover:scale-105 border border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{playerData.player.name}</h4>
                    <p className="text-sm text-blue-400">{playerData.player.role}</p>
                  </div>
                </div>
                <div className={`text-right ${
                  playerData.stats.winrate >= 60 ? 'text-green-400' : 
                  playerData.stats.winrate >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  <p className="font-bold">{playerData.stats.winrate}%</p>
                  <p className="text-xs">WR</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="text-gray-400">KDA</p>
                  <p className="font-semibold text-white">{playerData.stats.kda}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Games</p>
                  <p className="font-semibold text-white">{playerData.stats.games}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">CS</p>
                  <p className="font-semibold text-white">{playerData.stats.cs}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Vue détaillée d'un joueur
  const PlayerDetails = ({ playerData }) => {
    const { player, stats, analysis } = playerData;

    return (
      <div className="space-y-6">
        {/* Header du joueur */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">{player.name}</h3>
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

          {/* Stats principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.games}</div>
              <div className="text-sm text-gray-400">Parties</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className={`text-2xl font-bold ${
                stats.winrate >= 60 ? 'text-green-400' : 
                stats.winrate >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {stats.winrate}%
              </div>
              <div className="text-sm text-gray-400">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className={`text-2xl font-bold ${
                parseFloat(stats.kda) >= 3 ? 'text-green-400' : 
                parseFloat(stats.kda) >= 2 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {stats.kda}
              </div>
              <div className="text-sm text-gray-400">KDA</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{stats.visionScore}</div>
              <div className="text-sm text-gray-400">Vision</div>
            </div>
          </div>
        </div>

        {/* Stats détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-bold text-white mb-4">Statistiques de combat</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Kills moyens</span>
                <span className="text-white font-semibold">{stats.avgKills}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deaths moyens</span>
                <span className="text-white font-semibold">{stats.avgDeaths}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Assists moyens</span>
                <span className="text-white font-semibold">{stats.avgAssists}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Part des dégâts</span>
                <span className="text-red-400 font-semibold">{stats.damageShare}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-bold text-white mb-4">Économie & Farm</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">CS moyen</span>
                <span className="text-white font-semibold">{stats.cs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Or par minute</span>
                <span className="text-yellow-400 font-semibold">{stats.goldPerMin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Score de vision</span>
                <span className="text-purple-400 font-semibold">{stats.visionScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analyse détaillée */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Points forts */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="font-semibold text-green-300 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Points forts
            </h4>
            <ul className="space-y-2 text-sm">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-green-300 flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Points faibles */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 className="font-semibold text-red-300 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Points faibles
            </h4>
            <ul className="space-y-2 text-sm">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="text-red-300 flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          {/* Améliorations */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <h4 className="font-semibold text-blue-300 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Améliorations
            </h4>
            <ul className="space-y-2 text-sm">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="text-blue-300 flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Si aucun joueur n'est sélectionné, afficher la liste des joueurs
  if (!selectedPlayer) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
              <h1 className="text-2xl font-bold text-white">Rapport d'Équipe</h1>
            </div>
          </div>
        </div>

        {/* Sélection du mode */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="text-center">
            <div className="inline-flex bg-gray-700 rounded-lg p-1">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors">
                <Users className="w-4 h-4 inline mr-2" />
                Équipe
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-6 overflow-y-auto">
          <TeamOverview />
        </div>
      </div>
    );
  }

  // Interface de détail du joueur
  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-2xl font-bold text-white">
              Rapport - {selectedPlayer.player.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 overflow-y-auto">
        <PlayerDetails playerData={selectedPlayer} />
      </div>
    </div>
  );
};

export default TeamReportInterface;