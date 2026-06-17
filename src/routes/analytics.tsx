import { createFileRoute } from "@tanstack/react-router";
import { Activity, Brain, Search, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { analyticsData } from "@/lib/mockData";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

const stats = [
  { label: "Queries this week", value: "1,425", change: "+18%", icon: Search },
  { label: "Avg semantic score", value: "0.84", change: "+4%", icon: Brain },
  { label: "Active embeddings", value: "84.2k", change: "+1.2k", icon: Activity },
  { label: "Top vendor coverage", value: "94%", change: "+3%", icon: TrendingUp },
];

const COLORS = ["#8B5CF6", "#6366F1", "#3B82F6", "#A78BFA", "#22D3EE"];

function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold">AI Search Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">Embedding performance, query trends, and semantic score distribution.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="ai-border-glow rounded-2xl border border-border bg-card-gradient p-5">
            <div className="flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-ai-gradient/15 text-ai-purple"><s.icon className="h-4 w-4" /></div>
              <span className="rounded-full bg-ai-gradient/15 px-2 py-0.5 text-[10px] text-ai-purple">{s.change}</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-ai-gradient">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card-gradient p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Search trend</h3>
              <p className="text-xs text-muted-foreground">Queries vs matched results over the past week</p>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={analyticsData.trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="searches" stroke="#8B5CF6" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="matches" stroke="#3B82F6" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card-gradient p-5">
          <h3 className="font-display text-lg font-semibold">Top categories</h3>
          <p className="text-xs text-muted-foreground">Distribution of matched product categories</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={analyticsData.topCategories} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} stroke="none">
                  {analyticsData.topCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2">
            {analyticsData.topCategories.map((c, i) => (
              <span key={c.name} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} /> {c.name}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-card-gradient p-5">
          <h3 className="font-display text-lg font-semibold">Semantic score distribution</h3>
          <p className="text-xs text-muted-foreground">Count of returned matches by cosine similarity bucket</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={analyticsData.scoreDist}>
                <defs>
                  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Bar dataKey="count" fill="url(#bar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
