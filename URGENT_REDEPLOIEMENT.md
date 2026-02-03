# ⚠️ URGENT : Redéploiement Requis

## 🔴 Problème Identifié

Le test montre que **le serveur sur Railway utilise encore l'ancien code** qui ne gère pas les clés pré-activées.

**Preuve** : Le test échoue à l'étape 3 avec "Cette licence est déjà activée" alors que le code local devrait permettre la réactivation.

## ✅ Solution : Redéployer le Serveur

### Option 1 : Via GitHub (Recommandé)

1. **Vérifiez que vous êtes dans le bon dossier** :
   ```bash
   cd "Tool new\NoAuthVersion\license\exemple-serveur"
   ```

2. **Vérifiez le statut Git** :
   ```bash
   git status
   ```

3. **Ajoutez le fichier modifié** :
   ```bash
   git add server.js
   ```

4. **Commitez** :
   ```bash
   git commit -m "Fix: Gestion des clés pré-activées - Mise à jour hardwareId"
   ```

5. **Poussez sur GitHub** :
   ```bash
   git push
   ```

6. **Railway redéploiera automatiquement** (attendez 1-2 minutes)

### Option 2 : Upload Direct sur Railway

Si vous n'utilisez pas Git :

1. Allez sur https://railway.app
2. Ouvrez votre projet `nx-tool-v1`
3. Allez dans **"Settings"** > **"Source"**
4. Si possible, téléversez le fichier `server.js` modifié
5. Railway redéploiera

### Option 3 : Redéploiement Manuel

1. Allez sur Railway
2. Ouvrez votre projet
3. Cliquez sur **"Deployments"**
4. Cliquez sur les **3 points (⋯)** du dernier déploiement
5. Sélectionnez **"Redeploy"**

## ✅ Vérification Après Redéploiement

Une fois redéployé, **relancez le test** :

```powershell
cd "Tool new\NoAuthVersion\license\exemple-serveur"
.\test-serveur.ps1
```

**Tous les tests doivent passer** (4/4) ✅

## 📝 Code à Vérifier sur Railway

Le serveur sur Railway doit avoir ce code dans `/api/license/activate` :

```javascript
// Vérifier si la licence existe déjà
if (licenses.has(licenseKey)) {
  const existing = licenses.get(licenseKey);
  
  // Si la licence a été pré-activée, permettre la réactivation
  if (existing.hardwareId === 'PRE-ACTIVATED' || existing.hardwareId === 'pre-activation-test') {
    console.log(`🔄 Réactivation de la clé pré-activée...`);
    existing.hardwareId = hardwareId;
    existing.activationDate = activationDate || new Date().toISOString();
    licenses.set(licenseKey, existing);
    
    return res.json({
      valid: true,
      ...existing
    });
  }
  // ...
}
```

**Si ce code n'est pas présent, le serveur n'a pas été mis à jour !**

## 🎯 Après Redéploiement

Une fois le serveur redéployé avec le bon code :
1. ✅ Les clés pré-activées fonctionneront
2. ✅ Le hardwareId sera mis à jour automatiquement
3. ✅ Vos clés générées fonctionneront dans l'application

**Le problème vient du fait que Railway utilise encore l'ancien code !**
