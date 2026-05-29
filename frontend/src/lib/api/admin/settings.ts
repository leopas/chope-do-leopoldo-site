import { apiRequest } from "@/lib/api/client";
import type { SiteSettings } from "@/lib/types";

export const settingsApi = {
  get: () => apiRequest<SiteSettings>("/api/admin/settings"),
  update: (patch: Partial<SiteSettings>) =>
    apiRequest<SiteSettings>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
};
