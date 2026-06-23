import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SlidersHorizontal, Sparkles, X, Brain, Check, MessageSquareCode } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { products, categories, brands, sources } from "@/lib/mockData";

export const Route = createFileRoute("/search")({ component: SearchPage });

const MOCK_RAG_ANSWERS: Record<string, { answer: string; highlights: string[] }> = {
  "ergonomic chair for long coding sessions": {
    answer: "Based on our indexed catalog and semantic search matching, the **Ergohuman Gen 2** is the premier choice for developers sitting 8+ hours. Its auto-tuning lumbar system dynamically responds to back movement, which helps prevent posture fatigue. Alternatively, the **Steelcase Gesture** features extremely adjustable 360-degree armrests, perfect for code-writing angles. For hot environments, the mesh on the **Herman Miller Aeron** remains unmatched.",
    highlights: ["Lumbar Support", "360 Armrests", "Mesh Material"]
  },
  "minimalist desk under $600": {
    answer: "For a budget of $600, the **Fully Jarvis Bamboo Standing Desk** is highly rated for its quiet dual-motor system and sustainable wood finish. If you prioritize easy assembly and built-in cable management channels, the **Branch Standing Desk** is a strong runner-up, keeping wires completely hidden to preserve a clean minimalist aesthetic.",
    highlights: ["Quiet Motors", "Cable Management", "Sustainable Finish"]
  }
};

function SearchPage() {
  const [q, setQ] = useState("ergonomic chair for long coding sessions");
  const [searchMode, setSearchMode] = useState<"semantic" | "rag">("rag");
  const [loading, setLoading] = useState(false);
  const [ragResult, setRagResult] = useState<{ answer: string; highlights: string[] } | null>(MOCK_RAG_ANSWERS["ergonomic chair for long coding sessions"]);
  
  const [cat, setCat] = useState("All");
  const [price, setPrice] = useState(2000);
  const [minScore, setMinScore] = useState(0.7);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [selSources, setSelSources] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const onSubmit = () => {
    setLoading(true);
    setRagResult(null);
    
    setTimeout(() => {
      setLoading(false);
      if (searchMode === "rag") {
        const queryLower = q.toLowerCase();
        let matchedKey = Object.keys(MOCK_RAG_ANSWERS).find(key => queryLower.includes(key) || key.includes(queryLower));
        if (matchedKey) {
          setRagResult(MOCK_RAG_ANSWERS[matchedKey]);
        } else {
          setRagResult({
            answer: `Here is an AI synthesis of products matching your query **"${q}"**. We found top matches from **${selSources.length ? selSources.join(', ') : 'all sources'}**. Most products feature premium quality and fit your specification. Look at the filtered list below for pricing and rating comparisons.`,
            highlights: ["General Recommendation", "Matching Specs"]
          });
        }
      }
    }, 1200);
  };

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (!q) return true;
        const queryLower = q.toLowerCase();
        return (
          p.name.toLowerCase().includes(queryLower) ||
          p.description.toLowerCase().includes(queryLower) ||
          p.brand.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower)
        );
      })
      .filter((p) => (cat === "All" ? true : p.category === cat))
      .filter((p) => p.price <= price)
      .filter((p) => p.similarity_score >= minScore)
      .filter((p) => (selBrands.length ? selBrands.includes(p.brand) : true))
      .filter((p) => (selSources.length ? selSources.includes(p.source) : true))
      .sort((a, b) => b.similarity_score - a.similarity_score);
  }, [q, cat, price, minScore, selBrands, selSources]);

  return (
    <DashboardLayout title="Semantic Search Portal">
      {/* Search Header */}
      <section className="rounded-3xl border border-border bg-card-gradient p-6 lg:p-8 shadow-card-ai transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-ai-purple animate-pulse" />
            Express intent in natural language — the system embeds and ranks across {products.length * 84} products.
          </div>
          
          {/* Search Mode Toggles */}
          <div className="flex items-center rounded-xl bg-surface p-1 border border-border">
            <button
              onClick={() => setSearchMode("semantic")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                searchMode === "semantic"
                  ? "bg-surface-elevated text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Brain className="h-3.5 w-3.5" />
              Vector Match
            </button>
            <button
              onClick={() => setSearchMode("rag")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                searchMode === "rag"
                  ? "bg-ai-gradient text-white shadow-ai"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              RAG AI Search
            </button>
          </div>
        </div>

        <div className="mt-5">
          <SearchBar value={q} onChange={setQ} onSubmit={onSubmit} loading={loading} size="lg" />
        </div>

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
          <button onClick={() => setShowFilters((v) => !v)} className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs hover:bg-surface-elevated transition">
            <SlidersHorizontal className="h-3.5 w-3.5" /> {showFilters ? "Hide" : "Show"} Filters
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {showFilters && (
          <motion.aside
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5 rounded-2xl border border-border bg-card-gradient p-5 h-fit lg:sticky lg:top-20 shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-ai-purple" /> Advanced Filters
            </div>

            <div>
              <Label>Max price <span className="text-ai-gradient font-semibold">${price}</span></Label>
              <input type="range" min={50} max={2000} step={10} value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full accent-[var(--ai-purple)] cursor-pointer" />
            </div>

            <div>
              <Label>Semantic match score <span className="text-ai-gradient font-semibold">{Math.round(minScore * 100)}%+</span></Label>
              <input type="range" min={0.5} max={0.99} step={0.01} value={minScore} onChange={(e) => setMinScore(+e.target.value)} className="w-full accent-[var(--ai-purple)] cursor-pointer" />
            </div>

            <ChipGroup label="Brand" options={brands.slice(0, 8)} selected={selBrands} onToggle={(v) => setSelBrands((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])} />
            <ChipGroup label="Vendor source" options={sources.slice(0, 8)} selected={selSources} onToggle={(v) => setSelSources((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])} />

            <div>
              <Label>Color Filter</Label>
              <div className="flex flex-wrap gap-2">
                {["Obsidian","Oak","Midnight","Silver","Stone","Black","Sand"].map((c) => (
                  <span key={c} className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted-foreground select-none hover:bg-surface-elevated cursor-pointer transition">{c}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setCat("All"); setPrice(2000); setMinScore(0.7); setSelBrands([]); setSelSources([]); }}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs hover:bg-surface-elevated transition"
            >
              <X className="h-3.5 w-3.5" /> Clear All Filters
            </button>
          </motion.aside>
        )}

        <div className="space-y-6">
          {/* AI RAG Answer Section */}
          <AnimatePresence mode="wait">
            {searchMode === "rag" && ragResult && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="ai-border-glow rounded-2xl border border-ai-indigo/30 bg-ai-gradient/5 p-5 shadow-card-ai relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Brain className="h-24 w-24 text-ai-purple" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ai-gradient text-white shadow-glow">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="font-display font-bold text-sm tracking-wide text-foreground">AI Research Synthesis (RAG)</span>
                  <span className="rounded-full bg-ai-electric/25 px-2 py-0.5 text-[9px] uppercase tracking-wider text-ai-electric font-semibold">Live Analysis</span>
                </div>
                
                <p className="text-sm leading-relaxed text-foreground/90 font-light max-w-3xl">
                  {ragResult.answer}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MessageSquareCode className="h-3.5 w-3.5 text-ai-purple" /> Key criteria analyzed:
                  </span>
                  {ragResult.highlights.map(h => (
                    <span key={h} className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-[11px] text-foreground font-medium border border-border">
                      <Check className="h-3 w-3 text-ai-electric" /> {h}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Summary Bar */}
          <div>
            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> matches found for{" "}
                <span className="text-ai-gradient font-medium">"{q}"</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-ai-electric animate-pulse" /> Vectorized & Ranked
              </div>
            </div>

            {loading ? (
              <LoadingAnimation />
            ) : filtered.length === 0 ? (
              <EmptyState onSelectSuggestion={(s) => { setQ(s); onSubmit(); }} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} rank={i} />)}
              </div>
            )}
          </div>
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

function EmptyState({ onSelectSuggestion }: { onSelectSuggestion: (s: string) => void }) {
  return (
    <div className="rounded-3xl border border-border bg-card-gradient p-12 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ai-gradient/15 ring-1 ring-ai-indigo/30">
        <Sparkles className="h-7 w-7 text-ai-purple" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold">No semantic matches</h3>
      <p className="mt-2 text-sm text-muted-foreground">Try relaxing your filters or rephrasing the query with more contextual intent.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {["minimalist desk under $600","wireless mechanical keyboard","ergonomic chair with lumbar support"].map((s) => (
          <button
            key={s}
            onClick={() => onSelectSuggestion(s)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs cursor-pointer hover:bg-surface-elevated transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
