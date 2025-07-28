import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Profil from './pages/Profil';
import Team from './pages/Team';

// Composant temporaire pour les pages pas encore créées
const ComingSoon = ({ title, color = "blue" }) => (
  <div className="min-h-screen bg-gray-900 pt-20">
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl mb-6 shadow-2xl`}>
        <span className="text-3xl">🚧</span>
      </div>
      <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl text-gray-300 font-medium mb-8">
        Cette section est en cours de développement
      </p>
      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold text-white mb-4">Bientôt disponible !</h3>
        <p className="text-gray-400">
          Nous travaillons activement sur cette fonctionnalité. 
          Revenez bientôt pour découvrir de nouvelles analyses et outils.
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/analyse" element={<ComingSoon title="Analyse Avancée" color="green" />} />
        <Route path="/data-champ" element={<ComingSoon title="Data Champions" color="purple" />} />
        <Route path="/data-side" element={<ComingSoon title="Data Sides" color="purple" />} />
        <Route path="/amelioration" element={<ComingSoon title="Conseils d'Amélioration" color="orange" />} />
        <Route path="/top-tier" element={<ComingSoon title="Top Tier List" color="yellow" />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </Router>
  );
}

export default App;