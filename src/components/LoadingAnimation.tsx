import { motion } from "framer-motion";
import { Brain, Cpu, Sparkles, Database, Code } from "lucide-react";
import { useState, useEffect } from "react";

const steps = [
  { text: "Tokenizing natural language query...", icon: Code, color: "text-blue-400" },
  { text: "Generating 384-dimensional vector embeddings...", icon: Cpu, color: "text-purple-400" },
  { text: "Scanning global vector database...", icon: Database, color: "text-teal-400" },
  { text: "Evaluating cosine similarity metrics...", icon: Sparkles, color: "text-pink-400" },
  { text: "Synthesizing product recommendations...", icon: Brain, color: "text-indigo-400" },
];

export function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-24 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute -left-1/4 -top-1/4 h-72 w-72 rounded-full bg-ai-purple/10 blur-3xl" />
      <div className="absolute -right-1/4 -bottom-1/4 h-72 w-72 rounded-full bg-ai-electric/15 blur-3xl" />

      {/* Futuristic Orbit Core */}
      <div className="relative h-32 w-32 flex items-center justify-center">
        {/* Holographic scanner laser line */}
        <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-ai-electric to-transparent animate-laser-scan z-20" />

        {/* Orbit Ring 1 (Clockwise) */}
        <div className="absolute inset-0 rounded-full border border-dashed border-ai-purple/30 animate-spin-slow" />

        {/* Orbit Ring 2 (Counter-Clockwise) */}
        <div className="absolute inset-2 rounded-full border border-double border-ai-electric/40 animate-spin-reverse" />

        {/* Glow Aura */}
        <div className="absolute inset-4 rounded-full bg-ai-gradient opacity-20 blur-xl animate-pulse-glow" />

        {/* Core Node Container */}
        <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-ai-indigo/30 bg-background/80 shadow-glow-indigo backdrop-blur-xl">
          <Brain className="h-9 w-9 text-white animate-pulse" />
          
          {/* Micro digital lights inside core */}
          <span className="absolute top-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-ai-electric animate-ping" />
          <span className="absolute bottom-1.5 right-1.5 h-1 w-1 rounded-full bg-ai-purple" />
        </div>

        {/* Orbiting Satellite Dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-ai-electric"
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-4px",
              marginLeft: "-4px",
            }}
            animate={{
              rotate: 360,
              x: Math.cos((i * 2 * Math.PI) / 3) * 60,
              y: Math.sin((i * 2 * Math.PI) / 3) * 60,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* AI Processing Status Messages */}
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-elevated/40 p-5 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">AI Cogitation Status</div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-ai-electric">
            <span className="h-1.5 w-1.5 rounded-full bg-ai-electric animate-pulse" /> Processing
          </span>
        </div>

        <div className="space-y-2.5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;
            const isPending = i > currentStep;

            return (
              <div
                key={step.text}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isActive ? "opacity-100 scale-[1.01]" : isCompleted ? "opacity-60" : "opacity-25"
                }`}
              >
                <div
                  className={`grid h-7 w-7 place-items-center rounded-lg border text-xs transition-colors duration-300 ${
                    isActive
                      ? "border-ai-electric bg-ai-electric/10 " + step.color
                      : isCompleted
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-border bg-surface"
                  }`}
                >
                  {isCompleted ? <CheckIcon className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </div>

                <div className="flex-1 text-xs font-medium truncate">
                  {step.text}
                </div>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-ai-purple animate-ping" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
