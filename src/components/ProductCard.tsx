import { Link } from "@tanstack/react-router";
import { Heart, GitCompare, ExternalLink, Star } from "lucide-react";
import type { Product } from "@/lib/mockData";
import { SemanticScoreBadge } from "./SemanticScoreBadge";
import { useApp } from "@/context/AppContext";

export function ProductCard({ product, rank }: { product: Product; rank?: number }) {
  const { favorites, toggleFavorite } = useApp();
  const fav = favorites.some((f) => f.title === product.name);
  const best = rank === 0;

  const handleToggle = () => {
    toggleFavorite({
      title: product.name,
      price: product.price.toString(),
      imageUrl: product.image,
      store: product.source,
      productUrl: `/product/${product.id}`,
      rating: product.rating,
      category: product.tags[0] || "Unknown",
      summary: product.description,
    });
  };

  return (
    <div
      className="group relative ai-border-glow rounded-2xl bg-card-gradient border border-border overflow-hidden shadow-card-ai hover:shadow-ai hover:-translate-y-1 transition-all duration-300"
    >
      {best && (
        <div className="absolute top-3 left-3 z-10 rounded-full bg-ai-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow">
          Best Semantic Match
        </div>
      )}
      <button
        onClick={handleToggle}
        aria-label="favorite"
        className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full glass hover:bg-white/10 transition"
      >
        <Heart className={`h-4 w-4 ${fav ? "fill-ai-purple text-ai-purple" : "text-foreground"}`} />
      </button>

      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded-md bg-background/70 px-2 py-1 text-[10px] font-medium glass">{product.source}</span>
          <span className="rounded-md bg-background/70 px-2 py-1 text-[10px] font-medium glass">{product.brand}</span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug">{product.name}</h3>
          <div className="text-right">
            <div className="text-lg font-bold text-ai-gradient">${product.price}</div>
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-ai-electric text-ai-electric" /> {product.rating}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>

        <SemanticScoreBadge score={product.similarity_score} />

        <div className="flex items-center gap-2 pt-2">
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-3 py-2 text-sm font-semibold text-white shadow-ai hover:opacity-95 transition"
          >
            View details <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface hover:bg-surface-elevated transition" aria-label="compare">
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
