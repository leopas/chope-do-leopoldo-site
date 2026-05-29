# Pacote de CRPs — Chope do Leopoldo Site/Cardápio com Backend Python

Este pacote organiza a migração do protótipo visual criado pelo Lovable para um produto real com:

- frontend React/TypeScript/Vite;
- backend obrigatório em Python/FastAPI;
- banco de dados na Azure com conexão SSL/TLS via certificado CA;
- container Docker multi-stage;
- deploy preparado para Azure Container Apps ou Azure App Service for Containers;
- admin simples para produtos, categorias, imagens, campanhas, landing pages e configurações;
- tracking leve para campanhas, Pixel/GTM e medições futuras.

## Premissas

1. O projeto `leopoldo-bar-flow` é a origem visual.
2. O novo projeto será criado do zero para evitar carregar acoplamentos antigos.
3. O backend canônico será FastAPI.
4. O banco Azure exige certificado CA para conexão.
5. O certificado não deve ser commitado no repositório.
6. A aplicação deve aceitar o caminho do certificado via variável de ambiente.
7. O frontend deve consumir `/api/*`.
8. O FastAPI deve servir os assets estáticos do frontend buildado no container final.

## Ordem recomendada

1. `CRP-000` — Bootstrap do monorepo.
2. `CRP-001` — Migração visual do Lovable.
3. `CRP-002` — Configuração segura do banco Azure com certificado.
4. `CRP-003` — Modelagem e migrations.
5. `CRP-004` — API pública do cardápio e campanhas.
6. `CRP-005` — Admin real com CRUD.
7. `CRP-006` — Upload e biblioteca de imagens.
8. `CRP-007` — Tracking, UTMs e eventos.
9. `CRP-008` — Autenticação admin simples.
10. `CRP-009` — Container Azure-ready.
11. `CRP-010` — Testes, smoke tests e DoD de release.

## Convenção

Cada CRP contém:

- objetivo;
- contexto;
- escopo;
- fora de escopo;
- mudanças esperadas;
- variáveis de ambiente;
- critérios de aceite;
- prompt executor para Cursor/Codex/Lovable-like builder.

## Cuidado com o certificado

O certificado CA deve ser montado no container ou injetado como secret/volume. Exemplo de variável:

```env
DB_SSL_CA_PATH=/app/certs/azure-db-ca.pem
```

Não gravar certificado real no Git.
Não colocar senha, connection string ou certificado em Markdown definitivo.
Usar `.env.example` apenas com placeholders.
