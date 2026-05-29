import { Link, NavLink } from "react-router-dom";
import { MessageCircle, MenuSquare, MapPin } from "lucide-react";
import { useChopeStore } from "@/lib/store/chope-store";
import { generalInquiryLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

export function PublicHeader() {
  const settings = useChopeStore((s) => s.settings);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-warm)]">
            <span className="font-display text-lg font-bold">L</span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {settings.businessName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-sm font-medium transition hover:bg-muted hover:text-foreground ${
                isActive ? "bg-muted text-foreground" : "text-foreground/80"
              }`
            }
          >
            Cardápio
          </NavLink>
          <a
            href={settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("ClickDirections", { source: "header" })}
            className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
          >
            Como Chegar
          </a>
          <a
            href={generalInquiryLink(settings)}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("ClickWhatsApp", { source: "header" })}
            className="ml-1 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)] transition hover:brightness-95"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </nav>

        {/* mobile icons */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/menu"
            aria-label="Cardápio"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-muted"
          >
            <MenuSquare className="h-5 w-5" />
          </Link>
          <a
            href={settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Como chegar"
            onClick={() => track("ClickDirections", { source: "header_mobile" })}
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-muted"
          >
            <MapPin className="h-5 w-5" />
          </a>
          <a
            href={generalInquiryLink(settings)}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            onClick={() => track("ClickWhatsApp", { source: "header_mobile" })}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-warm)]"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
