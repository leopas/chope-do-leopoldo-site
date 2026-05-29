import os
from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.db.base import Base
from app.db.seed import run_seed
from app.db.session import reset_engine_for_tests
from app.main import app as fastapi_app
from app.services.admin_auth import seed_admin_user
import app.models  # noqa: F401

TEST_JWT_SECRET = "test-jwt-secret-do-not-use-in-production"
TEST_ADMIN_EMAIL = "admin@test.local"
TEST_ADMIN_PASSWORD = "test-admin-password-123"


@pytest.fixture(autouse=True)
def _auth_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("JWT_SECRET", TEST_JWT_SECRET)
    monkeypatch.setenv("JWT_ALGORITHM", "HS256")
    monkeypatch.setenv("JWT_EXPIRES_MINUTES", "480")
    monkeypatch.setenv("ADMIN_INITIAL_EMAIL", TEST_ADMIN_EMAIL)
    monkeypatch.setenv("ADMIN_INITIAL_PASSWORD", TEST_ADMIN_PASSWORD)
    get_settings.cache_clear()


@pytest.fixture
def seeded_client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Generator[TestClient, None, None]:
    db_file = tmp_path / "public_api.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db_file}")
    get_settings.cache_clear()
    reset_engine_for_tests()

    engine = create_engine(f"sqlite:///{db_file}")
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    with SessionLocal() as session:
        run_seed(session)
        seed_admin_user(session, get_settings())

    def override_get_db() -> Generator[Session, None, None]:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    from app.db.session import get_public_db

    fastapi_app.dependency_overrides[get_public_db] = override_get_db
    client = TestClient(fastapi_app)
    yield client
    fastapi_app.dependency_overrides.clear()
    reset_engine_for_tests()
    get_settings.cache_clear()
    monkeypatch.delenv("DATABASE_URL", raising=False)


@pytest.fixture
def admin_headers(seeded_client: TestClient) -> dict[str, str]:
    response = seeded_client.post(
        "/api/admin/auth/login",
        json={"email": TEST_ADMIN_EMAIL, "password": TEST_ADMIN_PASSWORD},
    )
    assert response.status_code == 200
    token = response.json()["accessToken"]
    return {"Authorization": f"Bearer {token}"}
