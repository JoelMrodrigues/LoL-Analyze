// Types de files centralisés
export const queueTypes = {
  '420': 'Classé Solo/Duo',
  '440': 'Classé Flexible',
  '450': 'ARAM',
  '400': 'Normale (Draft)',
  '430': 'Normale (Blind)'
};

// Calcul des statistiques principales
export const calculateStats = (matches) => {
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

// Calcul des statistiques avancées
export const calculateAdvancedStats = (matches) => {
  if (!matches?.length) return {};
  
  const recentMatches = matches.slice(0, 10);
  const avgGameDuration = recentMatches.reduce((sum, m) => sum + m.gameDuration, 0) / recentMatches.length;
  const perfectGames = recentMatches.filter(m => m.deaths === 0).length;
  const multikills = recentMatches.filter(m => m.kills >= 5 && m.assists >= 2).length;
  
  return {
    avgGameDuration: Math.floor(avgGameDuration / 60),
    perfectGamesPercent: ((perfectGames / recentMatches.length) * 100).toFixed(0),
    multikills: multikills
  };
};

// Utilitaires de formatage
export const formatGameDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getKDA = (kills, deaths, assists) => {
  return deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2);
};