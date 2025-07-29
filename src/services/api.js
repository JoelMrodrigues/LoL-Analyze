import axios from 'axios';

// Configuration de base
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lol_analyzer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    // Si un nouveau token est fourni, le sauvegarder
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('lol_analyzer_token', newToken);
    }
    return response;
  },
  (error) => {
    // Déconnexion automatique si token expiré
    if (error.response?.status === 401) {
      localStorage.removeItem('lol_analyzer_token');
      localStorage.removeItem('lol_analyzer_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Inscription
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.data.token) {
      localStorage.setItem('lol_analyzer_token', response.data.data.token);
      localStorage.setItem('lol_analyzer_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Connexion
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('lol_analyzer_token', response.data.data.token);
      localStorage.setItem('lol_analyzer_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Déconnexion
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('lol_analyzer_token');
      localStorage.removeItem('lol_analyzer_user');
    }
  },

  // Obtenir les infos utilisateur
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  // Vérifier si connecté
  isAuthenticated() {
    return !!localStorage.getItem('lol_analyzer_token');
  },

  // Obtenir l'utilisateur stocké
  getStoredUser() {
    const user = localStorage.getItem('lol_analyzer_user');
    return user ? JSON.parse(user) : null;
  }
};

// Service Riot API
export const riotService = {
  // Recherche de profil complet
  async searchProfile(gameName, tagLine, options = {}) {
    const { queue, matchCount = 10 } = options;
    const params = new URLSearchParams();
    if (queue) params.append('queue', queue);
    if (matchCount) params.append('matchCount', matchCount);
    
    const response = await api.get(`/riot/search/${gameName}/${tagLine}?${params}`);
    return response.data.data;
  },

  // Recherche basique (sans matchs)
  async getBasicProfile(gameName, tagLine) {
    const response = await api.get(`/riot/basic/${gameName}/${tagLine}`);
    return response.data.data;
  },

  // Vérifier si un joueur existe
  async verifyPlayer(gameName, tagLine) {
    const response = await api.post('/riot/verify', { gameName, tagLine });
    return response.data.data;
  },

  // Lier un compte Riot
  async linkAccount(gameName, tagLine) {
    const response = await api.post('/riot/link-account', { gameName, tagLine });
    return response.data;
  },

  // Délier un compte Riot
  async unlinkAccount(puuid) {
    const response = await api.delete(`/riot/unlink-account/${puuid}`);
    return response.data;
  },

  // Définir compte principal
  async setMainAccount(puuid) {
    const response = await api.patch(`/riot/set-main/${puuid}`);
    return response.data;
  },

  // Obtenir tous les comptes de l'utilisateur
  async getUserAccounts() {
    const response = await api.get('/riot/user-accounts');
    return response.data.data.accounts;
  },

  // Mettre à jour un compte
  async updateAccount(puuid) {
    const response = await api.post(`/riot/update-account/${puuid}`);
    return response.data;
  },

  // Détails d'un match
  async getMatchDetails(matchId) {
    const response = await api.get(`/riot/match/${matchId}`);
    return response.data.data;
  }
};

// Service équipes
export const teamService = {
  // Obtenir toutes les équipes
  async getTeams() {
    const response = await api.get('/teams');
    return response.data.data.teams;
  },

  // Obtenir une équipe spécifique
  async getTeam(teamId) {
    const response = await api.get(`/teams/${teamId}`);
    return response.data.data;
  },

  // Créer une équipe
  async createTeam(teamData) {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  // Modifier une équipe
  async updateTeam(teamId, teamData) {
    const response = await api.patch(`/teams/${teamId}`, teamData);
    return response.data;
  },

  // Supprimer une équipe
  async deleteTeam(teamId) {
    const response = await api.delete(`/teams/${teamId}`);
    return response.data;
  },

  // Ajouter un membre
  async addMember(teamId, memberData) {
    const response = await api.post(`/teams/${teamId}/members`, memberData);
    return response.data;
  },

  // Supprimer un membre
  async removeMember(teamId, memberId) {
    const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
    return response.data;
  },

  // Modifier un membre
  async updateMember(teamId, memberId, memberData) {
    const response = await api.patch(`/teams/${teamId}/members/${memberId}`, memberData);
    return response.data;
  },

  // Importer un match
  async importMatch(teamId, matchData) {
    const response = await api.post(`/teams/${teamId}/matches/import`, matchData);
    return response.data;
  },

  // Obtenir les matchs d'une équipe
  async getTeamMatches(teamId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const response = await api.get(`/teams/${teamId}/matches?page=${page}&limit=${limit}`);
    return response.data.data;
  }
};

// Utilitaires
export const apiUtils = {
  // Gestion centralisée des erreurs
  handleError(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Une erreur inattendue s\'est produite';
  },

  // Formater les erreurs de validation
  formatValidationErrors(error) {
    if (error.response?.data?.details) {
      return error.response.data.details;
    }
    return this.handleError(error);
  }
};

export default api;