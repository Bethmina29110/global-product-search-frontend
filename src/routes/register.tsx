import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Brain, Mail, Lock, User as UserIcon, Phone, MapPin, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useApp();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields (*).");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({
        email,
        fullName,
        password,
        confirmPassword,
        phoneNo: phoneNo || undefined,
        address: address || undefined,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      await fetchUser();
      toast.success("Account successfully created!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
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
      <div className="relative grid min-h-screen place-items-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card-gradient p-8 shadow-card-ai">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-ai-gradient">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold">Semantix</span>
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start exploring semantic product discovery.</p>
          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            <Field
              icon={UserIcon}
              label="Full Name *"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
            <Field
              icon={Mail}
              label="Email *"
              type="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Field
              icon={Phone}
              label="Phone Number"
              type="tel"
              placeholder="+94771234567"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              disabled={loading}
            />
            <Field
              icon={MapPin}
              label="Address"
              placeholder="123 Main Street, Colombo"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
            <Field
              icon={Lock}
              label="Password *"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Field
              icon={Lock}
              label="Confirm Password *"
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-ai hover:opacity-95 disabled:opacity-50 transition"
            >
              {loading ? "Creating account..." : "Create account"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have one? <Link to="/login" className="text-ai-electric hover:underline">Sign in</Link>
          </p>
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
