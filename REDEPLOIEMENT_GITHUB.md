# Redéploiement via GitHub - Guide Complet

## 🎯 Objectif

Pousser le fichier `server.js` modifié sur GitHub pour que Railway redéploie automatiquement.

## 📋 Méthode 1 : Via l'Interface Web GitHub (Le Plus Simple)

### Étape 1 : Aller sur GitHub

1. Allez sur https://github.com
2. Connectez-vous
3. Ouvrez votre repository : `NXReavsky/nx-tool-v1`

### Étape 2 : Modifier le Fichier Directement sur GitHub

1. Dans votre repository, naviguez vers le fichier `server.js`
   - Il devrait être dans le dossier racine ou dans un sous-dossier
2. Cliquez sur le fichier `server.js`
3. Cliquez sur l'icône **✏️ Edit** (crayon) en haut à droite
4. **Copiez le contenu** du fichier local `server.js` modifié
5. **Collez-le** dans l'éditeur GitHub
6. En bas de la page, dans "Commit changes" :
   - **Titre** : `Fix: Gestion des clés pré-activées`
   - **Description** : `Mise à jour du serveur pour gérer les clés pré-activées avec mise à jour automatique du hardwareId`
7. Cliquez sur **"Commit changes"**

### Étape 3 : Vérifier le Redéploiement

1. Allez sur https://railway.app
2. Ouvrez votre projet `nx-tool-v1`
3. Allez dans **"Deployments"**
4. Vous devriez voir un nouveau déploiement en cours
5. Attendez que le statut passe à **"Deployed"** (vert)

## 📋 Méthode 2 : Via Git en Ligne de Commande (Si Git est Installé)

### Étape 1 : Installer Git (Si Nécessaire)

Téléchargez Git : https://git-scm.com/download/win

### Étape 2 : Configurer Git (Première Utilisation)

```powershell
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### Étape 3 : Pousser les Modifications

```powershell
# Aller dans le dossier
cd "Tool new\NoAuthVersion\license\exemple-serveur"

# Vérifier le statut
git status

# Ajouter le fichier modifié
git add server.js

# Commiter
git commit -m "Fix: Gestion des clés pré-activées - Mise à jour hardwareId"

# Pousser sur GitHub
git push
```

## 📋 Méthode 3 : Via GitHub Desktop (Interface Graphique)

### Étape 1 : Installer GitHub Desktop

Téléchargez : https://desktop.github.com

### Étape 2 : Ouvrir le Repository

1. Ouvrez GitHub Desktop
2. **File** > **Add Local Repository**
3. Sélectionnez le dossier : `Tool new\NoAuthVersion\license\exemple-serveur`
4. Si le dossier n'est pas un repo Git, GitHub Desktop vous proposera de l'initialiser

### Étape 3 : Commiter et Pousser

1. Vous verrez `server.js` dans la liste des fichiers modifiés
2. Cochez la case à côté de `server.js`
3. En bas, écrivez un message : `Fix: Gestion des clés pré-activées`
4. Cliquez sur **"Commit to main"**
5. Cliquez sur **"Push origin"** (ou **"Publish branch"** si c'est la première fois)

## ✅ Vérification Après Redéploiement

### Test 1 : Vérifier les Logs Railway

1. Allez sur Railway
2. Ouvrez votre projet
3. Cliquez sur **"Deployments"**
4. Ouvrez le dernier déploiement
5. Vérifiez les logs pour voir si le serveur démarre correctement

### Test 2 : Tester le Serveur

```powershell
cd "Tool new\NoAuthVersion\license\exemple-serveur"
.\test-serveur.ps1
```

**Tous les tests doivent passer (4/4)** ✅

### Test 3 : Tester avec une Vraie Clé

1. Générez une nouvelle clé avec le générateur
2. Cochez "Activer automatiquement sur le serveur"
3. Utilisez la clé dans votre application
4. **La clé devrait fonctionner maintenant !**

## 🐛 Si le Redéploiement ne se Lance Pas

1. **Vérifiez que Railway est connecté à GitHub** :
   - Railway > Settings > Source
   - Vérifiez que le repository est bien connecté

2. **Forcez un redéploiement** :
   - Railway > Deployments > 3 points (⋯) > Redeploy

3. **Vérifiez les logs** :
   - Railway > Deployments > Dernier déploiement > Logs
   - Cherchez les erreurs

## 📝 Résumé Rapide

**Méthode la plus simple** :
1. Allez sur GitHub.com
2. Ouvrez votre repo `nx-tool-v1`
3. Éditez `server.js`
4. Collez le nouveau code
5. Commitez
6. Railway redéploiera automatiquement

**C'est tout !** 🚀
