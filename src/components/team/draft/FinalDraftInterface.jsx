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
  { name: 'Miss Fortune', roles: ['ADC'], tags: ['Marksman'] },
  { name: 'Mordekaiser', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Morgana', roles: ['SUPPORT', 'MID'], tags: ['Mage', 'Support'] },
  { name: 'Nami', roles: ['SUPPORT'], tags: ['Support', 'Mage'] },
  { name: 'Nasus', roles: ['TOP'], tags: ['Fighter', 'Tank'] },
  { name: 'Nautilus', roles: ['SUPPORT', 'JUNGLE'], tags: ['Tank', 'Fighter'] },
  { name: 'Neeko', roles: ['MID', 'SUPPORT'], tags: ['Mage', 'Support'] },
  { name: 'Nidalee', roles: ['JUNGLE'], tags: ['Assassin', 'Mage'] },
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

const FinalDraftInterface = ({ draftData, onSave, onBack }) => {
  const [currentDraft, setCurrentDraft] = useState(draftData);
  const [selectedSlot, setSelectedSlot] = useState(null); // { team, type, index }
  const [selectedChampion, setSelectedChampion] = useState(null); // nom du champion
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
    ['blueSide', 'redSide'].forEach(side => {
      if (currentDraft?.data?.[side]) {
        used.push(...currentDraft.data[side].bans.filter(Boolean));
        used.push(...currentDraft.data[side].picks.filter(Boolean));
      }
    });
    return used;
  };

  // Gestion de la sélection (slot OU champion)
  const handleSlotClick = (team, type, index) => {
    const slot = { team, type, index };
    
    if (selectedChampion) {
      // Si un champion est sélectionné, le placer dans ce slot
      placeChampionInSlot(selectedChampion, slot);
    } else {
      // Sinon, sélectionner ce slot
      setSelectedSlot(slot);
    }
  };

  const handleChampionClick = (championName) => {
    const usedChampions = getAllUsedChampions();
    
    if (usedChampions.includes(championName)) {
      // Si le champion est déjà utilisé, le retirer et le sélectionner
      removeChampionFromDraft(championName);
      setSelectedChampion(championName);
      setSelectedSlot(null);
    } else if (selectedSlot) {
      // Si un slot est sélectionné, placer le champion
      placeChampionInSlot(championName, selectedSlot);
    } else {
      // Sinon, sélectionner le champion
      setSelectedChampion(championName);
      setSelectedSlot(null);
    }
  };

  // Placer un champion dans un slot
  const placeChampionInSlot = (championName, slot) => {
    if (!championName || !slot) return;

    const usedChampions = getAllUsedChampions();
    if (usedChampions.includes(championName)) {
      // Retirer le champion de son ancienne position
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
      // Retirer des bans
      const banIndex = newDraft.data[side].bans.indexOf(championName);
      if (banIndex !== -1) {
        newDraft.data[side].bans[banIndex] = null;
      }
      
      // Retirer des picks
      const pickIndex = newDraft.data[side].picks.indexOf(championName);
      if (pickIndex !== -1) {
        newDraft.data[side].picks[pickIndex] = null;
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

  const usedChampions = getAllUsedChampions();

  return (
    <div className="h-full flex flex-col bg-gray-900">
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

      {/* Interface principale */}
      <div className="flex-1 flex">
        {/* Panneau gauche - Blue Side */}
        <div className="w-80 bg-gray-800 p-4 flex flex-col">
          {/* Header Blue Side avec nom éditable */}
          <div className="mb-6">
            {editingBlueName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={blueTeamName}
                  onChange={(e) => setBlueTeamName(e.target.value)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-center flex-1"
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
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setEditingBlueName(true)}
                className="bg-blue-600 text-white text-center py-3 rounded-lg font-bold text-xl cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {blueTeamName}
                <Edit3 className="w-4 h-4 opacity-60" />
              </div>
            )}
          </div>

          {/* Bans Blue */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-3 text-center">BANS</div>
            <div className="flex justify-center gap-2">
              {currentDraft?.data?.blueSide?.bans?.map((ban, index) => (
                <ChampionSlot
                  key={`blue-ban-${index}`}
                  champion={ban}
                  isEmpty={!ban}
                  isBan={true}
                  isSelected={selectedSlot?.team === 'blue' && selectedSlot?.type === 'ban' && selectedSlot?.index === index}
                  onClick={() => handleSlotClick('blue', 'ban', index)}
                  size="small"
                />
              ))}
            </div>
          </div>

          {/* Picks Blue */}
          <div className="flex-1">
            <div className="space-y-3">
              {currentDraft?.data?.blueSide?.picks?.map((pick, index) => (
                <div key={`blue-pick-${index}`} className="flex items-center gap-3">
                  <div className="w-8 text-sm text-blue-400 font-bold text-center">
                    B{index + 1}
                  </div>
                  <ChampionSlot
                    champion={pick}
                    isEmpty={!pick}
                    isBan={false}
                    isSelected={selectedSlot?.team === 'blue' && selectedSlot?.type === 'pick' && selectedSlot?.index === index}
                    onClick={() => handleSlotClick('blue', 'pick', index)}
                    size="large"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Centre - Sélecteur de champions */}
        <div className="flex-1 bg-gray-900 flex flex-col">
          {/* Filtres */}
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un champion..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

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

          {/* Grille des champions avec scroll */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
              {filteredChampions.map(champion => {
                const isUsed = usedChampions.includes(champion.name);
                const isCurrentlySelected = selectedChampion === champion.name;
                
                return (
                  <ChampionCard
                    key={champion.name}
                    champion={champion}
                    isUsed={isUsed}
                    isSelected={isCurrentlySelected}
                    onClick={() => handleChampionClick(champion.name)}
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

          {/* Instructions en bas */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            {selectedSlot && (
              <div className="text-center text-yellow-300 mb-2">
                📍 Slot sélectionné : {selectedSlot.team.toUpperCase()} {selectedSlot.type.toUpperCase()} #{selectedSlot.index + 1}
              </div>
            )}
            {selectedChampion && (
              <div className="text-center text-blue-300 mb-2">
                ✨ Champion sélectionné : {selectedChampion}
              </div>
            )}
            <div className="text-center text-gray-400 text-sm">
              💡 Cliquez sur une case puis un champion, ou cliquez sur un champion puis une case
            </div>
          </div>
        </div>

        {/* Panneau droit - Red Side */}
        <div className="w-80 bg-gray-800 p-4 flex flex-col">
          {/* Header Red Side avec nom éditable */}
          <div className="mb-6">
            {editingRedName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={redTeamName}
                  onChange={(e) => setRedTeamName(e.target.value)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-center flex-1"
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
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setEditingRedName(true)}
                className="bg-red-600 text-white text-center py-3 rounded-lg font-bold text-xl cursor-pointer hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {redTeamName}
                <Edit3 className="w-4 h-4 opacity-60" />
              </div>
            )}
          </div>

          {/* Bans Red */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-3 text-center">BANS</div>
            <div className="flex justify-center gap-2">
              {currentDraft?.data?.redSide?.bans?.map((ban, index) => (
                <ChampionSlot
                  key={`red-ban-${index}`}
                  champion={ban}
                  isEmpty={!ban}
                  isBan={true}
                  isSelected={selectedSlot?.team === 'red' && selectedSlot?.type === 'ban' && selectedSlot?.index === index}
                  onClick={() => handleSlotClick('red', 'ban', index)}
                  size="small"
                />
              ))}
            </div>
          </div>

          {/* Picks Red */}
          <div className="flex-1">
            <div className="space-y-3">
              {currentDraft?.data?.redSide?.picks?.map((pick, index) => (
                <div key={`red-pick-${index}`} className="flex items-center gap-3">
                  <div className="w-8 text-sm text-red-400 font-bold text-center">
                    R{index + 1}
                  </div>
                  <ChampionSlot
                    champion={pick}
                    isEmpty={!pick}
                    isBan={false}
                    isSelected={selectedSlot?.team === 'red' && selectedSlot?.type === 'pick' && selectedSlot?.index === index}
                    onClick={() => handleSlotClick('red', 'pick', index)}
                    size="large"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour les slots de champions
const ChampionSlot = ({ champion, isEmpty, isBan, isSelected, onClick, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16', 
    large: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className={`w-full h-full rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
        isSelected 
          ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg shadow-yellow-400/30' 
          : isEmpty 
          ? 'border-gray-600 bg-gray-800 hover:border-gray-500' 
          : 'border-gray-500 bg-gray-700 hover:border-gray-400'
      }`}
      onClick={onClick}
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
            
            {/* Croix pour les bans */}
            {isBan && (
              <div className="absolute inset-0 flex items-center justify-center">
                <X className="w-6 h-6 text-red-500 drop-shadow-lg" strokeWidth={3} />
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-sm text-center">
            {isSelected ? '?' : '+'}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour les cartes de champions
const ChampionCard = ({ champion, isUsed, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative group transition-all ${
        isUsed 
          ? 'opacity-50' 
          : isSelected
          ? 'scale-105 shadow-lg shadow-blue-500/30'
          : 'hover:scale-105'
      } cursor-pointer`}
      title={`${champion.name} - ${champion.roles.join(', ')}`}
    >
      <div className={`w-16 h-16 rounded border-2 overflow-hidden bg-gray-800 ${
        isSelected 
          ? 'border-blue-400' 
          : isUsed 
          ? 'border-gray-700' 
          : 'border-gray-600 hover:border-gray-500'
      }`}>
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.name.replace(/[^a-zA-Z0-9]/g, '')}.png`}
          alt={champion.name}
          className={`w-full h-full object-cover ${isUsed ? 'grayscale' : ''}`}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/64x64/374151/9CA3AF?text=' + champion.name.charAt(0);
          }}
        />
      </div>
      
      <div className="text-xs text-center text-gray-300 mt-1 truncate">
        {champion.name}
      </div>
      
      {/* Indicateur utilisé */}
      {isUsed && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}

      {/* Indicateur sélectionné */}
      {isSelected && (
        <div className="absolute -inset-1 border-2 border-blue-400 rounded animate-pulse"></div>
      )}

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
        {champion.roles.join(' • ')}
      </div>
    </button>
  );
};

export default FinalDraftInterface;