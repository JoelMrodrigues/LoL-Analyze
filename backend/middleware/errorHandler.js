// Gestionnaire d'erreurs centralisé
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  console.error('🚨 Erreur capturée:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      status: 'error',
      message: 'Données invalides',
      details: message
    });
  }

  // Erreur de duplication Mongoose (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(400).json({
      status: 'error',
      message: `${field} '${value}' existe déjà`,
      code: 'DUPLICATE_FIELD'
    });
  }

  // Erreur CastError Mongoose (ID invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'ID invalide',
      code: 'INVALID_ID'
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expiré',
      code: 'EXPIRED_TOKEN'
    });
  }

  // Erreur API Riot (avec notre format personnalisé)
  if (err.code && err.code.startsWith('RIOT_API_')) {
    return res.status(err.status || 500).json({
      status: 'error',
      message: err.message,
      code: err.code,
      details: err.details
    });
  }

  // Erreurs spécifiques avec statut
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message || 'Erreur serveur'
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erreur interne du serveur' 
    : err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
};

// Middleware pour les erreurs 404
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} non trouvée`);
  error.statusCode = 404;
  next(error);
};

// Wrapper pour les fonctions async
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Classe d'erreur personnalisée
export class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Erreurs prédéfinies
export const createError = {
  badRequest: (message = 'Requête invalide') => new AppError(message, 400, 'BAD_REQUEST'),
  unauthorized: (message = 'Non autorisé') => new AppError(message, 401, 'UNAUTHORIZED'),
  forbidden: (message = 'Accès interdit') => new AppError(message, 403, 'FORBIDDEN'),
  notFound: (message = 'Ressource non trouvée') => new AppError(message, 404, 'NOT_FOUND'),
  conflict: (message = 'Conflit de données') => new AppError(message, 409, 'CONFLICT'),
  tooManyRequests: (message = 'Trop de requêtes') => new AppError(message, 429, 'TOO_MANY_REQUESTS'),
  internal: (message = 'Erreur interne') => new AppError(message, 500, 'INTERNAL_ERROR')
};