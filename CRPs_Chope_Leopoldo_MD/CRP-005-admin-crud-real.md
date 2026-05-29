# CRP-005 — Admin CRUD Real

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Transformar o admin visual em admin funcional, persistindo produtos, categorias, campanhas, landing pages/settings e imagens.

## Escopo

Rotas admin:

```text
GET /api/admin/products
POST /api/admin/products
GET /api/admin/products/{id}
PUT /api/admin/products/{id}
DELETE /api/admin/products/{id}

GET /api/admin/categories
POST /api/admin/categories
GET /api/admin/categories/{id}
PUT /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

GET /api/admin/campaigns
POST /api/admin/campaigns
GET /api/admin/campaigns/{id}
PUT /api/admin/campaigns/{id}
DELETE /api/admin/campaigns/{id}

GET /api/admin/media
DELETE /api/admin/media/{id}

GET /api/admin/settings
PUT /api/admin/settings
```

## Frontend

Substituir mock/Zustand como fonte de verdade por chamadas HTTP.

Atenção:

- Zustand pode continuar para estado de UI temporário.
- Dados persistentes devem vir da API.
- Criar `frontend/src/lib/api/client.ts`.
- Criar serviços:
  - `productsApi`;
  - `categoriesApi`;
  - `campaignsApi`;
  - `mediaApi`;
  - `settingsApi`.

## Critérios de aceite

- Criar produto no admin salva no banco.
- Editar produto reflete no cardápio público.
- Desativar produto remove do público.
- Criar categoria salva no banco.
- Criar campanha cria landing `/lp/:slug`.
- Alterar settings muda WhatsApp/endereço no público.
- Estados de loading/erro/empty state aparecem no frontend.

## Prompt executor

```md
Implemente CRUD real para admin no FastAPI e conecte o frontend.

Backend:
- Criar rotas `/api/admin/*`.
- Usar Pydantic para request/response.
- Usar SQLAlchemy para persistência.

Frontend:
- Criar client HTTP.
- Substituir mock store por chamadas de API nas telas admin.
- Manter UX simples.
- Adicionar loading, erro e sucesso.

Não implementar permissões complexas ainda.
Não implementar ODS/Datamart.
```
