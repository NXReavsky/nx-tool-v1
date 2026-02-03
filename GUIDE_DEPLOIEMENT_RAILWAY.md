# Guide : Déployer sur Railway après le Push GitHub

Une fois votre code poussé sur GitHub, voici comment le déployer sur Railway.

## 🚀 Étape 1 : Créer un Compte Railway

1. Allez sur **https://railway.app**
2. Cliquez sur **"Start a New Project"** ou **"Login"**
3. Choisissez **"Login with GitHub"**
4. Autorisez Railway à accéder à votre compte GitHub

## 🚀 Étape 2 : Créer un Nouveau Projet

1. Dans Railway, cliquez sur **"New Project"**
2. Vous verrez plusieurs options, choisissez **"Deploy from GitHub repo"**
   - (Si vous voyez "Empty Project", vous pouvez aussi le choisir puis ajouter GitHub après)

## 🚀 Étape 3 : Sélectionner votre Repository

1. Railway va lister tous vos repositories GitHub
2. Cherchez et sélectionnez **`nx-tool-v1`** (ou le nom que vous avez donné)
3. Railway va automatiquement :
   - Détecter que c'est un projet Node.js
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)

## 🚀 Étape 4 : Attendre le Déploiement

1. Railway va afficher les logs de déploiement
2. Vous verrez quelque chose comme :
   ```
   Installing dependencies...
   npm install
   Starting server...
   node server.js
   🚀 Serveur de licence démarré sur le port 3000
   ```

3. Attendez que le statut passe à **"Deployed"** (vert)

## 🚀 Étape 5 : Obtenir l'URL de votre Serveur

1. Une fois déployé, Railway vous donne une URL
2. Cliquez sur votre projet dans Railway
3. Cliquez sur l'onglet **"Settings"**
4. Dans la section **"Domains"**, vous verrez une URL comme :
   - `https://votre-projet-production.up.railway.app`
   - Ou vous pouvez créer un domaine personnalisé

5. **Copiez cette URL** - vous en aurez besoin pour configurer votre application !

## 🚀 Étape 6 : Tester votre Serveur

1. Ouvrez votre navigateur
2. Allez sur : `https://votre-url.railway.app/health`
3. Vous devriez voir :
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-15T10:30:00.000Z",
     "licensesCount": 0
   }
   ```

✅ Si vous voyez ça, votre serveur fonctionne !

## 🚀 Étape 7 : Configurer votre Application

Maintenant, vous devez mettre à jour votre fichier `config.js` dans votre application :

1. Ouvrez : `Tool new/NoAuthVersion/license/config.js`
2. Remplacez les `'XXXXXXXX'` par votre URL Railway :

```javascript
server: {
  baseUrl: 'https://votre-projet-production.up.railway.app',
  licenseValidation: 'https://votre-projet-production.up.railway.app/api/license/validate',
  licenseActivation: 'https://votre-projet-production.up.railway.app/api/license/activate',
  purchaseUrl: 'https://votre-site.com/acheter' // Optionnel
}
```

⚠️ **Remplacez** `votre-projet-production.up.railway.app` par votre vraie URL Railway !

## 🧪 Tester l'Activation et la Validation

### Tester l'Activation (via PowerShell ou navigateur) :

```powershell
# Via PowerShell
Invoke-RestMethod -Uri "https://votre-url.railway.app/api/license/activate" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"licenseKey":"TEST-123","hardwareId":"test-hw-id"}'
```

### Tester la Validation :

```powershell
Invoke-RestMethod -Uri "https://votre-url.railway.app/api/license/validate" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"licenseKey":"TEST-123","hardwareId":"test-hw-id"}'
```

## ✅ Vérification Finale

1. ✅ Code sur GitHub
2. ✅ Déployé sur Railway
3. ✅ URL obtenue
4. ✅ Serveur testé (endpoint `/health`)
5. ✅ `config.js` mis à jour avec les URLs Railway
6. ✅ Application configurée

## 🎯 Prochaine Étape : Tester dans votre Application

1. Démarrez votre application Electron
2. La fenêtre de licence devrait s'afficher
3. Entrez une clé de licence de test
4. L'application devrait communiquer avec votre serveur Railway

## 🔧 Configuration Avancée (Optionnel)

### Variables d'Environnement

Dans Railway, vous pouvez ajouter des variables d'environnement :
1. Allez dans **Settings** > **Variables**
2. Ajoutez des variables si nécessaire (pour l'instant, pas besoin)

### Logs en Temps Réel

1. Dans Railway, cliquez sur votre projet
2. Onglet **"Deployments"** > Cliquez sur le dernier déploiement
3. Vous verrez les logs en temps réel de votre serveur

### Redéploiement

Si vous modifiez le code :
1. Faites `git push` sur GitHub
2. Railway redéploiera automatiquement !

## 🐛 Problèmes Courants

### Le serveur ne démarre pas
- Vérifiez les logs dans Railway
- Vérifiez que `package.json` a bien un script `"start": "node server.js"`

### Erreur 404
- Vérifiez que l'URL est correcte
- Vérifiez que le serveur est bien déployé (statut vert)

### Erreur de connexion
- Vérifiez que Railway est bien en ligne
- Vérifiez les logs pour voir les erreurs

## 📝 Résumé des URLs à Configurer

Dans `config.js`, vous devez avoir :

```javascript
licenseValidation: 'https://VOTRE-URL-RAILWAY/api/license/validate',
licenseActivation: 'https://VOTRE-URL-RAILWAY/api/license/activate',
```

C'est tout ! Votre serveur de licence est maintenant en ligne et prêt à être utilisé ! 🎉
