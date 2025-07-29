import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware d'authentification JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token d\'accès requis'
      });
    }

    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupération de l'utilisateur
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Utilisateur non trouvé ou inactif'
      });
    }

    // Ajout des infos utilisateur à la requête
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expiré'
      });
    }

    console.error('Erreur authentification:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur interne du serveur'
    });
  }
};

// Middleware pour vérifier les rôles (optionnel)
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentification requise'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

// Middleware pour vérifier la propriété d'une ressource
export const requireOwnership = (Model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          status: 'error',
          message: 'Ressource non trouvée'
        });
      }

      // Vérifier si l'utilisateur est propriétaire
      if (resource.owner && resource.owner.toString() !== req.userId.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'Accès interdit - Vous n\'êtes pas propriétaire de cette ressource'
        });
      }

      // Ajouter la ressource à la requête
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Erreur vérification propriété:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  };
};

// Générer un token JWT
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'lol-analyzer-api',
      audience: 'lol-analyzer-client'
    }
  );
};

// Middleware pour rafraîchir le token automatiquement
export const refreshTokenIfNeeded = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.decode(token);
    const now = Date.now() / 1000;
    
    // Si le token expire dans moins d'1 heure, en générer un nouveau
    if (decoded.exp - now < 3600) {
      const newToken = generateToken(decoded.userId);
      res.setHeader('X-New-Token', newToken);
    }

    next();
  } catch (error) {
    // En cas d'erreur, continuer sans rafraîchir
    next();
  }
};