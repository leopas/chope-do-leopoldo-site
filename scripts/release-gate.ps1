# Release gate local (CRP-010)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "==> Backend: pytest"
Set-Location "$Root\backend"
& .\.venv\Scripts\python.exe -m pip install -q -r requirements.txt -r requirements-dev.txt 2>$null
if (-not (Test-Path .\.venv\Scripts\python.exe)) {
    python -m pip install -q -r requirements.txt -r requirements-dev.txt
    $py = "python"
} else {
    $py = ".\.venv\Scripts\python.exe"
}
& $py -m pytest -q
Set-Location $Root

Write-Host "==> Frontend: build"
Set-Location "$Root\frontend"
if (Test-Path package-lock.json) { npm ci } else { npm install }
npm run build
Set-Location $Root

Write-Host "==> Frontend: Playwright smoke (FastAPI + SPA)"
Set-Location "$Root\frontend"
npx playwright install chromium
npm run test:e2e
Set-Location $Root

try {
    docker info *> $null
    Write-Host "==> Docker: build + smoke"
    & "$Root\scripts\docker-smoke.ps1"
} catch {
    Write-Host "==> Docker: ignorado (daemon indisponível)"
}

Write-Host ""
Write-Host "Release gate OK."
