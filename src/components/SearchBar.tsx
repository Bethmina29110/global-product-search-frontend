import { Brain, Search, Sparkles, Mic, Loader2, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const placeholders = [
  "Find ergonomic office chairs for long coding sessions",
  "Affordable modern minimalist desks",
  "Wireless headphones with deep bass for gaming",
  "AI-powered productivity gadgets under $200",
];

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (query: string) => void;
  onCancel?: () => void;
  size?: "lg" | "md";
  loading?: boolean;
}

export function SearchBar({ value, onChange, onSubmit, onCancel, size = "md", loading }: Props) {
  const [localValue, setLocalValue] = useState(value);
  const [ph, setPh] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const t = setInterval(() => setPh((p) => (p + 1) % placeholders.length), 3500);
    return () => clearInterval(t);
  }, []);

  const large = size === "lg";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) {
      onCancel?.();
    } else {
      onChange(localValue);
      onSubmit?.(localValue);
    }
  };

  const isButtonDisabled = !localValue.trim() && !loading;

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full ${large ? "max-w-3xl" : "max-w-2xl"} mx-auto`}
    >
      <div
        className={`absolute -inset-px rounded-2xl bg-ai-gradient opacity-60 blur-md transition-opacity ${focused ? "opacity-90" : "opacity-30"}`}
        aria-hidden
      />
      <div className="relative flex items-center gap-2 rounded-2xl glass-strong border border-border bg-background/60 px-4 py-3">
        <div className="relative">
          <Brain className={`text-ai-purple ${large ? "h-6 w-6" : "h-5 w-5"} ${loading ? "animate-pulse" : ""}`} />
          {loading && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ai-electric animate-ping" />}
        </div>
        <input
          ref={inputRef}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholders[ph]}
          disabled={loading}
          className={`flex-1 bg-transparent outline-none placeholder:text-muted-foreground/70 ${large ? "text-lg py-2" : "text-base"} disabled:opacity-75`}
        />
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3 text-ai-purple" /> Semantic AI
        </div>
        <button
          type="button"
          aria-label="voice search"
          disabled={loading}
          className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/5 transition cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Mic className="h-4 w-4 text-muted-foreground" />
        </button>
        {loading ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-white shadow-ai hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white shadow-ai hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:scale-100 disabled:active:scale-100 disabled:cursor-not-allowed"
          >
            <Search className="h-4 w-4" /> Search
          </button>
        )}
      </div>
    </form>
  );
}
