import React, { useState } from 'react';
import { Search, Trophy, Target, Clock, User, BarChart3, ChevronDown, ChevronUp, Gamepad2, Sword, Shield, Zap } from 'lucide-react';

// Composant Header intégré
const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-black bg-opacity-60 backdrop-blur-md text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">LoL Analyzer</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <a href="/" className="hover:text-blue-400 transition-colors">
                Accueil
              </a>
            </li>
            <li>
              <a href="/profil" className="text-blue-400 font-semibold">
                Profil
              </a>
            </li>
            <li>
              <a href="/analyse" className="hover:text-blue-400 transition-colors">
                Analyse
              </a>
            </li>
            <li>
              <a href="/data-champ" className="hover:text-blue-400 transition-colors">
                Data Champ
              </a>
            </li>
            <li>
              <a href="/amelioration" className="hover:text-blue-400 transition-colors">
                Amélioration
              </a>
            </li>
            <li>
              <a href="/top-tier" className="hover:text-blue-400 transition-colors">
                Top Tier
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Configuration API
const RIOT_API_KEY = 'RGAPI-257cd474-7cde-4100-8725-f436f39182a3';

// Types de files
const queueTypes = {
  '420': 'Classé Solo/Duo',
  '440': 'Classé Flexible', 
  '450': 'ARAM',
  '400': 'Normale (Draft)',
  '430': 'Normale (Blind)'
};

// Utilitaires pour les images
const getChampionImage = (championName) => {
  const version = '14.1.1';
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
};

const getItemImage = (itemId) => {
  const version = '14.1.1';
  if (!itemId || itemId === 0) return null;
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
};

const getSummonerSpellImage = (spellId) => {
  const version = '14.1.1';
  const spellNames = {
    1: 'SummonerBoost', 3: 'SummonerExhaust', 4: 'SummonerFlash',
    6: 'SummonerHaste', 7: 'SummonerHeal', 11: 'SummonerSmite',
    12: 'SummonerTeleport', 13: 'SummonerMana', 14: 'SummonerDot',
    21: 'SummonerBarrier', 30: 'SummonerPoroRecall', 31: 'SummonerPoroThrow',
    32: 'SummonerSnowball'
  };
  
  const spellName = spellNames[spellId] || 'SummonerFlash';
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spellName}.png`;
};

// Service API Riot Games
const riotAPI = {
  async getSummonerInfo(pseudoComplet) {
    if (!pseudoComplet || !pseudoComplet.includes("#")) {
      throw new Error("Le pseudo doit contenir un # (ex: Nom#TAG)");
    }

    const [gameName, tagLine] = pseudoComplet.split('#');
    const url = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    
    try {
      const response = await fetch(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY }
      });

      if (!response.ok) {
        throw new Error(`Joueur non trouvé (${response.status})`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Erreur de connexion à l'API Riot: ${error.message}`);
    }
  },

  async getMatchIds(puuid, queue, start = 0, count = 20) {
    let url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
    if (queue) url += `&queue=${queue}`;

    try {
      const response = await fetch(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY }
      });

      if (!response.ok) {
        throw new Error(`Erreur récupération matchs: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Impossible de récupérer l'historique: ${error.message}`);
    }
  },

  async getMatchDetails(matchId, puuid) {
    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    
    try {
      const response = await fetch(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const participant = data.info.participants.find(p => p.puuid === puuid);
      if (!participant) return null;

      return {
        matchId,
        champ: participant.championName,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        cs: participant.totalMinionsKilled + participant.neutralMinionsKilled,
        win: participant.win,
        gameDuration: data.info.gameDuration,
        date: new Date(data.info.gameStartTimestamp).toLocaleDateString(),
        items: [
          participant.item0, participant.item1, participant.item2,
          participant.item3, participant.item4, participant.item5, participant.item6
        ],
        summoners: [participant.summoner1Id, participant.summoner2Id],
        allPlayers: data.info.participants.map(p => ({
          puuid: p.puuid,
          summonerName: p.riotIdGameName || p.summonerName,
          tagLine: p.riotIdTagline || '',
          championName: p.championName,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          cs: p.totalMinionsKilled + p.neutralMinionsKilled,
          items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
          summoners: [p.summoner1Id, p.summoner2Id],
          level: p.champLevel,
          goldEarned: p.goldEarned,
          teamId: p.teamId,
          win: p.win,
          isSearchedPlayer: p.puuid === puuid
        }))
      };
    } catch (error) {
      console.error(`Erreur match ${matchId}:`, error);
      return null;
    }
  },

  async rechercherProfil(pseudo, queue) {
    try {
      const summoner = await this.getSummonerInfo(pseudo);
      const matches = await this.getMatchIds(summoner.puuid, queue, 0, 20);
      
      const matchDetails = await Promise.all(
        matches.map(id => this.getMatchDetails(id, summoner.puuid))
      );
      
      return matchDetails.filter(Boolean);
    } catch (error) {
      throw error;
    }
  }
};

// Fonction de calcul des statistiques
const calculateStats = (matches) => {
  if (!matches.length) return null;

  const wins = matches.filter(m => m.win).length;
  const totalKills = matches.reduce((sum, m) => sum + m.kills, 0);
  const totalDeaths = matches.reduce((sum, m) => sum + m.deaths, 0);
  const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0);
  const avgCS = matches.reduce((sum, m) => sum + m.cs, 0) / matches.length;

  return {
    winRate: ((wins / matches.length) * 100).toFixed(1),
    kda: totalDeaths > 0 ? ((totalKills + totalAssists) / totalDeaths).toFixed(2) : 'Perfect',
    avgKills: (totalKills / matches.length).toFixed(1),
    avgCS: avgCS.toFixed(0),
    totalGames: matches.length,
    wins: wins
  };
};

// Composant StatsCard
const StatsCard = ({ title, value, icon: Icon, color = "blue", subtitle }) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200", 
      icon: "text-blue-600",
      text: "text-blue-900",
      accent: "bg-blue-500"
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-200",
      icon: "text-green-600", 
      text: "text-green-900",
      accent: "bg-green-500"
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-200",
      icon: "text-red-600",
      text: "text-red-900",
      accent: "bg-red-500"
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100", 
      border: "border-orange-200",
      icon: "text-orange-600",
      text: "text-orange-900",
      accent: "bg-orange-500"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      border: "border-purple-200",
      icon: "text-purple-600",
      text: "text-purple-900", 
      accent: "bg-purple-500"
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-full h-1 ${colors.accent}`}></div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className={`h-5 w-5 ${colors.icon}`} />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold ${colors.text}`}>
              {value}
            </p>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className={`${colors.icon} opacity-10`}>
          <Icon className="h-16 w-16" />
        </div>
      </div>
    </div>
  );
};

// Composant SearchForm
const SearchForm = ({ pseudo, setPseudo, queue, setQueue, onSearch, loading, error }) => {
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
              <BarChart3 className="inline h-4 w-4 mr-1" />
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

// Composant StatsGrid
const StatsGrid = ({ stats, matches }) => {
  if (!stats) return null;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Taux de victoire"
          value={`${stats.winRate}%`}
          icon={Trophy}
          color="green"
          subtitle={`${stats.wins}/${stats.totalGames} victoires`}
        />
        <StatsCard
          title="KDA Moyen"
          value={stats.kda}
          icon={Target}
          color="blue"
          subtitle="Kills / Deaths / Assists"
        />
        <StatsCard
          title="Kills Moyens"
          value={stats.avgKills}
          icon={Sword}
          color="red"
          subtitle="Par partie"
        />
        <StatsCard
          title="CS Moyen"
          value={stats.avgCS}
          icon={Clock}
          color="orange"
          subtitle="Creep Score"
        />
      </div>

      {matches && matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Parties"
            value={stats.totalGames}
            icon={BarChart3}
            color="purple"
            subtitle="Analysées"
          />
          <StatsCard
            title="Perfect Games"
            value={matches.filter(m => m.deaths === 0).length}
            icon={Shield}
            color="green"
            subtitle="0 morts"
          />
          <StatsCard
            title="Multikills"
            value={matches.filter(m => m.kills >= 5).length}
            icon={Zap}
            color="orange"
            subtitle="5+ kills"
          />
        </div>
      )}
    </div>
  );
};

// Composant MatchHistory
const MatchHistory = ({ matches }) => {
  const [expandedMatch, setExpandedMatch] = useState(null);

  if (!matches.length) return null;

  const formatGameDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getKDA = (kills, deaths, assists) => {
    return deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2);
  };

  const ItemSlot = ({ itemId }) => {
    const itemImage = getItemImage(itemId);
    
    if (!itemImage) {
      return (
        <div className="w-8 h-8 bg-gray-800 rounded border border-gray-700"></div>
      );
    }

    return (
      <img 
        src={itemImage} 
        alt="Item" 
        className="w-8 h-8 rounded border border-gray-600"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  };

  const toggleMatchDetails = (matchId) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const PlayerRow = ({ player, isSearchedPlayer }) => (
    <div className={`flex items-center py-2 px-3 rounded ${
      isSearchedPlayer 
        ? 'bg-blue-900 bg-opacity-30 border border-blue-500' 
        : 'hover:bg-gray-50'
    }`}>
      <div className="flex items-center space-x-2 w-24">
        <div className="relative">
          <img 
            src={getChampionImage(player.championName)} 
            alt={player.championName}
            className="w-10 h-10 rounded"
          />
          <div className="absolute -bottom-1 -right-1 text-xs bg-gray-800 text-white px-1 rounded">
            {player.level}
          </div>
        </div>
        <div className="flex flex-col space-y-0.5">
          <img 
            src={getSummonerSpellImage(player.summoners[0])} 
            alt="Spell"
            className="w-4 h-4 rounded"
          />
          <img 
            src={getSummonerSpellImage(player.summoners[1])} 
            alt="Spell"
            className="w-4 h-4 rounded"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 px-3">
        <div className={`font-medium truncate ${
          isSearchedPlayer ? 'text-blue-600 font-bold' : 'text-gray-900'
        }`}>
          {player.summonerName}
          {player.tagLine && `#${player.tagLine}`}
        </div>
        <div className="text-sm text-gray-500">{player.championName}</div>
      </div>

      <div className="text-center w-20">
        <div className="font-semibold text-gray-900">
          {player.kills}/{player.deaths}/{player.assists}
        </div>
        <div className="text-sm text-gray-500">
          {getKDA(player.kills, player.deaths, player.assists)} KDA
        </div>
      </div>

      <div className="text-center w-16">
        <div className="font-medium text-gray-900">{player.cs}</div>
        <div className="text-xs text-gray-500">CS</div>
      </div>

      <div className="text-center w-20">
        <div className="font-medium text-yellow-600">
          {(player.goldEarned / 1000).toFixed(1)}k
        </div>
        <div className="text-xs text-gray-500">Gold</div>
      </div>

      <div className="flex space-x-1 w-56">
        {player.items.slice(0, 6).map((itemId, index) => (
          <ItemSlot key={index} itemId={itemId} />
        ))}
        <div className="w-1"></div>
        <ItemSlot itemId={player.items[6]} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <BarChart3 className="mr-3 text-blue-600" />
          Historique des matchs
        </h3>
        <div className="text-sm text-gray-400">
          {matches.length} matchs récents
        </div>
      </div>
      
      <div className="space-y-3">
        {matches.map((match, index) => {
          const isExpanded = expandedMatch === match.matchId;
          const teamBlue = match.allPlayers ? match.allPlayers.filter(p => p.teamId === 100) : [];
          const teamRed = match.allPlayers ? match.allPlayers.filter(p => p.teamId === 200) : [];

          return (
            <div key={match.matchId || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className={`p-4 cursor-pointer transition-colors duration-200 border-l-4 ${
                  match.win 
                    ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                    : 'border-red-500 bg-red-50 hover:bg-red-100'
                }`}
                onClick={() => toggleMatchDetails(match.matchId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={getChampionImage(match.champ)} 
                        alt={match.champ}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <img 
                        src={getSummonerSpellImage(match.summoners[0])} 
                        alt="Spell"
                        className="w-6 h-6 rounded"
                      />
                      <img 
                        src={getSummonerSpellImage(match.summoners[1])} 
                        alt="Spell"
                        className="w-6 h-6 rounded"
                      />
                    </div>

                    <div>
                      <div className="font-semibold text-lg text-gray-900">
                        {match.champ}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatGameDuration(match.gameDuration)}</span>
                        <span>•</span>
                        <span>{match.date}</span>
                      </div>
                    </div>

                    <div className="text-center bg-white rounded-lg px-4 py-2 shadow-sm">
                      <div className="font-bold text-lg text-gray-900">
                        {match.kills}/{match.deaths}/{match.assists}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getKDA(match.kills, match.deaths, match.assists)} KDA
                      </div>
                    </div>

                    <div className="text-center bg-white rounded-lg px-4 py-2 shadow-sm">
                      <div className="font-bold text-lg text-gray-900">{match.cs}</div>
                      <div className="text-sm text-gray-500">CS</div>
                    </div>

                    <div className="flex space-x-1">
                      {match.items.slice(0, 6).map((itemId, index) => (
                        <ItemSlot key={index} itemId={itemId} />
                      ))}
                      <div className="w-1"></div>
                      <ItemSlot itemId={match.items[6]} />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                      match.win 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {match.win ? 'VICTOIRE' : 'DÉFAITE'}
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && match.allPlayers && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                        <h4 className="font-semibold text-blue-700">Équipe Bleue</h4>
                        {teamBlue[0] && teamBlue[0].win && (
                          <Trophy className="w-4 h-4 text-yellow-500 ml-2" />
                        )}
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200">
                        {teamBlue.map((player, index) => (
                          <PlayerRow 
                            key={index} 
                            player={player} 
                            isSearchedPlayer={player.isSearchedPlayer}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-3">
                        <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                        <h4 className="font-semibold text-red-700">Équipe Rouge</h4>
                        {teamRed[0] && teamRed[0].win && (
                          <Trophy className="w-4 h-4 text-yellow-500 ml-2" />
                        )}
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200">
                        {teamRed.map((player, index) => (
                          <PlayerRow 
                            key={index} 
                            player={player} 
                            isSearchedPlayer={player.isSearchedPlayer}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Composant EmptyState
const EmptyState = () => (
  <div className="text-center text-white py-12">
    <Search className="mx-auto h-16 w-16 text-blue-300 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Commencez votre analyse</h3>
    <p className="text-blue-200">Entrez votre pseudo Riot pour voir vos statistiques</p>
  </div>
);

// Composant principal Profil
const Profil = () => {
  const [pseudo, setPseudo] = useState('');
  const [queue, setQueue] = useState('420');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const handleSearch = async () => {
    if (!pseudo.trim()) {
      setError('Veuillez entrer un pseudo');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const matchData = await riotAPI.rechercherProfil(pseudo, queue);
      setMatches(matchData);
      setStats(calculateStats(matchData));
    } catch (err) {
      setError(err.message || 'Erreur lors de la recherche');
      setMatches([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-16 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Analyse de Profil</h1>
          <p className="text-xl text-blue-200 font-medium">
            Découvrez vos statistiques détaillées et votre progression
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-blue-300">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              API Riot Games
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Temps réel
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Données détaillées
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <SearchForm
            pseudo={pseudo}
            setPseudo={setPseudo}
            queue={queue}
            setQueue={setQueue}
            onSearch={handleSearch}
            loading={loading}
            error={error}
          />

          <StatsGrid stats={stats} matches={matches} />
          <MatchHistory matches={matches} />
          
          {!loading && matches.length === 0 && !error && <EmptyState />}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black bg-opacity-60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <span>Développé avec</span>
              <span className="text-red-400">❤</span>
              <span>pour la communauté League of Legends</span>
            </div>
            <div className="mt-2 md:mt-0">
              <span>Données fournies par Riot Games API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profil;