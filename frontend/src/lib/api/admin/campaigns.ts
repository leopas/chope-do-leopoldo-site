import { apiRequest } from "@/lib/api/client";
import type { Campaign } from "@/lib/types";

export type CampaignMetrics = {
  campaignId: string;
  campaignSlug: string;
  views: number;
  clickWhatsApp: number;
  clickDirections: number;
  couponsShown: number;
  couponsCopied: number;
  whatsappRate: number;
  directionsRate: number;
};

export const campaignsApi = {
  list: () => apiRequest<Campaign[]>("/api/admin/campaigns"),
  create: (campaign: Campaign) =>
    apiRequest<Campaign>("/api/admin/campaigns", {
      method: "POST",
      body: JSON.stringify(campaign),
    }),
  update: (id: string, patch: Partial<Campaign>) =>
    apiRequest<Campaign>(`/api/admin/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  remove: (id: string) =>
    apiRequest<void>(`/api/admin/campaigns/${id}`, { method: "DELETE" }),
  metrics: (id: string) =>
    apiRequest<CampaignMetrics>(`/api/admin/campaigns/${id}/metrics`),
};
