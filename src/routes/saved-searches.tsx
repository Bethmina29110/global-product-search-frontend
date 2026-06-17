import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, RefreshCw, Trash2, Sparkles, Clock } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { savedSearches } from "@/lib/mockData";

export const Route = createFileRoute("/saved-searches")({ component: SavedSearchesPage });

function SavedSearchesPage() {
  return (
    <DashboardLayout title="Saved searches">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold">Your semantic queries</h2>
        <p className="mt-1 text-sm text-muted-foreground">Rerun, refine, or remove your past intent-based searches.</p>
      </div>
      <div className="grid gap-3">
        {savedSearches.map((s) => (
          <div key={s.id} className="ai-border-glow flex items-center gap-4 rounded-2xl border border-border bg-card-gradient p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-ai-gradient/15 text-ai-purple">
              <Bookmark className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-ai-gradient/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ai-purple">Semantic</span>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {s.date}</span>
              </div>
              <div className="mt-1 font-medium truncate">"{s.query}"</div>
              <div className="text-xs text-muted-foreground">{s.results} ranked matches</div>
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-3 py-2 text-xs font-semibold text-white shadow-ai">
              <RefreshCw className="h-3.5 w-3.5" /> Rerun
            </Link>
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:text-destructive" aria-label="delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-ai-purple" /> Saved searches are re-embedded automatically when products update.
      </div>
    </DashboardLayout>
  );
}
