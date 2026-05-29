import type { ReactNode } from "react";

export function HeroSection({
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  children,
  align = "left",
  size = "tall",
}: {
  imageUrl: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  align?: "left" | "center";
  size?: "tall" | "short";
}) {
  return (
    <section
      className={`relative isolate overflow-hidden ${size === "tall" ? "min-h-[78vh]" : "min-h-[55vh]"}`}
    >
      <img
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div
        className={`mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-12 pt-32 md:pb-20 md:pt-40 ${align === "center" ? "items-center text-center" : ""}`}
      >
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
            {eyebrow}
          </p>
        )}
        <h1
          className={`font-display text-4xl font-semibold leading-[1.05] text-white text-balance md:text-6xl ${align === "center" ? "max-w-3xl" : "max-w-2xl"}`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mt-4 text-base text-white/85 md:text-lg ${align === "center" ? "max-w-2xl" : "max-w-xl"}`}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div
            className={`mt-7 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
