# CRP-000 — Bootstrap do Monorepo

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Criar um novo projeto limpo para receber o frontend visual do Lovable e o backend Python/FastAPI.

## Contexto

O Lovable gerou um projeto visual (`leopoldo-bar-flow`) com React, TanStack Router/Start, mock data, Zustand e componentes de admin/público. Esse projeto deve ser usado como referência visual, mas o backend real deve ser Python/FastAPI.

## Escopo

Criar estrutura:

```text
chope-do-leopoldo-site/
├── backend/
├── frontend/
├── infra/
├── docs/
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

Backend mínimo:

- FastAPI;
- `/health`;
- CORS configurável;
- estrutura de settings por Pydantic;
- logging básico;
- pasta para static frontend.

Frontend mínimo:

- React;
- TypeScript;
- Vite;
- Tailwind;
- alias `@/`;
- build para `dist/`.

## Fora de escopo

- Banco real.
- Autenticação.
- Upload de imagens.
- Pixel/GTM.
- CRUD real.
- Deploy Azure.

## Variáveis de ambiente mínimas

```env
APP_ENV=local
APP_NAME=chope-do-leopoldo-site
API_PREFIX=/api
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8000
```

## Critérios de aceite

- `GET /health` retorna `{"status":"ok"}`.
- Frontend abre localmente.
- Backend abre localmente.
- Dockerfile ainda pode ser mínimo, mas já deve existir.
- README com comandos locais.
- Nenhum runtime Node é usado como backend real.

## Prompt executor

```md
Crie um novo monorepo `chope-do-leopoldo-site`.

Backend:
- Use Python 3.12+, FastAPI, uvicorn, pydantic-settings.
- Crie `backend/app/main.py` com `/health`.
- Crie `backend/app/core/config.py`.
- Crie `backend/requirements.txt`.

Frontend:
- Use React + TypeScript + Vite + Tailwind.
- Configure alias `@/`.
- Crie uma Home mínima temporária.

Infra:
- Crie `.env.example`, `docker-compose.yml`, `Dockerfile` inicial e `README.md`.

Regras:
- Não use Node/TanStack Start como backend.
- Não crie banco ainda.
- Não implemente auth ainda.
- Não traga ODS/Datamart.
```
