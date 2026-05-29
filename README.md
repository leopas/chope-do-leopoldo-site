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

- Health: [http://localhost:8000/health](http://localhost:8000/health) → `{"status":"ok"}`

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
