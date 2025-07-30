import React, { useState } from 'react';
import { Search, User, Loader2 } from 'lucide-react';
import Layout from '../components/common/Layout';
import SearchForm from '../components/profil/SearchForm';
import StatsGrid from '../components/profil/StatsGrid';
import EmptyState from '../components/common/EmptyState';
import { riotAPI } from '../services/riotAPI';
import { calculateStats } from '../utils/statsCalucaltor';

// Import du composant MatchHistory amélioré du paste.txt
import MatchHistoryEnhanced from '../components/profil/MatchHistoryEnhanced.jsx';

const Profil = () => {
  const [pseudo, setPseudo] = useState('');
  const [queue, setQueue] = useState('');  // Vide = tous les modes par défaut
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  
  // États pour la pagination
  const [currentSummoner, setCurrentSummoner] = useState(null);
  const [hasMoreMatches, setHasMoreMatches] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const MATCHES_PER_PAGE = 20;

  const handleSearch = async () => {
    if (!pseudo.trim()) {
      setError('Veuillez entrer un pseudo');
      return;
    }

    setLoading(true);
    setError('');
    setMatches([]);
    setStats(null);
    setCurrentPage(0);
    setHasMoreMatches(true);
    
    try {
      // Récupérer les infos du joueur
      const summoner = await riotAPI.getSummonerInfo(pseudo);
      setCurrentSummoner(summoner);
      
      // Charger les premiers matchs
      await loadMatches(summoner, 0, true);
      
    } catch (err) {
      setError(err.message || 'Erreur lors de la recherche');
      setMatches([]);
      setStats(null);
      setCurrentSummoner(null);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async (summoner, startIndex, isInitialLoad = false) => {
    try {
      // Récupérer les IDs des matchs
      const matchIds = await riotAPI.getMatchIds(
        summoner.puuid, 
        queue || null,  // Si queue est vide, on passe null pour récupérer tous les modes
        startIndex, 
        MATCHES_PER_PAGE
      );

      if (matchIds.length === 0) {
        setHasMoreMatches(false);
        return;
      }

      // Charger les détails des matchs
      const matchDetails = await Promise.all(
        matchIds.map(id => riotAPI.getMatchDetails(id, summoner.puuid))
      );
      
      const validMatches = matchDetails.filter(Boolean);
      
      if (isInitialLoad) {
        setMatches(validMatches);
        setStats(calculateStats(validMatches));
      } else {
        setMatches(prevMatches => [...prevMatches, ...validMatches]);
        // Recalculer les stats avec tous les matchs
        const allMatches = [...matches, ...validMatches];
        setStats(calculateStats(allMatches));
      }

      // Vérifier s'il y a encore des matchs à charger
      if (matchIds.length < MATCHES_PER_PAGE) {
        setHasMoreMatches(false);
      }

    } catch (err) {
      console.error('Erreur lors du chargement des matchs:', err);
      if (isInitialLoad) {
        throw err;
      } else {
        setError('Erreur lors du chargement des matchs supplémentaires');
      }
    }
  };

  const handleLoadMore = async () => {
    if (!currentSummoner || !hasMoreMatches || loadingMore) return;

    setLoadingMore(true);
    setError('');

    try {
      const nextPage = currentPage + 1;
      const startIndex = nextPage * MATCHES_PER_PAGE;
      
      await loadMatches(currentSummoner, startIndex, false);
      setCurrentPage(nextPage);
      
    } catch (err) {
      setError('Erreur lors du chargement des matchs supplémentaires');
    } finally {
      setLoadingMore(false);
    }
  };

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
          
          {/* Historique des matchs avec l'affichage amélioré */}
          <MatchHistoryEnhanced matches={matches} />
          
          {/* Bouton "Afficher plus" */}
          {matches.length > 0 && hasMoreMatches && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Chargement...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Afficher plus de parties</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Message de fin */}
          {matches.length > 0 && !hasMoreMatches && (
            <div className="text-center mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">
                🎯 Toutes les parties disponibles ont été chargées ({matches.length} parties au total)
              </p>
            </div>
          )}

          {/* État vide */}
          {!loading && matches.length === 0 && !error && <EmptyState />}
        </div>
      </section>
    </Layout>
  );
};

export default Profil;