import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { fetchPublicMenu } from "@/lib/api/public";
import { useChopeStore } from "@/lib/store/chope-store";
import { router } from "@/routes";

function PublicCatalogBootstrap() {
  const hydrateFromApi = useChopeStore((s) => s.hydrateFromApi);

  useEffect(() => {
    fetchPublicMenu().then((menu) => {
      if (!menu?.settings) return;
      hydrateFromApi({
        settings: menu.settings,
        categories: menu.categories,
        products: menu.products,
        campaigns: menu.campaigns,
      });
    });
  }, [hydrateFromApi]);

  return null;
}

export default function App() {
  return (
    <>
      <PublicCatalogBootstrap />
      <RouterProvider router={router} />
    </>
  );
}
