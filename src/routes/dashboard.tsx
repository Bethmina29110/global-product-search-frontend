import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { products, categories, brands, sources } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const [q, setQ] = useState("ergonomic chair for long coding sessions");
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState("All");
  const [price, setPrice] = useState(2000);
  const [minScore, setMinScore] = useState(0.7);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [selSources, setSelSources] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1100);
  };

  const filtered = useMemo(() => {
    return products
      .filter((p) => (cat === "All" ? true : p.category === cat))
      .filter((p) => p.price <= price)
      .filter((p) => p.similarity_score >= minScore)
      .filter((p) => (selBrands.length ? selBrands.includes(p.brand) : true))
      .filter((p) => (selSources.length ? selSources.includes(p.source) : true))
      .sort((a, b) => b.similarity_score - a.similarity_score);
  }, [cat, price, minScore, selBrands, selSources]);

  return (
    <DashboardLayout title="Semantic Search">
      <section className="rounded-3xl border border-border bg-card-gradient p-6 lg:p-8 shadow-card-ai">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-ai-purple" />
          Express intent in natural language — the model embeds and ranks across {products.length * 84} indexed products.
        </div>
        <div className="mt-5"><SearchBar value={q} onChange={setQ} onSubmit={onSubmit} loading={loading} size="lg" /></div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                cat === c ? "bg-ai-gradient text-white border-transparent shadow-ai" : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
          <button onClick={() => setShowFilters((v) => !v)} className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" /> {showFilters ? "Hide" : "Show"} filters
          </button>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {showFilters && (
          <motion.aside initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5 rounded-2xl border border-border bg-card-gradient p-5 h-fit lg:sticky lg:top-20">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-ai-purple" /> Advanced filters
            </div>

            <div>
              <Label>Max price <span className="text-ai-gradient font-semibold">${price}</span></Label>
              <input type="range" min={50} max={2000} step={10} value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full accent-[var(--ai-purple)]" />
            </div>

            <div>
              <Label>Semantic match score <span className="text-ai-gradient font-semibold">{Math.round(minScore * 100)}%+</span></Label>
              <input type="range" min={0.5} max={0.99} step={0.01} value={minScore} onChange={(e) => setMinScore(+e.target.value)} className="w-full accent-[var(--ai-purple)]" />
            </div>

            <ChipGroup label="Brand" options={brands.slice(0, 8)} selected={selBrands} onToggle={(v) => setSelBrands((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])} />
            <ChipGroup label="Vendor source" options={sources.slice(0, 8)} selected={selSources} onToggle={(v) => setSelSources((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])} />

            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {["Obsidian","Oak","Midnight","Silver","Stone","Black","Sand"].map((c) => (
                  <span key={c} className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted-foreground">{c}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setCat("All"); setPrice(2000); setMinScore(0.7); setSelBrands([]); setSelSources([]); }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs hover:bg-surface-elevated"
            >
              <X className="h-3.5 w-3.5" /> Clear all
            </button>
          </motion.aside>
        )}

        <div>
          <div className="mb-4 flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> semantic matches for{" "}
              <span className="text-ai-gradient font-medium">"{q}"</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-ai-electric animate-pulse" /> Ranked by cosine similarity
            </div>
          </div>

          {loading ? (
            <LoadingAnimation />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} rank={i} />)}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">{children}</div>;
}

function ChipGroup({ label, options, selected, onToggle }: { label: string; options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              onClick={() => onToggle(o)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                on ? "bg-ai-gradient text-white border-transparent" : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-border bg-card-gradient p-12 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ai-gradient/15 ring-1 ring-ai-indigo/30">
        <Sparkles className="h-7 w-7 text-ai-purple" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold">No semantic matches</h3>
      <p className="mt-2 text-sm text-muted-foreground">Try relaxing your filters or rephrasing the query with more contextual intent.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {["minimalist desk under $600","wireless mechanical keyboard","ergonomic chair with lumbar support"].map((s) => (
          <span key={s} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs">{s}</span>
        ))}
      </div>
    </div>
  );
}
