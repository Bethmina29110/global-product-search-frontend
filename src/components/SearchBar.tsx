import { motion } from "framer-motion";
import { Brain, Search, Sparkles, Mic } from "lucide-react";
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
  onSubmit?: () => void;
  size?: "lg" | "md";
  loading?: boolean;
}

export function SearchBar({ value, onChange, onSubmit, size = "md", loading }: Props) {
  const [ph, setPh] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setPh((p) => (p + 1) % placeholders.length), 3500);
    return () => clearInterval(t);
  }, []);

  const large = size === "lg";

  return (
    <motion.form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholders[ph]}
          className={`flex-1 bg-transparent outline-none placeholder:text-muted-foreground/70 ${large ? "text-lg py-2" : "text-base"}`}
        />
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3 text-ai-purple" /> Semantic AI
        </div>
        <button type="button" aria-label="voice search" className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/5 transition">
          <Mic className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white shadow-ai hover:opacity-95 transition"
        >
          <Search className="h-4 w-4" /> Search
        </button>
      </div>
    </motion.form>
  );
}
