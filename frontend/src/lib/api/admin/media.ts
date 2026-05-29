import { apiRequest } from "@/lib/api/client";
import type { MediaAsset, MediaAssetType } from "@/lib/types";

export const mediaApi = {
  list: () => apiRequest<MediaAsset[]>("/api/admin/media"),
  create: (asset: {
    name: string;
    url: string;
    alt: string;
    type: MediaAssetType;
  }) =>
    apiRequest<MediaAsset>("/api/admin/media", {
      method: "POST",
      body: JSON.stringify(asset),
    }),
  remove: (id: string) =>
    apiRequest<void>(`/api/admin/media/${id}`, { method: "DELETE" }),
};
