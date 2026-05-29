import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class MediaAssetType(str, enum.Enum):
    product = "product"
    category = "category"
    campaign = "campaign"
    home = "home"
    landing = "landing"


class StorageProvider(str, enum.Enum):
    local = "local"
    azure_blob = "azure_blob"


class MediaAsset(Base, TimestampMixin):
    __tablename__ = "media_assets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(512), nullable=False)
    alt: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    type: Mapped[MediaAssetType] = mapped_column(
        Enum(MediaAssetType, name="media_asset_type", native_enum=False),
        nullable=False,
    )
    storage_provider: Mapped[StorageProvider] = mapped_column(
        Enum(StorageProvider, name="storage_provider", native_enum=False),
        nullable=False,
        default=StorageProvider.local,
    )
    blob_name: Mapped[str | None] = mapped_column(String(512), nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
