import { apiRequest } from "@/lib/api/client";
import type { Campaign } from "@/lib/types";

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
};
