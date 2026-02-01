# Serveur de Licence - Guide de Déploiement

Ce dossier contient un serveur de licence prêt à déployer sur Railway, Render, ou tout autre service d'hébergement.

## 🚀 Déploiement Rapide sur Railway (Recommandé)

### Étape 1 : Préparer le code
1. Créez un nouveau repo GitHub
2. Copiez les fichiers de ce dossier dans le repo
3. Commitez et poussez sur GitHub

### Étape 2 : Déployer sur Railway
1. Allez sur https://railway.app
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Sélectionnez "Deploy from GitHub repo"
5. Choisissez votre repo
6. Railway détecte automatiquement Node.js et déploie
7. Copiez l'URL fournie (ex: `https://votre-projet.railway.app`)

### Étape 3 : Configurer dans votre app
Dans `Tool new/NoAuthVersion/license/config.js` :
```javascript
server: {
  licenseValidation: 'https://votre-projet.railway.app/api/license/validate',
  licenseActivation: 'https://votre-projet.railway.app/api/license/activate',
  purchaseUrl: 'https://votre-site.com/acheter'
}
```

## 🚀 Déploiement sur Render

1. Allez sur https://render.com
2. Créez un compte
3. Cliquez sur "New" > "Web Service"
4. Connectez votre repo GitHub
5. Render détecte automatiquement Node.js
6. Cliquez sur "Create Web Service"
7. Copiez l'URL fournie

## 🧪 Tester Localement

```bash
cd exemple-serveur
npm install
npm start
```

Le serveur démarre sur http://localhost:3000

### Tester l'activation :
```bash
curl -X POST http://localhost:3000/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "TEST-123-456",
    "hardwareId": "test-hardware-id",
    "activationDate": "2024-01-15T10:30:00.000Z"
  }'
```

### Tester la validation :
```bash
curl -X POST http://localhost:3000/api/license/validate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "TEST-123-456",
    "hardwareId": "test-hardware-id"
  }'
```

## ⚠️ Important : Base de Données

**Ce serveur utilise une Map en mémoire** qui sera perdue au redémarrage.

Pour la production, vous devriez utiliser une vraie base de données :

### Option 1 : PostgreSQL avec Railway
1. Dans Railway, ajoutez une base de données PostgreSQL
2. Installez `pg` : `npm install pg`
3. Modifiez le code pour utiliser PostgreSQL

### Option 2 : MongoDB Atlas (Gratuit)
1. Créez un compte sur https://mongodb.com/cloud/atlas
2. Créez un cluster gratuit (512MB)
3. Installez `mongodb` : `npm install mongodb`
4. Modifiez le code pour utiliser MongoDB

### Option 3 : Supabase (Gratuit)
1. Créez un compte sur https://supabase.com
2. Créez un projet
3. Utilisez l'API REST automatique ou installez `@supabase/supabase-js`

## 🔒 Sécurité

Avant de mettre en production, ajoutez :
- [ ] Authentification API (tokens)
- [ ] Rate limiting
- [ ] Validation stricte des données
- [ ] Logs des tentatives
- [ ] HTTPS (automatique avec Railway/Render)

## 📝 Variables d'Environnement

Vous pouvez ajouter des variables d'environnement dans Railway/Render :
- `PORT` : Port du serveur (défini automatiquement)
- `NODE_ENV` : `production` ou `development`

## 🐛 Debug

Vérifiez les logs dans Railway/Render pour voir les requêtes et erreurs.

