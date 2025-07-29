import axios from 'axios';

class RiotService {
  constructor() {
    this.apiKey = process.env.RIOT_API_KEY;
    this.baseURLs = {
      account: 'https://europe.api.riotgames.com',
      summoner: 'https://euw1.api.riotgames.com',
      match: 'https://europe.api.riotgames.com'
    };
    
    // Configuration axios avec intercepteurs
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'X-Riot-Token': this.apiKey
      }
    });
    
    // Intercepteur pour les erreurs
    this.client.interceptors.response.use(
      response => response,
      error => {
        const customError = this.handleApiError(error);
        return Promise.reject(customError);
      }
    );
  }

  // Gestion centralisée des erreurs API
  handleApiError(error) {
    if (!error.response) {
      return {
        status: 500,
        message: 'Erreur de connexion à l\'API Riot',
        code: 'CONNECTION_ERROR'
      };
    }

    const status = error.response.status;
    const errorMessages = {
      400: 'Requête invalide',
      401: 'Clé API invalide',
      403: 'Accès interdit - Vérifiez votre clé API',
      404: 'Joueur ou données non trouvés',
      415: 'Type de contenu non supporté',
      429: 'Trop de requêtes - Limite atteinte',
      500: 'Erreur interne de l\'API Riot',
      502: 'Service temporairement indisponible',
      503: 'Service en maintenance'
    };

    return {
      status,
      message: errorMessages[status] || 'Erreur API inconnue',
      code: `RIOT_API_${status}`,
      details: error.response.data
    };
  }

  // Récupérer les informations du compte Riot
  async getAccountByRiotId(gameName, tagLine) {
    try {
      const url = `${this.baseURLs.account}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
      const response = await this.client.get(url);
      
      return {
        puuid: response.data.puuid,
        gameName: response.data.gameName,
        tagLine: response.data.tagLine
      };
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les informations du summoner
  async getSummonerByPuuid(puuid) {
    try {
      const url = `${this.baseURLs.summoner}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
      const response = await this.client.get(url);
      
      return {
        id: response.data.id,
        accountId: response.data.accountId,
        puuid: response.data.puuid,
        name: response.data.name,
        profileIconId: response.data.profileIconId,
        revisionDate: response.data.revisionDate,
        summonerLevel: response.data.summonerLevel
      };
    } catch (error) {
      throw error;
    }
  }

  // Récupérer le rang du joueur
  async getRankBySummonerId(summonerId) {
    try {
      const url = `${this.baseURLs.summoner}/lol/league/v4/entries/by-summoner/${summonerId}`;
      const response = await this.client.get(url);
      
      // Chercher le rang en Solo/Duo
      const soloRank = response.data.find(entry => entry.queueType === 'RANKED_SOLO_5x5');
      
      if (soloRank) {
        return {
          tier: soloRank.tier,
          division: soloRank.rank,
          leaguePoints: soloRank.leaguePoints,
          wins: soloRank.wins,
          losses: soloRank.losses,
          hotStreak: soloRank.hotStreak,
          veteran: soloRank.veteran,
          freshBlood: soloRank.freshBlood,
          inactive: soloRank.inactive
        };
      }
      
      return {
        tier: 'UNRANKED',
        division: 'IV',
        leaguePoints: 0,
        wins: 0,
        losses: 0
      };
    } catch (error) {
      // Si pas de rang, retourner unranked
      return {
        tier: 'UNRANKED',
        division: 'IV',
        leaguePoints: 0,
        wins: 0,
        losses: 0
      };
    }
  }

  // Récupérer la liste des matchs
  async getMatchIdsByPuuid(puuid, options = {}) {
    try {
      const {
        queue = null,
        type = null,
        start = 0,
        count = 20
      } = options;
      
      let url = `${this.baseURLs.match}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
      
      if (queue) url += `&queue=${queue}`;
      if (type) url += `&type=${type}`;
      
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les détails d'un match
  async getMatchDetails(matchId) {
    try {
      const url = `${this.baseURLs.match}/lol/match/v5/matches/${matchId}`;
      const response = await this.client.get(url);
      
      const matchData = response.data;
      
      return {
        matchId: matchData.metadata.matchId,
        gameId: matchData.info.gameId,
        gameType: matchData.info.gameType,
        gameMode: matchData.info.gameMode,
        gameDuration: matchData.info.gameDuration,
        gameCreation: matchData.info.gameCreation,
        gameStartTimestamp: matchData.info.gameStartTimestamp,
        gameEndTimestamp: matchData.info.gameEndTimestamp,
        participants: matchData.info.participants.map(participant => ({
          puuid: participant.puuid,
          gameName: participant.riotIdGameName || participant.summonerName,
          tagLine: participant.riotIdTagline || '',
          championName: participant.championName,
          championId: participant.championId,
          position: participant.teamPosition || participant.individualPosition,
          kills: participant.kills,
          deaths: participant.deaths,
          assists: participant.assists,
          totalMinionsKilled: participant.totalMinionsKilled,
          neutralMinionsKilled: participant.neutralMinionsKilled,
          goldEarned: participant.goldEarned,
          items: [
            participant.item0, participant.item1, participant.item2,
            participant.item3, participant.item4, participant.item5, participant.item6
          ],
          summoners: [participant.summoner1Id, participant.summoner2Id],
          level: participant.champLevel,
          win: participant.win,
          teamId: participant.teamId,
          visionScore: participant.visionScore,
          wardsPlaced: participant.wardsPlaced,
          wardsKilled: participant.wardsKilled,
          damageDealtToChampions: participant.totalDamageDealtToChampions,
          damageTaken: participant.totalDamageTaken
        })),
        teams: matchData.info.teams.map(team => ({
          teamId: team.teamId,
          win: team.win,
          kills: team.objectives?.champion?.kills || 0,
          towers: team.objectives?.tower?.kills || 0,
          inhibitors: team.objectives?.inhibitor?.kills || 0,
          barons: team.objectives?.baron?.kills || 0,
          drakes: team.objectives?.dragon?.kills || 0,
          riftHeralds: team.objectives?.riftHerald?.kills || 0,
          bans: team.bans?.map(ban => ({
            championId: ban.championId,
            pickTurn: ban.pickTurn
          })) || []
        }))
      };
    } catch (error) {
      throw error;
    }
  }

  // Recherche complète d'un profil avec tous les détails
  async getCompleteProfile(gameName, tagLine, options = {}) {
    try {
      // 1. Récupérer le compte Riot
      const account = await this.getAccountByRiotId(gameName, tagLine);
      
      // 2. Récupérer les infos summoner
      const summoner = await this.getSummonerByPuuid(account.puuid);
      
      // 3. Récupérer le rang
      const rank = await this.getRankBySummonerId(summoner.id);
      
      // 4. Récupérer les matchs récents
      const matchIds = await this.getMatchIdsByPuuid(account.puuid, {
        count: options.matchCount || 10,
        queue: options.queue
      });
      
      // 5. Récupérer les détails des matchs (en parallèle mais avec limite)
      const matchPromises = matchIds.slice(0, 5).map(matchId => 
        this.getMatchDetails(matchId).catch(err => {
          console.warn(`Erreur match ${matchId}:`, err.message);
          return null;
        })
      );
      
      const matches = (await Promise.all(matchPromises)).filter(Boolean);
      
      return {
        account: {
          puuid: account.puuid,
          gameName: account.gameName,
          tagLine: account.tagLine
        },
        summoner: {
          summonerLevel: summoner.summonerLevel,
          profileIconId: summoner.profileIconId
        },
        rank,
        matches: matches.map(match => ({
          ...match,
          playerStats: match.participants.find(p => p.puuid === account.puuid)
        })),
        statistics: this.calculatePlayerStats(matches, account.puuid)
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculer les statistiques d'un joueur
  calculatePlayerStats(matches, puuid) {
    if (!matches.length) {
      return {
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        averageKDA: 0,
        averageKills: 0,
        averageDeaths: 0,
        averageAssists: 0,
        averageCS: 0
      };
    }

    const playerMatches = matches.map(match => {
      const playerStats = match.participants.find(p => p.puuid === puuid);
      return playerStats;
    }).filter(Boolean);

    const totalGames = playerMatches.length;
    const wins = playerMatches.filter(p => p.win).length;
    const losses = totalGames - wins;
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

    const totalKills = playerMatches.reduce((sum, p) => sum + p.kills, 0);
    const totalDeaths = playerMatches.reduce((sum, p) => sum + p.deaths, 0);
    const totalAssists = playerMatches.reduce((sum, p) => sum + p.assists, 0);
    const totalCS = playerMatches.reduce((sum, p) => sum + p.totalMinionsKilled + p.neutralMinionsKilled, 0);

    const averageKills = totalGames > 0 ? totalKills / totalGames : 0;
    const averageDeaths = totalGames > 0 ? totalDeaths / totalGames : 0;
    const averageAssists = totalGames > 0 ? totalAssists / totalGames : 0;
    const averageCS = totalGames > 0 ? totalCS / totalGames : 0;
    const averageKDA = totalDeaths > 0 ? (totalKills + totalAssists) / totalDeaths : totalKills + totalAssists;

    return {
      totalGames,
      wins,
      losses,
      winRate: Math.round(winRate * 100) / 100,
      averageKDA: Math.round(averageKDA * 100) / 100,
      averageKills: Math.round(averageKills * 100) / 100,
      averageDeaths: Math.round(averageDeaths * 100) / 100,
      averageAssists: Math.round(averageAssists * 100) / 100,
      averageCS: Math.round(averageCS)
    };
  }

  // Vérifier si un joueur existe
  async playerExists(gameName, tagLine) {
    try {
      await this.getAccountByRiotId(gameName, tagLine);
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  // Recherche rapide (sans les matchs)
  async getBasicProfile(gameName, tagLine) {
    try {
      const account = await this.getAccountByRiotId(gameName, tagLine);
      const summoner = await this.getSummonerByPuuid(account.puuid);
      const rank = await this.getRankBySummonerId(summoner.id);
      
      return {
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        rank
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new RiotService();