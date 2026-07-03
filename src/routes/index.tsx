import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Brain, Sparkles, Layers, Gauge, Globe2, Zap, Search, Cpu, Database, Cloud,
  Workflow, ArrowRight, Star, ChevronRight, Github, BookOpen, Twitter, MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { products } from "@/lib/mockData";
import { SemanticScoreBadge } from "@/components/SemanticScoreBadge";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/login",
    });
  },
  component: Landing,
});

const features = [
  { icon: Brain, title: "Semantic Search", desc: "Understands meaning and intent, not just keywords." },
  { icon: Sparkles, title: "AI Embeddings", desc: "Sentence-transformer powered 384-d vector space." },
  { icon: Layers, title: "Multi-Source Aggregation", desc: "Unifies products from many global vendors." },
  { icon: Gauge, title: "Intelligent Ranking", desc: "Cosine similarity + behavioral signals." },
  { icon: Zap, title: "Fast Retrieval", desc: "Sub-second vector search across millions of items." },
  { icon: Search, title: "Real-Time Search", desc: "Streaming results as embeddings resolve." },
  { icon: Globe2, title: "Global Discovery", desc: "Region-aware semantic relevance." },
  { icon: Cpu, title: "Smart Recommendations", desc: "Contextual similarity beyond categories." },
];

const pipeline = [
  { label: "User Query", icon: Search },
  { label: "NestJS API", icon: Workflow },
  { label: "FastAPI AI Service", icon: Cpu },
  { label: "Sentence Transformer", icon: Brain },
  { label: "Embeddings", icon: Sparkles },
  { label: "Cosine Similarity", icon: Gauge },
  { label: "Ranked Results", icon: Layers },
];

const stack = [
  { group: "Frontend", items: ["React", "TailwindCSS", "Axios"] },
  { group: "Backend", items: ["NestJS", "FastAPI"] },
  { group: "AI", items: ["Sentence Transformers", "all-MiniLM-L6-v2", "Cosine Similarity"] },
  { group: "Database", items: ["Supabase Postgres", "Prisma", "pgvector"] },
  { group: "Deployment", items: ["AWS", "CloudFront", "ECS"] },
];

function Landing() {
  const [q, setQ] = useState("comfortable gaming chair for long work sessions");
  const demo = products.filter((p) => ["1","8","2"].includes(p.id));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Top nav */}
      <header className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-ai-gradient shadow-ai">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">Semantix</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#stack" className="hover:text-foreground transition">Stack</a>
            <a href="#demo" className="hover:text-foreground transition">Demo</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:inline-flex rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white shadow-ai">
              Open App <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        {/* floating particles */}
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-ai-electric/70 blur-[1px]"
            style={{ top: `${(i * 53) % 90 + 5}%`, left: `${(i * 37) % 95}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 lg:pt-28 lg:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-1.5 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ai-electric animate-pulse" />
            Powered by sentence-transformer embeddings · all-MiniLM-L6-v2
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-4xl font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
          >
            Search products by <span className="text-ai-gradient">meaning</span>, not keywords.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground"
          >
            AI-powered semantic product discovery across multiple global product sources using
            intelligent embeddings and cosine similarity ranking.
          </motion.p>

          <div className="mt-10">
            <SearchBar value={q} onChange={setQ} size="lg" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
              Start Searching <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-1.5 rounded-xl border border-border glass px-5 py-2.5 text-sm font-medium">
              Explore Features <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-ai-electric" /> 384-d vector space</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-ai-purple" /> &lt;200ms median latency</span>
            <span className="flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-ai-indigo" /> 12+ vendor sources</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-ai-purple font-semibold">Capabilities</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">A search engine that understands you.</h2>
          <p className="mt-3 text-muted-foreground">Eight building blocks that turn vague intent into ranked, vendor-aware product results.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group ai-border-glow relative rounded-2xl border border-border bg-card-gradient p-5 hover:-translate-y-1 transition"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-ai-gradient/15 text-ai-purple ring-1 ring-ai-indigo/30">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works pipeline */}
      <section id="how" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-ai-electric font-semibold">AI pipeline</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">From query to ranked results.</h2>
        </div>
        <div className="mt-14 relative">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-ai-indigo/40 to-transparent" />
          <div className="relative grid gap-6 md:grid-cols-7 sm:grid-cols-4 grid-cols-2">
            {pipeline.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-ai-gradient opacity-40 blur-xl" />
                  <div className="relative grid h-14 w-14 place-items-center rounded-full glass border border-border">
                    <step.icon className="h-5 w-5 text-ai-purple" />
                  </div>
                </div>
                <div className="mt-3 text-xs font-medium text-foreground">{step.label}</div>
                <div className="text-[10px] text-muted-foreground">Step {i + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ai-purple font-semibold">Live demo preview</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">Semantic understanding in action.</h2>
            <p className="mt-3 text-muted-foreground">
              Watch how a fuzzy natural-language query is decomposed into intent vectors and matched
              against millions of product embeddings — ranked by contextual fit, not keyword overlap.
            </p>
            <div className="mt-6 rounded-2xl border border-border glass p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Query</div>
              <div className="mt-1 font-mono text-sm">"comfortable gaming chair for long work sessions"</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["comfort", "ergonomics", "endurance", "lumbar", "gaming", "office hybrid"].map((k) => (
                  <span key={k} className="rounded-full bg-ai-gradient/15 text-foreground px-2.5 py-1 text-[10px] border border-ai-indigo/30">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {demo.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card-gradient p-3 ai-border-glow"
              >
                <img src={p.image} alt={p.name} className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="rounded-full bg-ai-gradient px-2 py-0.5 text-[9px] font-bold uppercase text-white">Best Match</span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{p.brand} · {p.source}</span>
                  </div>
                  <div className="mt-1 font-semibold truncate">{p.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.description}</div>
                  <div className="mt-2"><SemanticScoreBadge score={p.similarity_score} /></div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-ai-gradient">${p.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-ai-indigo font-semibold">Built with</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">Enterprise-grade modern architecture.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {stack.map((g) => (
            <div key={g.group} className="rounded-2xl border border-border bg-card-gradient p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                {g.group === "Frontend" && <Sparkles className="h-3.5 w-3.5" />}
                {g.group === "Backend" && <Workflow className="h-3.5 w-3.5" />}
                {g.group === "AI" && <Brain className="h-3.5 w-3.5" />}
                {g.group === "Database" && <Database className="h-3.5 w-3.5" />}
                {g.group === "Deployment" && <Cloud className="h-3.5 w-3.5" />}
                {g.group}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.items.map((it) => (
                  <span key={it} className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs">{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card-gradient p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-hero-gradient opacity-60" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold">Experience the future of product search.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Hop into the live AI dashboard and search across vendors with intent-aware ranking.</p>
            <Link to="/dashboard" className="mt-7 inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow">
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-ai-gradient"><Brain className="h-4 w-4 text-white" /></div>
              <span className="font-display font-bold">Semantix</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">AI semantic product search & aggregation platform.</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Product</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#features" className="hover:text-foreground text-muted-foreground">Features</a></li>
              <li><a href="#how" className="hover:text-foreground text-muted-foreground">How it works</a></li>
              <li><Link to="/dashboard" className="hover:text-foreground text-muted-foreground">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Resources</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="hover:text-foreground text-muted-foreground inline-flex items-center gap-1.5" href="#"><BookOpen className="h-3.5 w-3.5" /> Documentation</a></li>
              <li><a className="hover:text-foreground text-muted-foreground inline-flex items-center gap-1.5" href="#"><Github className="h-3.5 w-3.5" /> GitHub</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Community</div>
            <div className="mt-3 flex items-center gap-2">
              <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface hover:bg-surface-elevated"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface hover:bg-surface-elevated"><Github className="h-4 w-4" /></a>
              <a href="#" aria-label="Discord" className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface hover:bg-surface-elevated"><MessageSquare className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} Global Product Search Platform</span>
            <span>Made with semantic AI · all-MiniLM-L6-v2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
