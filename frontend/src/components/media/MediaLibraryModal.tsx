import { useState } from "react";
import { Search, X } from "lucide-react";
import type { MediaAsset, MediaAssetType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MediaLibraryModal({
  open,
  onClose,
  assets,
  onSelect,
  defaultFilter = "product",
}: {
  open: boolean;
  onClose: () => void;
  assets: MediaAsset[];
  onSelect: (a: MediaAsset) => void;
  defaultFilter?: MediaAssetType | "all";
}) {
  const [filter, setFilter] = useState<MediaAssetType | "all">(defaultFilter);
  const [q, setQ] = useState("");

  if (!open) return null;

  const filtered = assets.filter((a) => {
    if (filter !== "all" && a.type !== filter) return false;
    if (q && !a.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm md:items-center">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-background shadow-2xl md:rounded-2xl">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="font-display text-lg font-semibold">Biblioteca de imagens</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="space-y-3 border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome do arquivo"
              className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "product", "category", "campaign", "home", "landing"] as const).map(
              (k) => (
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
              ),
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nenhuma imagem encontrada.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    onSelect(a);
                    onClose();
                  }}
                  className="group overflow-hidden rounded-xl border border-border bg-card text-left transition hover:border-primary"
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={a.url}
                      alt={a.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-medium">{a.name}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {labelFor(a.type)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function labelFor(k: MediaAssetType | "all") {
  switch (k) {
    case "all":
      return "Todas";
    case "product":
      return "Produtos";
    case "category":
      return "Categorias";
    case "campaign":
      return "Campanhas";
    case "home":
      return "Home";
    case "landing":
      return "Landing pages";
  }
}
