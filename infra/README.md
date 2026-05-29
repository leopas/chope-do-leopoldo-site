# Infraestrutura

- **CRP-000:** Docker e compose mínimos na raiz do monorepo.
- **CRP-002:** Conexão Azure DB com certificado CA (`certs/`, variáveis `DB_SSL_*`).
- **CRP-009:** Container Azure-ready (multi-stage refinado, docs de deploy).
- Certificados Azure DB: montar em `certs/` (não versionar `.pem`).
