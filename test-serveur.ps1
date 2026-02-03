# Script de Test du Serveur de Licence
# Utilisez ce script pour tester si le serveur fonctionne correctement

$SERVER_URL = "https://nx-tool-v1-production.up.railway.app"
$TEST_KEY = "TEST-$(Get-Random -Minimum 1000 -Maximum 9999)-$(Get-Random -Minimum 1000 -Maximum 9999)"
$TEST_HWID = "test-hardware-id-$(Get-Random)"

Write-Host "`n🧪 Test du Serveur de Licence`n" -ForegroundColor Cyan
Write-Host "URL du serveur: $SERVER_URL`n" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "1️⃣ Test Health Check..." -ForegroundColor Green
try {
    $health = Invoke-RestMethod -Uri "$SERVER_URL/health" -Method GET
    Write-Host "   ✅ Serveur en ligne" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
    Write-Host "   Licences: $($health.licensesCount)`n" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Pré-activation (comme le générateur)
Write-Host "2️⃣ Test Pré-activation (comme le générateur)..." -ForegroundColor Green
try {
    $preActivate = Invoke-RestMethod -Uri "$SERVER_URL/api/license/activate" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{
            licenseKey = $TEST_KEY
            hardwareId = "PRE-ACTIVATED"
            activationDate = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            expirationDays = 30
        } | ConvertTo-Json)
    
    if ($preActivate.valid) {
        Write-Host "   ✅ Clé pré-activée avec succès" -ForegroundColor Green
        Write-Host "   Clé: $TEST_KEY" -ForegroundColor Gray
        Write-Host "   HardwareId: $($preActivate.hardwareId)`n" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Échec de pré-activation: $($preActivate.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Erreur: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Réponse: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# Test 3: Activation avec vrai hardwareId (comme l'application)
Write-Host "3️⃣ Test Activation avec vrai hardwareId (comme l'application)..." -ForegroundColor Green
try {
    $activate = Invoke-RestMethod -Uri "$SERVER_URL/api/license/activate" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{
            licenseKey = $TEST_KEY
            hardwareId = $TEST_HWID
            activationDate = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        } | ConvertTo-Json)
    
    if ($activate.valid) {
        Write-Host "   ✅ Clé activée avec succès" -ForegroundColor Green
        Write-Host "   HardwareId mis à jour: $($activate.hardwareId)" -ForegroundColor Gray
        Write-Host "   Expiration: $($activate.expiration)`n" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Échec d'activation: $($activate.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Erreur: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Réponse: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# Test 4: Validation (comme l'application)
Write-Host "4️⃣ Test Validation (comme l'application)..." -ForegroundColor Green
try {
    $validate = Invoke-RestMethod -Uri "$SERVER_URL/api/license/validate" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{
            licenseKey = $TEST_KEY
            hardwareId = $TEST_HWID
        } | ConvertTo-Json)
    
    if ($validate.valid) {
        Write-Host "   ✅ Clé validée avec succès" -ForegroundColor Green
        Write-Host "   Client: $($validate.clientName)" -ForegroundColor Gray
        Write-Host "   Expiration: $($validate.expiration)`n" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Échec de validation: $($validate.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Erreur: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Réponse: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host "`n✅ Tous les tests sont passés ! Le serveur fonctionne correctement.`n" -ForegroundColor Green
Write-Host "Si les tests passent mais que vos clés ne fonctionnent pas dans l'application," -ForegroundColor Yellow
Write-Host "le problème vient peut-être de la configuration de l'application.`n" -ForegroundColor Yellow
