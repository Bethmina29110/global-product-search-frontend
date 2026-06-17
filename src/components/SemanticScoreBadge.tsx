import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function SemanticScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    score >= 0.9 ? "from-ai-purple to-ai-indigo" :
    score >= 0.8 ? "from-ai-indigo to-ai-electric" :
                   "from-ai-electric to-ai-indigo";
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-full bg-background/40 px-2.5 py-1 text-xs font-medium glass">
        <Sparkles className="h-3 w-3 text-ai-purple" />
        <span className="text-ai-gradient font-semibold">{pct}%</span>
        <span className="text-muted-foreground">match</span>
      </div>
      <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}
