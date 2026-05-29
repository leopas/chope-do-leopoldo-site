"""Seed idempotente do catálogo inicial."""

from __future__ import annotations

import logging
import sys

from sqlalchemy.orm import Session

from app.db.seed_data import (
    CAMPAIGNS,
    CATEGORIES,
    MEDIA_ASSETS,
    PRODUCTS,
    SITE_SETTINGS,
)
from app.db.session import get_engine, is_database_configured
from app.models import Campaign, Category, MediaAsset, Product, SiteSettings
from app.models.media_asset import StorageProvider

logger = logging.getLogger(__name__)


def run_seed(session: Session) -> None:
    for data in CATEGORIES:
        session.merge(Category(**data))

    for data in PRODUCTS:
        session.merge(Product(**data))

    for data in CAMPAIGNS:
        session.merge(Campaign(**data))

    for asset_id, name, url, alt, asset_type in MEDIA_ASSETS:
        session.merge(
            MediaAsset(
                id=asset_id,
                name=name,
                url=url,
                alt=alt,
                type=asset_type,
                storage_provider=StorageProvider.local,
                blob_name=None,
            )
        )

    session.merge(SiteSettings(**SITE_SETTINGS))
    session.commit()
    logger.info(
        "Seed concluído: %d categorias, %d produtos, %d campanhas, %d mídias, settings.",
        len(CATEGORIES),
        len(PRODUCTS),
        len(CAMPAIGNS),
        len(MEDIA_ASSETS),
    )


def main() -> int:
    logging.basicConfig(level=logging.INFO)
    if not is_database_configured():
        logger.error("DATABASE_URL não configurada. Defina no .env antes do seed.")
        return 1

    engine = get_engine()
    if engine is None:
        logger.error("Não foi possível criar engine do banco.")
        return 1

    from sqlalchemy.orm import sessionmaker

    SessionLocal = sessionmaker(bind=engine)
    with SessionLocal() as session:
        run_seed(session)

    return 0


if __name__ == "__main__":
    sys.exit(main())
