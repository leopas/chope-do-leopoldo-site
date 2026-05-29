import { create } from "zustand";
import type { Campaign, Category, MediaAsset, Product, SiteSettings } from "../types";
import { mockCategories } from "../mock/categories";
import { mockProducts } from "../mock/products";
import { mockCampaigns } from "../mock/campaigns";
import { mockMedia } from "../mock/media";
import { defaultSiteSettings } from "../mock/siteSettings";

type ChopeStore = {
  products: Product[];
  categories: Category[];
  campaigns: Campaign[];
  media: MediaAsset[];
  settings: SiteSettings;
  // products
  upsertProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  duplicateProduct: (id: string) => void;
  // categories
  upsertCategory: (c: Category) => void;
  removeCategory: (id: string) => void;
  // campaigns
  upsertCampaign: (c: Campaign) => void;
  removeCampaign: (id: string) => void;
  // media
  addMedia: (m: MediaAsset) => void;
  removeMedia: (id: string) => void;
  // settings
  updateSettings: (patch: Partial<SiteSettings>) => void;
  hydrateFromApi: (data: {
    settings: SiteSettings;
    categories: Category[];
    products: Product[];
    campaigns: Campaign[];
  }) => void;
};

export const useChopeStore = create<ChopeStore>((set) => ({
  products: mockProducts,
  categories: mockCategories,
  campaigns: mockCampaigns,
  media: mockMedia,
  settings: defaultSiteSettings,

  upsertProduct: (p) =>
    set((s) => {
      const exists = s.products.some((x) => x.id === p.id);
      return {
        products: exists
          ? s.products.map((x) => (x.id === p.id ? p : x))
          : [...s.products, p],
      };
    }),
  removeProduct: (id) =>
    set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
  toggleProductActive: (id) =>
    set((s) => ({
      products: s.products.map((p) =>
        p.id === id ? { ...p, isActive: !p.isActive } : p,
      ),
    })),
  duplicateProduct: (id) =>
    set((s) => {
      const orig = s.products.find((p) => p.id === id);
      if (!orig) return s;
      const copy: Product = {
        ...orig,
        id: `${orig.id}-copy-${Date.now()}`,
        name: `${orig.name} (cópia)`,
        isFeatured: false,
      };
      return { products: [...s.products, copy] };
    }),

  upsertCategory: (c) =>
    set((s) => {
      const exists = s.categories.some((x) => x.id === c.id);
      return {
        categories: exists
          ? s.categories.map((x) => (x.id === c.id ? c : x))
          : [...s.categories, c],
      };
    }),
  removeCategory: (id) =>
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

  upsertCampaign: (c) =>
    set((s) => {
      const exists = s.campaigns.some((x) => x.id === c.id);
      return {
        campaigns: exists
          ? s.campaigns.map((x) => (x.id === c.id ? c : x))
          : [...s.campaigns, c],
      };
    }),
  removeCampaign: (id) =>
    set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),

  addMedia: (m) => set((s) => ({ media: [m, ...s.media] })),
  removeMedia: (id) => set((s) => ({ media: s.media.filter((m) => m.id !== id) })),

  updateSettings: (patch) =>
    set((s) => ({ settings: { ...s.settings, ...patch } })),

  hydrateFromApi: (data) =>
    set({
      settings: data.settings,
      categories: data.categories,
      products: data.products,
      campaigns: data.campaigns,
    }),
}));

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
