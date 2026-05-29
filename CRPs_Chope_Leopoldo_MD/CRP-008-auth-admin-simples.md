# CRP-008 — Autenticação Admin Simples

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Proteger a área `/admin/*` e as APIs `/api/admin/*` com autenticação simples e suficiente para o MVP.

## Escopo

- Login admin por usuário/senha.
- JWT access token.
- Proteção de rotas admin no backend.
- Proteção de rotas admin no frontend.
- Logout.
- Usuário admin seedado via variável ou seed seguro.

## Variáveis

```env
JWT_SECRET=change-me
JWT_ALGORITHM=HS256
JWT_EXPIRES_MINUTES=480
ADMIN_INITIAL_EMAIL=admin@example.com
ADMIN_INITIAL_PASSWORD=change-me
```

## Regras

- Senha deve ser hashada com bcrypt/argon2.
- Nunca logar senha.
- Não salvar senha em claro.
- `.env.example` só com placeholders.
- Em produção, exigir troca da senha inicial ou documentar procedimento.

## Rotas

```text
POST /api/admin/auth/login
GET /api/admin/auth/me
POST /api/admin/auth/logout
```

## Critérios de aceite

- `/admin` redireciona para login se não autenticado.
- Login válido libera admin.
- Token inválido bloqueia APIs admin.
- APIs públicas continuam abertas.
- `/api/public/*` não exige token.
- `/api/admin/*` exige token.

## Prompt executor

```md
Implemente autenticação admin simples.

Backend:
- Criar admin_users.
- Criar login com JWT.
- Proteger rotas /api/admin/*.
- Hash de senha seguro.

Frontend:
- Criar tela /admin/login.
- Guard de rotas admin.
- Armazenar token de forma simples para MVP.
- Adicionar logout.

Não criar RBAC complexo.
Não criar SSO.
```
