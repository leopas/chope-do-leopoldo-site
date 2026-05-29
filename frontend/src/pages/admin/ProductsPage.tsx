import { useState } from "react";
import { Plus, Copy, Power, Pencil, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ImageUploader, type ImageUploaderValue } from "@/components/media/ImageUploader";
import { useChopeStore, formatPrice } from "@/lib/store/chope-store";
import type { Product } from "@/lib/types";


const empty: Product = {
  id: "",
  name: "",
  description: "",
  price: 0,
  categoryId: "",
  imageUrl: "",
  imageAlt: "",
  isAlcoholic: false,
  isFeatured: false,
  isActive: true,
  displayOrder: 99,
};

export default function AdminProducts() {
  const { products, categories, upsertProduct, toggleProductActive, duplicateProduct } =
    useChopeStore();
  const [editing, setEditing] = useState<Product | null>(null);

  return (
    <AdminLayout
      title="Produtos"
      actions={
        <button
          onClick={() => setEditing({ ...empty, id: `p-${Date.now()}` })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)]"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </button>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3">Produto</th>
              <th className="hidden px-3 py-3 md:table-cell">Categoria</th>
              <th className="px-3 py-3">Preço</th>
              <th className="hidden px-3 py-3 md:table-cell">Status</th>
              <th className="px-3 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => {
              const cat = categories.find((c) => c.id === p.categoryId);
              return (
                <tr key={p.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.imageAlt}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        {p.isFeatured && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 text-muted-foreground md:table-cell">
                    {cat?.name ?? "—"}
                  </td>
                  <td className="px-3 py-3">{formatPrice(p.price)}</td>
                  <td className="hidden px-3 py-3 md:table-cell">
                    <StatusBadge tone={p.isActive ? "success" : "muted"}>
                      {p.isActive ? "Ativo" : "Inativo"}
                    </StatusBadge>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => setEditing(p)}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                        aria-label="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateProduct(p.id)}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                        aria-label="Duplicar"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toggleProductActive(p.id)}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                        aria-label="Ativar/Desativar"
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductDrawer
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            upsertProduct(p);
            setEditing(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

function ProductDrawer({
  initial,
  onClose,
  onSave,
}: {
  initial: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const categories = useChopeStore((s) => s.categories);
  const [form, setForm] = useState<Product>(initial);
  const image: ImageUploaderValue | null = form.imageUrl
    ? { url: form.imageUrl, alt: form.imageAlt }
    : null;

  const hasImage = Boolean(form.imageUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-foreground/50 backdrop-blur-sm">
      <div className="flex w-full max-w-xl flex-col overflow-hidden bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-lg font-semibold">
            {initial.name ? "Editar produto" : "Novo produto"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-auto p-5">
          <section className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Imagem do Produto
            </p>
            <ImageUploader
              value={image}
              onChange={(v) =>
                setForm({ ...form, imageUrl: v?.url ?? "", imageAlt: v?.alt ?? "" })
              }
            />
            {!hasImage && (
              <p className="mt-3 rounded-md bg-primary/10 px-3 py-2 text-xs text-foreground">
                Produto sem imagem. Ele será exibido com uma imagem padrão no cardápio.
              </p>
            )}
          </section>

          <div className="grid gap-4">
            <Field label="Nome do produto">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Categoria">
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="input"
              >
                <option value="">Selecione</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Descrição curta">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Preço (R$)">
                <input
                  type="number"
                  step="0.10"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="input"
                />
              </Field>
              <Field label="Ordem de exibição">
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm({ ...form, displayOrder: Number(e.target.value) })
                  }
                  className="input"
                />
              </Field>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border bg-muted/30 p-4">
              <Toggle
                label="Produto alcoólico?"
                value={form.isAlcoholic}
                onChange={(v) => setForm({ ...form, isAlcoholic: v })}
              />
              <Toggle
                label="Destacar no cardápio?"
                value={form.isFeatured}
                onChange={(v) => setForm({ ...form, isFeatured: v })}
              />
              <Toggle
                label="Ativo?"
                value={form.isActive}
                onChange={(v) => setForm({ ...form, isActive: v })}
              />
            </div>
          </div>
        </div>
        <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.name || !form.categoryId}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)] disabled:opacity-50"
          >
            Salvar
          </button>
        </footer>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--input);background:var(--background);padding:.55rem .75rem;border-radius:.6rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 20%,transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition ${value ? "bg-primary" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${value ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </label>
  );
}
