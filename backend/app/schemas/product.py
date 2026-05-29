from datetime import datetime

from app.schemas.common import SchemaBase


class ProductRead(SchemaBase):
    id: str
    name: str
    description: str
    price_cents: int
    category_id: str
    image_url: str
    image_alt: str
    is_alcoholic: bool
    is_featured: bool
    is_active: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    @property
    def price(self) -> float:
        return self.price_cents / 100
