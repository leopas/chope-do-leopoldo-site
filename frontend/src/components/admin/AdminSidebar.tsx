import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Megaphone,
  Layout,
  Images,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const items: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/categorias", label: "Categorias", icon: Tags },
  { to: "/admin/campanhas", label: "Campanhas", icon: Megaphone },
  { to: "/admin/landing-pages", label: "Landing Pages", icon: Layout },
  { to: "/admin/imagens", label: "Imagens", icon: Images },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
  const { pathname: path } = useLocation();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
          <span className="font-display text-base font-bold">L</span>
        </span>
        <div>
          <p className="font-display text-sm font-semibold leading-tight">Chope do Leopoldo</p>
          <p className="text-[11px] text-sidebar-foreground/60">Painel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {items.map((it) => {
          const active = it.exact
            ? path === it.to || path === `${it.to}/`
            : path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Ver site público
        </Link>
      </div>
    </aside>
  );
}
