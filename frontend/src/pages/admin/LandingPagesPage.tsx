import { Link } from "react-router-dom";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useChopeStore } from "@/lib/store/chope-store";


export default function AdminLandingPages() {
  const campaigns = useChopeStore((s) => s.campaigns);
  const [copied, setCopied] = useState<string | null>(null);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/lp/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <AdminLayout title="Landing Pages">
      <p className="mb-4 text-sm text-muted-foreground">
        Cada campanha gera uma landing page pública pronta para divulgação.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((c) => (
          <article
            key={c.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
          >
            <div className="relative aspect-[16/10] bg-muted">
              {c.heroImageUrl && (
                <img src={c.heroImageUrl} alt={c.heroImageAlt} className="h-full w-full object-cover" />
              )}
              <div className="absolute right-3 top-3">
                <StatusBadge tone={c.status === "active" ? "success" : "muted"}>
                  {c.status}
                </StatusBadge>
              </div>
            </div>
            <div className="space-y-2 p-4">
              <p className="font-display text-lg font-semibold leading-tight">{c.title}</p>
              <p className="text-xs text-muted-foreground">/lp/{c.slug}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={`/lp/${c.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Prévia
                </Link>
                <button
                  onClick={() => copyLink(c.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                >
                  {copied === c.slug ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === c.slug ? "Copiado" : "Copiar link"}
                </button>
                <Link
                  to="/admin/campanhas"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                >
                  Editar
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}
