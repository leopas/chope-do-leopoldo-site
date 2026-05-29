import re
import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.seed_data import SITE_SETTINGS_ID
from app.models.campaign import Campaign
from app.models.category import Category
from app.models.media_asset import MediaAsset, MediaAssetType, StorageProvider
from app.models.product import Product
from app.models.site_settings import SiteSettings
from app.schemas.admin import (
    CampaignCreate,
    CampaignUpdate,
    CategoryCreate,
    CategoryUpdate,
    MediaAssetCreate,
    ProductCreate,
    ProductUpdate,
    PublicCampaignOut,
    PublicCategoryOut,
    PublicMediaAssetOut,
    PublicProductOut,
    PublicSiteSettingsOut,
    SiteSettingsUpdate,
)
from app.core.config import get_settings as get_app_settings
from app.services import mappers
from app.services.storage import get_media_storage
from app.services.storage.upload_validation import validate_upload


def _new_id(prefix: str, custom: str | None = None) -> str:
    return custom or f"{prefix}-{uuid.uuid4().hex[:12]}"


def _normalize_slug(slug: str) -> str:
    return re.sub(r"[^a-z0-9-]", "-", slug.lower()).strip("-")


def _ensure_unique_campaign_slug(db: Session, slug: str, exclude_id: str | None = None) -> None:
    query = select(Campaign).where(Campaign.slug == slug)
    if exclude_id:
        query = query.where(Campaign.id != exclude_id)
    if db.scalar(query):
        raise HTTPException(status_code=409, detail=f"Slug já em uso: {slug}")


# --- Products ---


def list_products(db: Session) -> list[PublicProductOut]:
    rows = db.scalars(
        select(Product).order_by(Product.display_order.asc(), Product.name.asc())
    ).all()
    return [mappers.product_out(p) for p in rows]


def get_product(db: Session, product_id: str) -> PublicProductOut:
    row = db.get(Product, product_id)
    if not row:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return mappers.product_out(row)


def create_product(db: Session, payload: ProductCreate) -> PublicProductOut:
    row = Product(
        id=_new_id("p", payload.id),
        name=payload.name,
        description=payload.description,
        price_cents=int(round(payload.price * 100)),
        category_id=payload.category_id,
        image_url=payload.image_url,
        image_alt=payload.image_alt,
        is_alcoholic=payload.is_alcoholic,
        is_featured=payload.is_featured,
        is_active=payload.is_active,
        display_order=payload.display_order,
    )
    if not db.get(Category, payload.category_id):
        raise HTTPException(status_code=400, detail="Categoria inválida")
    db.add(row)
    db.commit()
    db.refresh(row)
    return mappers.product_out(row)


def update_product(db: Session, product_id: str, payload: ProductUpdate) -> PublicProductOut:
    row = db.get(Product, product_id)
    if not row:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    data = payload.model_dump(exclude_unset=True)
    if "price" in data:
        row.price_cents = int(round(data.pop("price") * 100))
    if "category_id" in data:
        if not db.get(Category, data["category_id"]):
            raise HTTPException(status_code=400, detail="Categoria inválida")
    for key, value in data.items():
        setattr(row, key, value)

    db.commit()
    db.refresh(row)
    return mappers.product_out(row)


def delete_product(db: Session, product_id: str) -> None:
    row = db.get(Product, product_id)
    if not row:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(row)
    db.commit()


# --- Categories ---


def list_categories(db: Session) -> list[PublicCategoryOut]:
    rows = db.scalars(
        select(Category).order_by(Category.display_order.asc(), Category.name.asc())
    ).all()
    return [mappers.category_out(c) for c in rows]


def get_category(db: Session, category_id: str) -> PublicCategoryOut:
    row = db.get(Category, category_id)
    if not row:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return mappers.category_out(row)


def create_category(db: Session, payload: CategoryCreate) -> PublicCategoryOut:
    row = Category(
        id=_new_id("cat", payload.id),
        name=payload.name,
        description=payload.description,
        icon=payload.icon,
        image_url=payload.image_url,
        image_alt=payload.image_alt,
        accent_color=payload.accent_color,
        is_active=payload.is_active,
        display_order=payload.display_order,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return mappers.category_out(row)


def update_category(
    db: Session, category_id: str, payload: CategoryUpdate
) -> PublicCategoryOut:
    row = db.get(Category, category_id)
    if not row:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, key, value)

    db.commit()
    db.refresh(row)
    return mappers.category_out(row)


def delete_category(db: Session, category_id: str) -> None:
    row = db.get(Category, category_id)
    if not row:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    if db.scalar(select(Product).where(Product.category_id == category_id).limit(1)):
        raise HTTPException(
            status_code=409,
            detail="Categoria possui produtos vinculados. Remova ou mova os produtos antes.",
        )
    db.delete(row)
    db.commit()


# --- Campaigns ---


def list_campaigns(db: Session) -> list[PublicCampaignOut]:
    rows = db.scalars(select(Campaign).order_by(Campaign.name.asc())).all()
    return [mappers.campaign_out(c) for c in rows]


def get_campaign(db: Session, campaign_id: str) -> PublicCampaignOut:
    row = db.get(Campaign, campaign_id)
    if not row:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")
    return mappers.campaign_out(row)


def create_campaign(db: Session, payload: CampaignCreate) -> PublicCampaignOut:
    slug = _normalize_slug(payload.slug)
    _ensure_unique_campaign_slug(db, slug)

    row = Campaign(
        id=_new_id("c", payload.id),
        name=payload.name,
        slug=slug,
        title=payload.title,
        description=payload.description,
        hero_image_url=payload.hero_image_url,
        hero_image_alt=payload.hero_image_alt,
        coupon_code=payload.coupon_code,
        channel=payload.channel,
        status=payload.status,
        start_date=payload.start_date,
        end_date=payload.end_date,
        cta_label=payload.cta_label,
    )
    db.add(row)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Slug já em uso") from exc
    db.refresh(row)
    return mappers.campaign_out(row)


def update_campaign(
    db: Session, campaign_id: str, payload: CampaignUpdate
) -> PublicCampaignOut:
    row = db.get(Campaign, campaign_id)
    if not row:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")

    data = payload.model_dump(exclude_unset=True)
    if "slug" in data and data["slug"] is not None:
        data["slug"] = _normalize_slug(data["slug"])
        _ensure_unique_campaign_slug(db, data["slug"], exclude_id=campaign_id)

    for key, value in data.items():
        setattr(row, key, value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Slug já em uso") from exc
    db.refresh(row)
    return mappers.campaign_out(row)


def delete_campaign(db: Session, campaign_id: str) -> None:
    row = db.get(Campaign, campaign_id)
    if not row:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")
    db.delete(row)
    db.commit()


# --- Media ---


def list_media(db: Session) -> list[PublicMediaAssetOut]:
    rows = db.scalars(
        select(MediaAsset).order_by(MediaAsset.uploaded_at.desc(), MediaAsset.name.asc())
    ).all()
    return [mappers.media_out(m) for m in rows]


def create_media(db: Session, payload: MediaAssetCreate) -> PublicMediaAssetOut:
    row = MediaAsset(
        id=_new_id("m", payload.id),
        name=payload.name,
        url=payload.url,
        alt=payload.alt,
        type=payload.type,
        storage_provider=StorageProvider.local,
        blob_name=None,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return mappers.media_out(row)


def upload_media(
    db: Session,
    *,
    content: bytes,
    content_type: str,
    original_name: str,
    alt: str,
    asset_type: MediaAssetType,
) -> PublicMediaAssetOut:
    app_settings = get_app_settings()
    validated_type = validate_upload(content, content_type, app_settings.max_upload_bytes)
    storage = get_media_storage(app_settings)
    stored = storage.save(content, validated_type, original_name)

    display_name = original_name or stored.blob_name
    row = MediaAsset(
        id=_new_id("m", None),
        name=display_name,
        url=stored.url,
        alt=alt or display_name.rsplit(".", 1)[0],
        type=asset_type,
        storage_provider=stored.storage_provider,
        blob_name=stored.blob_name,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return mappers.media_out(row)


def delete_media(db: Session, media_id: str) -> None:
    row = db.get(MediaAsset, media_id)
    if not row:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    if row.blob_name:
        try:
            get_media_storage().delete(row.blob_name)
        except OSError:
            pass
    db.delete(row)
    db.commit()


# --- Settings ---


def get_settings(db: Session) -> PublicSiteSettingsOut:
    row = db.get(SiteSettings, SITE_SETTINGS_ID)
    if not row:
        raise HTTPException(status_code=404, detail="Configurações não encontradas")
    return mappers.settings_out(row)


def update_settings(db: Session, payload: SiteSettingsUpdate) -> PublicSiteSettingsOut:
    row = db.get(SiteSettings, SITE_SETTINGS_ID)
    if not row:
        raise HTTPException(status_code=404, detail="Configurações não encontradas")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, key, value)

    db.commit()
    db.refresh(row)
    return mappers.settings_out(row)
