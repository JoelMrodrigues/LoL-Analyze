const RIOT_API_KEY = 'RGAPI-257cd474-7cde-4100-8725-f436f39182a3';

export const riotAPI = {
  async getSummonerInfo(pseudoComplet) {
    if (!pseudoComplet || !pseudoComplet.includes("#")) {
      throw new Error("Le pseudo doit contenir un # (ex: Nom#TAG)");
    }

    const [gameName, tagLine] = pseudoComplet.split('#');
    const url = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    
    const response = await fetch(url, {
      headers: { "X-Riot-Token": RIOT_API_KEY }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return response.json();
  },

  async getMatchIds(puuid, queue, start = 0, count = 20) {
    let url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
    if (queue) url += `&queue=${queue}`;

    const response = await fetch(url, {
      headers: { "X-Riot-Token": RIOT_API_KEY }
    });

    if (!response.ok) {
      throw new Error(`Erreur récupération matchs: ${response.status}`);
    }

    return response.json();
  },

  async getMatchDetails(matchId, puuid) {
    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    
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

export const getChampionImage = (championName) => {
  const version = '14.1.1';
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
};

export const getItemImage = (itemId) => {
  const version = '14.1.1';
  if (!itemId || itemId === 0) return null;
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
};

export const getSummonerSpellImage = (spellId) => {
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