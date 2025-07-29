import { useState, useEffect } from 'react';
import { JSONParserService } from '../services/JSONParserService';

const useTeamData = () => {
    // États principaux
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamView, setTeamView] = useState('team');
    
    // États des modals
    const [showAuth, setShowAuth] = useState(false);
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [showInvitePlayer, setShowInvitePlayer] = useState(false);
    const [showImportMatch, setShowImportMatch] = useState(false);
    const [addPlayerMode, setAddPlayerMode] = useState('riot');

    // Auto-connexion pour les tests (à supprimer en production)
    useEffect(() => {
        const testUser = {
            id: 'test-user-1',
            username: 'TestUser'
        };
        
        setUser(testUser);
        
        // Charger les données sauvegardées si elles existent
        const savedTeams = localStorage.getItem('lol_analyzer_teams');
        if (savedTeams) {
            try {
                const parsedTeams = JSON.parse(savedTeams);
                setTeams(parsedTeams);
            } catch (error) {
                console.error('Erreur chargement teams:', error);
            }
        }
    }, []);

    // Sauvegarder les équipes dans localStorage à chaque modification
    useEffect(() => {
        if (teams.length > 0) {
            localStorage.setItem('lol_analyzer_teams', JSON.stringify(teams));
        }
    }, [teams]);

    // Fonctions d'authentification
    const handleAuth = (type, email, password) => {
        if (!email || !password) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const userData = {
            id: Math.random().toString(36).substr(2, 9),
            username: email.split('@')[0]
        };
        
        setUser(userData);
        setShowAuth(false);
        
        console.log(`${type} attempt:`, { email, password });
    };

    const handleGoogleAuth = () => {
        const userData = {
            id: 'google-' + Math.random().toString(36).substr(2, 9),
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
        localStorage.removeItem('lol_analyzer_teams');
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
        
        console.log('Creating team:', newTeam);
    };

    const deleteTeam = (teamId) => {
        const teamToDelete = teams.find(t => t.id === teamId);
        if (!teamToDelete) return;
        
        if (teamToDelete.owner !== user.id) {
            alert('Seul le propriétaire peut supprimer l\'équipe');
            return;
        }
        
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${teamToDelete.name}" ? Cette action est irréversible.`)) {
            const updatedTeams = teams.filter(t => t.id !== teamId);
            setTeams(updatedTeams);
            
            if (selectedTeam && selectedTeam.id === teamId) {
                setSelectedTeam(null);
                setTeamView('team');
            }
            
            console.log('Team deleted:', teamToDelete);
        }
    };

    const invitePlayer = async (playerInput, mode = 'riot') => {
        if (!playerInput.trim()) {
            alert('Veuillez entrer un pseudo');
            return;
        }

        if (!selectedTeam) {
            alert('Aucune équipe sélectionnée');
            return;
        }
        
        if (mode === 'manual') {
            // Mode manuel
            const existingPlayer = selectedTeam.players.find(p => 
                p.username.toLowerCase() === playerInput.toLowerCase()
            );
            
            if (existingPlayer) {
                alert('Ce joueur est déjà dans l\'équipe');
                return;
            }
            
            const newPlayer = {
                id: Math.random().toString(36).substr(2, 9),
                username: playerInput,
                role: 'player',
                rank: 'N/A',
                riotId: 'N/A',
                status: 'active',
                summonerLevel: null,
                puuid: null,
                isManual: true
            };
            
            const updatedTeam = {
                ...selectedTeam,
                players: [...selectedTeam.players, newPlayer]
            };
            
            const updatedTeams = teams.map(t => t.id === selectedTeam.id ? updatedTeam : t);
            setTeams(updatedTeams);
            setSelectedTeam(updatedTeam);
            setShowInvitePlayer(false);
            
            console.log('Manual player added:', newPlayer);
            return;
        }
        
        if (mode === 'riot') {
            // Mode Riot - validation du format
            if (!playerInput.includes('#')) {
                alert('Format requis: Pseudo#TAG (ex: MonPseudo#EUW)');
                return;
            }

            const existingPlayer = selectedTeam.players.find(p => 
                p.riotId === playerInput
            );
            
            if (existingPlayer) {
                alert('Ce Riot ID est déjà dans l\'équipe');
                return;
            }

            // Ajouter le joueur avec Riot ID
            const newPlayer = {
                id: Math.random().toString(36).substr(2, 9),
                username: playerInput.split('#')[0],
                role: 'player',
                rank: 'Unranked',
                riotId: playerInput,
                status: 'active',
                summonerLevel: null,
                puuid: null,
                isManual: false
            };
            
            const updatedTeam = {
                ...selectedTeam,
                players: [...selectedTeam.players, newPlayer]
            };
            
            const updatedTeams = teams.map(t => t.id === selectedTeam.id ? updatedTeam : t);
            setTeams(updatedTeams);
            setSelectedTeam(updatedTeam);
            setShowInvitePlayer(false);
            
            console.log('Riot player added:', newPlayer);
        }
    };

    const removePlayer = (playerId) => {
        if (!selectedTeam) return;
        
        const playerToRemove = selectedTeam.players.find(p => p.id === playerId);
        if (playerToRemove?.role === 'owner') {
            alert('Impossible de supprimer le propriétaire');
            return;
        }
        
        if (window.confirm(`Êtes-vous sûr de vouloir retirer ${playerToRemove.username} ?`)) {
            const updatedTeam = {
                ...selectedTeam,
                players: selectedTeam.players.filter(p => p.id !== playerId)
            };
            
            const updatedTeams = teams.map(t => t.id === selectedTeam.id ? updatedTeam : t);
            setTeams(updatedTeams);
            setSelectedTeam(updatedTeam);
            
            console.log('Player removed:', playerToRemove);
        }
    };

    // NOUVELLE FONCTION - Import amélioré avec parser JSON
    const importMatch = (jsonData) => {
        if (!selectedTeam) {
            alert('Aucune équipe sélectionnée');
            return;
        }
        
        try {
            // Obtenir les pseudos des membres de l'équipe
            const teamPseudos = selectedTeam.players
                .filter(p => p.riotId && p.riotId !== 'N/A')
                .map(p => p.riotId);

            console.log('Team pseudos for parsing:', teamPseudos);

            // Parser le JSON avec notre service
            const parseResult = JSONParserService.parseMatchJSON(jsonData, teamPseudos);
            
            if (!parseResult.success) {
                alert(`Erreur de parsing: ${parseResult.error}`);
                console.error('Parse error:', parseResult);
                return;
            }

            // Créer le nouveau match avec les données parsées
            const newMatch = {
                id: Math.random().toString(36).substr(2, 9),
                ...parseResult.data,
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
            
            // Message de succès plus détaillé
            const summary = JSONParserService.getMatchSummary(parseResult.data);
            alert(`Partie importée avec succès !
📊 ${parseResult.data.playersCount} joueurs trouvés
⏱️ Durée: ${summary?.duration || 'N/A'}min
🎯 Résultat: ${summary?.result || 'N/A'}
🔵 Side: ${summary?.side || 'N/A'}`);
            
            console.log('Match imported with enhanced parser:', newMatch);
            console.log('Match summary:', summary);
            
        } catch (error) {
            console.error('Error importing match:', error);
            alert('Erreur lors de l\'import de la partie: ' + error.message);
        }
    };

    return {
        // États
        user,
        teams,
        selectedTeam,
        teamView,
        showAuth,
        showCreateTeam,
        showInvitePlayer,
        showImportMatch,
        addPlayerMode,
        
        // Setters
        setUser,
        setTeams,
        setSelectedTeam,
        setTeamView,
        setShowAuth,
        setShowCreateTeam,
        setShowInvitePlayer,
        setShowImportMatch,
        setAddPlayerMode,
        
        // Actions
        handleAuth,
        handleGoogleAuth,
        handleLogout,
        createTeam,
        deleteTeam,
        invitePlayer,
        removePlayer,
        importMatch
    };
};

export default useTeamData;