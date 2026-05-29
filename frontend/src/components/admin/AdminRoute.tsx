import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  clearAdminToken,
  fetchAdminMe,
  getAdminToken,
} from "@/lib/auth/admin-auth";

export function AdminRoute() {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setStatus("denied");
      return;
    }
    fetchAdminMe()
      .then(() => setStatus("ok"))
      .catch(() => {
        clearAdminToken();
        setStatus("denied");
      });
  }, [location.pathname]);

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40 text-sm text-muted-foreground">
        Verificando sessão…
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
