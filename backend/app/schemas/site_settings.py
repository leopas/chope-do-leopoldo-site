from datetime import datetime

from app.schemas.common import SchemaBase


class SiteSettingsRead(SchemaBase):
    id: str
    business_name: str
    whatsapp_number: str
    whatsapp_display: str
    instagram_handle: str
    address: str
    maps_url: str
    opening_hours: str
    home_intro: str
    show_responsible_drinking_notice: bool
    meta_pixel_id: str | None = None
    google_tag_manager_id: str | None = None
    load_marketing_scripts_after_consent: bool
    updated_at: datetime
