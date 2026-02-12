# Sync root .env into backend/.env and frontend .env.local files (PowerShell)
param()
$rootEnv = Join-Path (Get-Location) '.env'
if (-not (Test-Path $rootEnv)) {
    Write-Error ".env file not found at project root. Create one from .env.example first."
    exit 1
}

Write-Output "Syncing $rootEnv -> backend/.env"
Copy-Item -Force $rootEnv -Destination "backend/.env"

Write-Output "Syncing $rootEnv -> admin-app/.env.local"
Copy-Item -Force $rootEnv -Destination "admin-app/.env.local"

Write-Output "Syncing $rootEnv -> user-app/.env.local"
Copy-Item -Force $rootEnv -Destination "user-app/.env.local"

Write-Output "Done. Note: frontends will need rebuild if REACT_APP_* changed."
