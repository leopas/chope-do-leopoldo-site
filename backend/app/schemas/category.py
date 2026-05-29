from datetime import datetime

from app.schemas.common import SchemaBase


class CategoryRead(SchemaBase):
    id: str
    name: str
    description: str | None = None
    icon: str | None = None
    image_url: str | None = None
    image_alt: str | None = None
    accent_color: str | None = None
    is_active: bool
    display_order: int
    created_at: datetime
    updated_at: datetime
