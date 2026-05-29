import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "md" | "lg";
  external?: boolean;
};

const baseSize = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function PrimaryCTA({ children, href, onClick, className, size = "lg", external }: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98]",
    "bg-primary text-primary-foreground shadow-[var(--shadow-warm)] hover:brightness-95",
    baseSize[size],
    className,
  );
  if (href)
    return (
      <a
        href={href}
        onClick={onClick}
        className={cls}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function SecondaryCTA({ children, href, onClick, className, size = "lg", external }: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98]",
    "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/15",
    baseSize[size],
    className,
  );
  if (href)
    return (
      <a
        href={href}
        onClick={onClick}
        className={cls}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function GhostCTA({ children, href, onClick, className, size = "md", external }: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition",
    "border border-border bg-card text-foreground hover:bg-muted",
    baseSize[size],
    className,
  );
  if (href)
    return (
      <a
        href={href}
        onClick={onClick}
        className={cls}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
