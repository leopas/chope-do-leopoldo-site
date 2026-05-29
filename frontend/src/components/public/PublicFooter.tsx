import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { useChopeStore } from "@/lib/store/chope-store";
import { track } from "@/lib/analytics";
import { generalInquiryLink } from "@/lib/whatsapp";
import { ResponsibleDrinkingNotice } from "./ResponsibleDrinkingNotice";

export function PublicFooter() {
  const settings = useChopeStore((s) => s.settings);

  return (
    <footer className="mt-16 border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold">{settings.businessName}</p>
          <p className="mt-2 text-sm text-secondary-foreground/80">
            {settings.openingHours}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <a
            href={settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("ClickDirections", { source: "footer" })}
            className="flex items-start gap-2 hover:text-primary"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{settings.address}</span>
          </a>
          <a
            href={generalInquiryLink(settings)}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("ClickWhatsApp", { source: "footer" })}
            className="flex items-center gap-2 hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" /> {settings.whatsappDisplay}
          </a>
          <a
            href={`https://instagram.com/${settings.instagramHandle.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("ClickInstagram", { source: "footer" })}
            className="flex items-center gap-2 hover:text-primary"
          >
            <Instagram className="h-4 w-4" /> {settings.instagramHandle}
          </a>
        </div>
        <div className="space-y-2 text-sm text-secondary-foreground/80">
          <p className="font-semibold text-secondary-foreground">Visite a gente</p>
          <p>Mesas internas, área externa e telão para jogos.</p>
        </div>
      </div>

      {settings.showResponsibleDrinkingNotice && (
        <div className="border-t border-secondary-foreground/15">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <ResponsibleDrinkingNotice tone="dark" />
          </div>
        </div>
      )}

      <div className="border-t border-secondary-foreground/15 py-4 text-center text-xs text-secondary-foreground/60">
        © {new Date().getFullYear()} {settings.businessName}
      </div>
    </footer>
  );
}
