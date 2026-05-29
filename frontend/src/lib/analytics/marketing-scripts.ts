import type { SiteSettings } from "@/lib/types";

export const MARKETING_CONSENT_KEY = "chope_marketing_consent";

export type MarketingConsent = "accepted" | "declined" | null;

export function getMarketingConsent(): MarketingConsent {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(MARKETING_CONSENT_KEY);
  return v === "accepted" || v === "declined" ? v : null;
}

export function setMarketingConsent(value: "accepted" | "declined") {
  window.localStorage.setItem(MARKETING_CONSENT_KEY, value);
}

/**
 * Pixel-ready: só injeta scripts de terceiros após consentimento explícito.
 * Meta Pixel / GTM reais ficam para fase posterior (CRP-007 não carrega SDK).
 */
export function initMarketingScripts(settings: SiteSettings) {
  if (getMarketingConsent() !== "accepted") return;
  if (!settings.loadMarketingScriptsAfterConsent) return;

  const pixelId = settings.metaPixelId?.trim();
  const gtmId = settings.googleTagManagerId?.trim();

  if (!pixelId && !gtmId) return;

  if (typeof window !== "undefined") {
    const w = window as Window & {
      __chopeMarketingReady?: { metaPixelId?: string; gtmId?: string };
    };
    w.__chopeMarketingReady = {
      metaPixelId: pixelId || undefined,
      gtmId: gtmId || undefined,
    };
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[marketing] consent OK — IDs reservados (sem SDK):", {
      metaPixelId: pixelId || null,
      googleTagManagerId: gtmId || null,
    });
  }
}
