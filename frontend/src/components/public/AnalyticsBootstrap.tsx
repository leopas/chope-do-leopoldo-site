import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureUtmFromSearch } from "@/lib/analytics/context";
import { initMarketingScripts } from "@/lib/analytics/marketing-scripts";
import { trackPageView } from "@/lib/analytics";
import { useChopeStore } from "@/lib/store/chope-store";
import { MarketingConsentBanner } from "./MarketingConsentBanner";

export function AnalyticsBootstrap() {
  const location = useLocation();
  const settings = useChopeStore((s) => s.settings);

  useEffect(() => {
    captureUtmFromSearch(location.search);
  }, [location.search]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    initMarketingScripts(settings);
  }, [settings]);

  if (location.pathname.startsWith("/admin")) return null;

  return <MarketingConsentBanner settings={settings} />;
}
