import logging
from collections.abc import Generator
from typing import Any

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import Settings, get_settings
from app.db.ssl import DatabaseSslError, build_connect_args, validate_ssl_certificate

logger = logging.getLogger(__name__)

_engine: Engine | None = None
_SessionLocal: sessionmaker[Session] | None = None


def is_database_configured(settings: Settings | None = None) -> bool:
    cfg = settings or get_settings()
    return cfg.database_configured


def validate_database_startup(settings: Settings | None = None) -> None:
    """
    Valida SSL obrigatório antes de criar o engine.
    Não exige DATABASE_URL em modo local sem banco.
    """
    cfg = settings or get_settings()
    if not cfg.database_configured:
        logger.info("DATABASE_URL não configurada — banco em modo local/mock.")
        return

    if cfg.db_ssl_enabled:
        validate_ssl_certificate(cfg)
        logger.info(
            "Banco configurado com SSL (modo=%s, CA definido).",
            cfg.db_ssl_mode,
        )
    else:
        logger.warning(
            "DATABASE_URL definida, mas DB_SSL_ENABLED=false. "
            "Use SSL na Azure em produção."
        )


def get_engine(settings: Settings | None = None) -> Engine | None:
    global _engine, _SessionLocal

    cfg = settings or get_settings()
    if not cfg.database_configured:
        return None

    if _engine is not None:
        return _engine

    try:
        connect_args = build_connect_args(cfg)
    except DatabaseSslError:
        logger.exception("Falha na configuração SSL do banco")
        raise

    safe_scheme = (cfg.database_url or "").split("://", 1)[0]
    logger.info("Criando engine SQLAlchemy (driver=%s, ssl=%s).", safe_scheme, cfg.db_ssl_enabled)

    _engine = create_engine(
        cfg.database_url,
        connect_args=connect_args,
        pool_pre_ping=True,
    )
    _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine


def get_db() -> Generator[Session, Any, None]:
    if _SessionLocal is None:
        get_engine()
    if _SessionLocal is None:
        raise RuntimeError(
            "Banco não configurado. Defina DATABASE_URL ou use endpoints sem persistência."
        )

    db = _SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_public_db() -> Generator[Session, Any, None]:
    """Dependency para rotas públicas: 503 se DATABASE_URL ausente."""
    from fastapi import HTTPException

    if not is_database_configured():
        raise HTTPException(
            status_code=503,
            detail="Banco de dados não configurado. Defina DATABASE_URL.",
        )
    yield from get_db()


def check_db_connection(settings: Settings | None = None) -> tuple[bool, str]:
    cfg = settings or get_settings()
    if not cfg.database_configured:
        return False, "not_configured"

    engine = get_engine(cfg)
    if engine is None:
        return False, "not_configured"

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Conexão com banco verificada com sucesso.")
        return True, "ok"
    except Exception:
        logger.exception("Falha ao conectar no banco")
        return False, "connection_failed"


def reset_engine_for_tests() -> None:
    """Libera engine em memória (útil em testes)."""
    global _engine, _SessionLocal
    if _engine is not None:
        _engine.dispose()
    _engine = None
    _SessionLocal = None
