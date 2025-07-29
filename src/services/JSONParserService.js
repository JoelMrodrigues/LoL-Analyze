// Service de parsing JSON adapté de votre script Google Apps Script
export class JSONParserService {
  
  // Map des pseudos/rôles de votre équipe (MODIFIEZ AVEC VOS VRAIS PSEUDOS)
  static mapPseudosRoles = {
    "Son of No One#EUW": "TOP",
    "Poro#EXA": "JUNGLE", 
    "Killa#MAJI": "MID",
    "Marcel le Zgeg#BACK": "ADC",
    "Swishee#EUW": "SUPPORT",
  };

  // Détection automatique du rôle basée sur la timeline
  static detecterRole(timeline) {
    if (!timeline) return "UNKNOWN";
    
    const lane = timeline.lane;
    const role = timeline.role;

    if (lane === "TOP") return "TOP";
    if (lane === "JUNGLE") return "JUNGLE";
    if (lane === "MIDDLE") return "MID";
    if (lane === "BOTTOM" && role === "CARRY") return "ADC";
    if (lane === "BOTTOM" && role === "SUPPORT") return "SUPPORT";
    return "UNKNOWN";
  }

  // Obtenir le nom du champion à partir de l'ID
  static getChampionName(championId) {
    const champions = {
      1: "Annie", 2: "Olaf", 3: "Galio", 4: "TwistedFate", 5: "XinZhao",
      22: "Ashe", 51: "Caitlyn", 81: "Ezreal", 157: "Yasuo", 222: "Jinx",
      // Ajoutez plus de champions selon vos besoins
    };
    
    return champions[championId] || `Champion${championId}`;
  }

  // Parser principal - adapté de votre fonction Google Apps Script
  static parseMatchJSON(jsonData, teamPseudos = []) {
    try {
      const json = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Validation basique
      if (!json.participants || !json.participantIdentities) {
        throw new Error("Format JSON invalide - participants ou participantIdentities manquants");
      }

      // Recherche des membres de l'équipe dans la partie
      const teamMembers = [];
      
      // Si on a des pseudos d'équipe spécifiques
      if (teamPseudos.length > 0) {
        teamPseudos.forEach(targetPseudo => {
          const [pseudoRecherche, tagRecherche] = targetPseudo.split('#');
          
          const identity = json.participantIdentities?.find(p =>
            p.player.gameName === pseudoRecherche && p.player.tagLine === tagRecherche
          );
          
          if (identity) {
            const participantId = identity.participantId;
            const participant = json.participants.find(p => p.participantId === participantId);
            
            if (participant) {
              const role = this.mapPseudosRoles[targetPseudo] || this.detecterRole(participant.timeline);
              teamMembers.push({
                participantId,
                participant,
                identity,
                role,
                pseudo: targetPseudo
              });
            }
          }
        });
      }

      if (teamMembers.length === 0) {
        throw new Error("Aucun membre de l'équipe trouvé dans cette partie");
      }

      // Déterminer l'équipe (prendre la teamId du premier joueur trouvé)
      const monTeamId = teamMembers[0].participant.teamId;
      
      // Filtrer uniquement les joueurs de la même équipe
      const joueursEquipe = teamMembers.filter(p => p.participant.teamId === monTeamId);

      // Trier par rôle
      const ordreRoles = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];
      joueursEquipe.sort((a, b) => ordreRoles.indexOf(a.role) - ordreRoles.indexOf(b.role));

      // Générer les données formatées
      const teamData = joueursEquipe.map(j => {
        const stats = j.participant.stats;
        const k = stats.kills || 0;
        const d = stats.deaths || 0;
        const a = stats.assists || 0;
        const kda = d === 0 ? (k + a).toFixed(2) : ((k + a) / d).toFixed(2);
        const champName = this.getChampionName(j.participant.championId);
        const side = j.participant.teamId === 100 ? "BLUE" : "RED";
        const isWin = stats.win || false;

        return {
          role: j.role,
          pseudo: j.pseudo,
          championName: champName,
          championId: j.participant.championId,
          kills: k,
          deaths: d,
          assists: a,
          kda: parseFloat(kda),
          totalDamageDealtToChampions: stats.totalDamageDealtToChampions || 0,
          goldEarned: stats.goldEarned || 0,
          cs: (stats.totalMinionsKilled || 0) + (stats.neutralMinionsKilled || 0),
          win: isWin,
          gameDuration: json.gameDuration || 0,
          visionWardsBought: stats.visionWardsBoughtInGame || 0,
          visionScore: stats.visionScore || 0,
          wardsPlaced: stats.wardsPlaced || 0,
          side: side,
          // Items
          item0: stats.item0 || 0,
          item1: stats.item1 || 0,
          item2: stats.item2 || 0,
          item3: stats.item3 || 0,
          item4: stats.item4 || 0,
          item5: stats.item5 || 0,
          item6: stats.item6 || 0
        };
      });

      // Déterminer le résultat global de l'équipe
      const teamWon = teamData.length > 0 ? teamData[0].win : false;

      return {
        success: true,
        data: {
          gameId: json.gameId || Math.random().toString(36).substr(2, 9),
          gameMode: json.gameMode || "CLASSIC",
          gameDuration: json.gameDuration || 0,
          gameCreation: json.gameCreation || Date.now(),
          side: teamData.length > 0 ? teamData[0].side : "UNKNOWN",
          result: teamWon ? "WIN" : "LOSE",
          teamData: teamData,
          importedAt: new Date().toISOString(),
          playersCount: teamData.length,
          teamId: monTeamId
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `Erreur de parsing: ${error.message}`,
        details: error
      };
    }
  }

  // Validation du format JSON
  static validateMatchJSON(jsonData) {
    try {
      const json = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      const requiredFields = ['participants', 'participantIdentities'];
      const missingFields = requiredFields.filter(field => !json[field]);
      
      if (missingFields.length > 0) {
        return {
          valid: false,
          error: `Champs manquants: ${missingFields.join(', ')}`
        };
      }

      return {
        valid: true,
        message: "Format JSON valide"
      };

    } catch (error) {
      return {
        valid: false,
        error: `JSON invalide: ${error.message}`
      };
    }
  }

  // Obtenir des statistiques rapides sur un match parsé
  static getMatchSummary(matchData) {
    if (!matchData.teamData || matchData.teamData.length === 0) {
      return null;
    }

    const team = matchData.teamData;
    const totalKills = team.reduce((sum, p) => sum + p.kills, 0);
    const totalDeaths = team.reduce((sum, p) => sum + p.deaths, 0);
    const totalAssists = team.reduce((sum, p) => sum + p.assists, 0);

    return {
      gameId: matchData.gameId,
      duration: Math.round(matchData.gameDuration / 60),
      result: matchData.result,
      side: matchData.side,
      teamStats: {
        totalKills,
        totalDeaths,
        totalAssists,
        teamKDA: totalDeaths > 0 ? ((totalKills + totalAssists) / totalDeaths).toFixed(2) : 'Perfect'
      },
      players: team.length,
      champions: team.map(p => p.championName)
    };
  }
}