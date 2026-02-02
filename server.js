/**
 * Serveur de Licence - Exemple Prêt à Déployer
 * 
 * Ce serveur peut être déployé sur Railway, Render, Fly.io, etc.
 * 
 * Pour déployer :
 * 1. Créez un compte sur Railway.app ou Render.com
 * 2. Créez un nouveau projet
 * 3. Connectez votre repo GitHub
 * 4. Le service détectera automatiquement Node.js et déploiera
 */

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ⚠️ ATTENTION : En production, utilisez une vraie base de données (PostgreSQL, MongoDB, etc.)
// Cette Map en mémoire sera perdue au redémarrage du serveur
// Railway et Render offrent des bases de données PostgreSQL gratuites
const licenses = new Map();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Route de santé (pour vérifier que le serveur fonctionne)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    licensesCount: licenses.size 
  });
});

/**
 * Endpoint d'ACTIVATION de licence
 * POST /api/license/activate
 * 
 * Body: {
 *   licenseKey: string,
 *   hardwareId: string,
 *   activationDate: string (ISO format)
 * }
 */
app.post('/api/license/activate', async (req, res) => {
  try {
    const { licenseKey, hardwareId, activationDate } = req.body;

    // Validation des données
    if (!licenseKey || !hardwareId) {
      return res.status(400).json({
        valid: false,
        message: 'licenseKey et hardwareId sont requis'
      });
    }

    // Vérifier si la licence existe déjà
    if (licenses.has(licenseKey)) {
      const existing = licenses.get(licenseKey);
      
      // Si la licence a été pré-activée, permettre la réactivation avec le vrai hardwareId
      if (existing.hardwareId === 'PRE-ACTIVATED' || existing.hardwareId === 'pre-activation-test') {
        console.log(`🔄 Réactivation de la clé pré-activée avec le vrai hardwareId: ${licenseKey.substring(0, 8)}...`);
        
        // ⚠️ IMPORTANT : Préserver l'expiration originale définie lors de la pré-activation
        // Si expirationDays est fourni, recalculer l'expiration (pour permettre de modifier la durée)
        // Sinon, conserver l'expiration originale qui a été définie avec la bonne durée lors de la pré-activation
        if (req.body.expirationDays) {
          const expirationDays = req.body.expirationDays;
          const newExpiration = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);
          existing.expiration = newExpiration.toISOString();
          console.log(`📅 Expiration recalculée: ${expirationDays} jours (${newExpiration.toISOString()})`);
        } else {
          // Préserver l'expiration originale définie lors de la pré-activation
          console.log(`📅 Expiration préservée: ${existing.expiration}`);
        }
        
        // Mettre à jour avec le vrai hardwareId
        existing.hardwareId = hardwareId;
        existing.activationDate = activationDate || new Date().toISOString();
        licenses.set(licenseKey, existing);
        
        return res.json({
          valid: true,
          ...existing
        });
      }
      
      // Sinon, la licence est déjà activée sur un autre appareil
      return res.json({
        valid: false,
        message: 'Cette licence est déjà activée',
        existingHardwareId: existing.hardwareId.substring(0, 8) + '...'
      });
    }

    // Calculer l'expiration (par défaut 1 an, mais peut être passé dans le body)
    const expirationDays = req.body.expirationDays || 365;
    const expiration = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);
    
    // Créer la licence
    const licenseData = {
      licenseKey,
      hardwareId,
      activationDate: activationDate || new Date().toISOString(),
      expiration: expiration.toISOString(),
      clientId: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientName: 'Client',
      gameModes: {
        multiplayer: true,
        warzone: true,
        cdl: false
      },
      createdAt: new Date().toISOString()
    };

    licenses.set(licenseKey, licenseData);

    console.log(`✅ Licence activée: ${licenseKey.substring(0, 8)}...`);

    res.json({
      valid: true,
      ...licenseData
    });
  } catch (error) {
    console.error('❌ Erreur activation:', error);
    res.status(500).json({
      valid: false,
      message: 'Erreur serveur lors de l\'activation'
    });
  }
});

/**
 * Endpoint de VALIDATION de licence
 * POST /api/license/validate
 * 
 * Body: {
 *   licenseKey: string,
 *   hardwareId: string
 * }
 */
app.post('/api/license/validate', async (req, res) => {
  try {
    const { licenseKey, hardwareId } = req.body;

    // Validation des données
    if (!licenseKey || !hardwareId) {
      return res.status(400).json({
        valid: false,
        message: 'licenseKey et hardwareId sont requis'
      });
    }

    // Récupérer la licence
    const license = licenses.get(licenseKey);

    if (!license) {
      console.log(`❌ Licence non trouvée: ${licenseKey.substring(0, 8)}...`);
      return res.json({
        valid: false,
        message: 'Licence non trouvée'
      });
    }

    // Si la licence a été pré-activée avec "PRE-ACTIVATED", mettre à jour avec le vrai hardwareId
    if (license.hardwareId === 'PRE-ACTIVATED' || license.hardwareId === 'pre-activation-test') {
      console.log(`🔄 Mise à jour du hardwareId pour la clé pré-activée: ${licenseKey.substring(0, 8)}...`);
      license.hardwareId = hardwareId;
      license.activationDate = new Date().toISOString();
      // ⚠️ IMPORTANT : Préserver l'expiration originale définie lors de la pré-activation
      // Ne pas recalculer l'expiration ici, elle a déjà été définie avec la bonne durée
      licenses.set(licenseKey, license);
      console.log(`📅 Expiration préservée: ${license.expiration}`);
    }
    // Sinon, vérifier que l'ID matériel correspond
    else if (license.hardwareId !== hardwareId) {
      console.log(`❌ ID matériel incorrect pour: ${licenseKey.substring(0, 8)}...`);
      return res.json({
        valid: false,
        message: 'Licence liée à un autre appareil'
      });
    }

    // Vérifier l'expiration
    const now = new Date();
    const expiration = new Date(license.expiration);
    
    if (now > expiration) {
      console.log(`❌ Licence expirée: ${licenseKey.substring(0, 8)}...`);
      return res.json({
        valid: false,
        message: 'Licence expirée',
        expiration: license.expiration
      });
    }

    console.log(`✅ Licence validée: ${licenseKey.substring(0, 8)}...`);

    res.json({
      valid: true,
      ...license
    });
  } catch (error) {
    console.error('❌ Erreur validation:', error);
    res.status(500).json({
      valid: false,
      message: 'Erreur serveur lors de la validation'
    });
  }
});

/**
 * Endpoint pour lister les licences (pour debug/admin)
 * GET /api/license/list
 * ⚠️ En production, protégez cette route avec une authentification !
 */
app.get('/api/license/list', (req, res) => {
  const licenseList = Array.from(licenses.values()).map(license => ({
    licenseKey: license.licenseKey.substring(0, 8) + '...',
    hardwareId: license.hardwareId.substring(0, 8) + '...',
    clientId: license.clientId,
    activationDate: license.activationDate,
    expiration: license.expiration,
    isValid: new Date() < new Date(license.expiration)
  }));

  res.json({
    count: licenses.size,
    licenses: licenseList
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur de licence démarré sur le port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Activation: http://localhost:${PORT}/api/license/activate`);
  console.log(`📍 Validation: http://localhost:${PORT}/api/license/validate`);
});

