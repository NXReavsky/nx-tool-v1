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
      
      // ⚠️ SÉCURITÉ : Si la licence a été pré-activée, permettre UNIQUEMENT la première activation réelle
      // Une fois activée avec un vrai hardwareId, elle est DÉFINITIVEMENT bloquée à ce PC
      if (existing.hardwareId === 'PRE-ACTIVATED' || existing.hardwareId === 'pre-activation-test') {
        console.log(`🔒 Première activation réelle de la clé pré-activée: ${licenseKey.substring(0, 8)}...`);
        console.log(`📅 Expiration AVANT activation: ${existing.expiration}`);
        console.log(`📅 expirationDays stocké: ${existing.expirationDays || 'non défini'}`);
        console.log(`🖥️ HardwareId qui sera bloqué: ${hardwareId.substring(0, 16)}...`);
        
        // ⚠️ CRITIQUE : TOUJOURS préserver l'expiration originale lors de l'activation
        // Ne JAMAIS recalculer l'expiration ici, même si expirationDays est fourni
        // L'expiration a déjà été définie correctement lors de la pré-activation
        
        // ⚠️ BLOQUER DÉFINITIVEMENT la clé au hardwareId de l'utilisateur
        // Cette clé ne pourra plus jamais être utilisée sur un autre PC
        existing.hardwareId = hardwareId;
        existing.isLocked = true; // Flag pour indiquer que la clé est verrouillée
        existing.lockedAt = new Date().toISOString(); // Date de verrouillage
        
        // ⚠️ IMPORTANT : Ne pas changer activationDate lors de l'activation
        // Garder l'activationDate originale de la pré-activation pour préserver la durée
        if (!existing.activationDate) {
          existing.activationDate = activationDate || new Date().toISOString();
        }
        licenses.set(licenseKey, existing);
        
        console.log(`✅ Clé BLOQUÉE au hardwareId: ${hardwareId.substring(0, 16)}...`);
        console.log(`📅 Expiration APRÈS activation: ${existing.expiration}`);
        
        return res.json({
          valid: true,
          ...existing
        });
      }
      
      // ⚠️ SÉCURITÉ : La licence est déjà activée et verrouillée sur un autre appareil
      // Refuser catégoriquement toute nouvelle activation
      console.log(`🚫 Tentative d'activation d'une clé déjà verrouillée: ${licenseKey.substring(0, 8)}...`);
      console.log(`   HardwareId actuel de la clé: ${existing.hardwareId.substring(0, 16)}...`);
      console.log(`   HardwareId de la tentative: ${hardwareId.substring(0, 16)}...`);
      
      return res.json({
        valid: false,
        message: 'Cette licence est déjà activée et verrouillée sur un autre appareil',
        existingHardwareId: existing.hardwareId.substring(0, 8) + '...',
        isLocked: existing.isLocked || false
      });
    }

    // Calculer l'expiration
    // ⚠️ CRITIQUE : Si expiration exacte est fournie par le générateur, l'utiliser directement
    // Sinon, calculer à partir de expirationDays (pour compatibilité)
    let expiration;
    let expirationDays;
    
    if (req.body.expiration) {
      // Utiliser l'expiration EXACTE fournie par le générateur
      expiration = new Date(req.body.expiration);
      // Calculer expirationDays à partir de l'expiration pour référence
      const now = new Date();
      expirationDays = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24));
      console.log(`📅 Création licence avec expiration EXACTE du générateur: ${expiration.toISOString()} (${expirationDays} jours)`);
    } else {
      // Fallback : calculer à partir de expirationDays
      expirationDays = req.body.expirationDays || 365;
      expiration = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);
      console.log(`📅 Création licence avec expirationDays: ${expirationDays} jours (${expiration.toISOString()})`);
    }
    
    // Créer la licence
    // ⚠️ SÉCURITÉ : Marquer la clé comme verrouillée dès sa création
    const licenseData = {
      licenseKey,
      hardwareId,
      activationDate: activationDate || new Date().toISOString(),
      expiration: expiration.toISOString(),
      expirationDays: expirationDays, // Stocker aussi expirationDays pour référence
      clientId: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientName: 'Client',
      gameModes: {
        multiplayer: true,
        warzone: true,
        cdl: false
      },
      isLocked: true, // La clé est immédiatement verrouillée au hardwareId
      lockedAt: new Date().toISOString(), // Date de verrouillage
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

    // ⚠️ SÉCURITÉ : Si la licence a été pré-activée, la bloquer au hardwareId lors de la première validation
    if (license.hardwareId === 'PRE-ACTIVATED' || license.hardwareId === 'pre-activation-test') {
      console.log(`🔒 Première validation réelle - Blocage de la clé pré-activée: ${licenseKey.substring(0, 8)}...`);
      console.log(`📅 Expiration AVANT validation: ${license.expiration}`);
      console.log(`🖥️ HardwareId qui sera bloqué: ${hardwareId.substring(0, 16)}...`);
      
      // ⚠️ BLOQUER DÉFINITIVEMENT la clé au hardwareId de l'utilisateur
      license.hardwareId = hardwareId;
      license.isLocked = true; // Flag pour indiquer que la clé est verrouillée
      license.lockedAt = new Date().toISOString(); // Date de verrouillage
      
      // ⚠️ IMPORTANT : Ne pas changer activationDate lors de la validation
      // Garder l'activationDate originale pour préserver la durée
      if (!license.activationDate) {
        license.activationDate = new Date().toISOString();
      }
      // ⚠️ CRITIQUE : Préserver l'expiration originale définie lors de la pré-activation
      // Ne JAMAIS recalculer l'expiration ici, elle a déjà été définie avec la bonne durée
      licenses.set(licenseKey, license);
      
      console.log(`✅ Clé BLOQUÉE au hardwareId: ${hardwareId.substring(0, 16)}...`);
      console.log(`📅 Expiration APRÈS validation: ${license.expiration}`);
    }
    // ⚠️ SÉCURITÉ : Vérifier que l'ID matériel correspond exactement
    else if (license.hardwareId !== hardwareId) {
      console.log(`❌ ID matériel incorrect pour: ${licenseKey.substring(0, 8)}...`);
      console.log(`   HardwareId attendu: ${license.hardwareId.substring(0, 16)}...`);
      console.log(`   HardwareId reçu: ${hardwareId.substring(0, 16)}...`);
      console.log(`   Clé verrouillée: ${license.isLocked ? 'OUI' : 'NON'}`);
      
      return res.json({
        valid: false,
        message: 'Licence liée à un autre appareil. Cette clé est verrouillée au PC d\'origine.',
        isLocked: license.isLocked || false
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
    isLocked: license.isLocked || false,
    lockedAt: license.lockedAt || null,
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

