import { Link } from "react-router-dom";
import type { Campaign } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link
      to={`/lp/${campaign.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={campaign.heroImageUrl}
          alt={campaign.heroImageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
          {campaign.name}
        </p>
        <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-balance">
          {campaign.title}
        </h3>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-glow opacity-90 transition group-hover:gap-2">
          Ver campanha <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
