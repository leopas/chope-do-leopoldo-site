import { useState } from "react";
import { Search, Eye, Trash2, X, UploadCloud } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useChopeStore } from "@/lib/store/chope-store";
import type { MediaAsset, MediaAssetType } from "@/lib/types";
import { cn } from "@/lib/utils";


const FILTERS: (MediaAssetType | "all")[] = [
  "all",
  "product",
  "category",
  "campaign",
  "home",
  "landing",
];

const labelFor = (k: MediaAssetType | "all") =>
  ({
    all: "Todas",
    product: "Produtos",
    category: "Categorias",
    campaign: "Campanhas",
    home: "Home",
    landing: "Landing Pages",
  })[k];

export default function AdminMedia() {
  const { media, addMedia, removeMedia } = useChopeStore();
  const [filter, setFilter] = useState<MediaAssetType | "all">("all");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<MediaAsset | null>(null);

  const filtered = media.filter((m) => {
    if (filter !== "all" && m.type !== filter) return false;
    if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const onUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    addMedia({
      id: `m-${Date.now()}`,
      name: file.name,
      url,
      alt: file.name.replace(/\.[^.]+$/, ""),
      type: filter === "all" ? "product" : filter,
      uploadedAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <AdminLayout
      title="Imagens"
      actions={
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)]">
          <UploadCloud className="h-4 w-4" /> Enviar imagem
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          />
        </label>
      }
    >
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome do arquivo"
            className="w-full rounded-full border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold",
                filter === k
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {labelFor(k)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Nenhuma imagem cadastrada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-square bg-muted">
                <img src={a.url} alt={a.alt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-end justify-end gap-1 bg-gradient-to-t from-foreground/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => setPreview(a)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white text-foreground"
                    aria-label="Ver"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeMedia(a.id)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white text-destructive"
                    aria-label="Remover"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium">{a.name}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {labelFor(a.type)} · {a.uploadedAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/70 p-4">
          <div className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl bg-background">
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-foreground shadow"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={preview.url} alt={preview.alt} className="max-h-[80vh] w-full object-contain" />
            <div className="border-t border-border p-3 text-xs">
              <p className="font-semibold">{preview.name}</p>
              <p className="text-muted-foreground">
                {labelFor(preview.type)} · {preview.uploadedAt}
              </p>
              <button className="mt-2 text-xs font-semibold text-primary hover:underline">
                Ajustar enquadramento (em breve)
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
