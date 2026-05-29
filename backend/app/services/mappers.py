from datetime import datetime

from app.models.campaign import Campaign
from app.models.category import Category
from app.models.media_asset import MediaAsset
from app.models.product import Product
from app.models.site_settings import SiteSettings
from app.schemas.admin import PublicMediaAssetOut
from app.schemas.public import PublicCampaignOut, PublicCategoryOut, PublicProductOut, PublicSiteSettingsOut


def product_out(product: Product) -> PublicProductOut:
    return PublicProductOut(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price_cents / 100,
        category_id=product.category_id,
        image_url=product.image_url,
        image_alt=product.image_alt,
        is_alcoholic=product.is_alcoholic,
        is_featured=product.is_featured,
        is_active=product.is_active,
        display_order=product.display_order,
    )


def category_out(category: Category) -> PublicCategoryOut:
    return PublicCategoryOut(
        id=category.id,
        name=category.name,
        description=category.description,
        icon=category.icon,
        image_url=category.image_url,
        image_alt=category.image_alt,
        accent_color=category.accent_color,
        is_active=category.is_active,
        display_order=category.display_order,
    )


def campaign_out(campaign: Campaign) -> PublicCampaignOut:
    return PublicCampaignOut(
        id=campaign.id,
        name=campaign.name,
        slug=campaign.slug,
        title=campaign.title,
        description=campaign.description,
        hero_image_url=campaign.hero_image_url,
        hero_image_alt=campaign.hero_image_alt,
        coupon_code=campaign.coupon_code,
        channel=campaign.channel,
        status=campaign.status,
        start_date=campaign.start_date,
        end_date=campaign.end_date,
        cta_label=campaign.cta_label,
    )


def settings_out(settings: SiteSettings) -> PublicSiteSettingsOut:
    return PublicSiteSettingsOut(
        business_name=settings.business_name,
        whatsapp_number=settings.whatsapp_number,
        whatsapp_display=settings.whatsapp_display,
        instagram_handle=settings.instagram_handle,
        address=settings.address,
        maps_url=settings.maps_url,
        opening_hours=settings.opening_hours,
        home_intro=settings.home_intro,
        show_responsible_drinking_notice=settings.show_responsible_drinking_notice,
        meta_pixel_id=settings.meta_pixel_id or None,
        google_tag_manager_id=settings.google_tag_manager_id or None,
    )


def media_out(asset: MediaAsset) -> PublicMediaAssetOut:
    uploaded = asset.uploaded_at
    if isinstance(uploaded, datetime):
        uploaded_str = uploaded.date().isoformat()
    else:
        uploaded_str = str(uploaded)[:10]
    return PublicMediaAssetOut(
        id=asset.id,
        name=asset.name,
        url=asset.url,
        alt=asset.alt,
        type=asset.type,
        uploaded_at=uploaded_str,
    )
