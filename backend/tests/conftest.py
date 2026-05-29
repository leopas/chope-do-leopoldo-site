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
from app.db.session import get_db, reset_engine_for_tests
from app.main import app as fastapi_app
import app.models  # noqa: F401


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
