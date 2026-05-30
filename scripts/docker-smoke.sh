#!/usr/bin/env bash
# Build da imagem e smoke HTTP em /health (CRP-010).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="${CHOPE_DOCKER_IMAGE:-chope-site:local}"
PORT="${CHOPE_DOCKER_PORT:-18000}"
HEALTH_URL="http://127.0.0.1:${PORT}/health"

cd "$ROOT"
docker build -t "$IMAGE" .

CID=""
cleanup() {
  if [ -n "$CID" ]; then
    docker rm -f "$CID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

# Env mínimo para subir sem Azure DB / JWT obrigatório no startup
CID=$(docker run -d --rm -p "${PORT}:8000" \
  -e APP_ENV=local \
  -e APP_NAME=chope-do-leopoldo-site \
  -e JWT_SECRET=local-docker-smoke-secret \
  -e ADMIN_INITIAL_EMAIL=admin@example.com \
  -e ADMIN_INITIAL_PASSWORD=change-me \
  "$IMAGE")

for i in $(seq 1 30); do
  if curl -sf "$HEALTH_URL" >/dev/null; then
    echo "Docker smoke OK: $HEALTH_URL"
    curl -sf "$HEALTH_URL"
    echo ""
    exit 0
  fi
  sleep 1
done

echo "Timeout aguardando $HEALTH_URL"
docker logs "$CID" 2>&1 | tail -30
exit 1
