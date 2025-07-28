import React from 'react';
import { Trophy, Target, TrendingUp, Clock, Zap, Shield, Sword } from 'lucide-react';
import StatsCard from '../ui/StatsCard';

const StatsGrid = ({ stats, matches }) => {
  if (!stats) return null;

  const calculateAdvancedStats = () => {
    if (!matches?.length) return {};
    
    const recentMatches = matches.slice(0, 10);
    const avgGameDuration = recentMatches.reduce((sum, m) => sum + m.gameDuration, 0) / recentMatches.length;
    const perfectGames = recentMatches.filter(m => m.deaths === 0).length;
    const multikills = recentMatches.filter(m => m.kills >= 5 && m.assists >= 2).length;
    
    return {
      avgGameDuration: Math.floor(avgGameDuration / 60),
      perfectGamesPercent: ((perfectGames / recentMatches.length) * 100).toFixed(0),
      multikills: multikills
    };
  };

  const advancedStats = calculateAdvancedStats();

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Taux de victoire"
          value={`${stats.winRate}%`}
          icon={Trophy}
          color="green"
          subtitle={`${Math.round((matches?.length || 0) * (stats.winRate / 100))} victoires`}
        />
        <StatsCard
          title="KDA Moyen"
          value={stats.kda}
          icon={Target}
          color="blue"
          subtitle="Kills / Deaths / Assists"
        />
        <StatsCard
          title="Kills Moyens"
          value={stats.avgKills}
          icon={Sword}
          color="red" 
          subtitle="Par partie"
        />
        <StatsCard
          title="CS Moyen"
          value={stats.avgCS}
          icon={Clock}
          color="orange"
          subtitle="Creep Score"
        />
      </div>

      {matches?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Durée moyenne"
            value={`${advancedStats.avgGameDuration}min`}
            icon={Clock}
            color="purple"
            subtitle="Temps de jeu"
          />
          <StatsCard
            title="Perfect Games"
            value={`${advancedStats.perfectGamesPercent}%`}
            icon={Shield}
            color="green"
            subtitle="0 morts"
          />
          <StatsCard
            title="Multikills"
            value={advancedStats.multikills}
            icon={Zap}
            color="orange"
            subtitle="5+ kills"
          />
        </div>
      )}
    </div>
  );
};

export default StatsGrid;