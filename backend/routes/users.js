import express from 'express';
import Joi from 'joi';
import User from '../models/User.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = express.Router();

// Schémas de validation
const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).optional(),
  avatar: Joi.string().uri().optional(),
  preferences: Joi.object({
    theme: Joi.string().valid('dark', 'light').optional(),
    notifications: Joi.boolean().optional(),
    publicProfile: Joi.boolean().optional()
  }).optional()
});

// GET /api/users/profile - Obtenir le profil complet
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)
    .populate('teams', 'name description membersCount')
    .select('-password');

  if (!user) {
    throw createError.notFound('Utilisateur non trouvé');
  }

  res.json({
    status: 'success',
    data: {
      user: {
        ...user.getPublicProfile(),
        teams: user.teams,
        preferences: user.preferences,
        riotAccounts: user.riotAccounts
      }
    }
  });
}));

// PATCH /api/users/profile - Mettre à jour le profil
router.patch('/profile', asyncHandler(async (req, res) => {
  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  const user = await User.findById(req.userId);
  if (!user) {
    throw createError.notFound('Utilisateur non trouvé');
  }

  // Vérifier si le username est déjà pris
  if (value.username && value.username !== user.username) {
    const existingUser = await User.findOne({ 
      username: value.username,
      _id: { $ne: req.userId }
    });
    
    if (existingUser) {
      throw createError.conflict('Ce nom d\'utilisateur est déjà pris');
    }
  }

  // Mettre à jour les champs
  Object.assign(user, value);
  await user.save();

  res.json({
    status: 'success',
    message: 'Profil mis à jour avec succès',
    data: {
      user: user.getPublicProfile()
    }
  });
}));

// GET /api/users/stats - Statistiques utilisateur
router.get('/stats', asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)
    .populate('teams')
    .select('-password');

  if (!user) {
    throw createError.notFound('Utilisateur non trouvé');
  }

  const stats = {
    totalTeams: user.teams.length,
    riotAccountsCount: user.riotAccounts.length,
    mainAccount: user.getMainRiotAccount(),
    memberSince: user.createdAt,
    lastLogin: user.lastLogin
  };

  res.json({
    status: 'success',
    data: { stats }
  });
}));

// GET /api/users/search/:username - Rechercher un utilisateur public
router.get('/search/:username', asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ 
    username: { $regex: new RegExp(username, 'i') },
    'preferences.publicProfile': true,
    isActive: true
  }).select('username avatar riotAccounts createdAt');

  if (!user) {
    throw createError.notFound('Utilisateur non trouvé ou profil privé');
  }

  res.json({
    status: 'success',
    data: {
      user: user.getPublicProfile()
    }
  });
}));

export default router;