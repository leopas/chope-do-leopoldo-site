import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { AnalyticsBootstrap } from "@/components/public/AnalyticsBootstrap";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import LandingPage from "@/pages/LandingPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminProductsPage from "@/pages/admin/ProductsPage";
import AdminCategoriesPage from "@/pages/admin/CategoriesPage";
import AdminCampaignsPage from "@/pages/admin/CampaignsPage";
import AdminLandingPagesPage from "@/pages/admin/LandingPagesPage";
import AdminMediaPage from "@/pages/admin/MediaPage";
import AdminSettingsPage from "@/pages/admin/SettingsPage";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Voltar para a home
        </a>
      </div>
    </div>
  );
}

function PublicShell() {
  return (
    <>
      <AnalyticsBootstrap />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <PublicShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/menu", element: <MenuPage /> },
      { path: "/lp/:slug", element: <LandingPage /> },
    ],
  },
  { path: "/admin", element: <AdminDashboardPage /> },
  { path: "/admin/produtos", element: <AdminProductsPage /> },
  { path: "/admin/categorias", element: <AdminCategoriesPage /> },
  { path: "/admin/campanhas", element: <AdminCampaignsPage /> },
  { path: "/admin/landing-pages", element: <AdminLandingPagesPage /> },
  { path: "/admin/imagens", element: <AdminMediaPage /> },
  { path: "/admin/configuracoes", element: <AdminSettingsPage /> },
  { path: "/admin/", element: <Navigate to="/admin" replace /> },
  { path: "*", element: <NotFoundPage /> },
]);
