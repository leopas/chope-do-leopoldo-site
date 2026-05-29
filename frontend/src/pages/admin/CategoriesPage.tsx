import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ImageUploader, type ImageUploaderValue } from "@/components/media/ImageUploader";
import { useChopeStore } from "@/lib/store/chope-store";
import type { Category } from "@/lib/types";


const empty: Category = {
  id: "",
  name: "",
  description: "",
  icon: "",
  imageUrl: "",
  imageAlt: "",
  accentColor: "",
  isActive: true,
  displayOrder: 99,
};

export default function AdminCategories() {
  const { categories, upsertCategory } = useChopeStore();
  const [editing, setEditing] = useState<Category | null>(null);

  return (
    <AdminLayout
      title="Categorias"
      actions={
        <button
          onClick={() => setEditing({ ...empty, id: `cat-${Date.now()}` })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)]"
        >
          <Plus className="h-4 w-4" /> Nova categoria
        </button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setEditing(c)}
            className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-card)] transition hover:border-primary"
          >
            <div className="relative aspect-[5/3] bg-muted">
              {c.imageUrl && (
                <img src={c.imageUrl} alt={c.imageAlt} className="h-full w-full object-cover" />
              )}
              {c.icon && (
                <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-xl backdrop-blur">
                  {c.icon}
                </span>
              )}
            </div>
            <div className="space-y-1 p-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-base font-semibold">{c.name}</p>
                <StatusBadge tone={c.isActive ? "success" : "muted"}>
                  {c.isActive ? "Ativa" : "Inativa"}
                </StatusBadge>
              </div>
              {c.description && (
                <p className="text-xs text-muted-foreground">{c.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {editing && (
        <CategoryDrawer
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(c) => {
            upsertCategory(c);
            setEditing(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

function CategoryDrawer({
  initial,
  onClose,
  onSave,
}: {
  initial: Category;
  onClose: () => void;
  onSave: (c: Category) => void;
}) {
  const [form, setForm] = useState<Category>(initial);
  const image: ImageUploaderValue | null = form.imageUrl
    ? { url: form.imageUrl, alt: form.imageAlt ?? "" }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-foreground/50 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-lg font-semibold">
            {initial.name ? "Editar categoria" : "Nova categoria"}
          </h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 space-y-4 overflow-auto p-5">
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Imagem ou ícone da categoria
            </p>
            <ImageUploader
              value={image}
              onChange={(v) =>
                setForm({ ...form, imageUrl: v?.url ?? "", imageAlt: v?.alt ?? "" })
              }
              guidance="A imagem aparece nos chips e na home como destaque visual."
            />
          </section>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Nome</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Descrição curta (opcional)</span>
            <input
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Ícone / emoji</span>
              <input
                value={form.icon ?? ""}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🍺"
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Ordem</span>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                className="input"
              />
            </label>
          </div>
          <label className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
            <span className="text-sm font-medium">Ativa?</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`relative h-6 w-11 rounded-full ${form.isActive ? "bg-primary" : "bg-border"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${form.isActive ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </label>
        </div>
        <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.name}
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
