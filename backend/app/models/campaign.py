import enum
from datetime import date

from sqlalchemy import Date, Enum, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class CampaignChannel(str, enum.Enum):
    instagram = "instagram"
    qr_code = "qr_code"
    organic = "organic"
    paid_traffic = "paid_traffic"


class CampaignStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    paused = "paused"
    finished = "finished"


class Campaign(Base, TimestampMixin):
    __tablename__ = "campaigns"
    __table_args__ = (UniqueConstraint("slug", name="uq_campaigns_slug"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    slug: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    hero_image_url: Mapped[str] = mapped_column(String(512), nullable=False)
    hero_image_alt: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    coupon_code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    channel: Mapped[CampaignChannel] = mapped_column(
        Enum(CampaignChannel, name="campaign_channel", native_enum=False),
        nullable=False,
    )
    status: Mapped[CampaignStatus] = mapped_column(
        Enum(CampaignStatus, name="campaign_status", native_enum=False),
        nullable=False,
        default=CampaignStatus.draft,
    )
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    cta_label: Mapped[str | None] = mapped_column(String(120), nullable=True)
