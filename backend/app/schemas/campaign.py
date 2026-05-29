from datetime import date, datetime

from app.models.campaign import CampaignChannel, CampaignStatus
from app.schemas.common import SchemaBase


class CampaignRead(SchemaBase):
    id: str
    name: str
    slug: str
    title: str
    description: str
    hero_image_url: str
    hero_image_alt: str
    coupon_code: str | None = None
    channel: CampaignChannel
    status: CampaignStatus
    start_date: date | None = None
    end_date: date | None = None
    cta_label: str | None = None
    created_at: datetime
    updated_at: datetime
