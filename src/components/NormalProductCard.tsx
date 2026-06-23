import { Heart, ExternalLink, Star } from "lucide-react";
import type { SearchProduct } from "@/lib/api/types";
import { useApp } from "@/context/AppContext";

interface NormalProductCardProps {
  product: SearchProduct;
  onClick?: () => void;
}

export function NormalProductCard({ product, onClick }: NormalProductCardProps) {
  const { favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(product.title);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.title);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={onClick}
      className="group relative ai-border-glow rounded-2xl bg-card-gradient border border-border overflow-hidden shadow-card-ai hover:shadow-ai hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer hover:border-ai-electric/50 animate-fade-in"
    >
      <button
        onClick={handleFavoriteClick}
        aria-label="favorite"
        className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full glass hover:bg-white/10 transition cursor-pointer"
      >
        <Heart className={`h-4 w-4 ${isFavorite ? "fill-ai-purple text-ai-purple" : "text-foreground"}`} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface flex items-center justify-center p-2">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-40" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded-md bg-background/80 px-2 py-1 text-[10px] font-semibold glass text-ai-electric">
            {product.store}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-bold leading-snug text-foreground/90 group-hover:text-ai-purple transition-colors line-clamp-2">
              {product.title}
            </h3>
            <div className="text-right shrink-0">
              <div className="text-base font-extrabold text-ai-gradient">{product.price}</div>
              {product.rating !== null && (
                <div className="flex items-center justify-end gap-0.5 text-xs text-muted-foreground mt-0.5">
                  <Star className="h-3 w-3 fill-ai-electric text-ai-electric" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-ai hover:opacity-95 transition cursor-pointer"
        >
          View at {product.store} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
