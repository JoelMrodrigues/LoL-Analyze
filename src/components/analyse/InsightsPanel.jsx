// src/components/analyse/InsightsPanel.jsx
import React from "react";

const InsightsPanel = ({ stats }) => {
  if (!stats || Object.keys(stats).length === 0) return null;

  // Helpers
  const format = (value, decimals = 1) =>
    value != null ? value.toFixed(decimals) : "N/A";

  const kda =
    stats.kills != null && stats.assists != null
      ? ((stats.kills + stats.assists) / (stats.deaths || 1)).toFixed(2)
      : "N/A";

  // Valeurs aléatoires temporaires (à remplacer avec vraies données)
  const killParticipation = format(Math.random() * 100, 1);
  const damageShare = format(Math.random() * 40, 1);
  const goldShare = format(Math.random() * 30, 1);
  const avgWards = format(Math.random() * 10, 1);
  const pinkWards = format(Math.random() * 5, 1);
  const avgPlates = format(Math.random() * 3, 2);

  
  return (
    <div className="bg-gray-800 p-6 mt-8 rounded-xl text-white shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📈 Résumé d'analyse</h2>

      <ul className="space-y-2">
        <li>👉 <strong>KDA moyen :</strong> {kda}</li>
        <li>🪙 <strong>Gold/min :</strong> {format(stats.goldPerMin)}</li>
        <li>📦 <strong>Dégâts/min :</strong> {format(stats.damagePerMin)}</li>
        <li>💥 <strong>Kill participation :</strong> {killParticipation}%</li>
        <li>🔥 <strong>% Dégâts d'équipe :</strong> {damageShare}%</li>
        <li>💰 <strong>% Gold équipe :</strong> {goldShare}%</li>
        <li>👁️ <strong>Score de vision :</strong> {format(stats.visionScoreAvg)}</li>
        <li>🔍 <strong>Wards placés :</strong> {avgWards}</li>
        <li>🧃 <strong>Pink wards :</strong> {pinkWards}</li>
        <li>🌾 <strong>CS/min :</strong> {format(stats.csPerMin, 2)}</li>
        <li>🪓 <strong>Plates prises :</strong> {avgPlates}</li>
        <li>🥇 <strong>Winrate :</strong> 
          {stats.winrate != null ? `${(stats.winrate * 100).toFixed(1)}%` : "N/A"}
        </li>
      </ul>

      <p className="mt-4 text-green-300 font-medium">
        {kda === "N/A"
          ? "Aucune donnée KDA disponible."
          : kda >= 4
          ? "Excellent KDA, vous jouez en sécurité et participez bien !"
          : kda >= 2
          ? "KDA correct, mais encore de la marge pour s'améliorer."
          : "KDA faible, attention à vos prises de risque !"}
      </p>

      {/* --- Analyse qualitative --- */}
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-300">✅ Points forts</h3>
          <ul className="list-disc list-inside text-gray-200">
            <li>Bonne vision de jeu (score de vision élevé)</li>
            <li>Participation active aux fights</li>
            <li>Bon farming</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-red-300">⚠️ Points faibles</h3>
          <ul className="list-disc list-inside text-gray-200">
            <li>Trop de morts en early game</li>
            <li>Manque d'impact dans les teamfights</li>
            <li>Vision de carte améliorable</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-yellow-300">🎯 Objectifs</h3>
          <ul className="list-disc list-inside text-gray-200">
            <li>Placer plus de balises de contrôle</li>
            <li>Travailler le positionnement en teamfight</li>
            <li>Optimiser le farming sur la durée</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
