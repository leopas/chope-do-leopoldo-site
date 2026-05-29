import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import get_settings
from app.db.session import validate_database_startup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()
static_dir = Path(__file__).resolve().parent / "static"
uploads_dir = settings.uploads_path
uploads_dir.mkdir(parents=True, exist_ok=True)


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

if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
    logger.info("Static frontend mounted from %s", static_dir)
else:
    logger.info("Static directory not found at %s (dev mode OK)", static_dir)
