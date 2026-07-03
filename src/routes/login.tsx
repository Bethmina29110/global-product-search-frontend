import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Brain, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useApp();

  useEffect(() => {
    setMounted(true);
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted:", { email, passwordLength: password.length });
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      console.log("Calling authApi.login...");
      const response = await authApi.login({ email, password });
      console.log("AuthApi.login response received:", response);
      
      if (response && response.data) {
        console.log("Saving tokens to localStorage:", {
          accessToken: response.data.accessToken ? "found" : "missing",
          refreshToken: response.data.refreshToken ? "found" : "missing"
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        await fetchUser();
        toast.success("Successfully logged in!");
        navigate({ to: "/dashboard" });
      } else {
        console.error("AuthApi.login responded but 'data' property was missing:", response);
        toast.error("Invalid response format from server.");
      }
    } catch (err: any) {
      console.error("AuthApi.login failed with error:", err);
      if (err.response) {
        console.error("Server response error details:", {
          status: err.response.status,
          data: err.response.data
        });
      }
      
      let errorMsg = "Invalid credentials. Please try again.";
      if (err.response?.data) {
        const { message, error } = err.response.data;
        if (error?.details && Array.isArray(error.details) && error.details.length > 0) {
          errorMsg = error.details.join('\n');
        } else if (message) {
          errorMsg = message;
        }
      }
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
              Global <span className="text-ai-gradient">Product</span> Search.
            </h2>
            <p className="text-muted-foreground max-w-md">
              Sign in to access your AI-powered semantic product discovery dashboard, saved searches, and personalized embeddings.
            </p>
            <div className="rounded-2xl border border-border glass p-5 max-w-md">
              <div className="text-xs uppercase tracking-wider text-ai-purple">AI Insight</div>
              <p className="mt-2 text-sm">
                "Your last query had 94% semantic confidence and surfaced 3 unique vendors not seen via keyword search."
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">© Global Product Search Platform</p>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card-gradient p-8 shadow-card-ai">
            <div className="mb-7 text-center lg:text-left">
              <h1 className="font-display text-2xl font-bold">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your Semantix workspace.</p>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <Field
                icon={Mail}
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Field
                icon={Lock}
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-[var(--ai-purple)]" disabled={loading} /> Remember me
                </label>
                <a href="#" className="text-ai-electric hover:underline">Forgot password?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-ai hover:opacity-95 disabled:opacity-50 transition"
              >
                {loading ? "Signing in..." : "Sign in"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              No account? <Link to="/register" className="text-ai-electric hover:underline">Create one</Link>
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
