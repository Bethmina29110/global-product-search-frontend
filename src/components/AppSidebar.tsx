import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Search, Heart, Bookmark, BarChart3, Settings, Brain, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useApp } from "@/context/AppContext";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/search", label: "Search", icon: Search },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/saved-searches", label: "Saved Searches", icon: Bookmark },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const { logout } = useApp();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Goodbye! See you next time.");
      navigate({ to: "/login" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar/60 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
      <Link to="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
        <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-ai-gradient shadow-ai">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="font-display text-base font-bold leading-none">Semantix</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Product Search</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.label}
              to={it.to}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-ai-gradient/15 text-foreground shadow-ai"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-ai-gradient" />
              )}
              <Icon className={`h-4 w-4 ${active ? "text-ai-purple" : ""}`} />
              {it.label}
            </Link>
          );
        })}

      </nav>

      <div className="px-3 pb-4 mt-auto">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
