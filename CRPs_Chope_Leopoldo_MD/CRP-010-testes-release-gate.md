# CRP-010 — Testes, Smoke Tests e Release Gate

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Criar um gate mínimo de qualidade para impedir regressões bobas antes do deploy.

## Testes backend

Ferramentas:

- pytest;
- httpx;
- pytest-asyncio se necessário.

Cobrir:

- `/health`;
- `/api/health/db`;
- `/api/public/menu`;
- `/api/public/campaigns/{slug}`;
- CRUD básico admin com auth;
- tracking event;
- upload de imagem com arquivo válido;
- rejeição de upload inválido.

## Testes frontend

Ferramentas:

- Vitest ou Playwright.
- Para MVP, Playwright é mais útil.

Rotas smoke:

```text
/
 /menu
 /lp/karaoke-sexta
 /admin/login
```

## Teste container

Script:

```bash
docker build -t chope-site:local .
docker run --rm -p 8000:8000 --env-file .env.local chope-site:local
curl http://localhost:8000/health
```

## Release checklist

- `.env.example` atualizado.
- Certificado não commitado.
- `DB_SSL_CA_PATH` documentado.
- Migrations rodam.
- Seed roda idempotente.
- Front build passa.
- Backend tests passam.
- Docker build passa.
- Smoke test de rotas passa.
- ODS/Datamart ausentes do runtime.
- Pixel/GTM não disparam sem consentimento.

## Critérios de aceite

- Pipeline local documentado.
- Testes automatizados mínimos presentes.
- Checklist de release no README.
- Nenhum segredo exposto.

## Prompt executor

```md
Implemente testes e release gate.

Backend:
- pytest para health, db health, menu, campanhas, admin CRUD, tracking e upload.
Frontend:
- Playwright smoke para /, /menu, /lp/karaoke-sexta, /admin/login.
Infra:
- script local de docker build/run/smoke.
Docs:
- checklist de release.

Não buscar cobertura perfeita agora.
Buscar proteção contra regressão básica e erro de deploy.
```
