const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Charger le mapping champions (vérifier si le fichier existe)
let championIdToName = {};
try {
  const championMapPath = path.join(__dirname, 'champion-id-map.json');
  if (fs.existsSync(championMapPath)) {
    championIdToName = JSON.parse(fs.readFileSync(championMapPath, 'utf8'));
    console.log('✅ Mapping des champions chargé');
  } else {
    console.warn('⚠️ Fichier champion-id-map.json non trouvé');
  }
} catch (error) {
  console.error('❌ Erreur chargement mapping champions:', error.message);
}

/**
 * Fonction principale pour traiter une URL de draft
 * @param {string} url - URL de la draft drafter.lol
 * @returns {Object} - Données extraites de la draft
 */
async function processDraftUrl(url) {
  console.log(`🔍 Début traitement: ${url}`);
  
  let browser;
  
  try {
    // Lancer Puppeteer
    browser = await puppeteer.launch({ 
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ] 
    });
    
    const page = await browser.newPage();
    
    // Aller sur la page
    console.log('🌐 Navigation vers la page...');
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Extraire les noms des équipes
    console.log('👥 Extraction des noms d\'équipes...');
    const teamNames = await page.evaluate(() => {
      const blueSpan = document.querySelector('.text-blueRole');
      const redSpan = document.querySelector('.text-redRole');
      return {
        team1Name: blueSpan?.textContent?.trim() || '',
        team2Name: redSpan?.textContent?.trim() || ''
      };
    });
    
    // Extraire les IDs des bans
    console.log('🚫 Extraction des bans...');
    const banIds = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img[alt="ban"]'));
      return images
        .map(img => {
          const match = img.src.match(/champion-icons%2F(\d+)\.png/);
          return match ? match[1] : null;
        })
        .filter(Boolean);
    });
    
    console.log(`📊 ${banIds.length} bans trouvés`);
    
    // Convertir les IDs en noms de champions
    const team1Bans = banIds.slice(0, 5).map(id => championIdToName[id] || `Champion_${id}`);
    const team2Bans = banIds.slice(5, 10).map(id => championIdToName[id] || `Champion_${id}`);
    
    // Vérifier si on a des erreurs (noms d'équipes manquants)
    const hasError = !teamNames.team1Name || !teamNames.team2Name;
    const errorMessage = hasError ? 'Noms d\'équipes manquants' : null;
    
    const result = {
      url,
      team1Name: teamNames.team1Name,
      team2Name: teamNames.team2Name,
      team1Bans,
      team2Bans,
      hasError,
      errorMessage,
      totalBans: banIds.length,
      extractedAt: new Date().toISOString()
    };
    
    console.log('✅ Extraction terminée:', {
      team1: `${result.team1Name} (${team1Bans.length} bans)`,
      team2: `${result.team2Name} (${team2Bans.length} bans)`,
      hasError: result.hasError
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction:', error);
    throw new Error(`Erreur scraping: ${error.message}`);
  } finally {
    // Toujours fermer le navigateur
    if (browser) {
      await browser.close();
      console.log('🔒 Navigateur fermé');
    }
  }
}

/**
 * Fonction pour traiter plusieurs URLs (votre logique actuelle)
 * @param {Array} urls - Tableau d'URLs
 * @returns {Array} - Résultats pour chaque URL
 */
async function processMultipleUrls(urls) {
  console.log(`🔍 Traitement de ${urls.length} URL(s)`);
  
  const results = [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      console.log(`📝 Traitement ${i + 1}/${urls.length}: ${url}`);
      const result = await processDraftUrl(url);
      results.push(result);
      
      // Petite pause entre les requêtes pour ne pas surcharger le site
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${url}:`, error.message);
      // Continuer avec les autres URLs même si une échoue
      results.push({
        url,
        error: error.message,
        hasError: true,
        extractedAt: new Date().toISOString()
      });
    }
  }
  
  return results;
}

/**
 * Fonction utilitaire pour vérifier si une équipe est "Exalty"
 * @param {string} teamName - Nom de l'équipe
 * @returns {boolean} - true si c'est une variante d'Exalty
 */
function isExaltyTeam(teamName) {
  if (!teamName) return false;
  const name = teamName.toLowerCase();
  return name.includes('exalty') || 
         name.includes('exal') || 
         name === 'ex' || 
         name.includes('exty');
}

// Exporter les fonctions
module.exports = {
  processDraftUrl,
  processMultipleUrls,
  isExaltyTeam
};