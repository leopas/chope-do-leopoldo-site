import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
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


def _register_spa_routes(application: FastAPI, directory: Path) -> None:
    """Serve assets e fallback index.html para rotas do React Router."""
    index_path = directory / "index.html"
    assets_dir = directory / "assets"

    if assets_dir.is_dir():
        application.mount("/assets", StaticFiles(directory=assets_dir), name="spa-assets")

    blocked_prefixes = ("api", "uploads")

    @application.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str = "") -> FileResponse:
        if full_path.startswith(blocked_prefixes) or full_path in blocked_prefixes:
            raise HTTPException(status_code=404, detail="Not Found")
        if full_path:
            candidate = directory / full_path
            if candidate.is_file():
                return FileResponse(candidate)
        if not index_path.is_file():
            raise HTTPException(status_code=404, detail="Not Found")
        return FileResponse(index_path)


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
    _register_spa_routes(app, spa_dir)
    logger.info("SPA frontend from %s (fallback index.html)", spa_dir)
else:
    logger.info("SPA static not found (dev: use Vite na porta 5173)")
