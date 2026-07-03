import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Heart, Share2, Sparkles, Star } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { products } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { SemanticScoreBadge } from "@/components/SemanticScoreBadge";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  notFoundComponent: () => (
    <DashboardLayout title="Not found">
      <div className="rounded-2xl border border-border bg-card-gradient p-10 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/dashboard" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white">
          Back to search
        </Link>
      </div>
    </DashboardLayout>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-sm text-muted-foreground">Error: {error.message}</div>,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { favorites, toggleFavorite } = useApp();
  const fav = favorites.some((f) => f.title === product.name);
  const similar = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  const insights = [
    { label: "Lexical overlap", value: 38 },
    { label: "Contextual relevance", value: 92 },
    { label: "Category alignment", value: 96 },
    { label: "Intent confidence", value: Math.round(product.similarity_score * 100) },
  ];

  return (
    <DashboardLayout title="Product details">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to search
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="overflow-hidden rounded-3xl border border-border bg-card-gradient">
            <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-2xl border border-border bg-card-gradient">
                <img src={product.image} alt="" className="h-full w-full object-cover opacity-80 hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{product.brand}</span> · <span>{product.category}</span> · <span>{product.source}</span>
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-ai-electric text-ai-electric" /> {product.rating} (1,284 reviews)
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-ai-gradient">${product.price}</div>
              <div className="text-xs text-muted-foreground">In stock</div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((t: string) => (
              <span key={t} className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted-foreground">#{t}</span>
            ))}
          </div>

          <SemanticScoreBadge score={product.similarity_score} />

          <div className="flex gap-2">
            <button className="flex-1 inline-flex items-center justify-center rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-ai">View at {product.source}</button>
            <button onClick={() => toggleFavorite({
              title: product.name,
              price: String(product.price),
              imageUrl: product.image,
              store: product.source,
              productUrl: product.url || "#",
              rating: product.rating,
              category: product.category,
              summary: product.description
            })} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface">
              <Heart className={`h-4 w-4 ${fav ? "fill-ai-purple text-ai-purple" : ""}`} />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface"><Share2 className="h-4 w-4" /></button>
          </div>

          {/* Semantic insights panel */}
          <div className="ai-border-glow rounded-2xl border border-border bg-card-gradient p-5">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-ai-gradient/15 text-ai-purple"><Brain className="h-4 w-4" /></div>
              <div>
                <div className="font-semibold text-sm">Semantic Insights</div>
                <div className="text-[11px] text-muted-foreground">Why the model ranked this product highly</div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {insights.map((i) => (
                <div key={i.label}>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{i.label}</span>
                    <span className="font-semibold">{i.value}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${i.value}%` }} transition={{ duration: 1 }} className="h-full bg-ai-gradient" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-background/40 p-3">
              <div className="text-[10px] uppercase tracking-wider text-ai-purple">Detected semantic keywords</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["comfort","support","durability","work-friendly","ergonomic posture"].map((k) => (
                  <span key={k} className="inline-flex items-center gap-1 rounded-full bg-ai-gradient/15 text-foreground px-2 py-0.5 text-[10px] border border-ai-indigo/30">
                    <Sparkles className="h-2.5 w-2.5" /> {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">Similar semantic matches</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {similar.map((p, i) => <ProductCard key={p.id} product={p} rank={i + 1} />)}
        </div>
      </section>
    </DashboardLayout>
  );
}
