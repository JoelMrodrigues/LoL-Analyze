import React, { useState } from 'react';
import { User } from 'lucide-react';
import Layout from '../components/common/Layout';
import SearchForm from '../components/profil/SearchForm';
import StatsGrid from '../components/profil/StatsGrid';
import MatchHistory from '../components/profil/MatchHistory';
import EmptyState from '../components/common/EmptyState';
import { riotService, apiUtils } from '../services/api';

const Profil = () => {
  const [pseudo, setPseudo] = useState('');
  const [queue, setQueue] = useState('420');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!pseudo.trim() || !pseudo.includes('#')) {
      setError('Veuillez entrer un Riot ID complet (ex: Pseudo#TAG)');
      return;
    }

    const [gameName, tagLine] = pseudo.split('#');
    if (!gameName || !tagLine) {
      setError('Format invalide. Utilisez: Pseudo#TAG');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await riotService.searchProfile(gameName, tagLine, {
        queue: queue || undefined,
        matchCount: 15
      });
      
      setProfileData(data);
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  // Transformer les données pour les composants existants
  const getFormattedData = () => {
    if (!profileData) return { stats: null, matches: [] };

    const { statistics, matches } = profileData;
    
    return {
      stats: {
        winRate: statistics.winRate,
        kda: statistics.averageKDA,
        avgKills: statistics.averageKills,
        avgCS: statistics.averageCS,
        totalGames: statistics.totalGames,
        wins: statistics.wins
      },
      matches: matches.map(match => ({
        matchId: match.matchId,
        champ: match.playerStats.championName,
        kills: match.playerStats.kills,
        deaths: match.playerStats.deaths,
        assists: match.playerStats.assists,
        cs: match.playerStats.totalMinionsKilled + match.playerStats.neutralMinionsKilled,
        win: match.playerStats.win,
        gameDuration: match.gameDuration,
        date: new Date(match.gameCreation).toLocaleDateString(),
        items: match.playerStats.items,
        summoners: match.playerStats.summoners,
        allPlayers: match.participants.map(p => ({
          puuid: p.puuid,
          summonerName: p.gameName,
          tagLine: p.tagLine,
          championName: p.championName,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          cs: p.totalMinionsKilled + p.neutralMinionsKilled,
          items: p.items,
          summoners: p.summoners,
          level: p.level,
          goldEarned: p.goldEarned,
          teamId: p.teamId,
          win: p.win,
          isSearchedPlayer: p.puuid === profileData.account.puuid
        }))
      }))
    };
  };

  const { stats, matches } = getFormattedData();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Analyse de Profil</h1>
          <p className="text-xl text-blue-200 font-medium">
            Découvrez vos statistiques détaillées et votre progression
          </p>
          
          {/* Infos utilisateur si profil trouvé */}
          {profileData && (
            <div className="mt-6 bg-black bg-opacity-30 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${profileData.summoner.profileIconId}.png`}
                  alt="Profile Icon"
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                />
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">
                    {profileData.account.gameName}#{profileData.account.tagLine}
                  </h3>
                  <p className="text-blue-200">
                    Level {profileData.summoner.summonerLevel} • {profileData.rank.tier} {profileData.rank.division}
                  </p>
                  {profileData.rank.leaguePoints > 0 && (
                    <p className="text-sm text-blue-300">
                      {profileData.rank.leaguePoints} LP • {profileData.rank.wins}W {profileData.rank.losses}L
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-center space-x-4 text-sm text-blue-300">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              API Riot Games
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Serveur sécurisé
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Données temps réel
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
    </Layout>
  );
};

export default Profil;