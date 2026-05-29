import { AlertTriangle } from "lucide-react";

export function ResponsibleDrinkingNotice({ tone = "light" }: { tone?: "light" | "dark" }) {
  const base =
    tone === "dark"
      ? "text-secondary-foreground/80"
      : "text-muted-foreground";
  return (
    <p className={`flex items-start gap-2 text-xs ${base}`}>
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        Bebida alcoólica somente para maiores de 18 anos. Beba com moderação.
      </span>
    </p>
  );
}
