# Checklist de release — Chope do Leopoldo

Use antes de cada deploy (Azure ou ambiente novo).

## Segredos e certificados

- [ ] `.env.example` revisado; valores reais só em `.env.local` / App Settings (nunca no Git)
- [ ] `certs/*.pem` **não** commitados (`certs/README.md` seguido)
- [ ] `DB_SSL_CA_PATH` documentado e PEM montado no container
- [ ] `JWT_SECRET` forte em produção (não `change-me`)
- [ ] Senha admin inicial trocada após primeiro acesso

## Banco de dados

- [ ] `alembic upgrade head` executado no ambiente alvo
- [ ] `python -m app.db.seed` idempotente (pode repetir)
- [ ] `GET /api/health/db` → `{"status":"ok","database":"connected"}`

## Qualidade automatizada (release gate)

```bash
# Linux/macOS
bash scripts/release-gate.sh

# Windows
powershell -File scripts/release-gate.ps1
```

Inclui:

- [ ] `pytest` backend (health, menu, campanhas, admin+auth, tracking, upload)
- [ ] `npm run build` frontend
- [ ] Playwright smoke: `/`, `/menu`, `/lp/karaoke-sexta`, `/admin/login`
- [ ] `docker build` + `curl /health` (se Docker disponível)

CI equivalente: workflow `.github/workflows/release-gate.yml`.

## Smoke manual pós-deploy

- [ ] `GET /health` → ok
- [ ] `/` — home
- [ ] `/menu` — cardápio
- [ ] `/lp/karaoke-sexta` — landing
- [ ] `/admin/login` — login admin
- [ ] Login admin + salvar um produto de teste
- [ ] Upload de imagem no admin

## Regras de produto (MVP)

- [ ] Nenhum módulo ODS/Datamart no runtime (`pytest` `test_runtime_has_no_ods_or_datamart`)
- [ ] Meta Pixel / GTM **não** carregam sem consentimento do banner
- [ ] APIs públicas (`/api/public/*`) abertas; admin exige JWT

## Referências

- [infra/azure-container.md](../infra/azure-container.md)
- [README.md](../README.md)
