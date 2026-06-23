import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Filter, SlidersHorizontal, Sparkles, X, Brain, Check, MessageSquareCode, Award, ChevronLeft, ChevronRight, Star, Layers, ShoppingBag, Search } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { SearchBar } from "@/components/SearchBar";
import { NormalProductCard } from "@/components/NormalProductCard";
import { RagProductCard } from "@/components/RagProductCard";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { NormalLoadingAnimation } from "@/components/NormalLoadingAnimation";
import { searchApi } from "@/lib/api/search";
import { ragApi } from "@/lib/api/rag";
import { RagSearchData, RagProduct, SearchProduct } from "@/lib/api/types";
import { toast } from "sonner";
import axios from "axios";

export const Route = createFileRoute("/search")({ component: SearchPage });

function SearchPage() {
  const [q, setQ] = useState("");
  const [searchMode, setSearchMode] = useState<"normal" | "rag">("rag");
  const [loading, setLoading] = useState(false);
  const [ragData, setRagData] = useState<RagSearchData | null>(null);
  const [normalResults, setNormalResults] = useState<SearchProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<RagProduct | SearchProduct | null>(null);
  
  // Abort Controller State
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleCancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      toast.info("Search request stopped.");
    }
  };

  const onSubmit = async (queryText?: string) => {
    const searchQuery = queryText !== undefined ? queryText : q;
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query.");
      return;
    }
    
    // Abort previous running request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setLoading(true);
    setError(null);
    
    if (searchMode === "rag") {
      try {
        const response = await ragApi.search(searchQuery, controller.signal);
        if (response && response.success) {
          setRagData(response.data);
          setNormalResults([]);
          toast.success(`Loaded RAG results!`);
        } else {
          setError("Failed to fetch search results from server.");
          toast.error("Failed to load search results.");
        }
      } catch (err: any) {
        if (axios.isCancel(err) || err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          console.log("RAG search query aborted by user.");
          return;
        }
        console.error("RAG search failed:", err);
        const errMsg = err.response?.data?.message || "Something went wrong. Please check your backend connection.";
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        if (abortControllerRef.current === controller) {
          setLoading(false);
          abortControllerRef.current = null;
        }
      }
    } else {
      // Normal search
      try {
        const response = await searchApi.search(searchQuery, controller.signal);
        if (response && response.success) {
          setNormalResults(response.data.results);
          setRagData(null);
          toast.success("Normal search complete!");
        } else {
          setError("Failed to fetch search results from server.");
          toast.error("Failed to load search results.");
        }
      } catch (err: any) {
        if (axios.isCancel(err) || err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          console.log("Normal search query aborted by user.");
          return;
        }
        console.error("Normal search failed:", err);
        const errMsg = err.response?.data?.message || "Something went wrong. Please check your backend connection.";
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        if (abortControllerRef.current === controller) {
          setLoading(false);
          abortControllerRef.current = null;
        }
      }
    }
  };

  // Type guard to distinguish RAG product from normal search product
  const isRagProduct = (p: RagProduct | SearchProduct): p is RagProduct => {
    return (p as RagProduct).confidence !== undefined;
  };

  return (
    <DashboardLayout title="Product Search Portal">
      {/* Search Header */}
      <section className="rounded-3xl border border-border bg-card-gradient p-6 lg:p-8 shadow-card-ai transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-ai-purple animate-pulse" />
            Search products instantly using normal queries or RAG-based AI synthesis.
          </div>
          
          {/* Search Mode Toggles */}
          <div className="flex items-center rounded-xl bg-surface p-1 border border-border">
            <button
              onClick={() => {
                setSearchMode("normal");
                setRagData(null);
                setNormalResults([]);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                searchMode === "normal"
                  ? "bg-surface-elevated text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              Normal Search
            </button>
            <button
              onClick={() => {
                setSearchMode("rag");
                setRagData(null);
                setNormalResults([]);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer ${
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
          <SearchBar
            value={q}
            onChange={setQ}
            onSubmit={(queryVal) => onSubmit(queryVal)}
            onCancel={handleCancelSearch}
            loading={loading}
            size="lg"
          />
        </div>
      </section>

      {/* Main Grid */}
      <div className={`mt-8 grid gap-6 ${showFilters ? "lg:grid-cols-[280px_1fr]" : "grid-cols-1"}`}>
        {showFilters && (
          <aside
            className="space-y-5 rounded-2xl border border-border bg-card-gradient p-5 h-fit lg:sticky lg:top-20 shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-ai-purple" /> Dynamic Metrics
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              No static filters active. Queries are run dynamically against the global product repository.
            </div>
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
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-ai-electric/25 blur-3xl" />
                  <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-ai-purple/20 blur-3xl" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-ai-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        <Award className="h-3.5 w-3.5" /> Top Recommendation Choice
                      </div>
                      <h3 className="font-display text-xl lg:text-2xl font-black text-foreground">
                        {ragData.topRecommendation.title}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xl font-light leading-relaxed">
                        {ragData.topRecommendation.reason}
                      </p>
                    </div>
                    
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
                ) : normalResults.length > 0 ? (
                  <>
                    <span className="font-semibold text-foreground">
                      {normalResults.length}
                    </span>{" "}
                    results for{" "}
                    <span className="text-ai-gradient font-medium">"{q}"</span>
                  </>
                ) : (
                  <>
                    No search results loaded.
                  </>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-ai-electric animate-pulse" /> Live Repository Search
              </div>
            </div>

            {loading ? (
              searchMode === "rag" ? <LoadingAnimation /> : <NormalLoadingAnimation />
            ) : searchMode === "rag" ? (
              !ragData || ragData.products.length === 0 ? (
                <EmptyState onSelectSuggestion={(s) => { setQ(s); onSubmit(s); }} />
              ) : (
                <div className="space-y-8">
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {ragData.products.map((p, i) => (
                      <RagProductCard key={i} product={p} rank={i} onClick={() => setSelectedProduct(p)} />
                    ))}
                  </div>
                </div>
              )
            ) : normalResults.length === 0 ? (
              <EmptyState onSelectSuggestion={(s) => { setQ(s); onSubmit(s); }} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {normalResults.map((p, i) => (
                  <NormalProductCard key={i} product={p} onClick={() => setSelectedProduct(p)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card-gradient shadow-2xl p-6 lg:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full glass hover:bg-white/10 transition cursor-pointer"
              aria-label="close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Product Visual */}
              <div className="aspect-[4/3] w-full md:w-48 shrink-0 rounded-2xl bg-surface border border-border overflow-hidden flex items-center justify-center p-2">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400";
                  }}
                />
              </div>

              {/* Title & Price */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-ai-electric/15 border border-ai-electric/25 px-2.5 py-0.5 text-[10px] font-semibold text-ai-electric">
                    {selectedProduct.store}
                  </span>
                  {isRagProduct(selectedProduct) && (
                    <span className="rounded-full bg-white/5 border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {selectedProduct.category || "General"}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-xl lg:text-2xl font-bold leading-snug text-foreground">
                  {selectedProduct.title}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-ai-gradient">{selectedProduct.price}</span>
                  {selectedProduct.rating !== null && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-ai-electric text-ai-electric" />
                      <span className="font-bold text-foreground">{selectedProduct.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Research Details (RAG only) */}
            {isRagProduct(selectedProduct) && (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-ai-purple animate-pulse" /> AI Synthesis Summary
                </h3>
                <p className="text-sm leading-relaxed text-foreground/90 font-light bg-surface/30 border border-border/30 rounded-2xl p-4">
                  {selectedProduct.summary}
                </p>
              </div>
            )}

            {/* Specifications Details (RAG only) */}
            {isRagProduct(selectedProduct) && (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-ai-electric" /> Product Specifications
                </h3>
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-xs p-2.5 rounded-xl border border-border/30 bg-surface/20">
                        <span className="text-muted-foreground capitalize">{key}</span>
                        <span className="font-semibold text-foreground/90">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic pl-1">
                    No detailed specifications listed for this product.
                  </p>
                )}
              </div>
            )}

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/40">
              <a
                href={selectedProduct.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-3 text-sm font-semibold text-white shadow-ai hover:opacity-95 transition cursor-pointer"
              >
                View on store page <ShoppingBag className="h-4 w-4" />
              </a>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold hover:bg-surface-elevated transition cursor-pointer"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">{children}</div>;
}

function EmptyState({ onSelectSuggestion }: { onSelectSuggestion: (s: string) => void }) {
  return (
    <div className="rounded-3xl border border-border bg-card-gradient p-12 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ai-gradient/15 ring-1 ring-ai-indigo/30">
        <Sparkles className="h-7 w-7 text-ai-purple" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold">No matches</h3>
      <p className="mt-2 text-sm text-muted-foreground">Type a keyword or item description in the search bar above to begin.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {["gaming laptop","black t shirts","wireless mechanical keyboard"].map((s) => (
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
