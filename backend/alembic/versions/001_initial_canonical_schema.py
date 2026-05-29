"""initial canonical schema

Revision ID: 001_initial
Revises:
Create Date: 2026-05-29

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001_initial"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "admin_users",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_admin_users_email", "admin_users", ["email"], unique=True)

    op.create_table(
        "categories",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("icon", sa.String(length=32), nullable=True),
        sa.Column("image_url", sa.String(length=512), nullable=True),
        sa.Column("image_alt", sa.String(length=255), nullable=True),
        sa.Column("accent_color", sa.String(length=32), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "campaigns",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("hero_image_url", sa.String(length=512), nullable=False),
        sa.Column("hero_image_alt", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("coupon_code", sa.String(length=64), nullable=True),
        sa.Column("channel", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="draft"),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("cta_label", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug", name="uq_campaigns_slug"),
    )
    op.create_index("ix_campaigns_slug", "campaigns", ["slug"], unique=False)

    op.create_table(
        "site_settings",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("business_name", sa.String(length=160), nullable=False),
        sa.Column("whatsapp_number", sa.String(length=32), nullable=False),
        sa.Column("whatsapp_display", sa.String(length=64), nullable=False),
        sa.Column("instagram_handle", sa.String(length=128), nullable=False, server_default=""),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("maps_url", sa.String(length=512), nullable=False),
        sa.Column("opening_hours", sa.String(length=255), nullable=False),
        sa.Column("home_intro", sa.Text(), nullable=False),
        sa.Column("show_responsible_drinking_notice", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("meta_pixel_id", sa.String(length=64), nullable=True),
        sa.Column("google_tag_manager_id", sa.String(length=64), nullable=True),
        sa.Column("load_marketing_scripts_after_consent", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "products",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("price_cents", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.String(length=36), nullable=False),
        sa.Column("image_url", sa.String(length=512), nullable=False),
        sa.Column("image_alt", sa.String(length=255), nullable=False),
        sa.Column("is_alcoholic", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_products_category_id", "products", ["category_id"], unique=False)

    op.create_table(
        "media_assets",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("url", sa.String(length=512), nullable=False),
        sa.Column("alt", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("type", sa.String(length=32), nullable=False),
        sa.Column("storage_provider", sa.String(length=32), nullable=False, server_default="local"),
        sa.Column("blob_name", sa.String(length=512), nullable=True),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "tracking_events",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("event_name", sa.String(length=120), nullable=False),
        sa.Column("campaign_id", sa.String(length=36), nullable=True),
        sa.Column("campaign_slug", sa.String(length=160), nullable=True),
        sa.Column("product_id", sa.String(length=36), nullable=True),
        sa.Column("session_id", sa.String(length=128), nullable=True),
        sa.Column("anonymous_id", sa.String(length=128), nullable=True),
        sa.Column("utm_source", sa.String(length=120), nullable=True),
        sa.Column("utm_medium", sa.String(length=120), nullable=True),
        sa.Column("utm_campaign", sa.String(length=120), nullable=True),
        sa.Column("utm_content", sa.String(length=120), nullable=True),
        sa.Column("fbclid", sa.String(length=255), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("ip_hash", sa.String(length=128), nullable=True),
        sa.Column("payload_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_tracking_events_event_name", "tracking_events", ["event_name"], unique=False)
    op.create_index("ix_tracking_events_created_at", "tracking_events", ["created_at"], unique=False)

    op.create_table(
        "coupon_redemptions",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("campaign_id", sa.String(length=36), nullable=True),
        sa.Column("coupon_code", sa.String(length=64), nullable=False),
        sa.Column("session_id", sa.String(length=128), nullable=True),
        sa.Column("redeemed_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["campaign_id"], ["campaigns.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_coupon_redemptions_coupon_code", "coupon_redemptions", ["coupon_code"], unique=False)


def downgrade() -> None:
    op.drop_table("coupon_redemptions")
    op.drop_table("tracking_events")
    op.drop_table("media_assets")
    op.drop_table("products")
    op.drop_table("site_settings")
    op.drop_table("campaigns")
    op.drop_table("categories")
    op.drop_table("admin_users")
