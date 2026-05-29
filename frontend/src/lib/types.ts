export type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  imageAlt?: string;
  accentColor?: string;
  isActive: boolean;
  displayOrder: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  imageAlt: string;
  isAlcoholic: boolean;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  badge?: "Destaque" | "Novo" | "Mais pedido";
};

export type CampaignChannel = "instagram" | "qr_code" | "organic" | "paid_traffic";
export type CampaignStatus = "draft" | "active" | "paused" | "finished";

export type Campaign = {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  heroImageUrl: string;
  heroImageAlt: string;
  featuredProductImageUrl?: string;
  couponCode?: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  startDate?: string;
  endDate?: string;
  ctaLabel?: string;
};

export type MediaAssetType = "product" | "category" | "campaign" | "home" | "landing";

export type MediaAsset = {
  id: string;
  name: string;
  url: string;
  alt: string;
  type: MediaAssetType;
  uploadedAt: string;
};

export type SiteSettings = {
  businessName: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  instagramHandle: string;
  address: string;
  mapsUrl: string;
  openingHours: string;
  homeIntro: string;
  showResponsibleDrinkingNotice: boolean;
  metaPixelId?: string;
  googleTagManagerId?: string;
};
