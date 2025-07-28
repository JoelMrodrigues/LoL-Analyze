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
    avgCS: avgCS.toFixed(0)
  };
};

export const queueTypes = {
  '420': 'Classé Solo/Duo',
  '440': 'Classé Flexible',
  '450': 'ARAM',
  '400': 'Normale (Draft)',
  '430': 'Normale (Blind)'
};