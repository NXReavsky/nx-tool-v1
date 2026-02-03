# Guide : Gérer les Clés de Licence

Comment créer, distribuer et gérer les clés de licence pour votre application.

## 🔑 Méthode 1 : Création Manuelle (Simple)

### Étape 1 : Créer une Clé de Licence

Vous pouvez créer des clés de licence manuellement. Format recommandé :

```
NX-XXXX-XXXX-XXXX-XXXX
```

Exemples :
- `NX-2024-ABCD-EFGH-IJKL`
- `NX-2024-1234-5678-9ABC`
- `NX-PROD-2024-USER-001`

### Étape 2 : Activer la Clé via le Serveur

Une fois qu'un utilisateur entre la clé dans votre application, elle sera automatiquement activée lors de la première utilisation.

**OU** vous pouvez l'activer manuellement via une requête API :

```powershell
# Via PowerShell
Invoke-RestMethod -Uri "https://nx-tool-v1-production.up.railway.app/api/license/activate" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"licenseKey":"NX-2024-ABCD-EFGH-IJKL","hardwareId":"pre-activation-test"}'
```

## 🔑 Méthode 2 : Script de Génération Automatique

Créez un script pour générer des clés automatiquement.

### Script Node.js (générateur-clés.js)

Créez un fichier `générateur-clés.js` :

```javascript
const crypto = require('crypto');

/**
 * Génère une clé de licence unique
 * @param {string} prefix - Préfixe (ex: "NX", "PROD")
 * @returns {string} - Clé de licence générée
 */
function genererCle(prefix = 'NX') {
  // Générer 4 groupes de 4 caractères alphanumériques
  const groupe1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const groupe2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const groupe3 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const groupe4 = crypto.randomBytes(2).toString('hex').toUpperCase();
  
  return `${prefix}-${groupe1}-${groupe2}-${groupe3}-${groupe4}`;
}

/**
 * Génère plusieurs clés de licence
 * @param {number} nombre - Nombre de clés à générer
 * @param {string} prefix - Préfixe
 * @returns {string[]} - Tableau de clés
 */
function genererCles(nombre = 1, prefix = 'NX') {
  const cles = [];
  for (let i = 0; i < nombre; i++) {
    cles.push(genererCle(prefix));
  }
  return cles;
}

// Exemple d'utilisation
if (require.main === module) {
  const nombre = process.argv[2] || 1;
  const prefix = process.argv[3] || 'NX';
  
  console.log(`\n🔑 Génération de ${nombre} clé(s) de licence...\n`);
  
  const cles = genererCles(parseInt(nombre), prefix);
  
  cles.forEach((cle, index) => {
    console.log(`${index + 1}. ${cle}`);
  });
  
  console.log(`\n✅ ${cles.length} clé(s) générée(s) !\n`);
}

module.exports = { genererCle, genererCles };
```

### Utilisation du Script

```bash
# Générer 1 clé
node générateur-clés.js

# Générer 10 clés
node générateur-clés.js 10

# Générer 5 clés avec préfixe "PROD"
node générateur-clés.js 5 PROD
```

## 🔑 Méthode 3 : Interface Web de Gestion (Avancé)

Créez une page web pour gérer les clés. Ajoutez ces routes à votre `server.js` :

```javascript
// Route pour créer une clé (nécessite authentification en production !)
app.post('/api/admin/create-license', async (req, res) => {
  // ⚠️ AJOUTEZ UNE AUTHENTIFICATION ICI !
  const { licenseKey, expirationDays = 365 } = req.body;
  
  if (!licenseKey) {
    return res.status(400).json({ error: 'licenseKey requis' });
  }
  
  // Pré-activer la clé (sans hardwareId, sera activée au premier usage)
  licenses.set(licenseKey, {
    licenseKey,
    hardwareId: null, // Sera défini lors de la première activation
    activationDate: null,
    expiration: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString(),
    clientId: `pre-${Date.now()}`,
    clientName: 'Pré-activé',
    gameModes: {
      multiplayer: true,
      warzone: true,
      cdl: false
    },
    preActivated: true
  });
  
  res.json({
    success: true,
    licenseKey,
    expiration: licenses.get(licenseKey).expiration
  });
});

// Route pour lister toutes les clés (nécessite authentification !)
app.get('/api/admin/licenses', (req, res) => {
  // ⚠️ AJOUTEZ UNE AUTHENTIFICATION ICI !
  const licenseList = Array.from(licenses.values()).map(license => ({
    licenseKey: license.licenseKey,
    hardwareId: license.hardwareId ? license.hardwareId.substring(0, 8) + '...' : 'Non activée',
    activationDate: license.activationDate,
    expiration: license.expiration,
    isValid: license.hardwareId && new Date() < new Date(license.expiration),
    clientName: license.clientName
  }));
  
  res.json({
    count: licenses.size,
    licenses: licenseList
  });
});
```

## 📋 Processus de Distribution

### Option 1 : Distribution Directe

1. **Générez une clé** (manuellement ou via script)
2. **Donnez la clé à l'utilisateur** (email, message, etc.)
3. **L'utilisateur entre la clé** dans votre application
4. **L'application active automatiquement** la clé au premier usage

### Option 2 : Pré-activation

1. **Générez une clé**
2. **Pré-activez-la** via l'API admin (si vous avez ajouté la route)
3. **Donnez la clé à l'utilisateur**
4. **L'utilisateur entre la clé** - elle sera validée directement

## 🗄️ Stockage des Clés

### Problème Actuel

Le serveur actuel utilise une **Map en mémoire**, ce qui signifie :
- ❌ Les clés sont perdues au redémarrage du serveur
- ❌ Pas de persistance

### Solution : Base de Données

Pour la production, vous devez utiliser une vraie base de données :

#### Option 1 : PostgreSQL (Recommandé avec Railway)

1. Dans Railway, ajoutez une base de données PostgreSQL
2. Installez `pg` : `npm install pg`
3. Modifiez le code pour sauvegarder dans PostgreSQL

#### Option 2 : MongoDB Atlas (Gratuit)

1. Créez un compte sur https://mongodb.com/cloud/atlas
2. Créez un cluster gratuit (512MB)
3. Installez `mongodb` : `npm install mongodb`
4. Modifiez le code pour utiliser MongoDB

#### Option 3 : Fichier JSON (Simple mais non recommandé pour production)

Sauvegardez dans un fichier JSON (perd les données si le serveur crash).

## 📊 Exemple de Table PostgreSQL

```sql
CREATE TABLE licenses (
  id SERIAL PRIMARY KEY,
  license_key VARCHAR(255) UNIQUE NOT NULL,
  hardware_id VARCHAR(255),
  activation_date TIMESTAMP,
  expiration_date TIMESTAMP NOT NULL,
  client_id VARCHAR(255),
  client_name VARCHAR(255),
  game_modes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_license_key ON licenses(license_key);
CREATE INDEX idx_hardware_id ON licenses(hardware_id);
```

## 🔐 Sécurité

### ⚠️ IMPORTANT : Ajoutez une Authentification !

Les routes admin (`/api/admin/*`) doivent être protégées :

```javascript
// Exemple avec token simple
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'changez-moi-en-production';

function requireAdmin(req, res, next) {
  const token = req.headers['authorization'];
  
  if (token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  next();
}

// Utilisation
app.post('/api/admin/create-license', requireAdmin, async (req, res) => {
  // ...
});
```

## 📝 Checklist de Distribution

- [ ] Générer des clés de licence
- [ ] Stocker les clés (base de données recommandée)
- [ ] Distribuer les clés aux utilisateurs
- [ ] Les utilisateurs entrent les clés dans l'application
- [ ] Les clés sont activées automatiquement
- [ ] Vérifier que les clés fonctionnent

## 🎯 Résumé Rapide

**Pour créer une clé maintenant :**

1. **Générez une clé** : `NX-2024-ABCD-EFGH-IJKL` (ou utilisez le script)
2. **Donnez-la à l'utilisateur**
3. **L'utilisateur l'entre dans l'application**
4. **La clé est activée automatiquement au premier usage**

**Pour gérer plusieurs clés :**

1. Utilisez le script de génération
2. Stockez-les dans une base de données
3. Créez une interface admin (avec authentification !)

Votre système est prêt à distribuer des clés ! 🚀
