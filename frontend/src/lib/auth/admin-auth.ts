import { apiRequest } from "@/lib/api/client";
import { clearAdminToken, getAdminToken, setAdminToken } from "@/lib/auth/token";

export { clearAdminToken, getAdminToken, isAdminAuthenticated, setAdminToken } from "@/lib/auth/token";

export type AdminUser = {
  id: string;
  email: string;
  fullName?: string | null;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AdminUser;
};

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAdminToken(data.accessToken);
  return data;
}

export async function fetchAdminMe(): Promise<AdminUser> {
  return apiRequest<AdminUser>("/api/admin/auth/me");
}

export async function logoutAdmin(): Promise<void> {
  const token = getAdminToken();
  if (token) {
    try {
      await apiRequest<void>("/api/admin/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
  }
  clearAdminToken();
}
