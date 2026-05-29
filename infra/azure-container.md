# Container Azure-ready — Chope do Leopoldo

Imagem única: frontend Vite (build) + FastAPI (API + SPA + uploads).

## Build local

Na raiz do monorepo:

```bash
docker build -t chope-do-leopoldo-site .
```

## Executar com Compose

1. Copie `.env.example` → `.env.local` e preencha segredos (`DATABASE_URL`, `JWT_SECRET`, admin, etc.).
2. Coloque o certificado CA do Azure em `certs/azure-db-ca.pem` (não commitar).
3. Se o arquivo não existir, comente o volume do certificado no `docker-compose.yml` ou crie um placeholder vazio só para subir sem SSL.

```bash
docker compose up --build
```

## Endpoints (aceite CRP-009)

| URL | Esperado |
|-----|----------|
| http://localhost:8000/health | `{"status":"ok"}` |
| http://localhost:8000/api/health/db | OK / skipped / erro SSL conforme env |
| http://localhost:8000/ | SPA (home) |
| http://localhost:8000/menu | SPA (cardápio) |
| http://localhost:8000/lp/karaoke-sexta | SPA (landing) |
| http://localhost:8000/admin | SPA → redirect login admin |

## Layout na imagem

```text
/app/
├── app/
│   ├── main.py
│   └── static/
│       ├── frontend/     # dist do Vite (index.html + assets/)
│       └── uploads/      # volume persistente
├── requirements.txt
└── alembic/              # migrations em runtime
```

Processo: **Gunicorn** + `uvicorn.workers.UvicornWorker` na porta **8000**.

## Variáveis de ambiente (Azure Container Apps / App Service)

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | PostgreSQL/MySQL Azure |
| `DB_SSL_ENABLED` | `true` em produção |
| `DB_SSL_CA_PATH` | Caminho do PEM montado (ex.: `/app/certs/azure-db-ca.pem`) |
| `DB_SSL_MODE` | `verify-full` (Postgres) |
| `JWT_SECRET` | Obrigatório para admin |
| `ADMIN_INITIAL_EMAIL` / `ADMIN_INITIAL_PASSWORD` | Primeiro admin (seed) |
| `CORS_ALLOWED_ORIGINS` | Origens do site público |
| `UPLOADS_DIR` | `/app/app/static/uploads` |
| `MEDIA_STORAGE_PROVIDER` | `local` ou `azure_blob` (futuro) |

**Nunca** colocar connection string, JWT ou senha admin no Dockerfile.

## Certificado SSL do banco

### Docker Compose (dev)

```yaml
volumes:
  - ./certs/azure-db-ca.pem:/app/certs/azure-db-ca.pem:ro
environment:
  DB_SSL_ENABLED: "true"
  DB_SSL_CA_PATH: /app/certs/azure-db-ca.pem
```

### Azure

- **Container Apps / Web App:** montar secret como arquivo ou usar Key Vault reference.
- Apenas o **CA público** pode ir na imagem em casos excepcionais; o padrão deste projeto é **volume/secret em runtime**.
- Connection string via **Application Settings** ou **secrets**, nunca na imagem.

## Migrations e seed (primeiro deploy)

Com `DATABASE_URL` configurada, entre no container ou use um job one-shot:

```bash
docker compose exec app alembic upgrade head
docker compose exec app python -m app.db.seed
```

## SPA fallback

Rotas registradas antes do mount estático:

- `/health`
- `/api/*` (pública, admin, health/db)
- `/uploads/*`

Qualquer outro path (`/menu`, `/admin`, `/lp/...`) sem arquivo físico recebe `index.html` (`StaticFiles(..., html=True)`).

## Health check

O `Dockerfile` define `HEALTHCHECK` em `/health`. No Azure, aponte o probe para o mesmo path.

## Storage de uploads

Use volume persistente ou, em produção, migre para `MEDIA_STORAGE_PROVIDER=azure_blob` (CRP-006) com container dedicado.

## Troubleshooting

| Sintoma | Causa provável |
|---------|----------------|
| 502 no container | `JWT_SECRET` ausente com rotas admin; ou falha SSL no startup |
| SPA 404 em `/menu` | Build frontend não copiado → verificar `app/static/frontend/index.html` na imagem |
| DB SSL error | `DB_SSL_CA_PATH` incorreto ou PEM não montado |
| Admin 401 | Login em `/admin/login`; token em `localStorage` |

## Referências

- [certs/README.md](../certs/README.md) — certificado Azure DB
- [.env.example](../.env.example) — placeholders de variáveis
- [README.md](../README.md) — visão geral do monorepo
