import { useState } from "react";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useChopeStore } from "@/lib/store/chope-store";


export default function AdminSettings() {
  const { settings, updateSettings } = useChopeStore();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout
      title="Configurações"
      actions={
        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)]"
        >
          <Save className="h-4 w-4" /> {saved ? "Salvo" : "Salvar"}
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Estabelecimento">
          <Field label="Nome do estabelecimento">
            <input
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Texto curto da home">
            <textarea
              value={form.homeIntro}
              onChange={(e) => setForm({ ...form, homeIntro: e.target.value })}
              rows={3}
              className="input"
            />
          </Field>
          <Field label="Horário de funcionamento">
            <input
              value={form.openingHours}
              onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
              className="input"
            />
          </Field>
        </Card>

        <Card title="Contato">
          <Field label="WhatsApp (somente números, com DDI)">
            <input
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              className="input"
              placeholder="5511999999999"
            />
          </Field>
          <Field label="WhatsApp para exibição">
            <input
              value={form.whatsappDisplay}
              onChange={(e) => setForm({ ...form, whatsappDisplay: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Instagram">
            <input
              value={form.instagramHandle}
              onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
              className="input"
            />
          </Field>
        </Card>

        <Card title="Localização">
          <Field label="Endereço">
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Link do Google Maps">
            <input
              value={form.mapsUrl}
              onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
              className="input"
            />
          </Field>
        </Card>

        <Card title="Preferências">
          <label className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
            <span className="text-sm font-medium">
              Mostrar aviso de consumo responsável
            </span>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  showResponsibleDrinkingNotice: !form.showResponsibleDrinkingNotice,
                })
              }
              className={`relative h-6 w-11 rounded-full ${form.showResponsibleDrinkingNotice ? "bg-primary" : "bg-border"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${form.showResponsibleDrinkingNotice ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </label>
          <Field label="Meta Pixel ID (placeholder)">
            <input
              value={form.metaPixelId ?? ""}
              onChange={(e) => setForm({ ...form, metaPixelId: e.target.value })}
              className="input"
              placeholder="Ainda não conectado"
            />
          </Field>
          <Field label="Google Tag Manager ID (placeholder)">
            <input
              value={form.googleTagManagerId ?? ""}
              onChange={(e) => setForm({ ...form, googleTagManagerId: e.target.value })}
              className="input"
              placeholder="Ainda não conectado"
            />
          </Field>
          <p className="text-xs text-muted-foreground">
            Estes campos ficam prontos para conectar Meta Pixel e Google Tag Manager no futuro.
          </p>
        </Card>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--input);background:var(--background);padding:.55rem .75rem;border-radius:.6rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </AdminLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
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
