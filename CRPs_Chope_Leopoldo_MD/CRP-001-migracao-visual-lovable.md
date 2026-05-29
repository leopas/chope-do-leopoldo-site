# CRP-001 — Migração Visual do Lovable

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Migrar a camada visual criada pelo Lovable para o novo frontend do monorepo.

## Origem

Projeto `leopoldo-bar-flow`, que contém:

- rotas públicas `/`, `/menu`, `/lp/$slug`;
- rotas admin `/admin`, `/admin/produtos`, `/admin/categorias`, `/admin/campanhas`, `/admin/imagens`, `/admin/configuracoes`;
- componentes públicos, admin e mídia;
- estilos em `src/styles.css`;
- mock data;
- helpers de WhatsApp, Maps e Analytics.

## Escopo

Migrar:

```text
src/components/public/
src/components/admin/
src/components/media/
src/components/ui/
src/lib/mock/
src/lib/types.ts
src/lib/whatsapp.ts
src/lib/maps.ts
src/lib/analytics.ts
src/styles.css
```

Adaptar rotas para o roteador escolhido no novo frontend.

Opção recomendada para simplicidade:

- React Router DOM no novo projeto;
- rotas explícitas em `frontend/src/routes.tsx`.

## Não migrar

Não levar como runtime:

```text
src/server.ts
src/start.ts
src/lib/config.server.ts
src/lib/api/example.functions.ts
createServerFn
TanStack Start como backend
```

## Escopo temporário permitido

Nesta fase, os dados ainda podem continuar mockados/local state.

## Critérios de aceite

- `/` abre a Home visual.
- `/menu` abre o cardápio visual.
- `/lp/karaoke-sexta` abre landing page.
- `/admin` abre dashboard.
- `/admin/produtos` abre produtos.
- `/admin/categorias` abre categorias.
- `/admin/campanhas` abre campanhas.
- `/admin/imagens` abre biblioteca de imagens.
- `/admin/configuracoes` abre settings.
- Build do frontend passa.

## Prompt executor

```md
Migre a camada visual do projeto `leopoldo-bar-flow` para `frontend/`.

Leve os componentes públicos, admin, mídia, UI, estilos, tipos, mocks e helpers.
Não leve runtime Node/TanStack Start como backend.

Adapte o roteamento para React Router DOM:
- `/`
- `/menu`
- `/lp/:slug`
- `/admin`
- `/admin/produtos`
- `/admin/categorias`
- `/admin/campanhas`
- `/admin/landing-pages`
- `/admin/imagens`
- `/admin/configuracoes`

Mantenha mock data local por enquanto.
Garanta `npm run build`.
```
