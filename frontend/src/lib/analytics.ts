import { getAnonymousId, getSessionId, getUtmContext } from "@/lib/analytics/context";
import { postTrackingEvent } from "@/lib/api/public";

export type AnalyticsEvent =
  | "PageView"
  | "ViewMenu"
  | "ViewCampaignLandingPage"
  | "ClickWhatsApp"
  | "ClickDirections"
  | "ClickInstagram"
  | "ViewProduct"
  | "CouponShown"
  | "CouponCopied"
  | "UseCoupon";

export type TrackPayload = {
  path?: string;
  source?: string;
  slug?: string;
  campaignId?: string;
  campaignSlug?: string;
  productId?: string;
  code?: string;
  [key: string]: unknown;
};

export function track(event: AnalyticsEvent, payload?: TrackPayload) {
  if (typeof window === "undefined") return;

  const utm = getUtmContext();
  const campaignSlug =
    payload?.campaignSlug ?? (typeof payload?.slug === "string" ? payload.slug : undefined);

  void postTrackingEvent({
    eventName: event,
    sessionId: getSessionId(),
    anonymousId: getAnonymousId(),
    campaignId: payload?.campaignId as string | undefined,
    campaignSlug,
    productId: payload?.productId as string | undefined,
    utmSource: utm.utmSource,
    utmMedium: utm.utmMedium,
    utmCampaign: utm.utmCampaign,
    utmContent: utm.utmContent,
    fbclid: utm.fbclid,
    payload: payload ?? {},
  });
}

export function trackPageView(path: string, extra?: TrackPayload) {
  track("PageView", { path, ...extra });
}
