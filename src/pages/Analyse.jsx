import React from 'react';
import Layout from '../components/common/Layout';

const Analyse = () => {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">🔬 Analyse Avancée</h1>
          <p className="text-xl text-green-200 font-medium">
            Outils d'analyse détaillée pour améliorer vos performances
          </p>
        </div>
      </section>

      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">🚧 En cours de développement</h2>
          <p className="text-gray-300 mb-8">
            Cette section contiendra bientôt des outils d'analyse avancée pour vos parties :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-400">📊 Analyse par rôle</h3>
              <p className="text-gray-300">Statistiques détaillées selon votre position sur la map</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">👁️ Vision Score</h3>
              <p className="text-gray-300">Analyse de votre contribution à la vision d'équipe</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">⚔️ Participation</h3>
              <p className="text-gray-300">Votre implication dans les combats d'équipe</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-orange-400">📈 Progression</h3>
              <p className="text-gray-300">Évolution de vos performances dans le temps</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Analyse;