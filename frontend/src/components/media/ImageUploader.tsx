import { useCallback, useRef, useState } from "react";
import { ImagePlus, UploadCloud, Trash2, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { mediaApi } from "@/lib/api/admin";
import type { MediaAssetType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "./ImagePlaceholder";

export type ImageUploaderValue = {
  url: string;
  alt: string;
  fileName?: string;
  sizeKb?: number;
};

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_KB = 5120;

export function ImageUploader({
  value,
  onChange,
  assetType = "product",
  autoUpload = true,
  guidance = "Use uma foto quadrada, bem iluminada, mostrando o produto com clareza.",
  recommendedLabel = "Recomendado: 1200 × 1200 px · JPG, PNG ou WebP · até 5 MB",
  altLabel = "Texto alternativo da imagem",
  altPlaceholder = "Ex.: Caneco de chope gelado sobre mesa de madeira",
  className,
}: {
  value: ImageUploaderValue | null;
  onChange: (v: ImageUploaderValue | null) => void;
  assetType?: MediaAssetType;
  autoUpload?: boolean;
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
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setWarning(null);
      if (!ACCEPTED.includes(file.type)) {
        setError("Formato não suportado. Use JPG, PNG ou WebP.");
        return;
      }
      const sizeKb = Math.round(file.size / 1024);
      if (sizeKb > MAX_KB) {
        setError("Imagem acima de 5 MB. Reduza o arquivo antes de enviar.");
        return;
      }
      if (sizeKb > 4000) {
        setWarning("Imagem pesada (acima de 4 MB). Considere otimizar.");
      }

      const defaultAlt = value?.alt || file.name.replace(/\.[^.]+$/, "");

      if (autoUpload) {
        setUploading(true);
        try {
          const asset = await mediaApi.upload(file, { alt: defaultAlt, type: assetType });
          onChange({
            url: asset.url,
            alt: asset.alt,
            fileName: asset.name,
            sizeKb,
          });
        } catch (e) {
          setError(e instanceof Error ? e.message : "Falha ao enviar imagem");
        } finally {
          setUploading(false);
        }
        return;
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
        alt: defaultAlt,
        fileName: file.name,
        sizeKb,
      });
    },
    [assetType, autoUpload, onChange, value?.alt],
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
            {uploading && (
              <div className="absolute inset-0 grid place-items-center bg-foreground/40">
                <Loader2 className="h-8 w-8 animate-spin text-background" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground">
            <span className="truncate">
              {value.fileName ?? "Imagem selecionada"}
              {value.sizeKb ? ` · ${value.sizeKb} KB` : ""}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Trocar
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
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
            if (f) void handleFile(f);
          }}
          className={cn(
            "relative overflow-hidden rounded-2xl border-2 border-dashed bg-card transition",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/60",
          )}
        >
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-medium text-foreground">Enviando imagem…</p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
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
