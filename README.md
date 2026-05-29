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

### Autenticação admin (CRP-008)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/admin/auth/login` | E-mail + senha → JWT |
| GET | `/api/admin/auth/me` | Usuário autenticado (Bearer) |
| POST | `/api/admin/auth/logout` | Logout stateless (cliente descarta token) |

Todas as demais rotas `/api/admin/*` exigem header `Authorization: Bearer <token>`.  
API pública (`/api/public/*`) permanece aberta.

Variáveis: `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRES_MINUTES`, `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`.  
O seed (`python -m app.db.seed`) cria/atualiza o usuário admin com senha **bcrypt** (nunca em texto puro no banco).

Frontend: `/admin/login`, guard nas rotas admin, token em `localStorage` (`chope_admin_token`).

### Admin CRUD real (CRP-005)

Rotas em `/api/admin/*` (protegidas por JWT desde CRP-008):

| Recurso | Operações |
|---------|-----------|
| `products` | list, create, get, update, delete |
| `categories` | list, create, get, update, delete |
| `campaigns` | list, create, get, update, delete |
| `media` | list, upload (multipart), create (URL externa), delete |
| `settings` | get, put |

O painel admin (`/admin/*`) usa `frontend/src/lib/api/client.ts` e serviços em `frontend/src/lib/api/admin/`. Após salvar, `syncPublicCatalog()` re-hidrata o cardápio público via `/api/public/menu`.

Sem `DATABASE_URL`, as rotas admin retornam **503** (mesmo comportamento da API pública).

### Upload de imagens (CRP-006)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/admin/media/upload` | `multipart/form-data`: `file`, `alt`, `type` |
| GET | `/api/admin/media` | Biblioteca de mídia |
| DELETE | `/api/admin/media/{id}` | Remove registro e arquivo (storage local) |

Arquivos locais (padrão): `backend/app/static/uploads/` → servidos em `/uploads/{filename}`.

Abstração de storage em `backend/app/services/storage/` (`local` e `azure_blob` preparado). Variáveis em `.env.example`:

- `MEDIA_STORAGE_PROVIDER=local`
- `MAX_UPLOAD_MB=5`
- `UPLOADS_DIR` (opcional; Docker: `/app/backend/app/static/uploads`)

No dev com Vite, `/uploads` também é proxy para a API.

### Tracking e campanhas (CRP-007)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/public/tracking-events` | Eventos (UTMs, session, IP hasheado) |
| GET | `/api/admin/campaigns/{id}/metrics` | Métricas agregadas da campanha |

Eventos: `PageView`, `ViewMenu`, `ViewCampaignLandingPage`, `ClickWhatsApp`, `ClickDirections`, `ClickInstagram`, `ViewProduct`, `CouponShown`, `CouponCopied`.

Frontend: `track()` em `frontend/src/lib/analytics.ts`, captura de UTMs/`fbclid`, banner de consentimento antes de scripts Meta/GTM (IDs em settings; SDK real não carregado nesta fase).

## Frontend (local)

```bash
cd frontend
npm install
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)
- O Vite faz proxy de `/health`, `/api` e `/uploads` para a porta 8000.

## Build do frontend

```bash
cd frontend
npm run build
```

Saída em `frontend/dist/`. Em produção o Dockerfile copia para `backend/app/static/frontend/` (SPA com fallback em `/menu`, `/admin`, `/lp/*`).

## Docker (CRP-009 — Azure-ready)

Build multi-stage: Node (Vite) → `backend/app/static/frontend`, Python + **Gunicorn/Uvicorn**.

```bash
docker compose up --build
```

| URL | Descrição |
|-----|-----------|
| [http://localhost:8000/health](http://localhost:8000/health) | Health da API |
| [http://localhost:8000/](http://localhost:8000/) | SPA (home) |
| [http://localhost:8000/menu](http://localhost:8000/menu) | SPA (cardápio) |
| [http://localhost:8000/admin](http://localhost:8000/admin) | SPA (admin) |
| [http://localhost:8000/api/health/db](http://localhost:8000/api/health/db) | Health do banco |

- Certificado DB: montar `certs/azure-db-ca.pem` (ver `docker-compose.yml`, não commitar o `.pem`).
- Uploads: volume `chope-uploads` em `/app/app/static/uploads`.
- Deploy Azure: [infra/azure-container.md](infra/azure-container.md).

Copie `.env.example` para `.env.local` (`DATABASE_URL`, `JWT_SECRET`, admin, etc.).

## CRPs

Pacote de mudanças em `CRPs_Chope_Leopoldo_MD/`. Ordem: 000 → 010.
