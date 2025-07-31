import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Search,
  X,
  Edit3,
  Check
} from 'lucide-react';

// Base de données complète des champions
const CHAMPIONS_DATABASE = [
  { name: 'Aatrox', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Ahri', roles: ['MID'], tags: ['Mage', 'Assassin'] },
  { name: 'Akali', roles: ['MID'], tags: ['Assassin'] },
  { name: 'Akshan', roles: ['MID', 'ADC'], tags: ['Marksman', 'Assassin'] },
  { name: 'Alistar', roles: ['SUPPORT'], tags: ['Tank', 'Support'] },
  { name: 'Ammu', roles: ['JUNGLE'], tags: ['Tank', 'Mage'] },
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

// Composant ChampionSlot
const ChampionSlot = ({ 
  champion, 
  isEmpty, 
  isBan, 
  isSelected, 
  onClick, 
  onRightClick, 
  size = "large" 
}) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-20 h-20",
    large: "w-24 h-24"
  };

  const handleContextMenu = (e) => {
    if (onRightClick) {
      e.preventDefault();
      onRightClick(e);
    }
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${isEmpty ? 'bg-gray-700 border-2 border-dashed border-gray-500' : 'bg-gray-800 border-2 border-gray-600'}
        ${isSelected ? 'ring-2 ring-yellow-400' : ''}
        rounded-lg cursor-pointer hover:bg-opacity-80 transition-all
        flex items-center justify-center text-xs font-bold text-white
        relative overflow-hidden
      `}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      title={champion || 'Slot vide'}
    >
      {champion ? (
        <>
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.replace(/[^a-zA-Z0-9]/g, '')}.png`}
            alt={champion}
            className={`w-full h-full object-cover rounded ${
              isBan ? 'grayscale opacity-60' : ''
            }`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/64x64/374151/9CA3AF?text=' + champion.charAt(0);
            }}
          />
          {isBan && (
            <div className="absolute inset-0 flex items-center justify-center">
              <X className="w-6 h-6 text-red-500 drop-shadow-lg" strokeWidth={3} />
            </div>
          )}
        </>
      ) : (
        <span className="text-gray-400">+</span>
      )}
    </div>
  );
};

const PerfectDraftInterface = ({ 
  draftData = {
    name: "Nouvelle Draft",
    data: {
      blueSide: {
        bans: [null, null, null, null, null],
        picks: [null, null, null, null, null],
        roles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT']
      },
      redSide: {
        bans: [null, null, null, null, null],
        picks: [null, null, null, null, null],
        roles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT']
      }
    }
  }, 
  onSave = () => {}, 
  onBack = () => {} 
}) => {
  const [currentDraft, setCurrentDraft] = useState(draftData);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  
  // États pour les noms d'équipes éditables
  const [blueTeamName, setBlueTeamName] = useState('Blue side');
  const [redTeamName, setRedTeamName] = useState('Red side');
  const [editingBlueName, setEditingBlueName] = useState(false);
  const [editingRedName, setEditingRedName] = useState(false);

  const roles = [
    { id: 'ALL', name: 'Tous', icon: '🎯' },
    { id: 'TOP', name: 'Top', icon: '⚔️' },
    { id: 'JUNGLE', name: 'Jungle', icon: '🌿' },
    { id: 'MID', name: 'Mid', icon: '✨' },
    { id: 'ADC', name: 'ADC', icon: '🏹' },
    { id: 'SUPPORT', name: 'Support', icon: '🛡️' }
  ];

  useEffect(() => {
    setCurrentDraft(draftData);
  }, [draftData]);

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

  // Obtenir tous les champions utilisés
  const getAllUsedChampions = () => {
    const used = [];
    if (currentDraft?.data?.blueSide) {
      used.push(...currentDraft.data.blueSide.bans.filter(Boolean));
      used.push(...currentDraft.data.blueSide.picks.filter(Boolean));
    }
    if (currentDraft?.data?.redSide) {
      used.push(...currentDraft.data.redSide.bans.filter(Boolean));
      used.push(...currentDraft.data.redSide.picks.filter(Boolean));
    }
    return used;
  };

  // Gestion de la sélection (slot OU champion)
  const handleSlotClick = (team, type, index) => {
    const slot = { team, type, index };
    
    if (selectedChampion) {
      placeChampionInSlot(selectedChampion, slot);
    } else {
      setSelectedSlot(slot);
    }
  };

  const handleChampionClick = (championName) => {
    const usedChampions = getAllUsedChampions();
    
    if (usedChampions.includes(championName)) {
      removeChampionFromDraft(championName);
      setSelectedChampion(championName);
      setSelectedSlot(null);
    } else if (selectedSlot) {
      placeChampionInSlot(championName, selectedSlot);
    } else {
      setSelectedChampion(championName);
      setSelectedSlot(null);
    }
  };

  // Gestion du clic droit pour retirer un champion
  const handleChampionRightClick = (e, championName) => {
    e.preventDefault();
    removeChampionFromDraft(championName);
    setSelectedChampion(null);
    setSelectedSlot(null);
  };

  // Placer un champion dans un slot
  const placeChampionInSlot = (championName, slot) => {
    if (!championName || !slot) return;

    const usedChampions = getAllUsedChampions();
    if (usedChampions.includes(championName)) {
      removeChampionFromDraft(championName);
    }

    const newDraft = { ...currentDraft };
    const { team, type, index } = slot;
    const side = team === 'blue' ? 'blueSide' : 'redSide';
    
    if (type === 'ban') {
      newDraft.data[side].bans[index] = championName;
    } else {
      newDraft.data[side].picks[index] = championName;
    }
    
    setCurrentDraft(newDraft);
    setSelectedSlot(null);
    setSelectedChampion(null);
  };

  // Retirer un champion de la draft
  const removeChampionFromDraft = (championName) => {
    const newDraft = { ...currentDraft };
    
    ['blueSide', 'redSide'].forEach(side => {
      if (newDraft.data[side]) {
        const banIndex = newDraft.data[side].bans.indexOf(championName);
        if (banIndex !== -1) {
          newDraft.data[side].bans[banIndex] = null;
        }
        
        const pickIndex = newDraft.data[side].picks.indexOf(championName);
        if (pickIndex !== -1) {
          newDraft.data[side].picks[pickIndex] = null;
        }
      }
    });
    
    setCurrentDraft(newDraft);
  };

  // Sauvegarder
  const handleSave = () => {
    const updatedDraft = {
      ...currentDraft,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedDraft);
  };

  // Reset
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir tout effacer ?')) {
      setCurrentDraft({
        ...currentDraft,
        data: {
          blueSide: {
            bans: [null, null, null, null, null],
            picks: [null, null, null, null, null],
            roles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT']
          },
          redSide: {
            bans: [null, null, null, null, null],
            picks: [null, null, null, null, null],
            roles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT']
          }
        }
      });
      setSelectedSlot(null);
      setSelectedChampion(null);
    }
  };

  // Vérifier si un slot est sélectionné
  const isSlotSelected = (team, type, index) => {
    return selectedSlot?.team === team && 
           selectedSlot?.type === type && 
           selectedSlot?.index === index;
  };

  const usedChampions = getAllUsedChampions();

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-2xl font-bold text-white">{currentDraft?.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              title="Tout effacer"
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

      {/* Layout principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Section du haut: Headers et Bans */}
        <div className="bg-gray-800 p-4">
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Blue Team Header */}
            <div className="col-span-2">
              {editingBlueName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={blueTeamName}
                    onChange={(e) => setBlueTeamName(e.target.value)}
                    className="bg-blue-600 text-white px-2 py-2 rounded font-bold text-center flex-1 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingBlueName(false);
                      if (e.key === 'Escape') {
                        setBlueTeamName('Blue side');
                        setEditingBlueName(false);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingBlueName(false)}
                    className="p-1 bg-green-600 hover:bg-green-700 rounded text-white"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setEditingBlueName(true)}
                  className="bg-blue-600 text-white text-center py-2 rounded font-bold cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {blueTeamName}
                  <Edit3 className="w-3 h-3 opacity-60" />
                </div>
              )}
            </div>

            {/* Espace central */}
            <div className="col-span-8"></div>

            {/* Red Team Header */}
            <div className="col-span-2">
              {editingRedName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={redTeamName}
                    onChange={(e) => setRedTeamName(e.target.value)}
                    className="bg-red-600 text-white px-2 py-2 rounded font-bold text-center flex-1 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingRedName(false);
                      if (e.key === 'Escape') {
                        setRedTeamName('Red side');
                        setEditingRedName(false);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingRedName(false)}
                    className="p-1 bg-green-600 hover:bg-green-700 rounded text-white"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setEditingRedName(true)}
                  className="bg-red-600 text-white text-center py-2 rounded font-bold cursor-pointer hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {redTeamName}
                  <Edit3 className="w-3 h-3 opacity-60" />
                </div>
              )}
            </div>
          </div>

          {/* Bans Section */}
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Blue Bans */}
            <div className="col-span-2">
              <div className="text-xs text-gray-400 mb-2 text-center">BANS</div>
              <div className="flex justify-center gap-1">
                {currentDraft?.data?.blueSide?.bans?.map((ban, index) => (
                  <ChampionSlot
                    key={`blue-ban-${index}`}
                    champion={ban}
                    isEmpty={!ban}
                    isBan={true}
                    isSelected={isSlotSelected('blue', 'ban', index)}
                    onClick={() => handleSlotClick('blue', 'ban', index)}
                    onRightClick={ban ? (e) => handleChampionRightClick(e, ban) : undefined}
                    size="small"
                  />
                ))}
              </div>
            </div>

            {/* Espace central pour les filtres */}
            <div className="col-span-8">
              {/* Barre de recherche */}
              <div className="relative mb-3">
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
              <div className="flex justify-center gap-2">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium transition-colors
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

            {/* Red Bans */}
            <div className="col-span-2">
              <div className="text-xs text-gray-400 mb-2 text-center">BANS</div>
              <div className="flex justify-center gap-1">
                {currentDraft?.data?.redSide?.bans?.map((ban, index) => (
                  <ChampionSlot
                    key={`red-ban-${index}`}
                    champion={ban}
                    isEmpty={!ban}
                    isBan={true}
                    isSelected={isSlotSelected('red', 'ban', index)}
                    onClick={() => handleSlotClick('red', 'ban', index)}
                    onRightClick={ban ? (e) => handleChampionRightClick(e, ban) : undefined}
                    size="small"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section principale: Picks + Champions */}
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          {/* Blue Picks (gauche) */}
          <div className="col-span-2 bg-gray-800 p-4 flex flex-col justify-center">
            <div className="space-y-4">
              {currentDraft?.data?.blueSide?.picks?.map((pick, index) => (
                <div key={`blue-pick-${index}`} className="flex items-center gap-3">
                  <div className="w-6 text-sm text-blue-400 font-bold">
                    B{index + 1}
                  </div>
                  <ChampionSlot
                    champion={pick}
                    isEmpty={!pick}
                    isBan={false}
                    isSelected={isSlotSelected('blue', 'pick', index)}
                    onClick={() => handleSlotClick('blue', 'pick', index)}
                    onRightClick={pick ? (e) => handleChampionRightClick(e, pick) : undefined}
                    size="medium"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Champions (centre) */}
          <div className="col-span-8 bg-gray-900 p-4 overflow-y-auto">
            <div className="grid grid-cols-10 gap-2">
              {filteredChampions.map(champion => {
                const isUsed = usedChampions.includes(champion.name);
                const isSelected = selectedChampion === champion.name;
                
                return (
                  <div
                    key={champion.name}
                    onClick={() => handleChampionClick(champion.name)}
                    onContextMenu={(e) => isUsed ? handleChampionRightClick(e, champion.name) : undefined}
                    className={`
                      p-2 rounded cursor-pointer transition-all text-center text-xs font-medium hover:scale-105 relative
                      ${isUsed 
                        ? 'opacity-50 cursor-not-allowed' 
                        : isSelected
                          ? 'ring-2 ring-yellow-400 shadow-lg'
                          : 'hover:shadow-md'
                      }
                    `}
                    title={`${champion.name} - ${champion.roles.join(', ')}`}
                  >
                    <div className="w-12 h-12 rounded mb-1 mx-auto overflow-hidden border border-gray-600">
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.name.replace(/[^a-zA-Z0-9]/g, '')}.png`}
                        alt={champion.name}
                        className={`w-full h-full object-cover ${isUsed ? 'grayscale' : ''}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x48/374151/9CA3AF?text=' + champion.name.charAt(0);
                        }}
                      />
                    </div>
                    <div className="truncate text-xs text-white">{champion.name}</div>
                    <div className="text-xs text-gray-300 mt-1 opacity-80">
                      {champion.roles.join('/')}
                    </div>
                    
                    {/* Indicateur utilisé */}
                    {isUsed && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}

                    {/* Indicateur sélectionné */}
                    {isSelected && (
                      <div className="absolute -inset-1 border-2 border-yellow-400 rounded animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Red Picks (droite) */}
          <div className="col-span-2 bg-gray-800 p-4 flex flex-col justify-center">
            <div className="space-y-4">
              {currentDraft?.data?.redSide?.picks?.map((pick, index) => (
                <div key={`red-pick-${index}`} className="flex items-center gap-3 justify-end">
                  <ChampionSlot
                    champion={pick}
                    isEmpty={!pick}
                    isBan={false}
                    isSelected={isSlotSelected('red', 'pick', index)}
                    onClick={() => handleSlotClick('red', 'pick', index)}
                    onRightClick={pick ? (e) => handleChampionRightClick(e, pick) : undefined}
                    size="medium"
                  />
                  <div className="w-6 text-sm text-red-400 font-bold">
                    R{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfectDraftInterface;