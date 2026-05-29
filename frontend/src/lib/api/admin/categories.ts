import { apiRequest } from "@/lib/api/client";
import type { Category } from "@/lib/types";

export const categoriesApi = {
  list: () => apiRequest<Category[]>("/api/admin/categories"),
  create: (category: Category) =>
    apiRequest<Category>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),
  update: (id: string, patch: Partial<Category>) =>
    apiRequest<Category>(`/api/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  remove: (id: string) =>
    apiRequest<void>(`/api/admin/categories/${id}`, { method: "DELETE" }),
};
