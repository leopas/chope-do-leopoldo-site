# CRP-009 — Container Azure-Ready

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Preparar a aplicação para rodar em container na Azure com backend Python e frontend servido como asset estático.

## Estratégia

Usar Dockerfile multi-stage:

1. build frontend com Node;
2. copiar `frontend/dist` para `backend/app/static/frontend`;
3. instalar dependências Python;
4. iniciar FastAPI com Gunicorn + UvicornWorker.

## Dockerfile esperado

```dockerfile
FROM node:22-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM python:3.12-slim AS backend
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY --from=frontend-build /frontend/dist ./app/static/frontend

EXPOSE 8000

CMD ["gunicorn", "app.main:app", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

## Certificado do banco no container

O certificado deve ser montado ou copiado em runtime seguro. Exemplos:

Local `docker-compose`:

```yaml
volumes:
  - ./certs/azure-db-ca.pem:/app/certs/azure-db-ca.pem:ro
environment:
  DB_SSL_CA_PATH: /app/certs/azure-db-ca.pem
```

Azure:

- usar secret/volume quando disponível;
- ou incluir o certificado público CA no ambiente de build se for certificado CA público, mas não incluir segredos;
- nunca incluir connection string secreta no Dockerfile.

## FastAPI static fallback

FastAPI deve servir SPA fallback:

- `/assets/*` serve assets;
- `/api/*` serve API;
- qualquer outra rota retorna `index.html`.

## Critérios de aceite

- `docker build` funciona.
- `docker run` funciona.
- `/health` responde.
- `/` abre frontend.
- `/menu` abre frontend direto.
- `/lp/karaoke-sexta` abre frontend direto.
- `/admin` abre frontend direto.
- `/api/health/db` testa banco se envs presentes.
- Certificado é montado via volume/env e não commitado.

## Prompt executor

```md
Crie Dockerfile multi-stage Azure-ready.

- Buildar frontend.
- Copiar dist para backend/app/static/frontend.
- Rodar FastAPI com Gunicorn + UvicornWorker.
- Servir SPA via FastAPI.
- Criar docker-compose local com volume para certificado.
- Criar docs em infra/azure-container.md.

Garantir:
- /health
- /
- /menu
- /lp/karaoke-sexta
- /admin

Não colocar segredos ou certificado real no Git.
```
