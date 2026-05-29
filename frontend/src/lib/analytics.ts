/**
 * Analytics stubs — preparados para futura integração com Meta Pixel / GTM.
 * Por enquanto apenas registra no console.
 */
export type AnalyticsEvent =
  | "ViewCampaignLandingPage"
  | "ClickWhatsApp"
  | "ClickDirections"
  | "ViewMenu"
  | "UseCoupon";

export function track(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  console.debug("[analytics]", event, payload ?? {});
}
