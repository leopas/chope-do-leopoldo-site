import { Link } from "react-router-dom";
import { Package, Megaphone, Images, Plus, Layout } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MetricCard } from "@/components/admin/MetricCard";
import { useChopeStore, formatPrice } from "@/lib/store/chope-store";


export default function AdminDashboardPage() {
  const products = useChopeStore((s) => s.products);
  const campaigns = useChopeStore((s) => s.campaigns);
  const media = useChopeStore((s) => s.media);
  const recent = [...products].slice(-5).reverse();

  return (
    <AdminLayout title="Dashboard">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Produtos ativos"
          value={products.filter((p) => p.isActive).length}
          icon={Package}
          hint={`de ${products.length} no total`}
        />
        <MetricCard
          label="Campanhas ativas"
          value={campaigns.filter((c) => c.status === "active").length}
          icon={Megaphone}
          hint={`de ${campaigns.length} no total`}
        />
        <MetricCard label="Imagens" value={media.length} icon={Images} hint="biblioteca" />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Atalhos</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { to: "/admin/produtos", label: "Novo produto", icon: Package },
            { to: "/admin/campanhas", label: "Nova campanha", icon: Megaphone },
            { to: "/admin/landing-pages", label: "Nova landing page", icon: Layout },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] hover:border-primary"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                  <a.icon className="h-4 w-4" />
                </span>
                <span className="font-medium">{a.label}</span>
              </span>
              <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Últimos produtos cadastrados</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-3">
                <img
                  src={p.imageUrl}
                  alt={p.imageAlt}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(p.price)}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {p.isActive ? "Ativo" : "Inativo"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AdminLayout>
  );
}
