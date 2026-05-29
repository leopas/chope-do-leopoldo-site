import { fetchPublicMenu } from "@/lib/api/public";
import { useChopeStore } from "@/lib/store/chope-store";

/** Atualiza o catálogo público no Zustand após mudanças no admin. */
export async function syncPublicCatalog(): Promise<void> {
  const menu = await fetchPublicMenu();
  if (!menu?.settings) return;
  useChopeStore.getState().hydrateFromApi({
    settings: menu.settings,
    categories: menu.categories,
    products: menu.products,
    campaigns: menu.campaigns,
  });
}
