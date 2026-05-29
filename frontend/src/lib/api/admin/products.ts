import { apiRequest } from "@/lib/api/client";
import type { Product } from "@/lib/types";

export const productsApi = {
  list: () => apiRequest<Product[]>("/api/admin/products"),
  get: (id: string) => apiRequest<Product>(`/api/admin/products/${id}`),
  create: (product: Product) =>
    apiRequest<Product>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  update: (id: string, patch: Partial<Product>) =>
    apiRequest<Product>(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  remove: (id: string) =>
    apiRequest<void>(`/api/admin/products/${id}`, { method: "DELETE" }),
  duplicate: async (source: Product) => {
    const copy: Product = {
      ...source,
      id: "",
      name: `${source.name} (cópia)`,
      isFeatured: false,
    };
    return productsApi.create(copy);
  },
  toggleActive: (product: Product) =>
    productsApi.update(product.id, { isActive: !product.isActive }),
};
