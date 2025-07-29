import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import Layout from '../components/common/Layout';
import SearchForm from '../components/profil/SearchForm';
import StatsGrid from '../components/profil/StatsGrid';
import MatchHistory from '../components/profil/MatchHistory';
import EmptyState from '../components/common/EmptyState';
import { riotAPI } from '../services/riotAPI';
import { calculateStats } from '../utils/statsCalucaltor';

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
          <MatchHistory matches={matches} />
          
          {!loading && matches.length === 0 && !error && <EmptyState />}
        </div>
      </section>
    </Layout>
  );
};

export default Profil;