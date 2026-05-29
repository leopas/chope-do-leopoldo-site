import type { Product } from "@/lib/types";
import { useChopeStore, formatPrice } from "@/lib/store/chope-store";
import { buildWhatsAppLink, productInquiryMessage } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { ImagePlaceholder } from "@/components/media/ImagePlaceholder";
import { MessageCircle } from "lucide-react";

const badgeColor: Record<NonNullable<Product["badge"]>, string> = {
  Destaque: "bg-primary text-primary-foreground",
  Novo: "bg-secondary text-secondary-foreground",
  "Mais pedido": "bg-accent text-accent-foreground",
};

export function ProductCard({ product }: { product: Product }) {
  const settings = useChopeStore((s) => s.settings);
  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    productInquiryMessage(product, settings.businessName),
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt || product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${badgeColor[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          {product.isAlcoholic && (
            <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground/80">
              +18 · beba com moderação
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-xl font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track("ClickWhatsApp", { source: "product_card", productId: product.id })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-95"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Quero este
          </a>
        </div>
      </div>
    </article>
  );
}
