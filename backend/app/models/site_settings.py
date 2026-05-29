from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SiteSettings(Base):
    """Registro único de configurações do site (MVP)."""

    __tablename__ = "site_settings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    business_name: Mapped[str] = mapped_column(String(160), nullable=False)
    whatsapp_number: Mapped[str] = mapped_column(String(32), nullable=False)
    whatsapp_display: Mapped[str] = mapped_column(String(64), nullable=False)
    instagram_handle: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    address: Mapped[str] = mapped_column(Text, nullable=False)
    maps_url: Mapped[str] = mapped_column(String(512), nullable=False)
    opening_hours: Mapped[str] = mapped_column(String(255), nullable=False)
    home_intro: Mapped[str] = mapped_column(Text, nullable=False)
    show_responsible_drinking_notice: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    meta_pixel_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    google_tag_manager_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    load_marketing_scripts_after_consent: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
