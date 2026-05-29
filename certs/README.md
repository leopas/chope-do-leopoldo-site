# Certificados Azure DB (não versionar)

Coloque aqui o certificado CA fornecido pela Azure para conexão SSL/TLS com o banco.

## Arquivo esperado

- Nome sugerido: `azure-db-ca.pem`
- Caminho padrão no container: `/app/certs/azure-db-ca.pem`
- Variável: `DB_SSL_CA_PATH=/app/certs/azure-db-ca.pem`

**Nunca commite** arquivos `.pem`, `.crt` ou `.key` reais neste repositório.

## Como obter o certificado

### Azure Database for PostgreSQL

1. No portal Azure, abra o servidor PostgreSQL.
2. Em **Segurança** / documentação de SSL, baixe o certificado raiz (DigiCert ou equivalente).
3. Salve como `certs/azure-db-ca.pem` localmente (fora do Git).

### Azure Database for MySQL

1. Baixe o certificado SSL recomendado pela Microsoft para MySQL na Azure.
2. Salve como `certs/azure-db-ca.pem`.

## Uso local

```bash
# Na raiz do monorepo
mkdir -p certs
# copie o arquivo baixado para certs/azure-db-ca.pem

# .env.local (não commitar)
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME
DB_SSL_ENABLED=true
DB_SSL_CA_PATH=./certs/azure-db-ca.pem
DB_SSL_MODE=verify-full
```

## Docker Compose

O `docker-compose.yml` monta `./certs` em `/app/certs` (somente leitura). Coloque o `.pem` na pasta `certs/` antes de subir o container.

## Verificar conexão

Com backend rodando e variáveis configuradas:

```bash
curl http://localhost:8000/api/health/db
```

Resposta esperada: `{"status":"ok","database":"connected"}`.
