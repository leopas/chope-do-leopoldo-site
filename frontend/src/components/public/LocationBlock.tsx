import { MapPin } from "lucide-react";
import { useChopeStore } from "@/lib/store/chope-store";
import { track } from "@/lib/analytics";

export function LocationBlock() {
  const settings = useChopeStore((s) => s.settings);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] md:grid md:grid-cols-2">
        <div className="aspect-[4/3] bg-muted md:aspect-auto">
          <iframe
            title="Mapa do bar"
            src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
            className="h-full min-h-[280px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Onde estamos
          </p>
          <h2 className="font-display text-3xl font-semibold">
            Seu ponto de encontro em Santa Isabel
          </h2>
          <p className="text-muted-foreground">{settings.address}</p>
          <p className="text-sm text-muted-foreground">{settings.openingHours}</p>
          <a
            href={settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("ClickDirections", { source: "location_block" })}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)] transition hover:brightness-95"
          >
            <MapPin className="h-4 w-4" /> Abrir no Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
