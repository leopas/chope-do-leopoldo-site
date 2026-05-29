from datetime import date

from pydantic import AliasChoices, BaseModel, ConfigDict, Field

from app.models.campaign import CampaignChannel, CampaignStatus
from app.models.media_asset import MediaAssetType
from app.schemas.public import (
    PublicCampaignOut,
    PublicCategoryOut,
    PublicProductOut,
    PublicSiteSettingsOut,
)


class PublicMediaAssetOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    url: str
    alt: str
    type: MediaAssetType
    uploaded_at: str = Field(serialization_alias="uploadedAt")


class ProductCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str | None = None
    name: str
    description: str = ""
    price: float
    category_id: str = Field(validation_alias=AliasChoices("category_id", "categoryId"))
    image_url: str = Field(default="", validation_alias=AliasChoices("image_url", "imageUrl"))
    image_alt: str = Field(default="", validation_alias=AliasChoices("image_alt", "imageAlt"))
    is_alcoholic: bool = Field(
        default=False, validation_alias=AliasChoices("is_alcoholic", "isAlcoholic")
    )
    is_featured: bool = Field(
        default=False, validation_alias=AliasChoices("is_featured", "isFeatured")
    )
    is_active: bool = Field(default=True, validation_alias=AliasChoices("is_active", "isActive"))
    display_order: int = Field(
        default=99, validation_alias=AliasChoices("display_order", "displayOrder")
    )


class ProductUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str | None = None
    description: str | None = None
    price: float | None = None
    category_id: str | None = Field(
        default=None, validation_alias=AliasChoices("category_id", "categoryId")
    )
    image_url: str | None = Field(
        default=None, validation_alias=AliasChoices("image_url", "imageUrl")
    )
    image_alt: str | None = Field(
        default=None, validation_alias=AliasChoices("image_alt", "imageAlt")
    )
    is_alcoholic: bool | None = Field(
        default=None, validation_alias=AliasChoices("is_alcoholic", "isAlcoholic")
    )
    is_featured: bool | None = Field(
        default=None, validation_alias=AliasChoices("is_featured", "isFeatured")
    )
    is_active: bool | None = Field(
        default=None, validation_alias=AliasChoices("is_active", "isActive")
    )
    display_order: int | None = Field(
        default=None, validation_alias=AliasChoices("display_order", "displayOrder")
    )


class CategoryCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str | None = None
    name: str
    description: str | None = None
    icon: str | None = None
    image_url: str | None = Field(
        default=None, validation_alias=AliasChoices("image_url", "imageUrl")
    )
    image_alt: str | None = Field(
        default=None, validation_alias=AliasChoices("image_alt", "imageAlt")
    )
    accent_color: str | None = Field(
        default=None, validation_alias=AliasChoices("accent_color", "accentColor")
    )
    is_active: bool = Field(default=True, validation_alias=AliasChoices("is_active", "isActive"))
    display_order: int = Field(
        default=99, validation_alias=AliasChoices("display_order", "displayOrder")
    )


class CategoryUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str | None = None
    description: str | None = None
    icon: str | None = None
    image_url: str | None = Field(
        default=None, validation_alias=AliasChoices("image_url", "imageUrl")
    )
    image_alt: str | None = Field(
        default=None, validation_alias=AliasChoices("image_alt", "imageAlt")
    )
    accent_color: str | None = Field(
        default=None, validation_alias=AliasChoices("accent_color", "accentColor")
    )
    is_active: bool | None = Field(
        default=None, validation_alias=AliasChoices("is_active", "isActive")
    )
    display_order: int | None = Field(
        default=None, validation_alias=AliasChoices("display_order", "displayOrder")
    )


class CampaignCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str | None = None
    name: str
    slug: str
    title: str
    description: str
    hero_image_url: str = Field(validation_alias=AliasChoices("hero_image_url", "heroImageUrl"))
    hero_image_alt: str = Field(
        default="", validation_alias=AliasChoices("hero_image_alt", "heroImageAlt")
    )
    coupon_code: str | None = Field(
        default=None, validation_alias=AliasChoices("coupon_code", "couponCode")
    )
    channel: CampaignChannel = CampaignChannel.instagram
    status: CampaignStatus = CampaignStatus.draft
    start_date: date | None = Field(
        default=None, validation_alias=AliasChoices("start_date", "startDate")
    )
    end_date: date | None = Field(
        default=None, validation_alias=AliasChoices("end_date", "endDate")
    )
    cta_label: str | None = Field(
        default=None, validation_alias=AliasChoices("cta_label", "ctaLabel")
    )


class CampaignUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str | None = None
    slug: str | None = None
    title: str | None = None
    description: str | None = None
    hero_image_url: str | None = Field(
        default=None, validation_alias=AliasChoices("hero_image_url", "heroImageUrl")
    )
    hero_image_alt: str | None = Field(
        default=None, validation_alias=AliasChoices("hero_image_alt", "heroImageAlt")
    )
    coupon_code: str | None = Field(
        default=None, validation_alias=AliasChoices("coupon_code", "couponCode")
    )
    channel: CampaignChannel | None = None
    status: CampaignStatus | None = None
    start_date: date | None = Field(
        default=None, validation_alias=AliasChoices("start_date", "startDate")
    )
    end_date: date | None = Field(
        default=None, validation_alias=AliasChoices("end_date", "endDate")
    )
    cta_label: str | None = Field(
        default=None, validation_alias=AliasChoices("cta_label", "ctaLabel")
    )


class MediaAssetCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str | None = None
    name: str
    url: str
    alt: str = ""
    type: MediaAssetType = MediaAssetType.product


class SiteSettingsUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    business_name: str | None = Field(
        default=None, validation_alias=AliasChoices("business_name", "businessName")
    )
    whatsapp_number: str | None = Field(
        default=None, validation_alias=AliasChoices("whatsapp_number", "whatsappNumber")
    )
    whatsapp_display: str | None = Field(
        default=None, validation_alias=AliasChoices("whatsapp_display", "whatsappDisplay")
    )
    instagram_handle: str | None = Field(
        default=None, validation_alias=AliasChoices("instagram_handle", "instagramHandle")
    )
    address: str | None = None
    maps_url: str | None = Field(
        default=None, validation_alias=AliasChoices("maps_url", "mapsUrl")
    )
    opening_hours: str | None = Field(
        default=None, validation_alias=AliasChoices("opening_hours", "openingHours")
    )
    home_intro: str | None = Field(
        default=None, validation_alias=AliasChoices("home_intro", "homeIntro")
    )
    show_responsible_drinking_notice: bool | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "show_responsible_drinking_notice", "showResponsibleDrinkingNotice"
        ),
    )
    meta_pixel_id: str | None = Field(
        default=None, validation_alias=AliasChoices("meta_pixel_id", "metaPixelId")
    )
    google_tag_manager_id: str | None = Field(
        default=None,
        validation_alias=AliasChoices("google_tag_manager_id", "googleTagManagerId"),
    )
    load_marketing_scripts_after_consent: bool | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "load_marketing_scripts_after_consent",
            "loadMarketingScriptsAfterConsent",
        ),
    )


class CampaignMetricsOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    campaign_id: str = Field(serialization_alias="campaignId")
    campaign_slug: str = Field(serialization_alias="campaignSlug")
    views: int
    click_whatsapp: int = Field(serialization_alias="clickWhatsApp")
    click_directions: int = Field(serialization_alias="clickDirections")
    coupons_shown: int = Field(serialization_alias="couponsShown")
    coupons_copied: int = Field(serialization_alias="couponsCopied")
    whatsapp_rate: float = Field(serialization_alias="whatsappRate")
    directions_rate: float = Field(serialization_alias="directionsRate")


# Re-export response types for OpenAPI
__all__ = [
    "CampaignMetricsOut",
    "PublicCampaignOut",
    "PublicCategoryOut",
    "PublicMediaAssetOut",
    "PublicProductOut",
    "PublicSiteSettingsOut",
]
