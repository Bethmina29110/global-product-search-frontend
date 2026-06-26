import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/mockData";

export const Route = createFileRoute("/favorites")({ component: FavoritesPage });

function FavoritesPage() {
  const { favorites } = useApp();
  
  const saved: Product[] = favorites.map(f => ({
    id: f.id.toString(),
    name: f.title,
    price: Number(f.price) || 0,
    rating: f.rating || 0,
    image: f.imageUrl || "",
    source: f.store || "",
    brand: "",
    description: f.summary || "",
    similarity_score: 0,
    tags: f.category ? [f.category] : [],
    category: f.category || "",
    color: "",
  }));

  return (
    <DashboardLayout title="Favorites">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Your saved products</h2>
          <p className="mt-1 text-sm text-muted-foreground">{saved.length} item{saved.length === 1 ? "" : "s"} saved for later</p>
        </div>
      </div>
      {saved.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card-gradient p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ai-gradient/15"><Heart className="h-7 w-7 text-ai-purple" /></div>
          <h3 className="mt-5 font-display text-xl font-semibold">No favorites yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Tap the heart icon on any product to save it here.</p>
          <Link to="/dashboard" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white shadow-ai">
            <Sparkles className="h-4 w-4" /> Start searching
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((p, i) => <ProductCard key={p.id} product={p} rank={i + 1} />)}
        </div>
      )}
    </DashboardLayout>
  );
}
