import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Filter, SlidersHorizontal, Sparkles, X, Brain, Check, MessageSquareCode, Award, ArrowUpRight } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { RagProductCard } from "@/components/RagProductCard";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { products, categories, brands, sources } from "@/lib/mockData";
import { ragApi } from "@/lib/api/rag";
import { RagSearchData } from "@/lib/api/types";
import { toast } from "sonner";

export const Route = createFileRoute("/search")({ component: SearchPage });

function SearchPage() {
  const [q, setQ] = useState("");
  const [searchMode, setSearchMode] = useState<"semantic" | "rag">("rag");
  const [loading, setLoading] = useState(false);
  const [ragData, setRagData] = useState<RagSearchData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [cat, setCat] = useState("All");
  const [price, setPrice] = useState(2000);
  const [minScore, setMinScore] = useState(0.7);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [selSources, setSelSources] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Trigger search on initial load only if query exists
  useEffect(() => {
    if (q) {
      onSubmit();
    }
  }, []);

  const onSubmit = async () => {
    if (!q.trim()) {
      toast.error("Please enter a search query.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    if (searchMode === "rag") {
      try {
        const response = await ragApi.search(q, 1);
        if (response && response.success) {
          setRagData(response.data);
          toast.success("AI search complete!");
        } else {
          setError("Failed to fetch search results from server.");
          toast.error("Failed to load search results.");
        }
      } catch (err: any) {
        console.error("RAG search failed:", err);
        const errMsg = err.response?.data?.message || "Something went wrong. Please make sure the backend server is running.";
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    } else {
      // Local semantic mock search
      setTimeout(() => {
        setLoading(false);
        toast.success("Vector matching complete!");
      }, 600);
    }
  };

  const filteredLocalProducts = useMemo(() => {
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
            Express intent in natural language — RAG retrieves and synthesizes choices in real-time.
          </div>
          
          {/* Search Mode Toggles */}
          <div className="flex items-center rounded-xl bg-surface p-1 border border-border">
            <button
              onClick={() => {
                setSearchMode("semantic");
                setRagData(null);
              }}
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
              onClick={() => {
                setSearchMode("rag");
              }}
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
          <aside
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
          </aside>
        )}

        <div className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* AI RAG Synthesis Highlights */}
          {searchMode === "rag" && ragData && !loading && (
            <div className="space-y-6">
              {/* Premium Top Recommendation Banner */}
              {ragData.topRecommendation && (
                <div className="relative overflow-hidden rounded-3xl border border-ai-electric/30 bg-surface/20 p-6 shadow-glow backdrop-blur-md">
                  {/* Decorative background gradients */}
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-ai-electric/25 blur-3xl" />
                  <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-ai-purple/20 blur-3xl" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-ai-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        <Award className="h-3.5 w-3.5" /> Top Organic Choice
                      </div>
                      <h3 className="font-display text-xl lg:text-2xl font-black text-foreground">
                        {ragData.topRecommendation.title}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xl font-light">
                        {ragData.topRecommendation.reason}
                      </p>
                    </div>
                    
                    {/* Score display badge */}
                    <div className="flex items-center gap-3 shrink-0 rounded-2xl bg-surface border border-border p-4">
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">AI Match Score</div>
                        <div className="text-2xl font-extrabold text-ai-gradient mt-0.5">
                          {ragData.topRecommendation.score}/10
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Summary Bar */}
          <div>
            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                {searchMode === "rag" && ragData ? (
                  <>
                    <span className="font-semibold text-foreground">
                      {ragData.products.length}
                    </span>{" "}
                    AI-synthesized matches for{" "}
                    <span className="text-ai-gradient font-medium">"{ragData.query}"</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-foreground">
                      {filteredLocalProducts.length}
                    </span>{" "}
                    local matches for{" "}
                    <span className="text-ai-gradient font-medium">"{q}"</span>
                  </>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-ai-electric animate-pulse" /> Vectorized & Ranked
              </div>
            </div>

            {loading ? (
              <LoadingAnimation />
            ) : searchMode === "rag" ? (
              !ragData || ragData.products.length === 0 ? (
                <EmptyState onSelectSuggestion={(s) => { setQ(s); onSubmit(); }} />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {ragData.products.map((p, i) => (
                    <RagProductCard key={i} product={p} rank={i} />
                  ))}
                </div>
              )
            ) : filteredLocalProducts.length === 0 ? (
              <EmptyState onSelectSuggestion={(s) => { setQ(s); onSubmit(); }} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredLocalProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} rank={i} />
                ))}
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
        {["black t shirts","wireless mechanical keyboard","ergonomic chair with lumbar support"].map((s) => (
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
