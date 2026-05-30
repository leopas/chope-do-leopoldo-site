#!/usr/bin/env bash
# Release gate local (CRP-010) — falha no primeiro erro.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Backend: pytest"
cd backend
python -m pip install -q -r requirements.txt -r requirements-dev.txt
python -m pytest -q
cd "$ROOT"

echo "==> Frontend: build"
cd frontend
if [ -f package-lock.json ]; then npm ci; else npm install; fi
npm run build
cd "$ROOT"

echo "==> Frontend: Playwright smoke (FastAPI + SPA)"
cd frontend
npx playwright install chromium
npm run test:e2e
cd "$ROOT"

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo "==> Docker: build + smoke /health"
  bash "$ROOT/scripts/docker-smoke.sh"
else
  echo "==> Docker: ignorado (daemon indisponível)"
fi

echo ""
echo "Release gate OK."
