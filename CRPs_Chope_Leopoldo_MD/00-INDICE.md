# Índice dos CRPs

| CRP | Nome | Objetivo |
|---|---|---|
| CRP-000 | Bootstrap do monorepo | Criar base limpa com backend FastAPI e frontend Vite |
| CRP-001 | Migração visual Lovable | Trazer telas, componentes e estilos do `leopoldo-bar-flow` |
| CRP-002 | Banco Azure com certificado | Conectar com Azure DB via SSL/TLS e CA externa |
| CRP-003 | Modelagem e migrations | Criar entidades canônicas sem ODS/Datamart |
| CRP-004 | API pública | Expor cardápio, campanhas, settings e tracking público |
| CRP-005 | Admin CRUD real | Persistir produtos, categorias, campanhas e settings |
| CRP-006 | Upload de imagens | Implementar mídia local/Azure Blob preparado |
| CRP-007 | Tracking e campanhas | UTMs, fbclid, session_id e eventos |
| CRP-008 | Autenticação admin | Login simples, JWT e proteção de rotas admin |
| CRP-009 | Container Azure-ready | Docker multi-stage e docs de deploy |
| CRP-010 | Testes e release gate | Smoke tests, API tests e checklist final |

## Definição de Done global

- Backend roda localmente com `uvicorn`.
- Frontend roda localmente com `npm run dev`.
- Container único roda localmente e serve `/`, `/menu`, `/lp/karaoke-sexta`, `/admin` e `/health`.
- `/api/docs` ou `/docs` abre documentação OpenAPI.
- Conexão com banco Azure usa certificado CA configurável por ambiente.
- Nenhum segredo real é commitado.
- ODS/Datamart não aparecem como dependência de runtime.
- CRUD admin persiste no banco.
- Front público consome APIs reais.
