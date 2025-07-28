import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Trophy, Target } from 'lucide-react';
import { getChampionImage, getItemImage, getSummonerSpellImage } from '../../services/riotAPI';

const MatchHistory = ({ matches }) => {
  const [expandedMatch, setExpandedMatch] = useState(null);

  if (!matches.length) return null;

  const toggleMatchDetails = (matchId) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const formatGameDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getKDA = (kills, deaths, assists) => {
    return deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2);
  };

  const ItemSlot = ({ itemId }) => {
    const itemImage = getItemImage(itemId);
    
    if (!itemImage) {
      return (
        <div className="w-8 h-8 bg-gray-800 rounded border border-gray-700"></div>
      );
    }

    return (
      <img 
        src={itemImage} 
        alt="Item" 
        className="w-8 h-8 rounded border border-gray-600"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  };

  const PlayerRow = ({ player, isSearchedPlayer }) => (
    <div className={`flex items-center py-2 px-3 rounded ${
      isSearchedPlayer 
        ? 'bg-blue-900 bg-opacity-30 border border-blue-500' 
        : 'hover:bg-gray-50'
    }`}>
      <div className="flex items-center space-x-2 w-24">
        <div className="relative">
          <img 
            src={getChampionImage(player.championName)} 
            alt={player.championName}
            className="w-10 h-10 rounded"
          />
          <div className="absolute -bottom-1 -right-1 text-xs bg-gray-800 text-white px-1 rounded">
            {player.level}
          </div>
        </div>
        <div className="flex flex-col space-y-0.5">
          <img 
            src={getSummonerSpellImage(player.summoners[0])} 
            alt="Spell"
            className="w-4 h-4 rounded"
          />
          <img 
            src={getSummonerSpellImage(player.summoners[1])} 
            alt="Spell"
            className="w-4 h-4 rounded"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 px-3">
        <div className={`font-medium truncate ${
          isSearchedPlayer ? 'text-blue-600 font-bold' : 'text-gray-900'
        }`}>
          {player.summonerName}
          {player.tagLine && `#${player.tagLine}`}
        </div>
        <div className="text-sm text-gray-500">{player.championName}</div>
      </div>

      <div className="text-center w-20">
        <div className="font-semibold text-gray-900">
          {player.kills}/{player.deaths}/{player.assists}
        </div>
        <div className="text-sm text-gray-500">
          {getKDA(player.kills, player.deaths, player.assists)} KDA
        </div>
      </div>

      <div className="text-center w-16">
        <div className="font-medium text-gray-900">{player.cs}</div>
        <div className="text-xs text-gray-500">CS</div>
      </div>

      <div className="text-center w-20">
        <div className="font-medium text-yellow-600">
          {(player.goldEarned / 1000).toFixed(1)}k
        </div>
        <div className="text-xs text-gray-500">Gold</div>
      </div>

      <div className="flex space-x-1 w-56">
        {player.items.slice(0, 6).map((itemId, index) => (
          <ItemSlot key={index} itemId={itemId} />
        ))}
        <div className="w-1"></div>
        <ItemSlot itemId={player.items[6]} />
      </div>
    </div>
  );

  const MatchCard = ({ match }) => {
    const isExpanded = expandedMatch === match.matchId;
    const teamBlue = match.allPlayers?.filter(p => p.teamId === 100) || [];
    const teamRed = match.allPlayers?.filter(p => p.teamId === 200) || [];

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className={`p-4 cursor-pointer transition-colors duration-200 border-l-4 ${
            match.win 
              ? 'border-green-500 bg-green-50 hover:bg-green-100' 
              : 'border-red-500 bg-red-50 hover:bg-red-100'
          }`}
          onClick={() => toggleMatchDetails(match.matchId)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={getChampionImage(match.champ)} 
                  alt={match.champ}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <img 
                  src={getSummonerSpellImage(match.summoners[0])} 
                  alt="Spell"
                  className="w-6 h-6 rounded"
                />
                <img 
                  src={getSummonerSpellImage(match.summoners[1])} 
                  alt="Spell"
                  className="w-6 h-6 rounded"
                />
              </div>

              <div>
                <div className="font-semibold text-lg text-gray-900">
                  {match.champ}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatGameDuration(match.gameDuration)}</span>
                  <span>•</span>
                  <span>{match.date}</span>
                </div>
              </div>

              <div className="text-center bg-white rounded-lg px-4 py-2 shadow-sm">
                <div className="font-bold text-lg text-gray-900">
                  {match.kills}/{match.deaths}/{match.assists}
                </div>
                <div className="text-sm text-gray-500">
                  {getKDA(match.kills, match.deaths, match.assists)} KDA
                </div>
              </div>

              <div className="text-center bg-white rounded-lg px-4 py-2 shadow-sm">
                <div className="font-bold text-lg text-gray-900">{match.cs}</div>
                <div className="text-sm text-gray-500">CS</div>
              </div>

              <div className="flex space-x-1">
                {match.items.slice(0, 6).map((itemId, index) => (
                  <ItemSlot key={index} itemId={itemId} />
                ))}
                <div className="w-1"></div>
                <ItemSlot itemId={match.items[6]} />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                match.win 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {match.win ? 'VICTOIRE' : 'DÉFAITE'}
              </div>

              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {isExpanded && match.allPlayers && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <h4 className="font-semibold text-blue-700">Équipe Bleue</h4>
                  {teamBlue[0]?.win && (
                    <Trophy className="w-4 h-4 text-yellow-500 ml-2" />
                  )}
                </div>
                <div className="bg-white rounded-lg border border-gray-200">
                  {teamBlue.map((player, index) => (
                    <PlayerRow 
                      key={index} 
                      player={player} 
                      isSearchedPlayer={player.isSearchedPlayer}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <h4 className="font-semibold text-red-700">Équipe Rouge</h4>
                  {teamRed[0]?.win && (
                    <Trophy className="w-4 h-4 text-yellow-500 ml-2" />
                  )}
                </div>
                <div className="bg-white rounded-lg border border-gray-200">
                  {teamRed.map((player, index) => (
                    <PlayerRow 
                      key={index} 
                      player={player} 
                      isSearchedPlayer={player.isSearchedPlayer}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Target className="mr-3 text-blue-600" />
          Historique des matchs
        </h3>
        <div className="text-sm text-gray-400">
          {matches.length} matchs récents
        </div>
      </div>
      
      <div className="space-y-3">
        {matches.map((match, index) => (
          <MatchCard key={match.matchId || index} match={match} />
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;