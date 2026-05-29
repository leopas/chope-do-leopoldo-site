# CRP-002 — Banco Azure com Certificado SSL/TLS

**Projeto:** Chope do Leopoldo — Site/Cardápio + Admin + Campanhas  
**Origem visual:** `leopoldo-bar-flow` gerado pelo Lovable  
**Destino:** novo monorepo com frontend React/Vite e backend Python/FastAPI  
**Princípio:** migrar o visual, não carregar o runtime/backend Node/TanStack Start como backend real.  
**Regra de ouro:** nada de ODS, Datamart, BI corporativo, financeiro, contratos ou delivery complexo nesta fase.

---
## Objetivo

Implementar conexão segura com o banco de dados hospedado na Azure, usando certificado CA obrigatório.

## Contexto

O banco de dados está na Azure e exige certificado para conexão SSL/TLS. O certificado real não deve ser versionado. A aplicação deve receber o caminho do certificado por variável de ambiente.

## Decisão

Criar camada de banco configurável, com SQLAlchemy 2 e suporte a certificado CA.

A implementação deve detectar o driver pela `DATABASE_URL`:

- `postgresql+psycopg://...` → usar `sslmode`/`sslrootcert`;
- `mysql+pymysql://...` → usar `ssl.ca`.

Essa abordagem evita travar o projeto antes de confirmar se o banco é Azure PostgreSQL ou Azure MySQL.

## Estrutura

```text
backend/app/db/
├── session.py
├── base.py
└── ssl.py
```

## Variáveis de ambiente

```env
DATABASE_URL=postgresql+psycopg://user:password@host:5432/dbname
# ou:
# DATABASE_URL=mysql+pymysql://user:password@host:3306/dbname

DB_SSL_ENABLED=true
DB_SSL_CA_PATH=/app/certs/azure-db-ca.pem
DB_SSL_MODE=verify-full
```

## Regras de segurança

- Não commitar certificado real.
- Não commitar `.env`.
- Criar apenas `.env.example`.
- Em container, montar certificado em `/app/certs/azure-db-ca.pem` ou caminho configurado.
- Falhar de forma explícita se `DB_SSL_ENABLED=true` e o arquivo do certificado não existir.
- Logar apenas estado de conexão, nunca connection string completa.

## Implementação esperada

`session.py` deve:

- criar engine SQLAlchemy;
- aplicar `connect_args` conforme driver;
- usar pool_pre_ping;
- expor `SessionLocal`;
- expor dependency `get_db`.

Pseudo-lógica:

```python
if db_ssl_enabled:
    if not ca_path.exists():
        raise RuntimeError("DB_SSL_CA_PATH not found")

    if database_url.startswith("postgresql"):
        connect_args = {
            "sslmode": "verify-full",
            "sslrootcert": str(ca_path),
        }

    if database_url.startswith("mysql"):
        connect_args = {
            "ssl": {"ca": str(ca_path)}
        }
```

## Critérios de aceite

- Aplicação sobe sem banco se `DATABASE_URL` não for exigida em modo local mock.
- Aplicação conecta com banco quando `DATABASE_URL` e `DB_SSL_CA_PATH` são válidos.
- Aplicação falha claramente quando certificado obrigatório não existe.
- `/health` tem health básico.
- `/api/health/db` testa conexão real no banco.
- README explica como baixar/montar o certificado sem commitar no Git.

## Prompt executor

```md
Implemente a camada de banco em `backend/app/db`.

Use SQLAlchemy 2.
Use pydantic-settings para ler:
- DATABASE_URL
- DB_SSL_ENABLED
- DB_SSL_CA_PATH
- DB_SSL_MODE

A conexão deve suportar:
- PostgreSQL com psycopg e sslrootcert
- MySQL com pymysql e ssl.ca

Não commitar certificado.
Criar `.env.example` com placeholders.
Criar endpoint `/api/health/db` que executa `SELECT 1`.

Se `DB_SSL_ENABLED=true` e o certificado não existir, a aplicação deve falhar com erro claro.
```
