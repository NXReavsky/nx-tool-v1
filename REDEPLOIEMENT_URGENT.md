# 🔄 Redéploiement Urgent du Serveur de Licence

## ⚠️ Corrections Apportées

1. **Bug de sécurité corrigé** : Empêche la validation avec une mauvaise clé en fermant la fenêtre
2. **Problème de durée corrigé** : Les clés respectent maintenant la durée définie dans le générateur (1j, 15j, 1mois, 3mois, 6mois, Lifetime)

## 🚀 Redéploiement sur Railway

### Option 1 : Via GitHub (Recommandé)

1. **Aller dans le dossier du serveur** :
   ```powershell
   cd "Tool new\NoAuthVersion\license\exemple-serveur"
   ```

2. **Vérifier les modifications** :
   ```powershell
   git status
   ```

3. **Ajouter les fichiers modifiés** :
   ```powershell
   git add server.js
   git commit -m "Fix: Correction bug sécurité et durée des clés"
   git push origin main
   ```

4. **Railway redéploiera automatiquement** :
   - Allez sur https://railway.app
   - Ouvrez votre projet
   - Railway détectera automatiquement le push et redéploiera

### Option 2 : Redéploiement Manuel

1. **Aller sur Railway** :
   - https://railway.app
   - Connectez-vous et ouvrez votre projet `nx-tool-v1`

2. **Redéployer** :
   - Cliquez sur votre service
   - Cliquez sur l'onglet "Deployments"
   - Cliquez sur "Redeploy" sur le dernier déploiement

### Option 3 : Via Railway CLI

```powershell
# Installer Railway CLI (si pas déjà fait)
npm i -g @railway/cli

# Se connecter
railway login

# Aller dans le dossier du serveur
cd "Tool new\NoAuthVersion\license\exemple-serveur"

# Lier au projet Railway
railway link

# Déployer
railway up
```

## ✅ Vérification après Redéploiement

1. **Tester le serveur** :
   ```powershell
   # Tester la santé du serveur
   curl https://nx-tool-v1-production.up.railway.app/health
   ```

2. **Créer une nouvelle clé de test** :
   - Utilisez le générateur de clés
   - Créez une clé avec une durée de 1 jour
   - Vérifiez que l'expiration est correcte (1 jour, pas 1 an)

3. **Tester la validation** :
   - Lancez l'application principale
   - Essayez d'entrer une mauvaise clé deux fois
   - Vérifiez que l'application se ferme (bug de sécurité corrigé)

## 📝 Notes Importantes

- ⚠️ **Les clés déjà créées avant le redéploiement garderont leur expiration actuelle**
- ✅ **Les nouvelles clés créées après le redéploiement respecteront la durée définie**
- 🔒 **Le bug de sécurité est corrigé côté application (déjà rebuild)**

## 🆘 En Cas de Problème

Si le redéploiement échoue :
1. Vérifiez les logs sur Railway
2. Vérifiez que `server.js` est bien modifié
3. Vérifiez que le commit a bien été poussé sur GitHub
