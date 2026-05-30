# Build da imagem e smoke HTTP em /health (CRP-010)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Image = if ($env:CHOPE_DOCKER_IMAGE) { $env:CHOPE_DOCKER_IMAGE } else { "chope-site:local" }
$Port = if ($env:CHOPE_DOCKER_PORT) { $env:CHOPE_DOCKER_PORT } else { "18000" }
$HealthUrl = "http://127.0.0.1:$Port/health"

Set-Location $Root
docker build -t $Image .

$cid = docker run -d --rm -p "${Port}:8000" `
  -e APP_ENV=local `
  -e APP_NAME=chope-do-leopoldo-site `
  -e JWT_SECRET=local-docker-smoke-secret `
  -e ADMIN_INITIAL_EMAIL=admin@example.com `
  -e ADMIN_INITIAL_PASSWORD=change-me `
  $Image

try {
    $ok = $false
    foreach ($i in 1..30) {
        try {
            $r = Invoke-WebRequest -Uri $HealthUrl -UseBasicParsing -TimeoutSec 2
            if ($r.StatusCode -eq 200) {
                Write-Host "Docker smoke OK: $HealthUrl"
                Write-Host $r.Content
                $ok = $true
                break
            }
        } catch { Start-Sleep -Seconds 1 }
    }
    if (-not $ok) {
        docker logs $cid 2>&1 | Select-Object -Last 30
        throw "Timeout aguardando $HealthUrl"
    }
} finally {
    docker rm -f $cid 2>$null | Out-Null
}
