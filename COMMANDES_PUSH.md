# 🚀 Commandes pour Mettre à Jour le Serveur sur GitHub

## 📝 Fichier à Mettre à Jour

**Un seul fichier** : `server.js`
- ✅ Correction du bug de durée des clés
- ✅ Préservation de l'expiration lors de la réactivation

## 🔧 Commandes PowerShell

```powershell
# 1. Aller dans le dossier du serveur
cd "Tool new\NoAuthVersion\license\exemple-serveur"

# 2. Vérifier l'état Git
git status

# 3. Ajouter le fichier modifié
git add server.js

# 4. Créer un commit
git commit -m "Fix: Correction durée des clés - respecte expirationDays du générateur"

# 5. Pousser sur GitHub
git push origin main
```

## ✅ Après le Push

1. **Railway redéploiera automatiquement** (si connecté à GitHub)
2. Attendez 1-2 minutes que le déploiement se termine
3. Testez avec une nouvelle clé pour vérifier que la durée est correcte

## 🆘 Si vous avez des erreurs Git

Si vous n'êtes pas dans un repo Git :
```powershell
# Initialiser Git (si pas déjà fait)
git init

# Ajouter le remote (remplacez par votre URL GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git

# Puis refaire les commandes ci-dessus
```

Si vous avez des conflits :
```powershell
# Récupérer les dernières modifications
git pull origin main

# Résoudre les conflits si nécessaire, puis :
git add server.js
git commit -m "Fix: Correction durée des clés"
git push origin main
```
