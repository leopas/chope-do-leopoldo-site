import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Megaphone,
  Layout,
  Images,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const mobileItems: NavItem[] = [
  { to: "/admin", label: "Início", icon: LayoutDashboard, exact: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/categorias", label: "Categ.", icon: Tags },
  { to: "/admin/campanhas", label: "Camp.", icon: Megaphone },
  { to: "/admin/landing-pages", label: "LPs", icon: Layout },
  { to: "/admin/imagens", label: "Mídia", icon: Images },
  { to: "/admin/configuracoes", label: "Config.", icon: Settings },
];

export function AdminTopbar({ title }: { title: string }) {
  const { pathname: path } = useLocation();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Painel
          </p>
          <h1 className="font-display text-xl font-semibold leading-tight">{title}</h1>
        </div>
        <Link
          to="/"
          className="hidden rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted md:inline-flex"
        >
          Ver site público
        </Link>
      </div>
      <nav className="md:hidden">
        <div className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileItems.map((it) => {
            const active = it.exact
              ? path === it.to || path === `${it.to}/`
              : path.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/80",
                )}
              >
                <it.icon className="h-3.5 w-3.5" />
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
