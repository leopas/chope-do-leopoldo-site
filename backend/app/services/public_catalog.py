import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.seed_data import SITE_SETTINGS_ID
from app.models.campaign import Campaign, CampaignStatus
from app.models.category import Category
from app.models.product import Product
from app.models.site_settings import SiteSettings
from app.models.tracking_event import TrackingEvent
from app.schemas.public import (
    PublicCampaignOut,
    PublicCategoryOut,
    PublicMenuResponse,
    PublicProductOut,
    PublicSiteSettingsOut,
    TrackingEventCreate,
    TrackingEventCreated,
)


def _product_out(product: Product) -> PublicProductOut:
    return PublicProductOut(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price_cents / 100,
        category_id=product.category_id,
        image_url=product.image_url,
        image_alt=product.image_alt,
        is_alcoholic=product.is_alcoholic,
        is_featured=product.is_featured,
        is_active=product.is_active,
        display_order=product.display_order,
    )


def _category_out(category: Category) -> PublicCategoryOut:
    return PublicCategoryOut(
        id=category.id,
        name=category.name,
        description=category.description,
        icon=category.icon,
        image_url=category.image_url,
        image_alt=category.image_alt,
        accent_color=category.accent_color,
        is_active=category.is_active,
        display_order=category.display_order,
    )


def _campaign_out(campaign: Campaign) -> PublicCampaignOut:
    return PublicCampaignOut(
        id=campaign.id,
        name=campaign.name,
        slug=campaign.slug,
        title=campaign.title,
        description=campaign.description,
        hero_image_url=campaign.hero_image_url,
        hero_image_alt=campaign.hero_image_alt,
        coupon_code=campaign.coupon_code,
        channel=campaign.channel,
        status=campaign.status,
        start_date=campaign.start_date,
        end_date=campaign.end_date,
        cta_label=campaign.cta_label,
    )


def _settings_out(settings: SiteSettings) -> PublicSiteSettingsOut:
    return PublicSiteSettingsOut(
        business_name=settings.business_name,
        whatsapp_number=settings.whatsapp_number,
        whatsapp_display=settings.whatsapp_display,
        instagram_handle=settings.instagram_handle,
        address=settings.address,
        maps_url=settings.maps_url,
        opening_hours=settings.opening_hours,
        home_intro=settings.home_intro,
        show_responsible_drinking_notice=settings.show_responsible_drinking_notice,
        meta_pixel_id=settings.meta_pixel_id or None,
        google_tag_manager_id=settings.google_tag_manager_id or None,
    )


def get_public_settings(db: Session) -> PublicSiteSettingsOut | None:
    row = db.get(SiteSettings, SITE_SETTINGS_ID)
    return _settings_out(row) if row else None


def list_public_categories(db: Session) -> list[PublicCategoryOut]:
    rows = db.scalars(
        select(Category)
        .where(Category.is_active.is_(True))
        .order_by(Category.display_order.asc(), Category.name.asc())
    ).all()
    return [_category_out(c) for c in rows]


def list_public_products(db: Session) -> list[PublicProductOut]:
    rows = db.scalars(
        select(Product)
        .where(Product.is_active.is_(True))
        .order_by(Product.display_order.asc(), Product.name.asc())
    ).all()
    return [_product_out(p) for p in rows]


def list_public_campaigns(db: Session) -> list[PublicCampaignOut]:
    rows = db.scalars(
        select(Campaign)
        .where(Campaign.status == CampaignStatus.active)
        .order_by(Campaign.name.asc())
    ).all()
    return [_campaign_out(c) for c in rows]


def get_public_campaign_by_slug(db: Session, slug: str) -> PublicCampaignOut:
    campaign = db.scalar(
        select(Campaign).where(
            Campaign.slug == slug,
            Campaign.status == CampaignStatus.active,
        )
    )
    if campaign is None:
        raise HTTPException(
            status_code=404,
            detail={
                "message": "Campanha não encontrada",
                "slug": slug,
            },
        )
    return _campaign_out(campaign)


def get_public_menu(db: Session) -> PublicMenuResponse:
    products = list_public_products(db)
    return PublicMenuResponse(
        settings=get_public_settings(db),
        categories=list_public_categories(db),
        products=products,
        featured_products=[p for p in products if p.is_featured],
        campaigns=list_public_campaigns(db),
    )


def create_tracking_event(
    db: Session,
    payload: TrackingEventCreate,
    *,
    user_agent: str | None = None,
    ip_hash: str | None = None,
) -> TrackingEventCreated:
    event_id = str(uuid.uuid4())
    row = TrackingEvent(
        id=event_id,
        event_name=payload.event_name,
        campaign_id=payload.campaign_id,
        campaign_slug=payload.campaign_slug,
        product_id=payload.product_id,
        session_id=payload.session_id,
        anonymous_id=payload.anonymous_id,
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        utm_content=payload.utm_content,
        fbclid=payload.fbclid,
        user_agent=user_agent,
        ip_hash=ip_hash,
        payload_json=payload.payload,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return TrackingEventCreated(id=row.id, created_at=row.created_at)
