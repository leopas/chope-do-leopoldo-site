import type { Campaign, Category, Product, SiteSettings } from "@/lib/types";

type PublicMenuResponse = {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  featuredProducts: Product[];
  campaigns: Campaign[];
};

type PublicCampaign = Campaign;

export type TrackingEventBody = {
  eventName: string;
  campaignId?: string;
  campaignSlug?: string;
  productId?: string;
  sessionId?: string;
  anonymousId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  payload?: Record<string, unknown>;
};

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPublicMenu(): Promise<PublicMenuResponse | null> {
  return fetchJson<PublicMenuResponse>("/api/public/menu");
}

export async function fetchPublicCampaign(slug: string): Promise<PublicCampaign | null> {
  return fetchJson<PublicCampaign>(`/api/public/campaigns/${encodeURIComponent(slug)}`);
}

export async function postTrackingEvent(body: TrackingEventBody): Promise<void> {
  await fetchJson("/api/public/tracking-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
