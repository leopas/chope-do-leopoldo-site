#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/frontend"
npm run build
rm -rf "$ROOT/backend/app/static/frontend"
mkdir -p "$ROOT/backend/app/static/frontend"
cp -r dist/* "$ROOT/backend/app/static/frontend/"
cd "$ROOT/backend"
export JWT_SECRET=e2e-jwt-secret
export ADMIN_INITIAL_EMAIL=admin@test.local
export ADMIN_INITIAL_PASSWORD=e2e-password
exec python -m uvicorn app.main:app --host 127.0.0.1 --port 4173
