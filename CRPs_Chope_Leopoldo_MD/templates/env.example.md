# .env.example — Chope do Leopoldo Site

```env
# App
APP_ENV=local
APP_NAME=chope-do-leopoldo-site
API_PREFIX=/api
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8000

# Database
# Use one of the examples below.
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME
# DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:3306/DBNAME

DB_SSL_ENABLED=true
DB_SSL_CA_PATH=/app/certs/azure-db-ca.pem
DB_SSL_MODE=verify-full

# Auth
JWT_SECRET=change-me
JWT_ALGORITHM=HS256
JWT_EXPIRES_MINUTES=480
ADMIN_INITIAL_EMAIL=admin@example.com
ADMIN_INITIAL_PASSWORD=change-me

# Media
MEDIA_STORAGE_PROVIDER=local
MAX_UPLOAD_MB=5
UPLOADS_DIR=/app/app/static/uploads

# Azure Blob — future/optional
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER=chope-media
AZURE_STORAGE_ACCOUNT_URL=

# Marketing
META_PIXEL_ID=
GOOGLE_TAG_MANAGER_ID=
LOAD_MARKETING_SCRIPTS_AFTER_CONSENT=true
```
