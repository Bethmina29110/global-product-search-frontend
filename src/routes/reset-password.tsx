import { createFileRoute, Link, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Brain, Lock, Key, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && localStorage.getItem("accessToken")) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: ResetPasswordPage 
});

function ResetPasswordPage() {
  const [step, setStep] = useState<"reset" | "success">("reset");
  // Assuming they might pass email in query param if they click the link in email, otherwise they enter it.
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    // Optionally extract email from URL if we pass it, e.g. /reset-password?email=xxx
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword, confirmPassword });
      toast.success("Password successfully reset!");
      setStep("success");
    } catch (err: any) {
      let errorMsg = "Failed to reset password. Please try again.";
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
              Create a <span className="text-ai-gradient">New Password</span>.
            </h2>
            <p className="text-muted-foreground max-w-md">
              Enter the OTP sent to your email and choose a strong new password for your Semantix account.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">© Global Product Search Platform</p>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card-gradient p-8 shadow-card-ai">
            
            {step === "reset" && (
              <>
                <div className="mb-7 text-center lg:text-left">
                  <h1 className="font-display text-2xl font-bold">Set New Password</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Check your email for the 4-digit code.</p>
                </div>
                <form className="space-y-4" onSubmit={handleResetPassword}>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai-indigo/40 disabled:opacity-50"
                    />
                  </label>
                  <Field
                    icon={Key}
                    label="4-Digit OTP"
                    type="text"
                    placeholder="e.g. 1234"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <Field
                    icon={Lock}
                    label="New Password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <Field
                    icon={Lock}
                    label="Confirm New Password"
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
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-ai hover:opacity-95 disabled:opacity-50 transition"
                  >
                    {loading ? "Resetting Password..." : "Reset Password"} <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}

            {step === "success" && (
              <div className="text-center py-6">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/10 text-green-500 mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">Password Reset!</h1>
                <p className="text-sm text-muted-foreground mb-8">Your password has been successfully updated. You can now sign in with your new credentials.</p>
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-ai hover:opacity-95 transition"
                >
                  Return to Sign In <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {step !== "success" && (
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Remember your password? <Link to="/login" className="text-ai-electric hover:underline">Back to login</Link>
              </p>
            )}
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
