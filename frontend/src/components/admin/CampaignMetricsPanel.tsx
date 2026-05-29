import { useEffect, useState } from "react";
import { BarChart3, X } from "lucide-react";
import { campaignsApi, type CampaignMetrics } from "@/lib/api/admin/campaigns";
import type { Campaign } from "@/lib/types";

function pct(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}

export function CampaignMetricsButton({ campaign }: { campaign: Campaign }) {
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    campaignsApi
      .metrics(campaign.id)
      .then(setMetrics)
      .catch((e) => setError(e instanceof Error ? e.message : "Erro ao carregar métricas"))
      .finally(() => setLoading(false));
  }, [open, campaign.id]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
        aria-label="Métricas da campanha"
        title="Métricas"
      >
        <BarChart3 className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4">
          <div
            role="dialog"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold">{campaign.name}</p>
                <p className="text-xs text-muted-foreground">/lp/{campaign.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loading && (
              <p className="mt-6 text-sm text-muted-foreground">Carregando métricas…</p>
            )}
            {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
            {metrics && !loading && (
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Views LP" value={metrics.views} />
                <Metric label="WhatsApp" value={metrics.clickWhatsApp} />
                <Metric label="Como chegar" value={metrics.clickDirections} />
                <Metric label="Cupons vistos" value={metrics.couponsShown} />
                <Metric label="Cupons copiados" value={metrics.couponsCopied} />
                <Metric label="WA / view" value={pct(metrics.whatsappRate)} />
                <Metric label="Maps / view" value={pct(metrics.directionsRate)} colSpan />
              </dl>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Metric({
  label,
  value,
  colSpan,
}: {
  label: string;
  value: number | string;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "col-span-2" : undefined}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-display text-xl font-semibold">{value}</dd>
    </div>
  );
}
