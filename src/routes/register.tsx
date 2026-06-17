import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative grid min-h-screen place-items-center p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-border bg-card-gradient p-8 shadow-card-ai">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-ai-gradient"><Brain className="h-5 w-5 text-white" /></div>
            <span className="font-display font-bold">Semantix</span>
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start exploring semantic product discovery.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Field icon={User} label="Full name" placeholder="Alex Chen" />
            <Field icon={Mail} label="Email" type="email" placeholder="you@university.edu" />
            <Field icon={Lock} label="Password" type="password" placeholder="At least 8 characters" />
            <Field icon={Lock} label="Confirm password" type="password" placeholder="Repeat password" />
            <Link to="/dashboard" className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-ai">
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have one? <Link to="/login" className="text-ai-electric hover:underline">Sign in</Link>
          </p>
        </motion.div>
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
