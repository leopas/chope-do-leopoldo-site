from fastapi import APIRouter, Depends, File, Form, Response, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.models.media_asset import MediaAssetType

from app.db.session import get_public_db
from app.schemas.admin import (
    CampaignCreate,
    CampaignMetricsOut,
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
from app.services import admin_catalog as catalog
from app.services import tracking_metrics

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin)],
)


# Products
@router.get("/products", response_model=list[PublicProductOut])
def admin_list_products(db: Session = Depends(get_public_db)) -> list[PublicProductOut]:
    return catalog.list_products(db)


@router.post("/products", response_model=PublicProductOut, status_code=status.HTTP_201_CREATED)
def admin_create_product(
    payload: ProductCreate, db: Session = Depends(get_public_db)
) -> PublicProductOut:
    return catalog.create_product(db, payload)


@router.get("/products/{product_id}", response_model=PublicProductOut)
def admin_get_product(
    product_id: str, db: Session = Depends(get_public_db)
) -> PublicProductOut:
    return catalog.get_product(db, product_id)


@router.put("/products/{product_id}", response_model=PublicProductOut)
def admin_update_product(
    product_id: str,
    payload: ProductUpdate,
    db: Session = Depends(get_public_db),
) -> PublicProductOut:
    return catalog.update_product(db, product_id, payload)


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_product(product_id: str, db: Session = Depends(get_public_db)) -> Response:
    catalog.delete_product(db, product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Categories
@router.get("/categories", response_model=list[PublicCategoryOut])
def admin_list_categories(db: Session = Depends(get_public_db)) -> list[PublicCategoryOut]:
    return catalog.list_categories(db)


@router.post("/categories", response_model=PublicCategoryOut, status_code=status.HTTP_201_CREATED)
def admin_create_category(
    payload: CategoryCreate, db: Session = Depends(get_public_db)
) -> PublicCategoryOut:
    return catalog.create_category(db, payload)


@router.get("/categories/{category_id}", response_model=PublicCategoryOut)
def admin_get_category(
    category_id: str, db: Session = Depends(get_public_db)
) -> PublicCategoryOut:
    return catalog.get_category(db, category_id)


@router.put("/categories/{category_id}", response_model=PublicCategoryOut)
def admin_update_category(
    category_id: str,
    payload: CategoryUpdate,
    db: Session = Depends(get_public_db),
) -> PublicCategoryOut:
    return catalog.update_category(db, category_id, payload)


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_category(category_id: str, db: Session = Depends(get_public_db)) -> Response:
    catalog.delete_category(db, category_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Campaigns
@router.get("/campaigns", response_model=list[PublicCampaignOut])
def admin_list_campaigns(db: Session = Depends(get_public_db)) -> list[PublicCampaignOut]:
    return catalog.list_campaigns(db)


@router.post("/campaigns", response_model=PublicCampaignOut, status_code=status.HTTP_201_CREATED)
def admin_create_campaign(
    payload: CampaignCreate, db: Session = Depends(get_public_db)
) -> PublicCampaignOut:
    return catalog.create_campaign(db, payload)


@router.get("/campaigns/{campaign_id}", response_model=PublicCampaignOut)
def admin_get_campaign(
    campaign_id: str, db: Session = Depends(get_public_db)
) -> PublicCampaignOut:
    return catalog.get_campaign(db, campaign_id)


@router.get("/campaigns/{campaign_id}/metrics", response_model=CampaignMetricsOut)
def admin_campaign_metrics(
    campaign_id: str, db: Session = Depends(get_public_db)
) -> CampaignMetricsOut:
    return tracking_metrics.get_campaign_metrics(db, campaign_id)


@router.put("/campaigns/{campaign_id}", response_model=PublicCampaignOut)
def admin_update_campaign(
    campaign_id: str,
    payload: CampaignUpdate,
    db: Session = Depends(get_public_db),
) -> PublicCampaignOut:
    return catalog.update_campaign(db, campaign_id, payload)


@router.delete("/campaigns/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_campaign(campaign_id: str, db: Session = Depends(get_public_db)) -> Response:
    catalog.delete_campaign(db, campaign_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Media
@router.get("/media", response_model=list[PublicMediaAssetOut])
def admin_list_media(db: Session = Depends(get_public_db)) -> list[PublicMediaAssetOut]:
    return catalog.list_media(db)


@router.post("/media", response_model=PublicMediaAssetOut, status_code=status.HTTP_201_CREATED)
def admin_create_media(
    payload: MediaAssetCreate, db: Session = Depends(get_public_db)
) -> PublicMediaAssetOut:
    return catalog.create_media(db, payload)


@router.post(
    "/media/upload",
    response_model=PublicMediaAssetOut,
    status_code=status.HTTP_201_CREATED,
)
async def admin_upload_media(
    file: UploadFile = File(...),
    alt: str = Form(""),
    type: MediaAssetType = Form(MediaAssetType.product),
    db: Session = Depends(get_public_db),
) -> PublicMediaAssetOut:
    content = await file.read()
    content_type = file.content_type or "application/octet-stream"
    return catalog.upload_media(
        db,
        content=content,
        content_type=content_type,
        original_name=file.filename or "upload",
        alt=alt,
        asset_type=type,
    )


@router.delete("/media/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_media(media_id: str, db: Session = Depends(get_public_db)) -> Response:
    catalog.delete_media(db, media_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Settings
@router.get("/settings", response_model=PublicSiteSettingsOut)
def admin_get_settings(db: Session = Depends(get_public_db)) -> PublicSiteSettingsOut:
    return catalog.get_settings(db)


@router.put("/settings", response_model=PublicSiteSettingsOut)
def admin_update_settings(
    payload: SiteSettingsUpdate, db: Session = Depends(get_public_db)
) -> PublicSiteSettingsOut:
    return catalog.update_settings(db, payload)
