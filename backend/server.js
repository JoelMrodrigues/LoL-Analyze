import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import des routes
import authRoutes from './routes/auth.js';
import riotRoutes from './routes/riot.js';
import teamRoutes from './routes/teams.js';
import userRoutes from './routes/users.js';

// Import des middlewares
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lol-analyzer')
  .then(() => console.log('🗄️  MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB:', err));

// Middlewares de sécurité
app.use(helmet());
app.use(compression());

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requêtes par window
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/riot', authenticateToken, riotRoutes);
app.use('/api/teams', authenticateToken, teamRoutes);
app.use('/api/users', authenticateToken, userRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'LoL Analyzer API is running! 🎮',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Route 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`
🚀 Serveur LoL Analyzer démarré !
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
🔗 Health check: http://localhost:${PORT}/api/health
  `);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;