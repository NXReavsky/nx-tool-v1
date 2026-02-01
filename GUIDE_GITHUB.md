# Guide : Créer le Code sur GitHub

Guide étape par étape pour créer votre repository GitHub et y ajouter le code du serveur de licence.

## 📋 Prérequis

- Un compte GitHub (gratuit) : https://github.com
- Git installé sur votre ordinateur (téléchargez sur https://git-scm.com si nécessaire)

## 🚀 Méthode 1 : Via l'Interface GitHub (Le Plus Simple)

### Étape 1 : Créer le Repository sur GitHub

1. Allez sur https://github.com et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite
3. Sélectionnez **"New repository"**

4. Remplissez le formulaire :
   - **Repository name** : `license-server` (ou le nom que vous voulez)
   - **Description** : "Serveur de licence pour l'application"
   - **Visibility** : Choisissez **Private** (recommandé) ou **Public**
   - **NE COCHEZ PAS** "Add a README file" (on va le créer manuellement)
   - Cliquez sur **"Create repository"**

### Étape 2 : Copier les Fichiers dans le Repository

1. GitHub vous montre une page avec des instructions
2. **Copiez l'URL HTTPS** de votre repository (ex: `https://github.com/votre-username/license-server.git`)

3. Sur votre ordinateur, ouvrez un terminal dans le dossier `exemple-serveur` :
   ```bash
   cd "Tool new/NoAuthVersion/license/exemple-serveur"
   ```

4. Initialisez Git et ajoutez les fichiers :
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Serveur de licence"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/license-server.git
   git push -u origin main
   ```

   ⚠️ **Remplacez** `VOTRE-USERNAME` et `license-server` par vos vraies valeurs !

5. GitHub vous demandera de vous connecter. Suivez les instructions.

## 🚀 Méthode 2 : Via GitHub Desktop (Plus Visuel)

### Étape 1 : Installer GitHub Desktop

1. Téléchargez GitHub Desktop : https://desktop.github.com
2. Installez et connectez-vous avec votre compte GitHub

### Étape 2 : Créer le Repository

1. Ouvrez GitHub Desktop
2. Cliquez sur **"File"** > **"New repository"**
3. Remplissez :
   - **Name** : `license-server`
   - **Local path** : Choisissez un dossier (ex: `C:\Users\VotreNom\license-server`)
   - **Description** : "Serveur de licence"
   - **Git Ignore** : Node
   - Cliquez sur **"Create repository"**

### Étape 3 : Copier les Fichiers

1. Copiez tous les fichiers du dossier `exemple-serveur` dans le dossier que vous venez de créer
2. Dans GitHub Desktop, vous verrez tous les fichiers apparaître
3. En bas, écrivez un message : "Initial commit: Serveur de licence"
4. Cliquez sur **"Commit to main"**
5. Cliquez sur **"Publish repository"**
6. Choisissez si vous voulez le rendre **Private** ou **Public**
7. Cliquez sur **"Publish repository"**

## 🚀 Méthode 3 : Via l'Interface Web GitHub (Sans Git)

### Étape 1 : Créer le Repository

1. Allez sur https://github.com
2. Créez un nouveau repository (comme dans Méthode 1)
3. **Cochez** "Add a README file" cette fois
4. Cliquez sur **"Create repository"**

### Étape 2 : Ajouter les Fichiers via l'Interface Web

1. Dans votre repository, cliquez sur **"Add file"** > **"Upload files"**
2. Glissez-déposez les fichiers suivants depuis `exemple-serveur` :
   - `server.js`
   - `package.json`
   - `README.md`
   - `.gitignore`
3. En bas de la page, écrivez un message : "Initial commit: Serveur de licence"
4. Cliquez sur **"Commit changes"**

## ✅ Vérification

Votre repository GitHub devrait maintenant contenir :
- ✅ `server.js`
- ✅ `package.json`
- ✅ `README.md`
- ✅ `.gitignore`

## 🔗 Prochaine Étape : Connecter à Railway

Une fois le code sur GitHub :

1. Allez sur https://railway.app
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Autorisez Railway à accéder à GitHub
5. Sélectionnez votre repository `license-server`
6. Railway va automatiquement :
   - Détecter Node.js
   - Installer les dépendances
   - Démarrer le serveur
   - Vous donner une URL

## 🐛 Problèmes Courants

### Erreur : "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/VOTRE-USERNAME/license-server.git
```

### Erreur : "Permission denied"
- Vérifiez que vous êtes connecté à GitHub
- Utilisez un Personal Access Token si nécessaire

### Erreur : "Repository not found"
- Vérifiez que le nom du repository est correct
- Vérifiez que vous avez les droits d'accès

## 📝 Commandes Git Utiles

```bash
# Voir l'état des fichiers
git status

# Ajouter tous les fichiers
git add .

# Faire un commit
git commit -m "Votre message"

# Pousser vers GitHub
git push

# Voir les remotes
git remote -v
```

## 🎯 Résumé Rapide

1. ✅ Créer un compte GitHub
2. ✅ Créer un nouveau repository
3. ✅ Copier les fichiers du dossier `exemple-serveur`
4. ✅ Pousser le code sur GitHub
5. ✅ Connecter à Railway

Votre code est maintenant sur GitHub et prêt à être déployé ! 🚀

