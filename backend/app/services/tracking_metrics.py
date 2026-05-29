import hashlib

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.models.tracking_event import TrackingEvent
from app.schemas.admin import CampaignMetricsOut

LANDING_VIEW = "ViewCampaignLandingPage"
CLICK_WHATSAPP = "ClickWhatsApp"
CLICK_DIRECTIONS = "ClickDirections"
COUPON_SHOWN = "CouponShown"
COUPON_COPIED = "CouponCopied"
USE_COUPON = "UseCoupon"


def hash_client_ip(ip: str | None, *, salt: str) -> str | None:
    if not ip:
        return None
    digest = hashlib.sha256(f"{salt}:{ip}".encode()).hexdigest()
    return digest[:32]


def resolve_client_ip(forwarded_for: str | None, client_host: str | None) -> str | None:
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return client_host


def _campaign_event_filter(campaign_id: str, slug: str):
    return or_(
        TrackingEvent.campaign_id == campaign_id,
        TrackingEvent.campaign_slug == slug,
    )


def _count_events(db: Session, campaign_id: str, slug: str, event_name: str) -> int:
    stmt = (
        select(func.count())
        .select_from(TrackingEvent)
        .where(
            _campaign_event_filter(campaign_id, slug),
            TrackingEvent.event_name == event_name,
        )
    )
    return int(db.scalar(stmt) or 0)


def get_campaign_metrics(db: Session, campaign_id: str) -> CampaignMetricsOut:
    campaign = db.get(Campaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")

    views = _count_events(db, campaign_id, campaign.slug, LANDING_VIEW)
    click_whatsapp = _count_events(db, campaign_id, campaign.slug, CLICK_WHATSAPP)
    click_directions = _count_events(db, campaign_id, campaign.slug, CLICK_DIRECTIONS)
    coupons_shown = _count_events(db, campaign_id, campaign.slug, COUPON_SHOWN)
    coupons_copied = _count_events(db, campaign_id, campaign.slug, COUPON_COPIED) + _count_events(
        db, campaign_id, campaign.slug, USE_COUPON
    )

    whatsapp_rate = round(click_whatsapp / views, 4) if views else 0.0
    directions_rate = round(click_directions / views, 4) if views else 0.0

    return CampaignMetricsOut(
        campaign_id=campaign_id,
        campaign_slug=campaign.slug,
        views=views,
        click_whatsapp=click_whatsapp,
        click_directions=click_directions,
        coupons_shown=coupons_shown,
        coupons_copied=coupons_copied,
        whatsapp_rate=whatsapp_rate,
        directions_rate=directions_rate,
    )
