import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Search,
  X
} from 'lucide-react';

// Base de données complète des champions (version simplifiée pour l'exemple)
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
  { name: 'Ekko', roles: ['JUNGLE', 'MID'], tags: ['Assassin', 'Fighter'] }
];

const ImprovedDraftInterface = ({ draftData, onSave, onBack }) => {
  const [currentDraft, setCurrentDraft] = useState(draftData);
  const [selectedSlot, setSelectedSlot] = useState(null); // { team: 'blue', type: 'ban', index: 0 }
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

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

  // Sélectionner un slot (case où placer un champion)
  const selectSlot = (team, type, index) => {
    setSelectedSlot({ team, type, index });
  };

  // Placer un champion dans le slot sélectionné
  const placeChampion = (championName) => {
    if (!selectedSlot || !championName) return;

    const usedChampions = getAllUsedChampions();
    if (usedChampions.includes(championName)) {
      alert('Ce champion est déjà utilisé !');
      return;
    }

    const newDraft = { ...currentDraft };
    const { team, type, index } = selectedSlot;
    const side = team === 'blue' ? 'blueSide' : 'redSide';
    
    if (type === 'ban') {
      newDraft.data[side].bans[index] = championName;
    } else {
      newDraft.data[side].picks[index] = championName;
    }
    
    setCurrentDraft(newDraft);
    setSelectedSlot(null); // Désélectionner après placement
  };

  // Retirer un champion d'un slot
  const removeChampion = (team, type, index) => {
    const newDraft = { ...currentDraft };
    const side = team === 'blue' ? 'blueSide' : 'redSide';
    
    if (type === 'ban') {
      newDraft.data[side].bans[index] = null;
    } else {
      newDraft.data[side].picks[index] = null;
    }
    
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

      <div className="flex-1 flex flex-col">
        {/* Équipes en haut */}
        <div className="bg-gray-800 p-6">
          {/* Headers des équipes */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-600 text-white text-center py-3 rounded-lg font-bold text-xl">
              BLUE SIDE
            </div>
            <div className="bg-red-600 text-white text-center py-3 rounded-lg font-bold text-xl">
              RED SIDE
            </div>
          </div>

          {/* Bans */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Bans Blue */}
            <div>
              <div className="text-sm text-gray-400 mb-3 text-center">BANS</div>
              <div className="flex justify-center gap-2">
                {currentDraft?.data?.blueSide?.bans?.map((ban, index) => (
                  <ChampionSlot
                    key={`blue-ban-${index}`}
                    champion={ban}
                    isEmpty={!ban}
                    isBan={true}
                    isSelected={selectedSlot?.team === 'blue' && selectedSlot?.type === 'ban' && selectedSlot?.index === index}
                    onClick={() => selectSlot('blue', 'ban', index)}
                    onRemove={() => removeChampion('blue', 'ban', index)}
                    size="medium"
                  />
                ))}
              </div>
            </div>

            {/* Bans Red */}
            <div>
              <div className="text-sm text-gray-400 mb-3 text-center">BANS</div>
              <div className="flex justify-center gap-2">
                {currentDraft?.data?.redSide?.bans?.map((ban, index) => (
                  <ChampionSlot
                    key={`red-ban-${index}`}
                    champion={ban}
                    isEmpty={!ban}
                    isBan={true}
                    isSelected={selectedSlot?.team === 'red' && selectedSlot?.type === 'ban' && selectedSlot?.index === index}
                    onClick={() => selectSlot('red', 'ban', index)}
                    onRemove={() => removeChampion('red', 'ban', index)}
                    size="medium"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Picks */}
          <div className="grid grid-cols-2 gap-6">
            {/* Picks Blue */}
            <div>
              <div className="space-y-3">
                {currentDraft?.data?.blueSide?.picks?.map((pick, index) => (
                  <div key={`blue-pick-${index}`} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-blue-400 font-semibold text-center">
                      {currentDraft.data.blueSide.roles[index]}
                    </div>
                    <ChampionSlot
                      champion={pick}
                      isEmpty={!pick}
                      isBan={false}
                      isSelected={selectedSlot?.team === 'blue' && selectedSlot?.type === 'pick' && selectedSlot?.index === index}
                      onClick={() => selectSlot('blue', 'pick', index)}
                      onRemove={() => removeChampion('blue', 'pick', index)}
                      size="large"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Picks Red */}
            <div>
              <div className="space-y-3">
                {currentDraft?.data?.redSide?.picks?.map((pick, index) => (
                  <div key={`red-pick-${index}`} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-red-400 font-semibold text-center">
                      {currentDraft.data.redSide.roles[index]}
                    </div>
                    <ChampionSlot
                      champion={pick}
                      isEmpty={!pick}
                      isBan={false}
                      isSelected={selectedSlot?.team === 'red' && selectedSlot?.type === 'pick' && selectedSlot?.index === index}
                      onClick={() => selectSlot('red', 'pick', index)}
                      onRemove={() => removeChampion('red', 'pick', index)}
                      size="large"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          {selectedSlot && (
            <div className="mt-6 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg text-center">
              <p className="text-yellow-300 font-medium">
                📍 Slot sélectionné : {selectedSlot.team.toUpperCase()} {selectedSlot.type.toUpperCase()} #{selectedSlot.index + 1}
              </p>
              <p className="text-yellow-200 text-sm mt-1">
                Cliquez sur un champion ci-dessous pour le placer, ou cliquez sur le slot pour le désélectionner
              </p>
            </div>
          )}
        </div>

        {/* Sélecteur de champions */}
        <div className="flex-1 bg-gray-900 p-6">
          {/* Filtres */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un champion..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
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

          {/* Grille des champions */}
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-14 gap-3">
            {filteredChampions.map(champion => {
              const isUsed = usedChampions.includes(champion.name);
              
              return (
                <ChampionCard
                  key={champion.name}
                  champion={champion}
                  isUsed={isUsed}
                  canSelect={!isUsed && selectedSlot}
                  onClick={() => !isUsed && selectedSlot && placeChampion(champion.name)}
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
      </div>
    </div>
  );
};

// Composant pour les slots de champions
const ChampionSlot = ({ champion, isEmpty, isBan, isSelected, onClick, onRemove, size = 'medium' }) => {
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
          : 'border-gray-500 bg-gray-700'
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

            {/* Bouton de suppression au hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-xs"
              title="Retirer"
            >
              ×
            </button>
          </>
        ) : (
          <div className="text-gray-500 text-xs text-center">
            {isSelected ? '?' : isEmpty ? '+' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour les cartes de champions
const ChampionCard = ({ champion, isUsed, canSelect, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isUsed || !canSelect}
      className={`relative group transition-all ${
        isUsed 
          ? 'opacity-40 cursor-not-allowed' 
          : canSelect
          ? 'hover:scale-105 cursor-pointer hover:shadow-lg'
          : 'opacity-60 cursor-default'
      }`}
      title={`${champion.name} - ${champion.roles.join(', ')}`}
    >
      <div className="w-16 h-16 rounded border-2 border-gray-600 overflow-hidden bg-gray-800">
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
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
          <span className="text-white font-bold">✓</span>
        </div>
      )}

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
        {champion.roles.join(' • ')}
      </div>
    </button>
  );
};

export default ImprovedDraftInterface;