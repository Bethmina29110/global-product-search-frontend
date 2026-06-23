import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Search, Heart, Bookmark, ArrowRight, Sparkles, TrendingUp, Cpu, History, Zap } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { savedSearches } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard")({ component: DashboardOverviewPage });

const MOCK_CHART_DATA = [
  { name: "Mon", Searches: 12, Accuracy: 84 },
  { name: "Tue", Searches: 19, Accuracy: 88 },
  { name: "Wed", Searches: 15, Accuracy: 85 },
  { name: "Thu", Searches: 27, Accuracy: 91 },
  { name: "Fri", Searches: 32, Accuracy: 93 },
  { name: "Sat", Searches: 20, Accuracy: 89 },
  { name: "Sun", Searches: 24, Accuracy: 92 },
];

function DashboardOverviewPage() {
  return (
    <DashboardLayout title="Analytics & Overview">
      <div className="space-y-6">
        {/* Welcome Section */}
        <section className="rounded-3xl border border-border bg-card-gradient p-6 lg:p-8 shadow-card-ai relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <Cpu className="h-32 w-32 text-ai-purple" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-ai-electric animate-pulse" />
              Embedding engine: all-MiniLM-L6-v2 active
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">Welcome to Semantix Dashboard</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Discover products by meaning and intent. Review your search metrics, quickly relaunch saved semantic queries, or run a new search with our Retrieval-Augmented Generation (RAG) assistant.
            </p>
            <div className="mt-5">
              <Link
                to="/search"
                className="inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white shadow-ai hover:opacity-95 transition"
              >
                Start New AI Search <Search className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Searches Run" value="148" description="+12% since yesterday" icon={Search} color="text-ai-purple" />
          <StatCard title="Saved Intent Queries" value={savedSearches.length.toString()} description="Quick-launch queries" icon={Bookmark} color="text-ai-indigo" />
          <StatCard title="Favorite Products" value="8" description="Shortlisted across vendors" icon={Heart} color="text-ai-electric" />
          <StatCard title="Average Latency" value="184ms" description="Vector similarity resolving" icon={Zap} color="text-emerald-400" />
        </div>

        {/* Analytics & Activity Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart Card */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card-gradient p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm">Semantic Search Activity</h3>
                <p className="text-xs text-muted-foreground">Weekly vector query volume</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <TrendingUp className="h-3.5 w-3.5" /> +24% activity
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--ai-purple)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--ai-purple)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#1a1a24", borderColor: "#2d2d3d", borderRadius: "12px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="Searches" stroke="var(--ai-purple)" strokeWidth={2} fillOpacity={1} fill="url(#colorSearches)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Saved Searches */}
          <div className="rounded-2xl border border-border bg-card-gradient p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <History className="h-4 w-4 text-ai-purple" /> Recent Saved Queries
              </h3>
              <p className="text-xs text-muted-foreground">Rerun your favorite intents</p>
            </div>

            <div className="space-y-2">
              {savedSearches.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-xs font-semibold truncate text-foreground/90">{s.query}</div>
                    <div className="text-[10px] text-muted-foreground">{s.date}</div>
                  </div>
                  <Link to="/search" className="shrink-0 text-muted-foreground hover:text-ai-purple">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            <Link to="/saved-searches" className="w-full inline-flex items-center justify-center gap-1 text-xs text-ai-purple hover:underline pt-2">
              View All Saved Searches <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, description, icon: Icon, color }: { title: string; value: string; description: string; icon: any; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card-gradient p-5 shadow-sm relative overflow-hidden group hover:border-border/80 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <div className={`p-1.5 rounded-lg bg-surface border border-border ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold font-display">{value}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
