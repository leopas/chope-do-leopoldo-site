# Chope do Leopoldo — Site / Cardápio

Monorepo com frontend React (Vite) e backend Python (FastAPI). O visual do protótipo Lovable (`leopoldo-bar-flow`) foi migrado no CRP-001 (React Router DOM + mocks locais).

## Estrutura

```text
chope-do-leopoldo-site/
├── backend/          # FastAPI
├── frontend/         # React + Vite + Tailwind
├── infra/            # Notas de infraestrutura
├── docs/             # Documentação do projeto
├── CRPs_Chope_Leopoldo_MD/
├── Dockerfile
└── docker-compose.yml
```

## Pré-requisitos

- Python 3.12+
- Node.js 22+
- npm

## Backend (local)

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- Health básico: [http://localhost:8000/health](http://localhost:8000/health) → `{"status":"ok"}`
- Health do banco: [http://localhost:8000/api/health/db](http://localhost:8000/api/health/db)  
  - Sem `DATABASE_URL`: `{"status":"skipped","database":"not_configured"}`  
  - Com banco + SSL ok: `{"status":"ok","database":"connected"}`

### Banco Azure com certificado SSL (CRP-002)

A conexão usa SQLAlchemy 2 e detecta o driver pela `DATABASE_URL`:

- `postgresql+psycopg://...` → `sslmode` + `sslrootcert`
- `mysql+pymysql://...` → `ssl.ca`

Variáveis (ver `.env.example`):

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME
DB_SSL_ENABLED=true
DB_SSL_CA_PATH=./certs/azure-db-ca.pem
DB_SSL_MODE=verify-full
```

**Não commite** o certificado real nem `.env`. Instruções completas: [certs/README.md](certs/README.md).

Se `DB_SSL_ENABLED=true` e o arquivo em `DB_SSL_CA_PATH` não existir, a API **não sobe** (erro explícito no startup).

Testes do backend:

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

### Modelagem e migrations (CRP-003)

Entidades canônicas (sem ODS/Datamart): `categories`, `products`, `campaigns`, `media_assets`, `site_settings`, `tracking_events`, `admin_users`, `coupon_redemptions` (preparado).

Preços em **centavos** (`price_cents`). `campaigns.slug` é único.

Com `DATABASE_URL` configurada:

```bash
cd backend
alembic upgrade head
python -m app.db.seed
```

O seed é **idempotente** (pode rodar mais de uma vez). Popula categorias, produtos, campanhas, mídias e settings do Chope do Leopoldo.

Schemas Pydantic de leitura em `backend/app/schemas/`.

### API pública (CRP-004)

Rotas sem autenticação (prefixo `/api/public`):

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/settings` | Configurações do site |
| GET | `/menu` | Pacote completo (settings, categorias, produtos, campanhas) |
| GET | `/categories` | Categorias ativas |
| GET | `/products` | Produtos ativos |
| GET | `/campaigns` | Campanhas `active` |
| GET | `/campaigns/{slug}` | Campanha por slug (404 se ausente) |
| POST | `/tracking-events` | Registra evento de tracking |

Documentação interativa: [http://localhost:8000/docs](http://localhost:8000/docs)

O frontend hidrata o Zustand via `GET /api/public/menu` quando o backend está disponível (fallback para mocks).

## Frontend (local)

```bash
cd frontend
npm install
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)
- O Vite faz proxy de `/health` e `/api` para a porta 8000.

## Build do frontend

```bash
cd frontend
npm run build
```

Saída em `frontend/dist/`. Para servir pelo FastAPI, copie o conteúdo para `backend/app/static/` (o Dockerfile faz isso automaticamente).

## Docker

```bash
docker compose up --build
```

- App + API: [http://localhost:8000](http://localhost:8000)
- Health: [http://localhost:8000/health](http://localhost:8000/health)

Copie `.env.example` para `.env.local` quando precisar de variáveis extras (não commitar segredos).

## CRPs

Pacote de mudanças em `CRPs_Chope_Leopoldo_MD/`. Ordem: 000 → 010.
