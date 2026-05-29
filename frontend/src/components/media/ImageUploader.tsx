import { useCallback, useRef, useState } from "react";
import { ImagePlus, UploadCloud, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "./ImagePlaceholder";

export type ImageUploaderValue = {
  url: string;
  alt: string;
  fileName?: string;
  sizeKb?: number;
};

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_KB = 4000;

export function ImageUploader({
  value,
  onChange,
  guidance = "Use uma foto quadrada, bem iluminada, mostrando o produto com clareza.",
  recommendedLabel = "Recomendado: 1200 × 1200 px · JPG, PNG ou WebP",
  altLabel = "Texto alternativo da imagem",
  altPlaceholder = "Ex.: Caneco de chope gelado sobre mesa de madeira",
  className,
}: {
  value: ImageUploaderValue | null;
  onChange: (v: ImageUploaderValue | null) => void;
  guidance?: string;
  recommendedLabel?: string;
  altLabel?: string;
  altPlaceholder?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      setWarning(null);
      if (!ACCEPTED.includes(file.type)) {
        setError("Formato não suportado. Use JPG, PNG ou WebP.");
        return;
      }
      const sizeKb = Math.round(file.size / 1024);
      if (sizeKb > MAX_KB) {
        setWarning("Imagem pesada (acima de 4 MB). Considere otimizar.");
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        if (img.width < 600 || img.height < 600) {
          setWarning("Imagem pequena. Recomendamos pelo menos 1200×1200 px.");
        }
      };
      img.src = url;
      onChange({
        url,
        alt: value?.alt ?? "",
        fileName: file.name,
        sizeKb,
      });
    },
    [onChange, value?.alt],
  );

  return (
    <div className={cn("space-y-3", className)}>
      {value?.url ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative aspect-square bg-muted">
            <img
              src={value.url}
              alt={value.alt || "Pré-visualização"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground">
            <span className="truncate">
              {value.fileName ?? "Imagem selecionada"}
              {value.sizeKb ? ` · ${value.sizeKb} KB` : ""}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Trocar
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remover
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={cn(
            "relative overflow-hidden rounded-2xl border-2 border-dashed bg-card transition",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/60",
          )}
        >
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <ImagePlaceholder className="h-20 w-20 rounded-xl" label="" />
            <div>
              <p className="font-medium text-foreground">
                Arraste uma imagem ou clique para selecionar
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{recommendedLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)]"
            >
              <UploadCloud className="h-4 w-4" /> Selecionar imagem
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <ImagePlus className="mt-0.5 h-3.5 w-3.5" /> {guidance}
      </p>

      {warning && (
        <p className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-2 text-xs text-foreground">
          <AlertCircle className="h-3.5 w-3.5 text-primary" /> {warning}
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">{altLabel}</label>
        <input
          type="text"
          value={value?.alt ?? ""}
          onChange={(e) =>
            onChange(
              value
                ? { ...value, alt: e.target.value }
                : { url: "", alt: e.target.value },
            )
          }
          placeholder={altPlaceholder}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}
