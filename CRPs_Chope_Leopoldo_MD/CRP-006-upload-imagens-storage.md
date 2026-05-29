# CRP-006 — Upload de Imagens e Biblioteca de Mídia

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Implementar upload real de imagens para produtos, categorias, campanhas e biblioteca de mídia.

## Fase 1 — Local

Salvar arquivos em:

```text
backend/app/static/uploads/
```

Expor via:

```text
/uploads/{filename}
```

## Fase 2 — Azure Blob preparado

Adicionar abstração de storage:

```text
backend/app/services/storage/
├── base.py
├── local_storage.py
└── azure_blob_storage.py
```

Variáveis:

```env
MEDIA_STORAGE_PROVIDER=local
# MEDIA_STORAGE_PROVIDER=azure_blob

AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER=chope-media
AZURE_STORAGE_ACCOUNT_URL=
```

## Rotas

```text
POST /api/admin/media/upload
GET /api/admin/media
DELETE /api/admin/media/{id}
```

## Validações

- aceitar JPG, PNG, WebP;
- limitar tamanho, por exemplo `MAX_UPLOAD_MB=5`;
- rejeitar MIME inválido;
- gerar nome seguro;
- preservar alt text;
- registrar em `media_assets`.

## Critérios de aceite

- Upload no admin cria media asset.
- Imagem aparece no grid `/admin/imagens`.
- Produto consegue usar imagem enviada.
- Categoria consegue usar imagem enviada.
- Campanha consegue usar imagem enviada.
- Storage local funciona no Docker.
- Abstração Azure Blob existe, mesmo que a primeira entrega use local.

## Prompt executor

```md
Implemente upload real de imagens.

Backend:
- Criar `POST /api/admin/media/upload` com multipart/form-data.
- Validar tipo e tamanho.
- Salvar localmente em `backend/app/static/uploads` por padrão.
- Registrar `media_assets`.
- Criar abstração para futura Azure Blob.

Frontend:
- Adaptar ImageUploader para enviar arquivo para API.
- Atualizar preview com URL retornada.
- Atualizar biblioteca de mídia.

Não criar editor avançado.
Não criar crop.
```
