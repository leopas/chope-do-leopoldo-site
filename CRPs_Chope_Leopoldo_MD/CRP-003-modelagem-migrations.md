# CRP-003 — Modelagem Canônica e Migrations

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Criar a modelagem mínima do produto real, sem ODS e sem Datamart.

## Entidades

```text
admin_users
categories
products
media_assets
campaigns
site_settings
tracking_events
coupon_redemptions  # preparado, pode ficar para depois
```

## Modelos

### categories

- id UUID/string;
- name;
- description;
- icon;
- image_url;
- image_alt;
- accent_color;
- is_active;
- display_order;
- created_at;
- updated_at.

### products

- id;
- name;
- description;
- price_cents;
- category_id;
- image_url;
- image_alt;
- is_alcoholic;
- is_featured;
- is_active;
- display_order;
- created_at;
- updated_at.

### campaigns

- id;
- name;
- slug unique;
- title;
- description;
- hero_image_url;
- hero_image_alt;
- coupon_code;
- channel;
- status;
- start_date;
- end_date;
- cta_label;
- created_at;
- updated_at.

### media_assets

- id;
- name;
- url;
- alt;
- type;
- storage_provider;
- blob_name;
- uploaded_at;
- created_at.

### site_settings

Pode ser chave-valor ou registro único. Para MVP, registro único é suficiente:

- id;
- business_name;
- whatsapp_number;
- whatsapp_display;
- instagram_handle;
- address;
- maps_url;
- opening_hours;
- home_intro;
- show_responsible_drinking_notice;
- meta_pixel_id;
- google_tag_manager_id;
- load_marketing_scripts_after_consent;
- updated_at.

### tracking_events

- id;
- event_name;
- campaign_id nullable;
- campaign_slug nullable;
- product_id nullable;
- session_id;
- anonymous_id;
- utm_source;
- utm_medium;
- utm_campaign;
- utm_content;
- fbclid;
- user_agent;
- ip_hash;
- payload_json;
- created_at.

## Ferramentas

- SQLAlchemy 2;
- Alembic;
- Pydantic schemas.

## Seed inicial

Criar seed com:

- categorias: Chopes, Drinks, Hambúrgueres, Porções, Bebidas, Eventos;
- produtos exemplo;
- campanhas exemplo;
- settings do Chope do Leopoldo.

## Critérios de aceite

- `alembic upgrade head` cria tabelas.
- Seed roda idempotente.
- Nenhuma entidade depende de ODS/Datamart.
- Preço salvo como inteiro em centavos.
- `slug` de campanha é único.
- IDs usam UUID/string de forma consistente.

## Prompt executor

```md
Crie modelos SQLAlchemy, schemas Pydantic e migrations Alembic para:
- admin_users
- categories
- products
- media_assets
- campaigns
- site_settings
- tracking_events

Não criar ODS.
Não criar Datamart.
Não criar BI.

Preço deve ser salvo em centavos.
Campaign.slug deve ser único.
Criar seed idempotente com categorias, produtos, campanhas e settings iniciais.
```
