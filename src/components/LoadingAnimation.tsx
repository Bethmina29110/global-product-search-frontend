import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const messages = [
  "Generating embeddings...",
  "Understanding query semantics...",
  "Computing cosine similarity...",
  "Finding contextual matches...",
  "Ranking by AI relevance...",
];

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rounded-full bg-ai-gradient opacity-30 blur-2xl animate-pulse-glow" />
        <div className="relative grid h-full w-full place-items-center rounded-full glass border border-border">
          <Brain className="h-10 w-10 text-ai-purple animate-pulse" />
        </div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-ai-indigo/40"
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
      </div>
      <motion.div className="space-y-2 text-center">
        {messages.map((m, i) => (
          <motion.p
            key={m}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.18 }}
            className="text-sm text-muted-foreground"
          >
            <span className="text-ai-gradient font-medium">→</span> {m}
          </motion.p>
        ))}
      </motion.div>
    </div>
  );
}
