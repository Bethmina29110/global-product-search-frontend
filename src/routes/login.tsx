import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Mail, Lock, ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-ai-gradient shadow-ai"><Brain className="h-5 w-5 text-white" /></div>
            <span className="font-display text-lg font-bold">Semantix</span>
          </Link>
          <div className="space-y-6">
            <h2 className="font-display text-5xl font-bold leading-tight">Search by <span className="text-ai-gradient">meaning</span>, not keywords.</h2>
            <p className="text-muted-foreground max-w-md">Sign in to access your AI-powered semantic product discovery dashboard, saved searches and personalized embeddings.</p>
            <div className="rounded-2xl border border-border glass p-5 max-w-md">
              <div className="text-xs uppercase tracking-wider text-ai-purple">AI Insight</div>
              <p className="mt-2 text-sm">"Your last query had 94% semantic confidence and surfaced 3 unique vendors not seen via keyword search."</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">© Semantix · Final-year project</p>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-border bg-card-gradient p-8 shadow-card-ai">
            <div className="mb-7 text-center lg:text-left">
              <h1 className="font-display text-2xl font-bold">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your Semantix workspace.</p>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Field icon={Mail} label="Email" type="email" placeholder="you@university.edu" />
              <Field icon={Lock} label="Password" type="password" placeholder="••••••••" />
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="accent-[var(--ai-purple)]" /> Remember me
                </label>
                <a href="#" className="text-ai-electric hover:underline">Forgot password?</a>
              </div>
              <Link to="/dashboard" className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-ai">
                Sign in <ArrowRight className="h-4 w-4" />
              </Link>
            </form>
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or continue with <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm hover:bg-surface-elevated"><Github className="h-4 w-4" /> GitHub</button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm hover:bg-surface-elevated">Google</button>
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              No account? <Link to="/register" className="text-ai-electric hover:underline">Create one</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, ...rest }: { icon: any; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input {...rest} className="w-full rounded-xl border border-border bg-surface pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai-indigo/40" />
      </div>
    </label>
  );
}
