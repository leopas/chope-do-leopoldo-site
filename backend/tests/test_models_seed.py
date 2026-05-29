import os
from pathlib import Path

import pytest
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.db.seed import run_seed
from app.db.seed_data import CATEGORIES, PRODUCTS, SITE_SETTINGS_ID
from app.db.session import reset_engine_for_tests
from app.models import Campaign, Category, Product, SiteSettings
import app.models  # noqa: F401


@pytest.fixture(autouse=True)
def _reset() -> None:
    reset_engine_for_tests()
    yield
    reset_engine_for_tests()


@pytest.fixture
def db_session(tmp_path: Path):
    db_file = tmp_path / "test.db"
    engine = create_engine(f"sqlite:///{db_file}")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    with Session() as session:
        yield session
    engine.dispose()


def test_seed_is_idempotent(db_session) -> None:
    run_seed(db_session)
    run_seed(db_session)

    assert db_session.scalar(select(Category).limit(1)) is not None
    assert len(db_session.scalars(select(Category)).all()) == len(CATEGORIES)
    assert len(db_session.scalars(select(Product)).all()) == len(PRODUCTS)
    assert len(db_session.scalars(select(Campaign)).all()) == 4

    settings = db_session.get(SiteSettings, SITE_SETTINGS_ID)
    assert settings is not None
    assert settings.business_name == "Chope do Leopoldo"


def test_product_price_stored_in_cents(db_session) -> None:
    run_seed(db_session)
    product = db_session.get(Product, "p-pilsen-500")
    assert product is not None
    assert product.price_cents == 1400


def test_alembic_upgrade_sqlite(tmp_path: Path) -> None:
    db_file = tmp_path / "migrate.db"
    os.environ["DATABASE_URL"] = f"sqlite:///{db_file}"

    from alembic import command
    from alembic.config import Config

    from app.core.config import get_settings

    reset_engine_for_tests()
    get_settings.cache_clear()

    cfg = Config("alembic.ini")
    cfg.set_main_option("sqlalchemy.url", get_settings().database_url)
    command.upgrade(cfg, "head")

    engine = create_engine(get_settings().database_url)
    inspector_tables = set(
        __import__("sqlalchemy").inspect(engine).get_table_names()
    )
    engine.dispose()

    assert "categories" in inspector_tables
    assert "products" in inspector_tables
    assert "campaigns" in inspector_tables
    assert "tracking_events" in inspector_tables
    assert "coupon_redemptions" in inspector_tables

    get_settings.cache_clear()
    os.environ.pop("DATABASE_URL", None)
