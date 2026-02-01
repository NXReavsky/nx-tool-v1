# Résolution des Erreurs Git

Guide pour résoudre les erreurs courantes lors du push vers GitHub.

## 🔧 Problème 1 : Author Identity Unknown

### Solution : Configurer Git

Exécutez ces commandes dans votre terminal (remplacez par vos vraies informations) :

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

**Exemple :**
```bash
git config --global user.name "NXReavsky"
git config --global user.email "votre-email@gmail.com"
```

⚠️ **Important** : Utilisez l'email associé à votre compte GitHub !

## 🔧 Problème 2 : src refspec main does not match any

Cette erreur signifie que le commit n'a pas réussi, donc il n'y a rien à pousser.

### Solution Complète : Recommencer depuis le début

Exécutez ces commandes **dans l'ordre** :

```bash
# 1. Vérifier que vous êtes dans le bon dossier
cd "C:\Users\User\Desktop\Tool new (2)\Tool new\NoAuthVersion\license\exemple-serveur"

# 2. Vérifier l'état de Git
git status

# 3. Si le dossier n'est pas initialisé, initialisez-le
git init

# 4. Ajouter tous les fichiers
git add .

# 5. Vérifier que les fichiers sont bien ajoutés
git status

# 6. Faire le commit (maintenant que Git est configuré)
git commit -m "Initial commit: Serveur de licence"

# 7. Renommer la branche en main
git branch -M main

# 8. Vérifier que le remote est bien configuré
git remote -v

# Si le remote n'existe pas ou est incorrect, ajoutez-le :
git remote remove origin
git remote add origin https://github.com/NXReavsky/nx-tool-v1.git

# 9. Pousser vers GitHub
git push -u origin main
```

## 📝 Commandes Complètes (Copier-Coller)

Si vous voulez tout faire d'un coup, voici la séquence complète :

```bash
# Configuration Git (à faire UNE SEULE FOIS)
git config --global user.name "NXReavsky"
git config --global user.email "votre-email@gmail.com"

# Aller dans le dossier
cd "C:\Users\User\Desktop\Tool new (2)\Tool new\NoAuthVersion\license\exemple-serveur"

# Initialiser et préparer
git init
git add .
git commit -m "Initial commit: Serveur de licence"
git branch -M main

# Configurer le remote
git remote remove origin
git remote add origin https://github.com/NXReavsky/nx-tool-v1.git

# Pousser
git push -u origin main
```

## 🔐 Authentification GitHub

Quand vous faites `git push`, GitHub peut demander :
- **Username** : Votre nom d'utilisateur GitHub (NXReavsky)
- **Password** : Utilisez un **Personal Access Token** (pas votre mot de passe)

### Créer un Personal Access Token :

1. Allez sur https://github.com/settings/tokens
2. Cliquez sur **"Generate new token"** > **"Generate new token (classic)"**
3. Donnez un nom : "Railway Deployment"
4. Cochez **"repo"** (accès complet aux repositories)
5. Cliquez sur **"Generate token"**
6. **COPIEZ LE TOKEN** (vous ne le reverrez plus !)
7. Utilisez ce token comme mot de passe lors du `git push`

## ✅ Vérification

Après le push réussi, vous devriez voir :
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/NXReavsky/nx-tool-v1.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🐛 Autres Erreurs Possibles

### Erreur : "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/NXReavsky/nx-tool-v1.git
```

### Erreur : "Permission denied"
- Vérifiez que vous utilisez un Personal Access Token
- Vérifiez que le repository existe sur GitHub
- Vérifiez que vous avez les droits d'accès

### Erreur : "Repository not found"
- Vérifiez que le repository `nx-tool-v1` existe sur votre compte GitHub
- Vérifiez l'URL du remote : `git remote -v`

## 🎯 Alternative : Utiliser l'Interface GitHub

Si Git continue à poser problème, utilisez l'interface web GitHub :

1. Allez sur https://github.com/NXReavsky/nx-tool-v1
2. Cliquez sur **"Add file"** > **"Upload files"**
3. Glissez-déposez les fichiers :
   - `server.js`
   - `package.json`
   - `README.md`
   - `.gitignore`
4. Cliquez sur **"Commit changes"**

C'est plus simple et évite les problèmes d'authentification Git !

