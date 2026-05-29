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
from app.core.config import get_settings
from app.services import public_catalog as catalog
from app.services.tracking_metrics import hash_client_ip, resolve_client_ip

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
    settings = get_settings()
    client_ip = resolve_client_ip(
        request.headers.get("x-forwarded-for"),
        request.client.host if request.client else None,
    )
    return catalog.create_tracking_event(
        db,
        body,
        user_agent=request.headers.get("user-agent"),
        ip_hash=hash_client_ip(client_ip, salt=settings.app_name),
    )
