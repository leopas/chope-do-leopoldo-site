# docker-compose.yml — exemplo com certificado Azure DB

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: chope-do-leopoldo-site
    ports:
      - "8000:8000"
    env_file:
      - .env.local
    volumes:
      - ./certs/azure-db-ca.pem:/app/certs/azure-db-ca.pem:ro
      - ./local-uploads:/app/app/static/uploads
    environment:
      DB_SSL_CA_PATH: /app/certs/azure-db-ca.pem
```

## Observações

- `certs/azure-db-ca.pem` não deve ser commitado.
- Adicione `certs/*.pem` no `.gitignore`.
- Para Azure, use secret/volume ou mecanismo equivalente de montagem segura.
```
