import { createFileRoute } from "@tanstack/react-router";
import { Activity, Brain, Search, TrendingUp, Heart, Bookmark, Zap, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState, useEffect } from "react";
import { analyticsApi, AnalyticsOverview, TopCategory, TopStore, PriceDistribution } from "@/lib/api/analytics";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

const COLORS = ["#8B5CF6", "#6366F1", "#3B82F6", "#A78BFA", "#22D3EE", "#10B981", "#F59E0B", "#EF4444"];

function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [trendData, setTrendData] = useState<{ day: string; searches: number }[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [topStores, setTopStores] = useState<TopStore[]>([]);
  const [priceDistribution, setPriceDistribution] = useState<PriceDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [overviewRes, trendRes, categoriesRes, storesRes, priceRes] = await Promise.all([
          analyticsApi.getOverview(),
          analyticsApi.getSearchTrend(),
          analyticsApi.getTopCategories(),
          analyticsApi.getTopStores(),
          analyticsApi.getPriceDistribution()
        ]);
        setOverview(overviewRes);
        
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setTrendData(trendRes.map((val, idx) => ({ day: days[idx], searches: val })));
        setTopCategories(categoriesRes);
        setTopStores(storesRes);
        setPriceDistribution(priceRes);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-ai-purple" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: "Total Searches", value: overview?.totalSearches.toString() || "0", change: "", icon: Search, color: "text-ai-purple" },
    { label: "Saved Searches", value: overview?.savedSearches.toString() || "0", change: "", icon: Bookmark, color: "text-ai-indigo" },
    { label: "Favorite Products", value: overview?.favoriteProducts.toString() || "0", change: "", icon: Heart, color: "text-ai-electric" },
    { label: "Avg Latency", value: `${overview?.averageLatency || 0}ms`, change: "", icon: Zap, color: "text-emerald-400" },
  ];

  const handleDownloadReport = () => {
    const csvRows = [];
    csvRows.push("--- AI Search Analytics Report ---");
    csvRows.push("");
    
    csvRows.push("Overview");
    csvRows.push(`Total Searches,${overview?.totalSearches || 0}`);
    csvRows.push(`Saved Searches,${overview?.savedSearches || 0}`);
    csvRows.push(`Favorite Products,${overview?.favoriteProducts || 0}`);
    csvRows.push(`Average Latency,${overview?.averageLatency || 0}ms`);
    csvRows.push("");

    csvRows.push("Search Trend");
    csvRows.push("Day,Searches");
    trendData.forEach(t => csvRows.push(`${t.day},${t.searches}`));
    csvRows.push("");

    csvRows.push("Top Categories");
    csvRows.push("Category,Count");
    topCategories.forEach(c => csvRows.push(`"${c.name}",${c.value}`));
    csvRows.push("");

    csvRows.push("Top Stores");
    csvRows.push("Store,Count");
    topStores.forEach(s => csvRows.push(`"${s.name}",${s.value}`));
    csvRows.push("");

    csvRows.push("Price Distribution");
    csvRows.push("Range,Count");
    priceDistribution.forEach(p => csvRows.push(`"${p.range}",${p.count}`));
    
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Analytics">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">AI Search Analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">Embedding performance, query trends, and semantic score distribution.</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="inline-flex items-center gap-2 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white shadow-ai hover:opacity-95 transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download Report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="ai-border-glow rounded-2xl border border-border bg-card-gradient p-5">
            <div className="flex items-center justify-between">
              <div className={`grid h-9 w-9 place-items-center rounded-xl bg-surface border border-border ${s.color}`}><s.icon className="h-4 w-4" /></div>
              {s.change && <span className="rounded-full bg-ai-gradient/15 px-2 py-0.5 text-[10px] text-ai-purple">{s.change}</span>}
            </div>
            <div className="mt-3 text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Search Trend */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card-gradient p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Search trend</h3>
              <p className="text-xs text-muted-foreground">Queries over the past week</p>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="searches" stroke="#8B5CF6" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories */}
        <div className="rounded-2xl border border-border bg-card-gradient p-5">
          <h3 className="font-display text-lg font-semibold">Top categories</h3>
          <p className="text-xs text-muted-foreground">Distribution of matched product categories</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={topCategories} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} stroke="none">
                  {topCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2">
            {topCategories.map((c, i) => (
              <span key={c.name} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Top Stores */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card-gradient p-5">
          <h3 className="font-display text-lg font-semibold">Top Stores</h3>
          <p className="text-xs text-muted-foreground">Stores with the most returned products</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {topStores.map((store, i) => {
              const maxVal = Math.max(...topStores.map((s) => s.value));
              const percentage = maxVal === 0 ? 0 : (store.value / maxVal) * 100;
              return (
                <div key={store.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate pr-2" title={store.name}>{i + 1}. {store.name}</span>
                    <span className="text-muted-foreground font-semibold">{store.value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface border border-border/50">
                    <div
                      className="h-full rounded-full bg-ai-gradient"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Distribution */}
        <div className="rounded-2xl border border-border bg-card-gradient p-5">
          <h3 className="font-display text-lg font-semibold">Price Distribution</h3>
          <p className="text-xs text-muted-foreground">Returned products by price range</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={priceDistribution} dataKey="count" nameKey="range" innerRadius={55} outerRadius={90} stroke="none">
                  {priceDistribution.map((_, i) => <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2">
            {priceDistribution.map((p, i) => (
              <span key={p.range} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[(i + 4) % COLORS.length] }} /> {p.range}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
