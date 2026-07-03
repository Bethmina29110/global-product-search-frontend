import { Moon, Sun, Sparkles, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function TopNav({ title }: { title?: string }) {
  const { theme, toggleTheme, user } = useApp();
  
  // Extract initials for the avatar placeholder
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/70 px-4 lg:px-8 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-lg font-semibold tracking-tight">{title ?? "Semantic Search"}</h1>
        <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3 text-ai-purple" /> AI Embeddings Active
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} aria-label="theme" className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface hover:bg-surface-elevated transition">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-1.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-ai-gradient text-white text-xs font-semibold">
            {user ? getInitials(user.name || user.fullName || "") : <User className="h-3.5 w-3.5" />}
          </div>
          <div className="hidden md:block text-xs">
            <div className="font-semibold leading-none">{user?.name || user?.fullName || "Guest User"}</div>
            <div className="text-muted-foreground text-[10px] mt-0.5">{user?.email || "Not signed in"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
