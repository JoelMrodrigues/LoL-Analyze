import express from 'express';
import Joi from 'joi';
import riotService from '../services/riotService.js';
import User from '../models/User.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = express.Router();

// Schémas de validation
const riotIdSchema = Joi.object({
  gameName: Joi.string().min(1).max(16).required(),
  tagLine: Joi.string().min(1).max(5).required()
});

const profileSearchSchema = Joi.object({
  gameName: Joi.string().min(1).max(16).required(),
  tagLine: Joi.string().min(1).max(5).required(),
  queue: Joi.number().integer().optional(),
  matchCount: Joi.number().integer().min(1).max(50).default(10)
});

// GET /api/riot/search/:gameName/:tagLine - Recherche de profil
router.get('/search/:gameName/:tagLine', asyncHandler(async (req, res) => {
  const { gameName, tagLine } = req.params;
  const { queue, matchCount = 10 } = req.query;

  // Validation
  const { error } = riotIdSchema.validate({ gameName, tagLine });
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  try {
    const profile = await riotService.getCompleteProfile(gameName, tagLine, {
      queue: queue ? parseInt(queue) : null,
      matchCount: parseInt(matchCount)
    });

    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    throw error;
  }
}));

// GET /api/riot/basic/:gameName/:tagLine - Recherche basique (sans matchs)
router.get('/basic/:gameName/:tagLine', asyncHandler(async (req, res) => {
  const { gameName, tagLine } = req.params;

  // Validation
  const { error } = riotIdSchema.validate({ gameName, tagLine });
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  try {
    const profile = await riotService.getBasicProfile(gameName, tagLine);

    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    throw error;
  }
}));

// POST /api/riot/verify - Vérifier si un joueur existe
router.post('/verify', asyncHandler(async (req, res) => {
  const { gameName, tagLine } = req.body;

  // Validation
  const { error } = riotIdSchema.validate({ gameName, tagLine });
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  try {
    const exists = await riotService.playerExists(gameName, tagLine);

    res.json({
      status: 'success',
      data: {
        exists,
        gameName,
        tagLine
      }
    });
  } catch (error) {
    throw error;
  }
}));

// POST /api/riot/link-account - Lier un compte Riot à l'utilisateur
router.post('/link-account', asyncHandler(async (req, res) => {
  const { gameName, tagLine } = req.body;

  // Validation
  const { error } = riotIdSchema.validate({ gameName, tagLine });
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  try {
    // Récupérer les infos complètes du compte
    const profile = await riotService.getBasicProfile(gameName, tagLine);

    // Ajouter le compte à l'utilisateur
    const accountData = {
      gameName: profile.gameName,
      tagLine: profile.tagLine,
      puuid: profile.puuid,
      summonerLevel: profile.summonerLevel,
      profileIcon: profile.profileIconId,
      rank: profile.rank
    };

    await req.user.addRiotAccount(accountData);

    res.json({
      status: 'success',
      message: 'Compte Riot lié avec succès',
      data: {
        account: accountData
      }
    });
  } catch (error) {
    throw error;
  }
}));

// DELETE /api/riot/unlink-account/:puuid - Délier un compte Riot
router.delete('/unlink-account/:puuid', asyncHandler(async (req, res) => {
  const { puuid } = req.params;

  const user = await User.findById(req.userId);
  
  // Trouver le compte à supprimer
  const accountIndex = user.riotAccounts.findIndex(
    account => account.puuid === puuid
  );

  if (accountIndex === -1) {
    throw createError.notFound('Compte Riot non trouvé');
  }

  // Ne pas supprimer le compte principal s'il est le seul
  const account = user.riotAccounts[accountIndex];
  if (account.isMain && user.riotAccounts.length === 1) {
    throw createError.badRequest('Impossible de supprimer le seul compte principal');
  }

  // Supprimer le compte
  user.riotAccounts.splice(accountIndex, 1);

  // Si c'était le compte principal, définir un nouveau principal
  if (account.isMain && user.riotAccounts.length > 0) {
    user.riotAccounts[0].isMain = true;
  }

  await user.save();

  res.json({
    status: 'success',
    message: 'Compte Riot délié avec succès'
  });
}));

// PATCH /api/riot/set-main/:puuid - Définir un compte comme principal
router.patch('/set-main/:puuid', asyncHandler(async (req, res) => {
  const { puuid } = req.params;

  const user = await User.findById(req.userId);
  
  // Trouver le compte à définir comme principal
  const targetAccount = user.riotAccounts.find(
    account => account.puuid === puuid
  );

  if (!targetAccount) {
    throw createError.notFound('Compte Riot non trouvé');
  }

  // Retirer le statut principal de tous les comptes
  user.riotAccounts.forEach(account => {
    account.isMain = false;
  });

  // Définir le nouveau compte principal
  targetAccount.isMain = true;

  await user.save();

  res.json({
    status: 'success',
    message: 'Compte principal modifié avec succès',
    data: {
      mainAccount: {
        gameName: targetAccount.gameName,
        tagLine: targetAccount.tagLine,
        puuid: targetAccount.puuid
      }
    }
  });
}));

// GET /api/riot/match/:matchId - Détails d'un match
router.get('/match/:matchId', asyncHandler(async (req, res) => {
  const { matchId } = req.params;

  if (!matchId || !matchId.startsWith('EUW1_')) {
    throw createError.badRequest('ID de match invalide');
  }

  try {
    const matchDetails = await riotService.getMatchDetails(matchId);

    res.json({
      status: 'success',
      data: matchDetails
    });
  } catch (error) {
    throw error;
  }
}));

// GET /api/riot/matches/:puuid - Historique des matchs d'un joueur
router.get('/matches/:puuid', asyncHandler(async (req, res) => {
  const { puuid } = req.params;
  const { queue, type, start = 0, count = 20 } = req.query;

  if (!puuid) {
    throw createError.badRequest('PUUID requis');
  }

  try {
    const matchIds = await riotService.getMatchIdsByPuuid(puuid, {
      queue: queue ? parseInt(queue) : null,
      type,
      start: parseInt(start),
      count: Math.min(parseInt(count), 100) // Limite à 100
    });

    res.json({
      status: 'success',
      data: {
        matchIds,
        pagination: {
          start: parseInt(start),
          count: matchIds.length,
          hasMore: matchIds.length === parseInt(count)
        }
      }
    });
  } catch (error) {
    throw error;
  }
}));

// POST /api/riot/update-account/:puuid - Mettre à jour un compte Riot
router.post('/update-account/:puuid', asyncHandler(async (req, res) => {
  const { puuid } = req.params;

  const user = await User.findById(req.userId);
  
  // Trouver le compte à mettre à jour
  const account = user.riotAccounts.find(acc => acc.puuid === puuid);

  if (!account) {
    throw createError.notFound('Compte Riot non trouvé');
  }

  try {
    // Récupérer les nouvelles données
    const updatedProfile = await riotService.getBasicProfile(
      account.gameName, 
      account.tagLine
    );

    // Mettre à jour les données
    account.summonerLevel = updatedProfile.summonerLevel;
    account.profileIcon = updatedProfile.profileIconId;
    account.rank = updatedProfile.rank;
    account.lastUpdated = new Date();

    await user.save();

    res.json({
      status: 'success',
      message: 'Compte mis à jour avec succès',
      data: {
        account: {
          gameName: account.gameName,
          tagLine: account.tagLine,
          summonerLevel: account.summonerLevel,
          rank: account.rank,
          lastUpdated: account.lastUpdated
        }
      }
    });
  } catch (error) {
    throw error;
  }
}));

// GET /api/riot/user-accounts - Obtenir tous les comptes Riot de l'utilisateur
router.get('/user-accounts', asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  res.json({
    status: 'success',
    data: {
      accounts: user.riotAccounts.map(account => ({
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine,
        summonerLevel: account.summonerLevel,
        profileIcon: account.profileIcon,
        rank: account.rank,
        isMain: account.isMain,
        lastUpdated: account.lastUpdated
      }))
    }
  });
}));

// Middleware de gestion d'erreur spécifique aux routes Riot
router.use((error, req, res, next) => {
  // Si c'est une erreur de notre service Riot, la formatter
  if (error.code && error.code.startsWith('RIOT_API_')) {
    return res.status(error.status || 500).json({
      status: 'error',
      message: error.message,
      code: error.code,
      service: 'riot-api'
    });
  }
  
  next(error);
});

export default router;