import { cn } from "@/lib/utils";

type Tone = "success" | "neutral" | "warning" | "muted";

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const toneClass: Record<Tone, string> = {
    success: "bg-secondary/15 text-secondary border-secondary/30",
    neutral: "bg-primary/15 text-primary border-primary/30",
    warning: "bg-accent/15 text-accent border-accent/30",
    muted: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        toneClass[tone],
      )}
    >
      {children}
    </span>
  );
}
