from pathlib import Path

import pytest

from app.core.config import Settings
from app.db.session import reset_engine_for_tests, validate_database_startup
from app.db.ssl import DatabaseSslError, build_connect_args


@pytest.fixture(autouse=True)
def _reset_engine() -> None:
    reset_engine_for_tests()
    yield
    reset_engine_for_tests()


def test_build_connect_args_postgresql_with_ca(tmp_path: Path) -> None:
    ca = tmp_path / "azure-db-ca.pem"
    ca.write_text("fake-ca", encoding="utf-8")
    settings = Settings(
        DATABASE_URL="postgresql+psycopg://user:pass@host:5432/db",
        DB_SSL_ENABLED=True,
        DB_SSL_CA_PATH=str(ca),
        DB_SSL_MODE="verify-full",
    )
    args = build_connect_args(settings)
    assert args == {"sslmode": "verify-full", "sslrootcert": str(ca)}


def test_build_connect_args_mysql_with_ca(tmp_path: Path) -> None:
    ca = tmp_path / "azure-db-ca.pem"
    ca.write_text("fake-ca", encoding="utf-8")
    settings = Settings(
        DATABASE_URL="mysql+pymysql://user:pass@host:3306/db",
        DB_SSL_ENABLED=True,
        DB_SSL_CA_PATH=str(ca),
    )
    args = build_connect_args(settings)
    assert args == {"ssl": {"ca": str(ca)}}


def test_ssl_enabled_missing_ca_raises() -> None:
    settings = Settings(
        DATABASE_URL="postgresql+psycopg://user:pass@host:5432/db",
        DB_SSL_ENABLED=True,
        DB_SSL_CA_PATH="/nope/azure-db-ca.pem",
    )
    with pytest.raises(DatabaseSslError, match="DB_SSL_CA_PATH não encontrado"):
        build_connect_args(settings)


def test_startup_without_database_url_is_ok() -> None:
    validate_database_startup(Settings())


def test_startup_ssl_missing_cert_fails(tmp_path: Path) -> None:
    settings = Settings(
        DATABASE_URL="postgresql+psycopg://user:pass@host:5432/db",
        DB_SSL_ENABLED=True,
        DB_SSL_CA_PATH=str(tmp_path / "missing.pem"),
    )
    with pytest.raises(DatabaseSslError):
        validate_database_startup(settings)
