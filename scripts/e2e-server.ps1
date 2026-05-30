# Servidor FastAPI + SPA buildado para Playwright (fallback SPA igual produção)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location "$Root\frontend"
npm run build
$dist = "$Root\frontend\dist"
$target = "$Root\backend\app\static\frontend"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Copy-Item -Path "$dist\*" -Destination $target -Recurse -Force
Set-Location "$Root\backend"
$env:JWT_SECRET = "e2e-jwt-secret"
$env:ADMIN_INITIAL_EMAIL = "admin@test.local"
$env:ADMIN_INITIAL_PASSWORD = "e2e-password"
if (Test-Path ".\.venv\Scripts\python.exe") {
    & .\.venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 4173
} else {
    uvicorn app.main:app --host 127.0.0.1 --port 4173
}
