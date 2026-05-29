import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MessageCircle, MapPin, UtensilsCrossed, Sparkles, TicketPercent } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { HeroSection } from "@/components/public/HeroSection";
import { PrimaryCTA, SecondaryCTA } from "@/components/public/CTAButtons";
import { LocationBlock } from "@/components/public/LocationBlock";
import { ResponsibleDrinkingNotice } from "@/components/public/ResponsibleDrinkingNotice";
import { fetchPublicCampaign } from "@/lib/api/public";
import { useChopeStore } from "@/lib/store/chope-store";
import { mockCampaigns } from "@/lib/mock/campaigns";
import type { Campaign } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

function LandingNotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div className="max-w-md">
        <h1 className="font-display text-4xl font-semibold">Campanha não encontrada</h1>
        <p className="mt-3 text-muted-foreground">
          O link pode ter expirado. Veja nosso cardápio.
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Ver cardápio
        </Link>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const storeCampaigns = useChopeStore((s) => s.campaigns);
  const settings = useChopeStore((s) => s.settings);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!slug) {
      setResolved(true);
      return;
    }

    const fromStore = storeCampaigns.find((x) => x.slug === slug);
    if (fromStore) {
      setCampaign(fromStore);
      setResolved(true);
      return;
    }

    fetchPublicCampaign(slug).then((apiCampaign) => {
      setCampaign(apiCampaign ?? mockCampaigns.find((x) => x.slug === slug) ?? null);
      setResolved(true);
    });
  }, [slug, storeCampaigns]);

  useEffect(() => {
    if (!campaign?.slug) return;
    track("ViewCampaignLandingPage", {
      campaignId: campaign.id,
      campaignSlug: campaign.slug,
      slug: campaign.slug,
    });
  }, [campaign?.id, campaign?.slug]);

  useEffect(() => {
    if (!campaign?.couponCode) return;
    track("CouponShown", {
      campaignId: campaign.id,
      campaignSlug: campaign.slug,
      code: campaign.couponCode,
    });
  }, [campaign?.couponCode, campaign?.id, campaign?.slug]);

  if (!resolved) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Carregando campanha…
      </div>
    );
  }

  if (!campaign) return <LandingNotFound />;

  const waMessage = `Olá, ${settings.businessName}! Vim pela campanha ${campaign.name}${campaign.couponCode ? ` (cupom ${campaign.couponCode})` : ""}.`;
  const waLink = buildWhatsAppLink(settings.whatsappNumber, waMessage);

  return (
    <>
      <PublicHeader />
      <main>
        <HeroSection
          imageUrl={campaign.heroImageUrl}
          imageAlt={campaign.heroImageAlt}
          eyebrow={campaign.name}
          title={campaign.title}
          subtitle={campaign.description}
        >
          <PrimaryCTA
            external
            href={waLink}
            onClick={() =>
              track("ClickWhatsApp", {
                source: "lp_hero",
                campaignId: campaign.id,
                campaignSlug: campaign.slug,
              })
            }
          >
            <MessageCircle className="h-5 w-5" /> {campaign.ctaLabel ?? "Chamar no WhatsApp"}
          </PrimaryCTA>
          <SecondaryCTA href="/menu" onClick={() => track("ViewMenu", { source: "lp" })}>
            <UtensilsCrossed className="h-5 w-5" /> Ver Cardápio
          </SecondaryCTA>
          <SecondaryCTA
            external
            href={settings.mapsUrl}
            onClick={() =>
              track("ClickDirections", {
                source: "lp",
                campaignId: campaign.id,
                campaignSlug: campaign.slug,
              })
            }
          >
            <MapPin className="h-5 w-5" /> Como Chegar
          </SecondaryCTA>
        </HeroSection>

        {campaign.couponCode && (
          <section className="mx-auto max-w-3xl px-4 py-12">
            <div
              className="relative overflow-hidden rounded-3xl border border-dashed border-primary bg-primary/5 p-6 text-center shadow-[var(--shadow-card)] md:p-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <TicketPercent className="h-3.5 w-3.5" /> Cupom da casa
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Mostre este cupom no balcão:
              </p>
              <p className="mt-2 font-display text-4xl font-bold tracking-wider text-foreground md:text-5xl">
                {campaign.couponCode}
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(campaign.couponCode!);
                  track("CouponCopied", {
                    code: campaign.couponCode,
                    campaignId: campaign.id,
                    campaignSlug: campaign.slug,
                  });
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
              >
                Copiar cupom
              </button>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-5xl px-4 py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Como funciona
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Simples assim
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Chame no WhatsApp",
                d: "Diga que veio pela campanha e a gente já separa.",
              },
              {
                n: "2",
                t: "Venha até a casa",
                d: "Rua Coronel Ramos, 51 — Centro, Santa Isabel/SP.",
              },
              {
                n: "3",
                t: "Apresente o cupom",
                d: "Mostre o código no balcão para garantir o benefício.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg font-bold">
                  {s.n}
                </div>
                <p className="mt-3 font-display text-lg font-semibold">{s.t}</p>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <LocationBlock />

        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="rounded-3xl bg-secondary p-8 text-center text-secondary-foreground md:p-12">
            <Sparkles className="mx-auto h-6 w-6 text-primary-glow" />
            <h2 className="mt-4 font-display text-3xl font-semibold md:text-4xl">
              Bora? A gente te espera.
            </h2>
            <p className="mt-3 text-secondary-foreground/85">
              Chame no WhatsApp ou venha direto. Mesa garantida.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <PrimaryCTA
                external
                href={waLink}
                onClick={() =>
                  track("ClickWhatsApp", {
                    source: "lp_bottom",
                    campaignId: campaign.id,
                    campaignSlug: campaign.slug,
                  })
                }
              >
                <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
              </PrimaryCTA>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  track("ClickDirections", {
                    source: "lp_bottom",
                    campaignId: campaign.id,
                    campaignSlug: campaign.slug,
                  })
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-base font-semibold text-white hover:bg-white/15"
              >
                <MapPin className="h-5 w-5" /> Como chegar
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 pb-12">
          <ResponsibleDrinkingNotice />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
