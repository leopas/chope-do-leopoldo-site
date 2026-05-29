import { Link } from "react-router-dom";
import { MessageCircle, MapPin, UtensilsCrossed, Sparkles, Mic2, Beer, Flame } from "lucide-react";
import heroImg from "@/assets/hero-bar.jpg";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { HeroSection } from "@/components/public/HeroSection";
import { PrimaryCTA, SecondaryCTA } from "@/components/public/CTAButtons";
import { LocationBlock } from "@/components/public/LocationBlock";
import { CampaignCard } from "@/components/public/CampaignCard";
import { useChopeStore } from "@/lib/store/chope-store";
import { generalInquiryLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

const highlights = [
  { icon: Sparkles, title: "Promoções da semana", text: "Combos e descontos toda semana." },
  { icon: Mic2, title: "Karaokê", text: "Sextas com voz da galera." },
  { icon: Flame, title: "Hambúrgueres", text: "Carne fresca, pão na chapa." },
  { icon: Beer, title: "Chope gelado", text: "Sempre no ponto certo." },
];

export default function HomePage() {
  const settings = useChopeStore((s) => s.settings);
  const campaigns = useChopeStore((s) =>
    s.campaigns.filter((c) => c.status === "active").slice(0, 4),
  );

  return (
    <>
      <PublicHeader />
      <main>
        <HeroSection
          imageUrl={heroImg}
          imageAlt="Atmosfera de bar com canecos de chope e luzes quentes"
          eyebrow="Choperia · Santa Isabel/SP"
          title="Seu ponto de encontro em Santa Isabel"
          subtitle={settings.homeIntro}
        >
          <PrimaryCTA
            href="/menu"
            onClick={() => track("ViewMenu", { source: "home_hero" })}
          >
            <UtensilsCrossed className="h-5 w-5" /> Ver Cardápio
          </PrimaryCTA>
          <SecondaryCTA
            external
            href={generalInquiryLink(settings)}
            onClick={() => track("ClickWhatsApp", { source: "home_hero" })}
          >
            <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
          </SecondaryCTA>
          <SecondaryCTA
            external
            href={settings.mapsUrl}
            onClick={() => track("ClickDirections", { source: "home_hero" })}
          >
            <MapPin className="h-5 w-5" /> Como Chegar
          </SecondaryCTA>
        </HeroSection>

        {/* Destaques */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Hoje no Chope
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
                Destaques da casa
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary">
                  <h.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-lg font-semibold">{h.title}</p>
                <p className="text-sm text-muted-foreground">{h.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Campanhas */}
        {campaigns.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-4">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Promoções da semana
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
                  Tá rolando agora
                </h2>
              </div>
              <Link
                to="/menu"
                className="hidden text-sm font-semibold text-primary hover:underline md:inline"
              >
                Ver cardápio →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {campaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </section>
        )}

        <LocationBlock />
      </main>
      <PublicFooter />
    </>
  );
}
