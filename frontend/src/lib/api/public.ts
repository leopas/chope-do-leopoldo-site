import type { Campaign, Category, Product, SiteSettings } from "@/lib/types";

type PublicMenuResponse = {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  featuredProducts: Product[];
  campaigns: Campaign[];
};

type PublicCampaign = Campaign;

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

export async function postTrackingEvent(
  eventName: string,
  payload?: Record<string, unknown>,
): Promise<void> {
  await fetchJson("/api/public/tracking-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      payload,
      sessionId:
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("chope_session_id") ??
            (() => {
              const id = crypto.randomUUID();
              window.sessionStorage.setItem("chope_session_id", id);
              return id;
            })()
          : undefined,
    }),
  });
}
