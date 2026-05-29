import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminLayout({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar title={title} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {actions && (
            <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
              {actions}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
