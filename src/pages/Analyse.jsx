import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import SearchForm from '../components/profil/SearchForm';
import StatsGrid from '../components/profil/StatsGrid';
import EmptyState from '../components/common/EmptyState';
import { riotAPI } from '../services/riotAPI';
import { calculateStats } from '../utils/statsCalucaltor';
import InsightsPanel from '../components/analyse/InsightsPanel.jsx';

const Analyse = () => {
  const [pseudo, setPseudo] = useState('');
  const [queue, setQueue] = useState('420');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [matchLimit, setMatchLimit] = useState(20); // 👈 limite personnalisable

  const handleSearch = async () => {
    if (!pseudo.trim()) {
      setError('Veuillez entrer un pseudo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const matchData = await riotAPI.rechercherProfil(pseudo, queue, matchLimit); // 👈 passage de la limite
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
      <section className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">🔬 Analyse Avancée</h1>
          <p className="text-xl text-green-200 font-medium">
            Analyse automatique à partir de vos statistiques
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-6 mb-6">
            {/* Champ sélection du nombre de parties */}
            <label className="text-white">
              Nombre de parties à analyser :
              <input
                type="number"
                min={1}
                max={2000}
                value={matchLimit}
                onChange={(e) =>
                  setMatchLimit(Math.min(2000, parseInt(e.target.value) || 1))
                }
                className="ml-2 w-24 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600"
              />
            </label>
          </div>

          <SearchForm
            pseudo={pseudo}
            setPseudo={setPseudo}
            queue={queue}
            setQueue={setQueue}
            onSearch={handleSearch}
            loading={loading}
            error={error}
          />

          {/* Grille brute des stats */}
          <StatsGrid stats={stats} matches={matches} />

          {/* Analyse personnalisée */}
          {stats && <InsightsPanel stats={stats} />}

          {!loading && matches.length === 0 && !error && <EmptyState />}
        </div>
      </section>
    </Layout>
  );
};

export default Analyse;
