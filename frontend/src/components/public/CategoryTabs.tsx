import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryTabs({
  categories,
  activeId,
  onChange,
}: {
  categories: Category[];
  activeId: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-border/60 bg-background/90 px-4 backdrop-blur">
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={activeId === null} onClick={() => onChange(null)}>
            Tudo
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.id}
              active={activeId === c.id}
              onClick={() => onChange(c.id)}
            >
              {c.icon && <span className="mr-1.5">{c.icon}</span>}
              {c.name}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-warm)]"
          : "border-border bg-card text-foreground/80 hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
