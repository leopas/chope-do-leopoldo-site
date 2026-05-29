# CRP-004 — API Pública de Cardápio, Settings e Campanhas

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Expor APIs públicas para o frontend consumir cardápio, configurações e landing pages.

## Rotas

```text
GET /api/public/settings
GET /api/public/menu
GET /api/public/categories
GET /api/public/products
GET /api/public/campaigns
GET /api/public/campaigns/{slug}
POST /api/public/tracking-events
```

## Regras

- APIs públicas não exigem autenticação.
- Retornar apenas registros ativos, salvo regra específica.
- Ordenar categorias e produtos por `display_order`.
- Produtos inativos não aparecem no cardápio.
- Campanhas com status `active` aparecem publicamente.
- Campanha por slug deve retornar 404 amigável se não existir.

## Contrato `/api/public/menu`

Resposta esperada:

```json
{
  "settings": {},
  "categories": [],
  "products": [],
  "featuredProducts": [],
  "campaigns": []
}
```

## Critérios de aceite

- Home consegue renderizar settings e campanhas.
- Menu consegue renderizar categorias e produtos.
- Landing page consegue carregar campanha por slug.
- OpenAPI documenta as rotas.
- Testes básicos cobrem happy path e 404 de campanha.

## Prompt executor

```md
Implemente as rotas públicas FastAPI:
- GET /api/public/settings
- GET /api/public/menu
- GET /api/public/categories
- GET /api/public/products
- GET /api/public/campaigns
- GET /api/public/campaigns/{slug}
- POST /api/public/tracking-events

Use SQLAlchemy e Pydantic.
Não exigir autenticação.
Filtrar somente registros ativos.
Ordenar por display_order.
Criar testes básicos.
```
