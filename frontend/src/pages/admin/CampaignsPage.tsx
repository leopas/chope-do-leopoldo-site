import { Link } from "react-router-dom";
import { useState } from "react";
import { Plus, X, ExternalLink } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ImageUploader, type ImageUploaderValue } from "@/components/media/ImageUploader";
import { useChopeStore } from "@/lib/store/chope-store";
import type { Campaign, CampaignChannel, CampaignStatus } from "@/lib/types";


const empty: Campaign = {
  id: "",
  name: "",
  slug: "",
  title: "",
  description: "",
  heroImageUrl: "",
  heroImageAlt: "",
  couponCode: "",
  channel: "instagram",
  status: "draft",
};

const channelLabel: Record<CampaignChannel, string> = {
  instagram: "Instagram",
  qr_code: "QR Code",
  organic: "Orgânico",
  paid_traffic: "Tráfego pago",
};

const statusTone: Record<CampaignStatus, "success" | "neutral" | "warning" | "muted"> = {
  active: "success",
  draft: "muted",
  paused: "warning",
  finished: "muted",
};

const statusLabel: Record<CampaignStatus, string> = {
  active: "Ativa",
  draft: "Rascunho",
  paused: "Pausada",
  finished: "Encerrada",
};

export default function AdminCampaigns() {
  const { campaigns, upsertCampaign } = useChopeStore();
  const [editing, setEditing] = useState<Campaign | null>(null);

  return (
    <AdminLayout
      title="Campanhas"
      actions={
        <button
          onClick={() => setEditing({ ...empty, id: `c-${Date.now()}` })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)]"
        >
          <Plus className="h-4 w-4" /> Nova campanha
        </button>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3">Nome</th>
              <th className="hidden px-3 py-3 md:table-cell">Canal</th>
              <th className="hidden px-3 py-3 md:table-cell">Cupom</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-muted/40">
                <td className="px-3 py-3">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">/lp/{c.slug}</p>
                </td>
                <td className="hidden px-3 py-3 text-muted-foreground md:table-cell">
                  {channelLabel[c.channel]}
                </td>
                <td className="hidden px-3 py-3 md:table-cell">
                  {c.couponCode ? (
                    <code className="rounded bg-muted px-2 py-0.5 text-xs">{c.couponCode}</code>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge tone={statusTone[c.status]}>{statusLabel[c.status]}</StatusBadge>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/lp/${c.slug}`}
                      target="_blank"
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                      aria-label="Abrir LP"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => setEditing(c)}
                      className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted"
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <CampaignDrawer
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(c) => {
            upsertCampaign(c);
            setEditing(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

function CampaignDrawer({
  initial,
  onClose,
  onSave,
}: {
  initial: Campaign;
  onClose: () => void;
  onSave: (c: Campaign) => void;
}) {
  const [form, setForm] = useState<Campaign>(initial);
  const image: ImageUploaderValue | null = form.heroImageUrl
    ? { url: form.heroImageUrl, alt: form.heroImageAlt }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-foreground/50 backdrop-blur-sm">
      <div className="flex w-full max-w-xl flex-col overflow-hidden bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-lg font-semibold">
            {initial.name ? "Editar campanha" : "Nova campanha"}
          </h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 space-y-4 overflow-auto p-5">
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Imagem principal da campanha
            </p>
            <ImageUploader
              value={image}
              onChange={(v) =>
                setForm({ ...form, heroImageUrl: v?.url ?? "", heroImageAlt: v?.alt ?? "" })
              }
              guidance="Imagem 16:9 horizontal funciona melhor no hero da landing page."
              recommendedLabel="Recomendado: 1600 × 1200 px"
            />
          </section>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome interno">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </Field>
            <Field label="Slug (URL)">
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                className="input"
                placeholder="karaoke-sexta"
              />
            </Field>
          </div>
          <Field label="Título da landing page">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          </Field>
          <Field label="Descrição curta">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA principal">
              <input
                value={form.ctaLabel ?? ""}
                onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                className="input"
                placeholder="Chamar no WhatsApp"
              />
            </Field>
            <Field label="Cupom (opcional)">
              <input
                value={form.couponCode ?? ""}
                onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                className="input"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Início">
              <input
                type="date"
                value={form.startDate ?? ""}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Fim">
              <input
                type="date"
                value={form.endDate ?? ""}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="input"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Canal">
              <select
                value={form.channel}
                onChange={(e) =>
                  setForm({ ...form, channel: e.target.value as CampaignChannel })
                }
                className="input"
              >
                {(Object.keys(channelLabel) as CampaignChannel[]).map((k) => (
                  <option key={k} value={k}>
                    {channelLabel[k]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as CampaignStatus })
                }
                className="input"
              >
                {(Object.keys(statusLabel) as CampaignStatus[]).map((k) => (
                  <option key={k} value={k}>
                    {statusLabel[k]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
        <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.name || !form.slug || !form.title}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            Salvar
          </button>
        </footer>
        <style>{`.input{width:100%;border:1px solid var(--input);background:var(--background);padding:.55rem .75rem;border-radius:.6rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary)}`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}
