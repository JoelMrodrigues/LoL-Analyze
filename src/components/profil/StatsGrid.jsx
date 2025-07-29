import React from 'react';
import { Trophy, Target, TrendingUp, Clock, Zap, Shield, Sword } from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import { calculateAdvancedStats } from '../../utils/statsCalucaltor';

const StatsGrid = ({ stats, matches }) => {
  if (!stats) return null;

  const advancedStats = calculateAdvancedStats(matches);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Taux de victoire"
          value={`${stats.winRate}%`}
          icon={Trophy}
          color="green"
          subtitle={`${stats.wins}/${stats.totalGames} victoires`}
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