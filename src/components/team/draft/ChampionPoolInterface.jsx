import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Search,
  X,
  User,
  Star,
  TrendingUp,
  Clock,
  BookOpen,
  Minus
} from 'lucide-react';

// Base de données complète des champions
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
  { name: 'Aurora', roles: ['MID', 'TOP'], tags: ['Mage', 'Assassin'] },
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
  { name: 'Naafiri', roles: ['MID'], tags: ['Assassin'] },
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

// Composant pour les cartes de champions
const ChampionCard = ({ champion, onClick, isInPool, category, onRemove, showRemove }) => {
  return (
    <div
      className="relative group"
      onMouseEnter={() => showRemove && showRemove(true)}
      onMouseLeave={() => showRemove && showRemove(false)}
    >
      <div
        onClick={onClick}
        className={`
          w-16 h-16 rounded border-2 overflow-hidden cursor-pointer transition-all hover:scale-105
          ${isInPool ? 'border-green-500 bg-green-900' : 'border-gray-600 bg-gray-800 hover:border-gray-500'}
        `}
        title={`${champion.name} - ${champion.roles.join(', ')}`}
      >
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

      {/* Bouton de suppression */}
      {isInPool && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Minus className="w-3 h-3 text-white" />
        </button>
      )}

      {/* Indicateur de catégorie */}
      {isInPool && category && (
        <div className={`
          absolute top-1 left-1 w-3 h-3 rounded-full
          ${category === 'best' ? 'bg-yellow-500' : 
            category === 'good' ? 'bg-green-500' : 
            category === 'needsGames' ? 'bg-orange-500' : 
            'bg-blue-500'}
        `}></div>
      )}
    </div>
  );
};

// Composant pour une catégorie de champions
const ChampionCategory = ({ title, icon, champions, onAddChampion, onRemoveChampion, color, description }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border-2 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="text-sm text-gray-400">({champions.length})</span>
      </div>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      
      <div className="grid grid-cols-6 gap-2 min-h-[80px]">
        {champions.map(championName => {
          const champion = CHAMPIONS_DATABASE.find(c => c.name === championName);
          return champion ? (
            <ChampionCard
              key={championName}
              champion={champion}
              isInPool={true}
              onRemove={() => onRemoveChampion(championName)}
            />
          ) : null;
        })}
        
        {/* Placeholder pour ajouter des champions */}
        {champions.length === 0 && (
          <div className="col-span-6 flex items-center justify-center h-20 border-2 border-dashed border-gray-600 rounded text-gray-500">
            Cliquez sur un champion ci-dessous pour l'ajouter
          </div>
        )}
      </div>
    </div>
  );
};

const ChampionPoolInterface = ({ 
  teamData,
  onSave = () => {}, 
  onBack = () => {} 
}) => {
  // Données par défaut si teamData n'est pas fourni
  const defaultTeamData = {
    players: [
      { id: 1, name: 'Joueur 1', role: 'TOP' },
      { id: 2, name: 'Joueur 2', role: 'JUNGLE' },
      { id: 3, name: 'Joueur 3', role: 'MID' },
      { id: 4, name: 'Joueur 4', role: 'ADC' },
      { id: 5, name: 'Joueur 5', role: 'SUPPORT' }
    ]
  };

  const currentTeamData = teamData || defaultTeamData;

  // Debug - vérifier les données
  console.log('teamData reçu:', teamData);
  console.log('currentTeamData utilisé:', currentTeamData);
  console.log('Joueurs disponibles:', currentTeamData.players);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerPools, setPlayerPools] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const roles = [
    { id: 'ALL', name: 'Tous', icon: '🎯' },
    { id: 'TOP', name: 'Top', icon: '⚔️' },
    { id: 'JUNGLE', name: 'Jungle', icon: '🌿' },
    { id: 'MID', name: 'Mid', icon: '✨' },
    { id: 'ADC', name: 'ADC', icon: '🏹' },
    { id: 'SUPPORT', name: 'Support', icon: '🛡️' }
  ];

  const categories = [
    {
      id: 'best',
      title: 'Best Champs',
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      color: 'border-yellow-500',
      description: 'Champions maîtrisés à la perfection'
    },
    {
      id: 'good',
      title: 'Good Champs',
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      color: 'border-green-500',
      description: 'Champions joués correctement'
    },
    {
      id: 'needsGames',
      title: 'Besoin de 10 games',
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      color: 'border-orange-500',
      description: 'Champions qui nécessitent plus de pratique'
    },
    {
      id: 'toLearn',
      title: 'À Apprendre',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      color: 'border-blue-500',
      description: 'Champions à découvrir et apprendre'
    }
  ];

  // Initialiser les pools des joueurs
  useEffect(() => {
    const initialPools = {};
    currentTeamData.players.forEach(player => {
      if (!playerPools[player.id]) {
        initialPools[player.id] = {
          best: [],
          good: [],
          needsGames: [],
          toLearn: []
        };
      }
    });
    if (Object.keys(initialPools).length > 0) {
      setPlayerPools(prev => ({ ...prev, ...initialPools }));
    }
  }, [currentTeamData.players, playerPools]);

  // Filtrage des champions
  const filteredChampions = CHAMPIONS_DATABASE.filter(champion => {
    if (selectedRole !== 'ALL' && !champion.roles.includes(selectedRole)) {
      return false;
    }
    if (searchQuery && !champion.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Obtenir tous les champions dans la pool du joueur
  const getAllPlayerChampions = (playerId) => {
    const pool = playerPools[playerId];
    if (!pool) return [];
    return [...pool.best, ...pool.good, ...pool.needsGames, ...pool.toLearn];
  };

  // Ajouter un champion à une catégorie
  const addChampionToCategory = (playerId, championName, category) => {
    setPlayerPools(prev => {
      const newPools = { ...prev };
      
      // Retirer le champion de toutes les autres catégories
      Object.keys(newPools[playerId]).forEach(cat => {
        newPools[playerId][cat] = newPools[playerId][cat].filter(name => name !== championName);
      });
      
      // Ajouter à la nouvelle catégorie
      if (!newPools[playerId][category].includes(championName)) {
        newPools[playerId][category] = [...newPools[playerId][category], championName];
      }
      
      return newPools;
    });
  };

  // Retirer un champion d'une catégorie
  const removeChampionFromCategory = (playerId, championName, category) => {
    setPlayerPools(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [category]: prev[playerId][category].filter(name => name !== championName)
      }
    }));
  };

  // Gérer le clic sur un champion
  const handleChampionClick = (championName) => {
    if (!selectedPlayer || !selectedCategory) return;
    
    const playerChampions = getAllPlayerChampions(selectedPlayer.id);
    
    if (playerChampions.includes(championName)) {
      // Si le champion est déjà dans la pool, le retirer
      Object.keys(playerPools[selectedPlayer.id]).forEach(category => {
        if (playerPools[selectedPlayer.id][category].includes(championName)) {
          removeChampionFromCategory(selectedPlayer.id, championName, category);
        }
      });
    } else {
      // Sinon, l'ajouter à la catégorie sélectionnée
      addChampionToCategory(selectedPlayer.id, championName, selectedCategory);
    }
  };

  // Sauvegarder
  const handleSave = () => {
    const updatedData = {
      ...currentTeamData,
      playerPools: playerPools,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedData);
  };

  // Reset
  const handleReset = () => {
    if (selectedPlayer && window.confirm(`Êtes-vous sûr de vouloir vider la pool de ${selectedPlayer.name} ?`)) {
      setPlayerPools(prev => ({
        ...prev,
        [selectedPlayer.id]: {
          best: [],
          good: [],
          needsGames: [],
          toLearn: []
        }
      }));
    }
  };

  // Si aucun joueur n'est sélectionné, afficher la liste des joueurs
  if (!selectedPlayer) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
              <h1 className="text-2xl font-bold text-white">Pool de Champions</h1>
            </div>
          </div>
        </div>

        {/* Sélection du joueur */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl w-full px-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Sélectionnez un joueur</h2>
              <p className="text-gray-400">Choisissez le joueur dont vous voulez gérer la pool de champions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTeamData.players.map(player => {
                const playerChampionsCount = getAllPlayerChampions(player.id).length;
                
                return (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 cursor-pointer transition-all hover:scale-105 border-2 border-gray-700 hover:border-blue-500"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
                      <div className="text-sm text-blue-400 mb-2">{player.role}</div>
                      <div className="text-sm text-gray-400">
                        {playerChampionsCount} champion{playerChampionsCount !== 1 ? 's' : ''} dans la pool
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interface de gestion de la pool du joueur sélectionné
  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedPlayer.name}</h1>
                <p className="text-sm text-blue-400">{selectedPlayer.role} - Pool de Champions</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              title="Vider la pool"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Catégories de champions */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="grid grid-cols-4 gap-4">
          {categories.map(category => (
            <ChampionCategory
              key={category.id}
              title={category.title}
              icon={category.icon}
              champions={playerPools[selectedPlayer.id]?.[category.id] || []}
              color={category.color}
              description={category.description}
              onRemoveChampion={(championName) => 
                removeChampionFromCategory(selectedPlayer.id, championName, category.id)
              }
            />
          ))}
        </div>

        {/* Sélecteur de catégorie */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400 mb-2">Sélectionnez une catégorie pour ajouter des champions :</p>
          <div className="flex justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                  ${selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {category.icon}
                <span>{category.title}</span>
              </button>
            ))}
          </div>
          {selectedCategory && (
            <p className="text-xs text-blue-400 mt-2">
              Cliquez sur un champion ci-dessous pour l'ajouter à "{categories.find(c => c.id === selectedCategory)?.title}"
            </p>
          )}
        </div>
      </div>

      {/* Filtres et champions */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Filtres */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un champion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtres par rôle */}
            <div className="flex gap-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${selectedRole === role.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                  `}
                >
                  {role.icon} {role.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grille des champions */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-12 gap-3">
            {filteredChampions.map(champion => {
              const playerChampions = getAllPlayerChampions(selectedPlayer.id);
              const isInPool = playerChampions.includes(champion.name);
              
              return (
                <ChampionCard
                  key={champion.name}
                  champion={champion}
                  onClick={() => handleChampionClick(champion.name)}
                  isInPool={isInPool}
                />
              );
            })}
          </div>

          {filteredChampions.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl mb-2">Aucun champion trouvé</p>
              <p>Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="text-center">
            {!selectedCategory ? (
              <p className="text-gray-400">
                💡 Sélectionnez d'abord une catégorie ci-dessus, puis cliquez sur les champions pour les ajouter
              </p>
            ) : (
              <p className="text-blue-300">
                ✨ Catégorie "{categories.find(c => c.id === selectedCategory)?.title}" sélectionnée - Cliquez sur un champion pour l'ajouter
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionPoolInterface;