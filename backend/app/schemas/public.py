from datetime import date, datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field

from app.models.campaign import CampaignChannel, CampaignStatus


class PublicSiteSettingsOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    business_name: str = Field(serialization_alias="businessName")
    whatsapp_number: str = Field(serialization_alias="whatsappNumber")
    whatsapp_display: str = Field(serialization_alias="whatsappDisplay")
    instagram_handle: str = Field(serialization_alias="instagramHandle")
    address: str
    maps_url: str = Field(serialization_alias="mapsUrl")
    opening_hours: str = Field(serialization_alias="openingHours")
    home_intro: str = Field(serialization_alias="homeIntro")
    show_responsible_drinking_notice: bool = Field(
        serialization_alias="showResponsibleDrinkingNotice"
    )
    meta_pixel_id: str | None = Field(default=None, serialization_alias="metaPixelId")
    google_tag_manager_id: str | None = Field(
        default=None, serialization_alias="googleTagManagerId"
    )
    load_marketing_scripts_after_consent: bool = Field(
        default=True,
        serialization_alias="loadMarketingScriptsAfterConsent",
    )


class PublicCategoryOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    description: str | None = None
    icon: str | None = None
    image_url: str | None = Field(default=None, serialization_alias="imageUrl")
    image_alt: str | None = Field(default=None, serialization_alias="imageAlt")
    accent_color: str | None = Field(default=None, serialization_alias="accentColor")
    is_active: bool = Field(serialization_alias="isActive")
    display_order: int = Field(serialization_alias="displayOrder")


class PublicProductOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    description: str
    price: float
    category_id: str = Field(serialization_alias="categoryId")
    image_url: str = Field(serialization_alias="imageUrl")
    image_alt: str = Field(serialization_alias="imageAlt")
    is_alcoholic: bool = Field(serialization_alias="isAlcoholic")
    is_featured: bool = Field(serialization_alias="isFeatured")
    is_active: bool = Field(serialization_alias="isActive")
    display_order: int = Field(serialization_alias="displayOrder")


class PublicCampaignOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    slug: str
    title: str
    description: str
    hero_image_url: str = Field(serialization_alias="heroImageUrl")
    hero_image_alt: str = Field(serialization_alias="heroImageAlt")
    coupon_code: str | None = Field(default=None, serialization_alias="couponCode")
    channel: CampaignChannel
    status: CampaignStatus
    start_date: date | None = Field(default=None, serialization_alias="startDate")
    end_date: date | None = Field(default=None, serialization_alias="endDate")
    cta_label: str | None = Field(default=None, serialization_alias="ctaLabel")


class PublicMenuResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    settings: PublicSiteSettingsOut | None
    categories: list[PublicCategoryOut]
    products: list[PublicProductOut]
    featured_products: list[PublicProductOut] = Field(serialization_alias="featuredProducts")
    campaigns: list[PublicCampaignOut]


class TrackingEventCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    event_name: str = Field(validation_alias=AliasChoices("event_name", "eventName"))
    campaign_id: str | None = Field(
        default=None, validation_alias=AliasChoices("campaign_id", "campaignId")
    )
    campaign_slug: str | None = Field(
        default=None, validation_alias=AliasChoices("campaign_slug", "campaignSlug")
    )
    product_id: str | None = Field(
        default=None, validation_alias=AliasChoices("product_id", "productId")
    )
    session_id: str | None = Field(
        default=None, validation_alias=AliasChoices("session_id", "sessionId")
    )
    anonymous_id: str | None = Field(
        default=None, validation_alias=AliasChoices("anonymous_id", "anonymousId")
    )
    utm_source: str | None = Field(
        default=None, validation_alias=AliasChoices("utm_source", "utmSource")
    )
    utm_medium: str | None = Field(
        default=None, validation_alias=AliasChoices("utm_medium", "utmMedium")
    )
    utm_campaign: str | None = Field(
        default=None, validation_alias=AliasChoices("utm_campaign", "utmCampaign")
    )
    utm_content: str | None = Field(
        default=None, validation_alias=AliasChoices("utm_content", "utmContent")
    )
    fbclid: str | None = None
    payload: dict | None = None


class TrackingEventCreated(BaseModel):
    id: str
    status: str = "accepted"
    created_at: datetime = Field(serialization_alias="createdAt")
