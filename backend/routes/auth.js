import express from 'express';
import Joi from 'joi';
import User from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = express.Router();

// Schémas de validation Joi
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// POST /api/auth/register - Inscription
router.post('/register', asyncHandler(async (req, res) => {
  // Validation des données
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  const { username, email, password } = value;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw createError.conflict('Cet email est déjà utilisé');
    }
    if (existingUser.username === username) {
      throw createError.conflict('Ce nom d\'utilisateur est déjà pris');
    }
  }

  // Créer le nouvel utilisateur
  const user = new User({
    username,
    email,
    password // Le hachage est fait automatiquement par le middleware pre-save
  });

  await user.save();

  // Générer le token
  const token = generateToken(user._id);

  // Réponse (sans le mot de passe)
  res.status(201).json({
    status: 'success',
    message: 'Compte créé avec succès',
    data: {
      token,
      user: user.getPublicProfile()
    }
  });
}));

// POST /api/auth/login - Connexion
router.post('/login', asyncHandler(async (req, res) => {
  // Validation des données
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  const { email, password } = value;

  // Trouver l'utilisateur (avec le mot de passe pour la comparaison)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !user.isActive) {
    throw createError.unauthorized('Email ou mot de passe incorrect');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createError.unauthorized('Email ou mot de passe incorrect');
  }

  // Mettre à jour la date de dernière connexion
  user.lastLogin = new Date();
  await user.save();

  // Générer le token
  const token = generateToken(user._id);

  res.json({
    status: 'success',
    message: 'Connexion réussie',
    data: {
      token,
      user: user.getPublicProfile()
    }
  });
}));

// GET /api/auth/me - Obtenir les infos de l'utilisateur connecté
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user.getPublicProfile()
    }
  });
}));

// POST /api/auth/refresh - Rafraîchir le token
router.post('/refresh', authenticateToken, asyncHandler(async (req, res) => {
  const newToken = generateToken(req.user._id);
  
  res.json({
    status: 'success',
    data: {
      token: newToken
    }
  });
}));

// POST /api/auth/logout - Déconnexion (côté client principalement)
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // En réalité, avec JWT, la déconnexion se fait côté client
  // Ici on peut juste confirmer la déconnexion
  res.json({
    status: 'success',
    message: 'Déconnexion réussie'
  });
}));

// PATCH /api/auth/password - Changer le mot de passe
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

router.patch('/password', authenticateToken, asyncHandler(async (req, res) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  const { currentPassword, newPassword } = value;

  // Récupérer l'utilisateur avec le mot de passe
  const user = await User.findById(req.userId).select('+password');
  
  // Vérifier le mot de passe actuel
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw createError.unauthorized('Mot de passe actuel incorrect');
  }

  // Mettre à jour le mot de passe
  user.password = newPassword;
  await user.save();

  res.json({
    status: 'success',
    message: 'Mot de passe modifié avec succès'
  });
}));

// DELETE /api/auth/account - Supprimer le compte
router.delete('/account', authenticateToken, asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw createError.badRequest('Mot de passe requis pour supprimer le compte');
  }

  // Récupérer l'utilisateur avec le mot de passe
  const user = await User.findById(req.userId).select('+password');
  
  // Vérifier le mot de passe
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createError.unauthorized('Mot de passe incorrect');
  }

  // Désactiver le compte au lieu de le supprimer
  user.isActive = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  user.username = `deleted_${Date.now()}_${user.username}`;
  await user.save();

  res.json({
    status: 'success',
    message: 'Compte supprimé avec succès'
  });
}));

export default router;