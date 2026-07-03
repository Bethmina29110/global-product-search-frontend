import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Loader2, ExternalLink, Star } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { NormalProductCard } from "@/components/NormalProductCard";
import type { SearchProduct, Favourite } from "@/lib/api/types";
import { useEffect, useState } from "react";
import { favoritesApi } from "@/lib/api/favorites";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/favorites")({ component: FavoritesPage });

function FavoritesPage() {
  const { favorites: globalFavorites } = useApp(); // Used to check if favorite, though NormalProductCard already handles this
  const [localFavorites, setLocalFavorites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFavorite, setSelectedFavorite] = useState<Favourite | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await favoritesApi.getFavorites(pageNum, 20);
      if (res && 'meta' in res) {
        setLocalFavorites(res.data);
        setTotalPages(res.meta.totalPages);
      } else {
        setLocalFavorites(res as Favourite[]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to load favorites page:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page, globalFavorites.length]); // Refresh if global favorites change (added/removed)

  return (
    <DashboardLayout title="Favorites">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Your saved products</h2>
          <p className="mt-1 text-sm text-muted-foreground">{localFavorites.length} item{localFavorites.length === 1 ? "" : "s"} on this page</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-ai-purple" />
        </div>
      ) : localFavorites.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card-gradient p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ai-gradient/15"><Heart className="h-7 w-7 text-ai-purple" /></div>
          <h3 className="mt-5 font-display text-xl font-semibold">No favorites yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Tap the heart icon on any product to save it here.</p>
          <Link to="/dashboard" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white shadow-ai">
            <Sparkles className="h-4 w-4" /> Start searching
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {localFavorites.map((f) => {
            const productProps: SearchProduct = {
              title: f.title,
              price: f.price || "N/A",
              rating: f.rating ?? null,
              imageUrl: f.imageUrl || "",
              store: f.store || "Unknown",
              productUrl: f.productUrl || "#",
            };
            return (
              <NormalProductCard 
                key={f.id} 
                product={productProps} 
                onClick={() => setSelectedFavorite(f)}
              />
            );
          })}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Favorite Details Modal */}
      <Dialog open={!!selectedFavorite} onOpenChange={(open) => !open && setSelectedFavorite(null)}>
        <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 border-border bg-card-gradient shadow-card-ai gap-0">
          {selectedFavorite && (
            <>
              <div className="relative aspect-video w-full overflow-hidden bg-surface flex items-center justify-center p-6 border-b border-border">
                <img
                  src={selectedFavorite.imageUrl}
                  alt={selectedFavorite.title}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400";
                  }}
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="rounded-md bg-background/90 px-2 py-1 text-xs font-semibold glass text-ai-electric shadow-sm">
                    {selectedFavorite.store}
                  </span>
                  {selectedFavorite.category && (
                    <span className="rounded-md bg-background/90 px-2 py-1 text-xs font-semibold glass text-muted-foreground shadow-sm">
                      {selectedFavorite.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <DialogTitle className="font-display text-xl leading-snug line-clamp-3 flex-1">
                    {selectedFavorite.title}
                  </DialogTitle>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-extrabold text-ai-gradient">{selectedFavorite.price || "N/A"}</div>
                    {selectedFavorite.rating !== null && selectedFavorite.rating !== undefined && (
                      <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground mt-1">
                        <Star className="h-4 w-4 fill-ai-electric text-ai-electric" />
                        <span>{selectedFavorite.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedFavorite.summary && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Why we matched this</h4>
                    <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                      {selectedFavorite.summary}
                    </DialogDescription>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <a
                    href={selectedFavorite.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-ai-gradient px-6 py-3 text-sm font-semibold text-white shadow-ai hover:opacity-95 transition"
                  >
                    View at {selectedFavorite.store} <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
