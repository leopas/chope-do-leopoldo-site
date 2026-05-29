from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from app.core.config import Settings


class DatabaseSslError(RuntimeError):
    """Erro de configuração SSL do banco."""


def _normalize_scheme(database_url: str) -> str:
    parsed = urlparse(database_url)
    return (parsed.scheme or "").lower()


def validate_ssl_certificate(settings: Settings) -> Path | None:
    """Garante que o CA existe quando SSL está habilitado."""
    if not settings.db_ssl_enabled:
        return None

    if not settings.db_ssl_ca_path:
        raise DatabaseSslError(
            "DB_SSL_ENABLED=true, mas DB_SSL_CA_PATH não foi definido."
        )

    ca_path = Path(settings.db_ssl_ca_path)
    if not ca_path.is_file():
        raise DatabaseSslError(
            f"DB_SSL_CA_PATH não encontrado: {ca_path}. "
            "Monte o certificado Azure no container ou defina um caminho válido."
        )

    return ca_path


def build_connect_args(settings: Settings) -> dict[str, Any]:
    """
    Monta connect_args do SQLAlchemy conforme o driver da DATABASE_URL.
    """
    if not settings.database_configured:
        return {}

    database_url = settings.database_url or ""
    scheme = _normalize_scheme(database_url)

    if not settings.db_ssl_enabled:
        return {}

    ca_path = validate_ssl_certificate(settings)
    assert ca_path is not None

    if scheme.startswith("postgresql"):
        return {
            "sslmode": settings.db_ssl_mode,
            "sslrootcert": str(ca_path),
        }

    if scheme.startswith("mysql"):
        return {
            "ssl": {"ca": str(ca_path)},
        }

    raise DatabaseSslError(
        f"Driver não suportado para SSL: {scheme!r}. "
        "Use postgresql+psycopg:// ou mysql+pymysql://."
    )
