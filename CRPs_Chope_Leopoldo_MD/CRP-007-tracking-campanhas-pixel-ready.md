# CRP-007 — Tracking, UTMs e Pixel-Ready

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Registrar eventos de campanha e preparar a integração futura com Meta Pixel/GTM sem disparar scripts de marketing sem consentimento.

## Eventos

```text
PageView
ViewMenu
ViewCampaignLandingPage
ClickWhatsApp
ClickDirections
ClickInstagram
ViewProduct
CouponShown
CouponCopied
UseCoupon
```

## Dados capturados

- `session_id`;
- `anonymous_id`;
- `utm_source`;
- `utm_medium`;
- `utm_campaign`;
- `utm_content`;
- `fbclid`;
- `campaign_slug`;
- `product_id`;
- payload adicional;
- user-agent;
- IP com hash ou truncamento, nunca IP cru se não for necessário.

## Rotas

```text
POST /api/public/tracking-events
GET /api/admin/campaigns/{id}/metrics
```

## Consentimento

Adicionar no frontend:

- banner simples de cookies/marketing;
- não carregar Pixel/GTM antes do consentimento;
- `analytics.track()` sempre pode registrar evento interno básico, mas scripts de terceiros só com consentimento.

## Métricas iniciais

Por campanha:

- visualizações da landing;
- cliques no WhatsApp;
- cliques em rota;
- cupons exibidos;
- cupons copiados;
- taxa ClickWhatsApp / ViewCampaignLandingPage;
- taxa ClickDirections / ViewCampaignLandingPage.

## Critérios de aceite

- Landing page registra `ViewCampaignLandingPage`.
- Botão WhatsApp registra `ClickWhatsApp`.
- Botão Como Chegar registra `ClickDirections`.
- Admin mostra métricas simples por campanha.
- Nenhum Pixel real é carregado se não houver consentimento.
- `metaPixelId` e `googleTagManagerId` seguem em settings.

## Prompt executor

```md
Implemente tracking leve de campanhas.

Backend:
- Criar modelo tracking_events se ainda não existir.
- Criar POST /api/public/tracking-events.
- Criar GET /api/admin/campaigns/{id}/metrics.

Frontend:
- Implementar analytics.track() chamando API.
- Capturar UTMs e fbclid.
- Criar session_id/anonymous_id local.
- Registrar eventos em home, menu, landing pages e CTAs.
- Adicionar banner simples de consentimento para scripts de marketing.

Não implementar Meta Pixel real ainda.
Não enviar dados pessoais.
```
