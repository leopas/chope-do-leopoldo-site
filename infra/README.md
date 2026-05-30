# Infraestrutura

- **CRP-000:** Docker e compose mínimos na raiz do monorepo.
- **CRP-002:** Conexão Azure DB com certificado CA (`certs/`, variáveis `DB_SSL_*`).
- **CRP-003:** Alembic + modelos SQLAlchemy + seed idempotente (`alembic upgrade head`, `python -m app.db.seed`).
- **CRP-009:** Container Azure-ready — [azure-container.md](azure-container.md) (Gunicorn, SPA fallback, certificado via volume).
- **CRP-010:** Release gate — [../docs/release-checklist.md](../docs/release-checklist.md), scripts `../scripts/release-gate.*`.
- Certificados Azure DB: montar em `certs/` (não versionar `.pem`).
