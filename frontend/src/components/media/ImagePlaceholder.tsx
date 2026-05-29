import { Beer } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  className,
  label = "Sem imagem",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center bg-muted text-muted-foreground",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <Beer className="h-8 w-8 opacity-50" />
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          {label}
        </span>
      </div>
    </div>
  );
}
