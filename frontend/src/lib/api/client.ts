import { clearAdminToken, getAdminToken } from "@/lib/auth/token";

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown) {
    const message =
      typeof detail === "object" && detail && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : `Erro na API (${status})`;
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function authHeaders(init?: RequestInit, jsonBody?: boolean): Record<string, string> {
  const token = getAdminToken();
  return {
    Accept: "application/json",
    ...(jsonBody ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  };
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = authHeaders(init, Boolean(init?.body));

  const res = await fetch(path, { ...init, headers });

  if (!res.ok) {
    if (res.status === 401 && path.startsWith("/api/admin") && !path.includes("/auth/login")) {
      clearAdminToken();
    }
    let detail: unknown = res.statusText;
    try {
      detail = await res.json();
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

/** Multipart — não definir Content-Type (boundary automático). */
export async function apiFormRequest<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    body: form,
    headers: authHeaders(undefined, false),
  });

  if (!res.ok) {
    if (res.status === 401) clearAdminToken();
    let detail: unknown = res.statusText;
    try {
      detail = await res.json();
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail);
  }

  return (await res.json()) as T;
}
