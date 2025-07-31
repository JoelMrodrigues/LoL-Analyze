// Service pour communiquer avec l'API backend

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Fonction utilitaire pour faire des requêtes HTTP
 */
async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erreur HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Erreur API ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Tester si l'API backend est accessible
 */
export async function testApiConnection() {
  try {
    const result = await makeRequest('/test');
    console.log('✅ API Backend connectée:', result.message);
    return result;
  } catch (error) {
    console.error('❌ API Backend non accessible:', error.message);
    throw new Error('API Backend non accessible. Vérifiez que le serveur est démarré.');
  }
}

/**
 * Traiter une seule URL de draft
 * @param {string} url - URL de la draft drafter.lol
 * @returns {Promise<Object>} - Données de la draft
 */
export async function processSingleDraft(url) {
  try {
    console.log(`🔄 Envoi à l'API: ${url}`);
    
    const result = await makeRequest('/process-draft', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });

    console.log('✅ Réponse API reçue:', result.data);
    return result.data;
    
  } catch (error) {
    console.error('❌ Erreur traitement draft:', error);
    throw error;
  }
}

/**
 * Traiter plusieurs URLs de drafts
 * @param {Array<string>} urls - Tableau d'URLs
 * @returns {Promise<Array>} - Résultats pour chaque URL
 */
export async function processMultipleDrafts(urls) {
  try {
    console.log(`🔄 Envoi de ${urls.length} URL(s) à l'API`);
    
    const result = await makeRequest('/process-multiple-drafts', {
      method: 'POST',
      body: JSON.stringify({ urls }),
    });

    console.log(`✅ API a traité ${result.processed} draft(s) avec ${result.errors} erreur(s)`);
    return result;
    
  } catch (error) {
    console.error('❌ Erreur traitement multiple:', error);
    throw error;
  }
}

/**
 * Vérifier le statut de l'API
 */
export async function getApiStatus() {
  try {
    const result = await testApiConnection();
    return {
      online: true,
      message: result.message,
      timestamp: result.timestamp
    };
  } catch (error) {
    return {
      online: false,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}