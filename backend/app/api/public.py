from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db.session import get_public_db
from app.schemas.public import (
    PublicCampaignOut,
    PublicCategoryOut,
    PublicMenuResponse,
    PublicProductOut,
    PublicSiteSettingsOut,
    TrackingEventCreate,
    TrackingEventCreated,
)
from app.services import public_catalog as catalog

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/settings", response_model=PublicSiteSettingsOut)
def public_settings(db: Session = Depends(get_public_db)) -> PublicSiteSettingsOut:
    settings = catalog.get_public_settings(db)
    if settings is None:
        raise HTTPException(status_code=404, detail="Configurações do site não encontradas.")
    return settings


@router.get("/menu", response_model=PublicMenuResponse)
def public_menu(db: Session = Depends(get_public_db)) -> PublicMenuResponse:
    return catalog.get_public_menu(db)


@router.get("/categories", response_model=list[PublicCategoryOut])
def public_categories(db: Session = Depends(get_public_db)) -> list[PublicCategoryOut]:
    return catalog.list_public_categories(db)


@router.get("/products", response_model=list[PublicProductOut])
def public_products(db: Session = Depends(get_public_db)) -> list[PublicProductOut]:
    return catalog.list_public_products(db)


@router.get("/campaigns", response_model=list[PublicCampaignOut])
def public_campaigns(db: Session = Depends(get_public_db)) -> list[PublicCampaignOut]:
    return catalog.list_public_campaigns(db)


@router.get("/campaigns/{slug}", response_model=PublicCampaignOut)
def public_campaign_by_slug(
    slug: str, db: Session = Depends(get_public_db)
) -> PublicCampaignOut:
    return catalog.get_public_campaign_by_slug(db, slug)


@router.post(
    "/tracking-events",
    response_model=TrackingEventCreated,
    status_code=201,
)
def public_tracking_event(
    body: TrackingEventCreate,
    request: Request,
    db: Session = Depends(get_public_db),
) -> TrackingEventCreated:
    return catalog.create_tracking_event(
        db,
        body,
        user_agent=request.headers.get("user-agent"),
    )
