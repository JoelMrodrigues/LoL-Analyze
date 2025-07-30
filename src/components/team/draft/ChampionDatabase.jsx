import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';

// Base de données complète des champions League of Legends
const CHAMPIONS_DATABASE = [
  { name: 'Aatrox', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Ahri', roles: ['MID'], tags: ['Mage', 'Assassin'] },
  { name: 'Akali', roles: ['MID'], tags: ['Assassin'] },
  { name: 'Akshan', roles: ['MID', 'ADC'], tags: ['Marksman', 'Assassin'] },
  { name: 'Alistar', roles: ['SUPPORT'], tags: ['Tank', 'Support'] },
  { name: 'Amumu', roles: ['JUNGLE'], tags: ['Tank', 'Mage'] },
  { name: 'Anivia', roles: ['MID'], tags: ['Mage'] },
  { name: 'Annie', roles: ['MID'], tags: ['Mage'] },
  { name: 'Aphelios', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Ashe', roles: ['ADC'], tags: ['Marksman', 'Support'] },
  { name: 'Aurelion Sol', roles: ['MID'], tags: ['Mage'] },
  { name: 'Azir', roles: ['MID'], tags: ['Mage', 'Marksman'] },
  { name: 'Bard', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Bel\'Veth', roles: ['JUNGLE'], tags: ['Fighter'] },
  { name: 'Blitzcrank', roles: ['SUPPORT'], tags: ['Tank', 'Fighter'] },
  { name: 'Brand', roles: ['SUPPORT', 'MID'], tags: ['Mage'] },
  { name: 'Braum', roles: ['SUPPORT'], tags: ['Support', 'Tank'] },
  { name: 'Briar', roles: ['JUNGLE'], tags: ['Fighter', 'Assassin'] },
  { name: 'Caitlyn', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Camille', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Cassiopeia', roles: ['MID'], tags: ['Mage'] },
  { name: 'Cho\'Gath', roles: ['TOP', 'JUNGLE'], tags: ['Tank', 'Mage'] },
  { name: 'Corki', roles: ['MID', 'ADC'], tags: ['Marksman'] },
  { name: 'Darius', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Diana', roles: ['JUNGLE', 'MID'], tags: ['Fighter', 'Mage'] },
  { name: 'Dr. Mundo', roles: ['TOP', 'JUNGLE'], tags: ['Fighter', 'Tank'] },
  { name: 'Draven', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Ekko', roles: ['JUNGLE', 'MID'], tags: ['Assassin', 'Fighter'] },
  { name: 'Elise', roles: ['JUNGLE'], tags: ['Mage', 'Fighter'] },
  { name: 'Evelynn', roles: ['JUNGLE'], tags: ['Assassin', 'Mage'] },
  { name: 'Ezreal', roles: ['ADC'], tags: ['Marksman', 'Mage'] },
  { name: 'Fiddlesticks', roles: ['JUNGLE'], tags: ['Mage', 'Support'] },
  { name: 'Fiora', roles: ['TOP'], tags: ['Fighter', 'Assassin'] },
  { name: 'Fizz', roles: ['MID'], tags: ['Assassin', 'Fighter'] },
  { name: 'Galio', roles: ['MID', 'SUPPORT'], tags: ['Tank', 'Mage'] },
  { name: 'Gangplank', roles: ['TOP', 'MID'], tags: ['Fighter'] },
  { name: 'Garen', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Gnar', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Gragas', roles: ['JUNGLE', 'TOP'], tags: ['Fighter', 'Mage'] },
  { name: 'Graves', roles: ['JUNGLE'], tags: ['Marksman'] },
  { name: 'Gwen', roles: ['TOP', 'JUNGLE'], tags: ['Fighter', 'Assassin'] },
  { name: 'Hecarim', roles: ['JUNGLE'], tags: ['Fighter', 'Tank'] },
  { name: 'Heimerdinger', roles: ['MID', 'TOP'], tags: ['Mage', 'Support'] },
  { name: 'Hwei', roles: ['MID', 'SUPPORT'], tags: ['Mage'] },
  { name: 'Illaoi', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Irelia', roles: ['TOP', 'MID'], tags: ['Fighter', 'Assassin'] },
  { name: 'Ivern', roles: ['JUNGLE'], tags: ['Support', 'Mage'] },
  { name: 'Janna', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Jarvan IV', roles: ['JUNGLE'], tags: ['Tank', 'Fighter'] },
  { name: 'Jax', roles: ['TOP', 'JUNGLE'], tags: ['Fighter', 'Assassin'] },
  { name: 'Jayce', roles: ['TOP', 'MID'], tags: ['Fighter', 'Marksman'] },
  { name: 'Jhin', roles: ['ADC'], tags: ['Marksman', 'Mage'] },
  { name: 'Jinx', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'K\'Sante', roles: ['TOP'], tags: ['Tank', 'Fighter'] },
  { name: 'Kai\'Sa', roles: ['ADC'], tags: ['Marksman', 'Assassin'] },
  { name: 'Kalista', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Karma', roles: ['SUPPORT', 'MID'], tags: ['Mage', 'Support'] },
  { name: 'Karthus', roles: ['JUNGLE', 'MID'], tags: ['Mage'] },
  { name: 'Kassadin', roles: ['MID'], tags: ['Assassin', 'Mage'] },
  { name: 'Katarina', roles: ['MID'], tags: ['Assassin', 'Mage'] },
  { name: 'Kayle', roles: ['TOP'], tags: ['Fighter', 'Support'] },
  { name: 'Kayn', roles: ['JUNGLE'], tags: ['Fighter', 'Assassin'] },
  { name: 'Kennen', roles: ['TOP'], tags: ['Mage', 'Marksman'] },
  { name: 'Kha\'Zix', roles: ['JUNGLE'], tags: ['Assassin'] },
  { name: 'Kindred', roles: ['JUNGLE'], tags: ['Marksman'] },
  { name: 'Kled', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Kog\'Maw', roles: ['ADC'], tags: ['Marksman', 'Mage'] },
  { name: 'LeBlanc', roles: ['MID'], tags: ['Assassin', 'Mage'] },
  { name: 'Lee Sin', roles: ['JUNGLE'], tags: ['Fighter', 'Assassin'] },
  { name: 'Leona', roles: ['SUPPORT'], tags: ['Tank', 'Support'] },
  { name: 'Lillia', roles: ['JUNGLE'], tags: ['Fighter', 'Mage'] },
  { name: 'Lissandra', roles: ['MID'], tags: ['Mage'] },
  { name: 'Lucian', roles: ['ADC', 'MID'], tags: ['Marksman'] },
  { name: 'Lulu', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Lux', roles: ['SUPPORT', 'MID'], tags: ['Mage', 'Support'] },
  { name: 'Malphite', roles: ['TOP'], tags: ['Tank', 'Mage'] },
  { name: 'Malzahar', roles: ['MID'], tags: ['Mage', 'Assassin'] },
  { name: 'Maokai', roles: ['TOP', 'SUPPORT'], tags: ['Tank', 'Mage'] },
  { name: 'Master Yi', roles: ['JUNGLE'], tags: ['Assassin', 'Fighter'] },
  { name: 'Milio', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Miss Fortune', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Mordekaiser', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Morgana', roles: ['SUPPORT', 'MID'], tags: ['Mage', 'Support'] },
  { name: 'Nami', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Nasus', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Nautilus', roles: ['SUPPORT', 'JUNGLE'], tags: ['Tank', 'Fighter'] },
  { name: 'Neeko', roles: ['MID', 'SUPPORT'], tags: ['Mage', 'Support'] },
  { name: 'Nidalee', roles: ['JUNGLE'], tags: ['Assassin', 'Mage'] },
  { name: 'Nilah', roles: ['ADC'], tags: ['Fighter', 'Assassin'] },
  { name: 'Nocturne', roles: ['JUNGLE'], tags: ['Assassin', 'Fighter'] },
  { name: 'Nunu & Willump', roles: ['JUNGLE'], tags: ['Tank', 'Fighter'] },
  { name: 'Olaf', roles: ['JUNGLE', 'TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Orianna', roles: ['MID'], tags: ['Mage', 'Support'] },
  { name: 'Ornn', roles: ['TOP'], tags: ['Tank', 'Fighter'] },
  { name: 'Pantheon', roles: ['TOP', 'JUNGLE', 'SUPPORT'], tags: ['Fighter', 'Assassin'] },
  { name: 'Poppy', roles: ['TOP', 'JUNGLE'], tags: ['Tank', 'Fighter'] },
  { name: 'Pyke', roles: ['SUPPORT'], tags: ['Support', 'Assassin'] },
  { name: 'Qiyana', roles: ['MID'], tags: ['Assassin', 'Fighter'] },
  { name: 'Quinn', roles: ['TOP'], tags: ['Marksman', 'Assassin'] },
  { name: 'Rakan', roles: ['SUPPORT'], tags: ['Support'] },
  { name: 'Rammus', roles: ['JUNGLE'], tags: ['Tank', 'Fighter'] },
  { name: 'Rek\'Sai', roles: ['JUNGLE'], tags: ['Fighter'] },
  { name: 'Rell', roles: ['SUPPORT'], tags: ['Tank', 'Support'] },
  { name: 'Renata Glasc', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Renekton', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Rengar', roles: ['JUNGLE'], tags: ['Assassin', 'Fighter'] },
  { name: 'Riven', roles: ['TOP'], tags: ['Fighter', 'Assassin'] },
  { name: 'Rumble', roles: ['TOP', 'JUNGLE'], tags: ['Fighter', 'Mage'] },
  { name: 'Ryze', roles: ['MID'], tags: ['Mage', 'Fighter'] },
  { name: 'Samira', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Sejuani', roles: ['JUNGLE'], tags: ['Tank', 'Fighter'] },
  { name: 'Senna', roles: ['SUPPORT', 'ADC'], tags: ['Marksman', 'Support'] },
  { name: 'Seraphine', roles: ['SUPPORT', 'MID'], tags: ['Mage', 'Support'] },
  { name: 'Sett', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Shaco', roles: ['JUNGLE'], tags: ['Assassin'] },
  { name: 'Shen', roles: ['TOP'], tags: ['Tank'] },
  { name: 'Shyvana', roles: ['JUNGLE'], tags: ['Fighter', 'Tank'] },
  { name: 'Singed', roles: ['TOP'], tags: ['Tank', 'Fighter'] },
  { name: 'Sion', roles: ['TOP'], tags: ['Tank', 'Fighter'] },
  { name: 'Sivir', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Skarner', roles: ['JUNGLE'], tags: ['Fighter', 'Tank'] },
  { name: 'Smolder', roles: ['ADC'], tags: ['Marksman', 'Mage'] },
  { name: 'Sona', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Soraka', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Swain', roles: ['MID', 'SUPPORT'], tags: ['Mage', 'Fighter'] },
  { name: 'Sylas', roles: ['MID', 'JUNGLE'], tags: ['Mage', 'Assassin'] },
  { name: 'Syndra', roles: ['MID'], tags: ['Mage'] },
  { name: 'Tahm Kench', roles: ['TOP', 'SUPPORT'], tags: ['Support', 'Tank'] },
  { name: 'Taliyah', roles: ['JUNGLE', 'MID'], tags: ['Mage'] },
  { name: 'Talon', roles: ['MID'], tags: ['Assassin'] },
  { name: 'Taric', roles: ['SUPPORT'], tags: ['Support', 'Fighter'] },
  { name: 'Teemo', roles: ['TOP'], tags: ['Marksman', 'Assassin'] },
  { name: 'Thresh', roles: ['SUPPORT'], tags: ['Support', 'Fighter'] },
  { name: 'Tristana', roles: ['ADC'], tags: ['Marksman', 'Assassin'] },
  { name: 'Trundle', roles: ['JUNGLE', 'TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Tryndamere', roles: ['TOP'], tags: ['Fighter', 'Assassin'] },
  { name: 'Twisted Fate', roles: ['MID'], tags: ['Mage'] },
  { name: 'Twitch', roles: ['ADC'], tags: ['Marksman', 'Assassin'] },
  { name: 'Udyr', roles: ['JUNGLE'], tags: ['Fighter', 'Tank'] },
  { name: 'Urgot', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Varus', roles: ['ADC'], tags: ['Marksman', 'Mage'] },
  { name: 'Vayne', roles: ['ADC'], tags: ['Marksman', 'Assassin'] },
  { name: 'Veigar', roles: ['MID'], tags: ['Mage'] },
  { name: 'Vel\'Koz', roles: ['MID', 'SUPPORT'], tags: ['Mage'] },
  { name: 'Vex', roles: ['MID'], tags: ['Mage'] },
  { name: 'Vi', roles: ['JUNGLE'], tags: ['Fighter', 'Assassin'] },
  { name: 'Viego', roles: ['JUNGLE'], tags: ['Assassin', 'Fighter'] },
  { name: 'Viktor', roles: ['MID'], tags: ['Mage'] },
  { name: 'Vladimir', roles: ['MID'], tags: ['Mage'] },
  { name: 'Volibear', roles: ['JUNGLE', 'TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Warwick', roles: ['JUNGLE'], tags: ['Fighter', 'Tank'] },
  { name: 'Wukong', roles: ['JUNGLE', 'TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Xayah', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Xerath', roles: ['MID', 'SUPPORT'], tags: ['Mage'] },
  { name: 'Xin Zhao', roles: ['JUNGLE'], tags: ['Fighter', 'Assassin'] },
  { name: 'Yasuo', roles: ['MID', 'TOP'], tags: ['Fighter', 'Assassin'] },
  { name: 'Yone', roles: ['MID', 'TOP'], tags: ['Assassin', 'Fighter'] },
  { name: 'Yorick', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Yuumi', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Zac', roles: ['JUNGLE'], tags: ['Tank', 'Fighter'] },
  { name: 'Zed', roles: ['MID'], tags: ['Assassin'] },
  { name: 'Zeri', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Ziggs', roles: ['MID'], tags: ['Mage'] },
  { name: 'Zilean', roles: ['SUPPORT', 'MID'], tags: ['Support', 'Mage'] },
  { name: 'Zoe', roles: ['MID'], tags: ['Mage', 'Support'] },
  { name: 'Zyra', roles: ['SUPPORT'], tags: ['Mage', 'Support'] }
];

// Composant principal pour la sélection de champions
const ChampionSelector = ({ 
  onSelectChampion, 
  bannedChampions = [], 
  pickedChampions = [], 
  currentPhase = { type: 'pick', side: 'blue' },
  disabled = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const roles = [
    { id: 'ALL', name: 'Tous', icon: '🎯' },
    { id: 'TOP', name: 'Top', icon: '⚔️' },
    { id: 'JUNGLE', name: 'Jungle', icon: '🌿' },
    { id: 'MID', name: 'Mid', icon: '✨' },
    { id: 'ADC', name: 'ADC', icon: '🏹' },
    { id: 'SUPPORT', name: 'Support', icon: '🛡️' }
  ];

  // Filtrage des champions
  const filteredChampions = useMemo(() => {
    return CHAMPIONS_DATABASE
      .filter(champion => {
        // Filtre par rôle
        if (selectedRole !== 'ALL' && !champion.roles.includes(selectedRole)) {
          return false;
        }
        
        // Filtre par recherche
        if (searchQuery && !champion.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, selectedRole]);

  const handleChampionClick = (championName) => {
    if (disabled) return;
    
    const isBanned = bannedChampions.includes(championName);
    const isPicked = pickedChampions.includes(championName);
    
    if (!isBanned && !isPicked) {
      onSelectChampion(championName);
    }
  };

  if (disabled) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">🏁</div>
          <h3 className="text-2xl font-bold mb-2">Draft Terminée !</h3>
          <p>Toutes les sélections ont été effectuées.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header avec instructions */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              {currentPhase.type === 'ban' ? '🚫 Bannir' : '✅ Choisir'} un champion
            </h3>
            <p className="text-gray-400">
              Pour l'équipe{' '}
              <span className={currentPhase.side === 'blue' ? 'text-blue-400' : 'text-red-400'}>
                {currentPhase.side === 'blue' ? 'BLEUE' : 'ROUGE'}
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un champion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Filtres par rôle */}
        <div className="flex gap-2 overflow-x-auto">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                selectedRole === role.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{role.icon}</span>
              <span>{role.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Liste des champions */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 text-sm text-gray-400">
          {filteredChampions.length} champion(s) trouvé(s)
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
            {filteredChampions.map(champion => {
              const isBanned = bannedChampions.includes(champion.name);
              const isPicked = pickedChampions.includes(champion.name);
              const isUnavailable = isBanned || isPicked;

              return (
                <ChampionCard
                  key={champion.name}
                  champion={champion}
                  isBanned={isBanned}
                  isPicked={isPicked}
                  isUnavailable={isUnavailable}
                  onClick={() => handleChampionClick(champion.name)}
                  viewMode="grid"
                />
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChampions.map(champion => {
              const isBanned = bannedChampions.includes(champion.name);
              const isPicked = pickedChampions.includes(champion.name);
              const isUnavailable = isBanned || isPicked;

              return (
                <ChampionCard
                  key={champion.name}
                  champion={champion}
                  isBanned={isBanned}
                  isPicked={isPicked}
                  isUnavailable={isUnavailable}
                  onClick={() => handleChampionClick(champion.name)}
                  viewMode="list"
                />
              );
            })}
          </div>
        )}

        {filteredChampions.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl mb-2">Aucun champion trouvé</p>
            <p>Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour afficher un champion
const ChampionCard = ({ champion, isBanned, isPicked, isUnavailable, onClick, viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <button
        onClick={onClick}
        disabled={isUnavailable}
        className={`relative group ${
          isUnavailable 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:scale-105 cursor-pointer'
        } transition-all`}
        title={`${champion.name} - ${champion.roles.join(', ')}`}
      >
        <div className="w-16 h-16 rounded border-2 border-gray-600 overflow-hidden bg-gray-800">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.name.replace(/[^a-zA-Z0-9]/g, '')}.png`}
            alt={champion.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/64x64/374151/9CA3AF?text=' + champion.name.charAt(0);
            }}
          />
        </div>
        
        <div className="text-xs text-center text-gray-300 mt-1 truncate">
          {champion.name}
        </div>
        
        {/* Overlay pour banned/picked */}
        {isBanned && (
          <div className="absolute inset-0 bg-red-600 bg-opacity-80 flex items-center justify-center rounded">
            <span className="text-white font-bold text-xl">❌</span>
          </div>
        )}
        
        {isPicked && (
          <div className="absolute inset-0 bg-blue-600 bg-opacity-80 flex items-center justify-center rounded">
            <span className="text-white font-bold text-xl">✓</span>
          </div>
        )}

        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
          {champion.roles.join(' • ')}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isUnavailable}
      className={`w-full flex items-center p-3 rounded-lg border transition-all ${
        isUnavailable
          ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-700'
          : 'hover:bg-gray-700 bg-gray-800 border-gray-600 hover:border-gray-500'
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded border border-gray-600 overflow-hidden bg-gray-700">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.name.replace(/[^a-zA-Z0-9]/g, '')}.png`}
            alt={champion.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/48x48/374151/9CA3AF?text=' + champion.name.charAt(0);
            }}
          />
        </div>
        
        {isBanned && (
          <div className="absolute inset-0 bg-red-600 bg-opacity-80 flex items-center justify-center rounded">
            <span className="text-white font-bold">❌</span>
          </div>
        )}
        
        {isPicked && (
          <div className="absolute inset-0 bg-blue-600 bg-opacity-80 flex items-center justify-center rounded">
            <span className="text-white font-bold">✓</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex-1 text-left">
        <div className="font-medium text-white">{champion.name}</div>
        <div className="text-sm text-gray-400">
          {champion.roles.join(' • ')} | {champion.tags.join(' • ')}
        </div>
      </div>

      {(isBanned || isPicked) && (
        <div className="text-sm font-medium">
          {isBanned ? (
            <span className="text-red-400">BANNED</span>
          ) : (
            <span className="text-blue-400">PICKED</span>
          )}
        </div>
      )}
    </button>
  );
};

export default ChampionSelector;