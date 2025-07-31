const express = require('express');
const cors = require('cors');
const { processDraftUrl } = require('./scraper');

// Créer l'application Express
const app = express();
const PORT = 3001; // Port différent de React (3000)

// Middleware
app.use(cors()); // Permet à React de communiquer avec l'API
app.use(express.json()); // Permet de recevoir du JSON

// Route de test pour vérifier que l'API fonctionne
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API Backend fonctionne !', 
    timestamp: new Date().toISOString() 
  });
});

// Route principale pour traiter une URL de draft
app.post('/api/process-draft', async (req, res) => {
  try {
    console.log('📥 Nouvelle demande de traitement de draft');
    
    // Récupérer l'URL depuis la requête
    const { url } = req.body;
    
    // Vérifications
    if (!url) {
      return res.status(400).json({ 
        error: 'URL manquante',
        message: 'Veuillez fournir une URL de draft' 
      });
    }
    
    if (!url.includes('drafter.lol/draft/')) {
      return res.status(400).json({ 
        error: 'URL invalide',
        message: 'Veuillez utiliser une URL drafter.lol valide' 
      });
    }
    
    console.log(`🔍 Traitement de l'URL: ${url}`);
    
    // Appeler votre script de scraping
    const result = await processDraftUrl(url);
    
    console.log(`✅ Traitement terminé pour: ${url}`);
    
    // Retourner les résultats
    res.json({
      success: true,
      data: result,
      processedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du traitement:', error);
    
    res.status(500).json({
      error: 'Erreur de traitement',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Route pour traiter plusieurs URLs en une fois
app.post('/api/process-multiple-drafts', async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ 
        error: 'URLs manquantes',
        message: 'Veuillez fournir un tableau d\'URLs' 
      });
    }
    
    console.log(`🔍 Traitement de ${urls.length} URL(s)`);
    
    const results = [];
    const errors = [];
    
    // Traiter chaque URL une par une (pour éviter de surcharger le serveur)
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        console.log(`📝 Traitement ${i + 1}/${urls.length}: ${url}`);
        const result = await processDraftUrl(url);
        results.push(result);
      } catch (error) {
        console.error(`❌ Erreur pour ${url}:`, error.message);
        errors.push({ url, error: error.message });
      }
    }
    
    res.json({
      success: true,
      processed: results.length,
      errors: errors.length,
      data: results,
      errorDetails: errors,
      processedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur globale:', error);
    res.status(500).json({
      error: 'Erreur de traitement global',
      message: error.message
    });
  }
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.originalUrl} n'existe pas`,
    availableRoutes: [
      'GET /api/test',
      'POST /api/process-draft',
      'POST /api/process-multiple-drafts'
    ]
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log('🚀 Serveur API démarré !');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log('⏱️ ', new Date().toLocaleString());
});

// Gestion propre de l'arrêt du serveur
process.on('SIGINT', () => {
  console.log('\n⏹️  Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Arrêt du serveur...');
  process.exit(0);
});