const SESSION_KEY = "chope_session_id";
const ANON_KEY = "chope_anonymous_id";
const UTM_KEY = "chope_utm_context";

export type UtmContext = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(ANON_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

export function captureUtmFromSearch(search: string) {
  if (typeof window === "undefined" || !search) return;
  const params = new URLSearchParams(search);
  const hasUtm =
    params.has("utm_source") ||
    params.has("utm_medium") ||
    params.has("utm_campaign") ||
    params.has("utm_content") ||
    params.has("fbclid");
  if (!hasUtm) return;

  const ctx: UtmContext = {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    fbclid: params.get("fbclid") ?? undefined,
  };
  writeJson(UTM_KEY, ctx);
}

export function getUtmContext(): UtmContext {
  return readJson<UtmContext>(UTM_KEY) ?? {};
}
