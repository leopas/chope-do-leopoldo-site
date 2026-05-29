# Adições recomendadas ao .gitignore

```gitignore
# env
.env
.env.*
!.env.example

# certs
certs/
*.pem
*.key
*.pfx
*.crt

# uploads locais
local-uploads/
backend/app/static/uploads/

# python
__pycache__/
.pytest_cache/
.venv/

# frontend
node_modules/
frontend/dist/
```
