import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import {
  getMarketingConsent,
  initMarketingScripts,
  setMarketingConsent,
} from "@/lib/analytics/marketing-scripts";

export function MarketingConsentBanner({ settings }: { settings: SiteSettings }) {
  const [visible, setVisible] = useState(false);

  const hasMarketingIds = Boolean(
    settings.metaPixelId?.trim() || settings.googleTagManagerId?.trim(),
  );

  useEffect(() => {
    const requireConsent = settings.loadMarketingScriptsAfterConsent !== false;
    if (!hasMarketingIds || !requireConsent) {
      setVisible(false);
      return;
    }
    setVisible(getMarketingConsent() === null);
  }, [hasMarketingIds, settings.loadMarketingScriptsAfterConsent]);

  if (!visible) return null;

  const accept = () => {
    setMarketingConsent("accepted");
    initMarketingScripts(settings);
    setVisible(false);
  };

  const decline = () => {
    setMarketingConsent("declined");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies e marketing"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-4 shadow-[var(--shadow-card)] backdrop-blur md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-2xl md:border"
    >
      <p className="text-sm font-semibold text-foreground">Cookies e medição</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Usamos medição interna para melhorar campanhas. Scripts de marketing (Meta / Google)
        só carregam se você aceitar. O cardápio continua funcionando normalmente.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          Aceitar medição
        </button>
        <button
          type="button"
          onClick={decline}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
        >
          Apenas essencial
        </button>
      </div>
    </div>
  );
}
