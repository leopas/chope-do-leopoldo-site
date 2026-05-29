import { apiFormRequest, apiRequest } from "@/lib/api/client";
import type { MediaAsset, MediaAssetType } from "@/lib/types";

export const mediaApi = {
  list: () => apiRequest<MediaAsset[]>("/api/admin/media"),
  upload: (file: File, opts: { alt?: string; type: MediaAssetType }) => {
    const form = new FormData();
    form.append("file", file);
    form.append("type", opts.type);
    if (opts.alt) form.append("alt", opts.alt);
    return apiFormRequest<MediaAsset>("/api/admin/media/upload", form);
  },
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
