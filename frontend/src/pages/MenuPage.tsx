import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CategoryTabs } from "@/components/public/CategoryTabs";
import { ProductCard } from "@/components/public/ProductCard";
import { ResponsibleDrinkingNotice } from "@/components/public/ResponsibleDrinkingNotice";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { useChopeStore } from "@/lib/store/chope-store";
import { track } from "@/lib/analytics";


export default function MenuPage() {
  const products = useChopeStore((s) => s.products.filter((p) => p.isActive));
  const categories = useChopeStore((s) =>
    s.categories.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    track("ViewMenu");
  }, []);

  const filtered = useMemo(() => {
    return products
      .filter((p) => (activeId ? p.categoryId === activeId : true))
      .filter((p) =>
        query
          ? `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())
          : true,
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [products, activeId, query]);

  return (
    <>
      <PublicHeader />
      <main className="pb-32">
        <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Cardápio
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
            O que tá rolando hoje
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Escolha sua categoria, peça pelo WhatsApp e a gente já separa pra você.
          </p>

          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar no cardápio"
              className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm shadow-[var(--shadow-card)] outline-none focus:border-primary"
            />
          </div>
        </section>

        <CategoryTabs
          categories={categories}
          activeId={activeId}
          onChange={setActiveId}
        />

        <section className="mx-auto max-w-6xl px-4 pt-6">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              Nenhum item encontrado. Tenta outra busca?
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <div className="mt-10">
            <ResponsibleDrinkingNotice />
          </div>
        </section>
      </main>
      <WhatsAppFloatingButton />
      <PublicFooter />
    </>
  );
}
