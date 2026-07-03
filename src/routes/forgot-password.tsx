import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Brain, Mail, Lock, Key, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: () => {
    if (localStorage.getItem("accessToken")) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: ForgotPasswordPage 
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      toast.success("If your email is registered, you will receive an OTP shortly.");
      navigate({ to: "/reset-password", search: { email } });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to request password reset. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-ai-gradient shadow-ai">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">Semantix</span>
          </Link>
          <div className="space-y-6">
            <h2 className="font-display text-5xl font-bold leading-tight">
              Reset Your <span className="text-ai-gradient">Password</span>.
            </h2>
            <p className="text-muted-foreground max-w-md">
              Forgot your password? No worries. Request a one-time passcode to regain access to your semantic product discovery workspace.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">© Global Product Search Platform</p>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card-gradient p-8 shadow-card-ai">
            
            <div className="mb-7 text-center lg:text-left">
              <h1 className="font-display text-2xl font-bold">Forgot Password</h1>
              <p className="mt-1 text-sm text-muted-foreground">Enter your email to receive a reset code.</p>
            </div>
            <form className="space-y-4" onSubmit={handleRequestOtp}>
              <Field
                icon={Mail}
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-ai hover:opacity-95 disabled:opacity-50 transition"
              >
                {loading ? "Sending OTP..." : "Send Reset Code"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Remember your password? <Link to="/login" className="text-ai-electric hover:underline">Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  ...rest
}: { icon: any; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = rest.type === "password";
  const type = isPassword ? (showPassword ? "text" : "password") : rest.type;

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          {...rest}
          type={type}
          className="w-full rounded-xl border border-border bg-surface pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai-indigo/40 disabled:opacity-50"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  );
}
