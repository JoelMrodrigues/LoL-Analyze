import React, { useState, useEffect } from 'react';
import { Search, Trophy, Target, Clock, User, BarChart3, ChevronDown, ChevronUp, Gamepad2, Sword, Shield, Zap } from 'lucide-react';

// Composant Header intégré
const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-black bg-opacity-60 backdrop-blur-md text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">LoL Analyzer</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <a href="/" className="hover:text-blue-400 transition-colors">
                Accueil
              </a>
            </li>
            <li>
              <a href="/profil" className="text-blue-400 font-semibold">
                Profil
              </a>
            </li>
            <li>
              <a href="/analyse" className="hover:text-blue-400 transition-colors">
                Analyse
              </a>
            </li>
            <li>
              <a href="/data-champ" className="hover:text-blue-400 transition-colors">
                Data Champ
              </a>
            </li>
            <li>
              <a href="/amelioration" className="hover:text-blue-400 transition-colors">
                Amélioration
              </a>
            </li>
            <li>
              <a href="/team" className="hover:text-blue-400 transition-colors">
                Team
              </a>
            </li>
            
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Configuration API
const RIOT_API_KEY = 'RGAPI-257cd474-7cde-4100-8725-f436f39182a3';

const Team = () => {
    // États principaux
    const [user, setUser] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamView, setTeamView] = useState('team');
    
    // États des modals
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [showInvitePlayer, setShowInvitePlayer] = useState(false);
    const [showImportMatch, setShowImportMatch] = useState(false);

    // Simulation de données de test (à supprimer en production)
    useEffect(() => {
        // Vous pouvez supprimer cette section en production
        const testUser = {
            id: 'test-user-1',
            email: 'test@example.com',
            username: 'TestUser'
        };
        
        const testTeam = {
            id: 'test-team-1',
            name: 'PANDORE V2',
            owner: 'test-user-1',
            players: [
                {
                    id: 'test-user-1',
                    username: 'TestUser',
                    email: 'test@example.com',
                    role: 'owner',
                    rank: 'Grandmaster I 949 LP',
                    riotId: 'TestUser#ZEUS',
                    status: 'active'
                },
                {
                    id: 'player-2',
                    username: 'Quest',
                    email: 'quest@example.com',
                    role: 'player',
                    rank: 'Master I 591 LP',
                    riotId: 'questionable#what',
                    status: 'active'
                },
                {
                    id: 'player-3',
                    username: 'Elnard',
                    email: 'elnard@example.com',
                    role: 'player',
                    rank: 'Master I 109 LP',
                    riotId: 'Elnard#mini',
                    status: 'active'
                }
            ],
            matches: [],
            stats: {},
            createdAt: new Date().toISOString()
        };
        
        // Auto-connexion pour les tests (à supprimer)
        setUser(testUser);
        setTeams([testTeam]);
        setSelectedTeam(testTeam);
    }, []);

    // Fonctions d'authentification
    const handleAuth = (type, email, password) => {
        if (!email || !password) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        // Simulation d'authentification - remplacer par votre API
        const userData = {
            id: Math.random().toString(36).substr(2, 9),
            email: email,
            username: email.split('@')[0]
        };
        
        setUser(userData);
        setShowAuth(false);
        
        // Ici vous feriez l'appel à votre API d'authentification
        console.log(`${type} attempt:`, { email, password });
    };

    const handleGoogleAuth = () => {
        // Simulation connexion Google - remplacer par votre intégration Google OAuth
        const userData = {
            id: 'google-' + Math.random().toString(36).substr(2, 9),
            email: 'user@gmail.com',
            username: 'GoogleUser'
        };
        
        setUser(userData);
        setShowAuth(false);
    };

    const handleLogout = () => {
        setUser(null);
        setTeams([]);
        setSelectedTeam(null);
        setTeamView('team');
    };

    // Fonctions de gestion d'équipe
    const createTeam = (teamName) => {
        if (!teamName.trim()) {
            alert('Veuillez entrer un nom d\'équipe');
            return;
        }

        const newTeam = {
            id: Math.random().toString(36).substr(2, 9),
            name: teamName,
            owner: user.id,
            players: [{
                id: user.id,
                username: user.username,
                email: user.email,
                role: 'owner',
                rank: 'Unranked',
                riotId: `${user.username}#0000`,
                status: 'active'
            }],
            matches: [],
            stats: {},
            createdAt: new Date().toISOString()
        };
        
        const updatedTeams = [...teams, newTeam];
        setTeams(updatedTeams);
        setSelectedTeam(newTeam);
        setShowCreateTeam(false);
        
        // Ici vous feriez l'appel à votre API pour sauvegarder l'équipe
        console.log('Creating team:', newTeam);
    };

    const invitePlayer = (identifier) => {
        if (!identifier.trim()) {
            alert('Veuillez entrer un email ou pseudo');
            return;
        }

        if (!selectedTeam) {
            alert('Aucune équipe sélectionnée');
            return;
        }
        
        // Vérifier si le joueur n'est pas déjà dans l'équipe
        const existingPlayer = selectedTeam.players.find(p => 
            p.email === identifier || p.riotId === identifier
        );
        
        if (existingPlayer) {
            alert('Ce joueur est déjà dans l\'équipe');
            return;
        }
        
        const newPlayer = {
            id: Math.random().toString(36).substr(2, 9),
            username: identifier.includes('@') ? identifier.split('@')[0] : identifier.split('#')[0],
            email: identifier.includes('@') ? identifier : `${identifier.split('#')[0]}@riot.com`,
            role: 'player',
            rank: 'Unranked',
            riotId: identifier.includes('#') ? identifier : `${identifier}#0000`,
            status: 'pending'
        };
        
        const updatedTeam = {
            ...selectedTeam,
            players: [...selectedTeam.players, newPlayer]
        };
        
        const updatedTeams = teams.map(t => t.id === selectedTeam.id ? updatedTeam : t);
        setTeams(updatedTeams);
        setSelectedTeam(updatedTeam);
        setShowInvitePlayer(false);
        
        // Ici vous feriez l'appel à votre API pour envoyer l'invitation
        console.log('Inviting player:', newPlayer);
    };

    const removePlayer = (playerId) => {
        if (!selectedTeam) return;
        
        const playerToRemove = selectedTeam.players.find(p => p.id === playerId);
        if (playerToRemove?.role === 'owner') {
            alert('Impossible de supprimer le propriétaire');
            return;
        }
        
        if (window.confirm('Êtes-vous sûr de vouloir retirer ce joueur ?')) {
            const updatedTeam = {
                ...selectedTeam,
                players: selectedTeam.players.filter(p => p.id !== playerId)
            };
            
            const updatedTeams = teams.map(t => t.id === selectedTeam.id ? updatedTeam : t);
            setTeams(updatedTeams);
            setSelectedTeam(updatedTeam);
        }
    };

    const importMatch = (jsonData) => {
        if (!selectedTeam) {
            alert('Aucune équipe sélectionnée');
            return;
        }
        
        try {
            // Ici vous traiterez le fichier JSON avec votre script personnalisé
            const newMatch = {
                id: Math.random().toString(36).substr(2, 9),
                ...jsonData,
                importedAt: new Date().toISOString(),
                teamId: selectedTeam.id
            };
            
            const updatedTeam = {
                ...selectedTeam,
                matches: [...(selectedTeam.matches || []), newMatch]
            };
            
            const updatedTeams = teams.map(t => t.id === selectedTeam.id ? updatedTeam : t);
            setTeams(updatedTeams);
            setSelectedTeam(updatedTeam);
            setShowImportMatch(false);
            
            alert('Partie importée avec succès !');
            console.log('Match imported:', newMatch);
            
        } catch (error) {
            console.error('Error importing match:', error);
            alert('Erreur lors de l\'import de la partie');
        }
    };

    // Composants des modals
    const AuthModal = () => {
        const [authType, setAuthType] = useState('login');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                    <button
                        onClick={() => setShowAuth(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-6 text-center text-white">
                        {authType === 'login' ? 'Connexion' : 'Inscription'}
                    </h2>
                    
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        
                        <button
                            onClick={() => handleAuth(authType, email, password)}
                            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium transition-colors text-white"
                        >
                            {authType === 'login' ? 'Se connecter' : 'S\'inscrire'}
                        </button>
                        
                        <button
                            onClick={handleGoogleAuth}
                            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white"
                        >
                            <span>🔴</span> Continuer avec Google
                        </button>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setAuthType(authType === 'login' ? 'register' : 'login')}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            {authType === 'login' ? 'Créer un compte' : 'Déjà un compte ?'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const CreateTeamModal = () => {
        const [teamName, setTeamName] = useState('');

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                    <button
                        onClick={() => setShowCreateTeam(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-6 text-white">Créer une équipe</h2>
                    
                    <input
                        type="text"
                        placeholder="Nom de l'équipe"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white mb-4 border border-gray-600 focus:border-blue-500 focus:outline-none"
                        maxLength={50}
                    />
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => createTeam(teamName)}
                            disabled={!teamName.trim()}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-medium transition-colors text-white"
                        >
                            Créer
                        </button>
                        <button
                            onClick={() => setShowCreateTeam(false)}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 p-3 rounded-lg font-medium transition-colors text-white"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const InvitePlayerModal = () => {
        const [identifier, setIdentifier] = useState('');

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                    <button
                        onClick={() => setShowInvitePlayer(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-6 text-white">Inviter un joueur</h2>
                    
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Email ou Pseudo#1234"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                            Exemples: player@email.com ou PlayerName#1234
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => invitePlayer(identifier)}
                            disabled={!identifier.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-medium transition-colors text-white"
                        >
                            Inviter
                        </button>
                        <button
                            onClick={() => setShowInvitePlayer(false)}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 p-3 rounded-lg font-medium transition-colors text-white"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ImportMatchModal = () => {
        const [dragActive, setDragActive] = useState(false);

        const handleFiles = (files) => {
            const file = files[0];
            if (!file) return;
            
            if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                alert('Veuillez sélectionner un fichier JSON valide');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    importMatch(jsonData);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    alert('Fichier JSON invalide ou corrompu');
                }
            };
            reader.readAsText(file);
        };

        const handleDrag = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.type === "dragenter" || e.type === "dragover") {
                setDragActive(true);
            } else if (e.type === "dragleave") {
                setDragActive(false);
            }
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFiles(e.dataTransfer.files);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                    <button
                        onClick={() => setShowImportMatch(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-6 text-white">Importer une partie</h2>
                    
                    <div 
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            dragActive 
                                ? 'border-blue-400 bg-blue-400 bg-opacity-10' 
                                : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="text-4xl mb-4">📄</div>
                        <p className="text-gray-300 mb-4">
                            Glissez votre fichier JSON ici
                        </p>
                        <p className="text-sm text-gray-400 mb-4">ou</p>
                        <input
                            type="file"
                            accept=".json,application/json"
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg cursor-pointer inline-block transition-colors text-white font-medium"
                        >
                            Choisir un fichier
                        </label>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-400">
                        <p>Formats acceptés: .json</p>
                        <p>Taille maximum: 10MB</p>
                    </div>
                </div>
            </div>
        );
    };

    // Rendu du contenu principal selon la vue sélectionnée
    const renderTeamContent = () => {
        if (!selectedTeam) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                        <div className="text-6xl mb-4">👥</div>
                        <p className="text-xl mb-4">Aucune équipe sélectionnée</p>
                        <p className="mb-6">Créez ou sélectionnez une équipe pour commencer</p>
                        <button
                            onClick={() => setShowCreateTeam(true)}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
                        >
                            Créer une équipe
                        </button>
                    </div>
                </div>
            );
        }

        switch(teamView) {
            case 'team':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white">{selectedTeam.name}</h2>
                                <p className="text-gray-400 mt-1">
                                    {selectedTeam.players.length} membre{selectedTeam.players.length > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowInvitePlayer(true)}
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white font-medium flex items-center gap-2"
                                >
                                    <span>➕</span> Inviter un joueur
                                </button>
                                <button
                                    onClick={() => setShowImportMatch(true)}
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-white font-medium flex items-center gap-2"
                                >
                                    <span>📤</span> Importer une partie
                                </button>
                            </div>
                        </div>

                        {/* Liste des joueurs avec design similaire à votre capture */}
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                                <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                    <div>Joueur</div>
                                    <div>Rôle</div>
                                    <div>Pool champ</div>
                                    <div>Riot ID</div>
                                    <div>Rang (soloQ)</div>
                                    <div>OP.GG</div>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-700">
                                {selectedTeam.players.map(player => (
                                    <div key={player.id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                                        <div className="grid grid-cols-6 gap-4 items-center">
                                            {/* Joueur */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {player.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{player.username}</p>
                                                    <p className="text-sm text-gray-400">{player.email}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Rôle */}
                                            <div>
                                                <span className="text-sm text-gray-300">Toplaner</span>
                                            </div>
                                            
                                            {/* Pool champ */}
                                            <div className="flex items-center gap-1">
                                                {/* Icônes de champions simulées */}
                                                <div className="flex -space-x-1">
                                                    {[1,2,3,4].map(i => (
                                                        <div key={i} className="w-8 h-8 bg-yellow-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs">
                                                            C{i}
                                                        </div>
                                                    ))}
                                                    <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs text-gray-300">
                                                        +5
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Riot ID */}
                                            <div>
                                                <span className="text-sm text-blue-400">{player.riotId}</span>
                                            </div>
                                            
                                            {/* Rang */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                                                <span className="text-sm text-white">{player.rank}</span>
                                            </div>
                                            
                                            {/* OP.GG + Actions */}
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`https://op.gg/summoners/euw/${player.username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                                >
                                                    op.gg ↗
                                                </a>
                                                {player.role !== 'owner' && (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => removePlayer(player.id)}
                                                            className="text-red-400 hover:text-red-300 p-1"
                                                            title="Retirer le joueur"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                )}
                                                {player.status === 'pending' && (
                                                    <span className="px-2 py-1 bg-orange-600 rounded text-xs text-white">
                                                        En attente
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'match-history':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Historique des parties</h2>
                            <button
                                onClick={() => setShowImportMatch(true)}
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-white font-medium"
                            >
                                Importer une partie
                            </button>
                        </div>
                        
                        {selectedTeam.matches && selectedTeam.matches.length > 0 ? (
                            <div className="space-y-4">
                                {selectedTeam.matches.map(match => (
                                    <div key={match.id} className="bg-gray-800 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white">Match #{match.gameId}</h3>
                                                <p className="text-sm text-gray-400">
                                                    Importé le {new Date(match.importedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400">Mode: {match.gameMode}</p>
                                                <p className="text-sm text-gray-400">
                                                    Durée: {Math.floor(match.gameDuration / 60)}:{String(match.gameDuration % 60).padStart(2, '0')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 text-center py-12">
                                <div className="text-6xl mb-4">🎮</div>
                                <p className="text-xl mb-4">Aucune partie importée</p>
                                <p className="mb-6">Importez vos parties pour voir l'historique</p>
                                <button
                                    onClick={() => setShowImportMatch(true)}
                                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors text-white font-medium"
                                >
                                    Importer une partie
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'stats':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-white">Statistiques de l'équipe</h2>
                        <div className="text-gray-400 text-center py-12">
                            <div className="text-6xl mb-4">📊</div>
                            <p className="text-xl mb-4">Statistiques en cours de développement</p>
                            <p>Les statistiques apparaîtront après l'import de parties</p>
                        </div>
                    </div>
                );

            case 'pool-champ':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-white">Pool de Champions</h2>
                        <div className="text-gray-400 text-center py-12">
                            <div className="text-6xl mb-4">🏆</div>
                            <p className="text-xl mb-4">Pool de champions de l'équipe</p>
                            <p>Gérez les champions maîtrisés par chaque membre</p>
                        </div>
                    </div>
                );

            case 'drafts':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-white">Drafts</h2>
                        <div className="text-gray-400 text-center py-12">
                            <div className="text-6xl mb-4">🎯</div>
                            <p className="text-xl mb-4">Historique des drafts</p>
                            <p>Analysez vos stratégies de draft et compositions d'équipe</p>
                        </div>
                    </div>
                );

            default:
                return <div>Vue non trouvée</div>;
        }
    };

    // Interface non connecté
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Header />
                <div className="pt-20 flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="text-8xl mb-8">🛡️</div>
                        <h1 className="text-4xl font-bold mb-4 text-white">Team Management</h1>
                        <p className="text-xl text-gray-400 mb-8">
                            Gérez vos équipes, analysez vos performances et optimisez vos stratégies
                        </p>
                        <button
                            onClick={() => setShowAuth(true)}
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-medium transition-colors text-white text-lg"
                        >
                            Se connecter / S'inscrire
                        </button>
                    </div>
                    {showAuth && <AuthModal />}
                </div>
            </div>
        );
    }

    // Interface principale
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            
            {/* Content avec padding-top pour compenser le header fixe */}
            <div className="pt-20">
                {/* Header de la page */}
                <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">Team Management</h1>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-400">Welcome, {user.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>

                <div className="flex h-[calc(100vh-153px)]">
                    {/* Sidebar gauche */}
                    <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
                        {/* Sélection d'équipe */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-lg font-semibold text-white">Équipe</label>
                                <button
                                    onClick={() => setShowCreateTeam(true)}
                                    className="text-green-400 hover:text-green-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                >
                                    + Créer
                                </button>
                            </div>
                            <select
                                value={selectedTeam?.id || ''}
                                onChange={(e) => {
                                    const team = teams.find(t => t.id === e.target.value);
                                    setSelectedTeam(team);
                                    if (team) setTeamView('team');
                                }}
                                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Sélectionner une équipe</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id}>
                                        {team.name} ({team.players.length} membres)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                Navigation
                            </h3>
                            {[
                                { id: 'team', label: 'Team', icon: '👥' },
                                { id: 'match-history', label: 'Match History', icon: '🎮' },
                                { id: 'stats', label: 'Stats', icon: '📊' },
                                { id: 'pool-champ', label: 'Pool Champ', icon: '🏆' },
                                { id: 'drafts', label: 'Drafts', icon: '🎯' }
                            ].map(view => (
                                <button
                                    key={view.id}
                                    onClick={() => setTeamView(view.id)}
                                    disabled={!selectedTeam}
                                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                                        teamView === view.id && selectedTeam
                                            ? 'bg-blue-600 text-white' 
                                            : selectedTeam
                                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            : 'text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <span className="text-xl">{view.icon}</span>
                                    <span className="font-medium">{view.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Info équipe sélectionnée */}
                        {selectedTeam && (
                            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                                <h4 className="font-semibold text-white mb-2">{selectedTeam.name}</h4>
                                <div className="text-sm text-gray-300 space-y-1">
                                    <p>👥 {selectedTeam.players.length} membres</p>
                                    <p>🎮 {selectedTeam.matches?.length || 0} parties</p>
                                    <p>📅 Créée le {new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contenu principal */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        {renderTeamContent()}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateTeam && <CreateTeamModal />}
            {showInvitePlayer && <InvitePlayerModal />}
            {showImportMatch && <ImportMatchModal />}
        </div>
    );
};

export default Team;