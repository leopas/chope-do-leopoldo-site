import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import get_settings
from app.db.session import validate_database_startup
from app.spa import resolve_spa_directory

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()
uploads_dir = settings.uploads_path
uploads_dir.mkdir(parents=True, exist_ok=True)
spa_dir = resolve_spa_directory()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    validate_database_startup(settings)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.api_prefix)

app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
logger.info("Uploads mounted at /uploads from %s", uploads_dir)

if spa_dir is not None:
    # html=True: /menu, /admin, /lp/:slug → index.html (React Router)
    app.mount("/", StaticFiles(directory=spa_dir, html=True), name="spa")
    logger.info("SPA frontend mounted from %s", spa_dir)
else:
    logger.info("SPA static not found (dev: use Vite na porta 5173)")
