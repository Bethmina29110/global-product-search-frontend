import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Database, Key, Palette, Shield, User, Loader2, Trash2, Eye, EyeOff } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { authApi } from "@/lib/api/auth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, toggleTheme, user, fetchUser, logout, fetchFavorites } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Clear data state
  const [isClearingFavs, setIsClearingFavs] = useState(false);
  const [isClearingSaved, setIsClearingSaved] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);

  // Sync state if user loads later
  useEffect(() => {
    if (user) {
      setName(user.name || user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      await authApi.updateProfile({ name, email });
      await fetchUser(); // refresh global state
      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error("Failed to update profile", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    toast("Delete Account", {
      description: "Are you sure you want to delete your account? This cannot be undone.",
      action: {
        label: "Yes",
        onClick: async () => {
          try {
            setIsDeleting(true);
            await authApi.deleteAccount();
            await logout();
            toast.success("Account deleted");
            navigate({ to: "/login" });
          } catch (err: any) {
            console.error("Failed to delete account", err);
            toast.error("Failed to delete account");
            setIsDeleting(false);
          }
        },
      },
      cancel: {
        label: "No",
        onClick: () => {},
      },
    });
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      setIsChangingPassword(true);
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Failed to change password", err);
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClearData = (type: "history" | "favs" | "saved") => {
    const titles: Record<string, string> = {
      history: "Search History",
      favs: "Favorites",
      saved: "Saved Searches"
    };
    
    toast(`Clear ${titles[type]}`, {
      description: `Are you sure you want to clear your ${titles[type].toLowerCase()}? This cannot be undone.`,
      action: {
        label: "Yes",
        onClick: async () => {
          try {
            if (type === "history") {
              setIsClearingHistory(true);
              await authApi.clearSearchHistory();
              toast.success("Search history cleared");
            } else if (type === "favs") {
              setIsClearingFavs(true);
              await authApi.clearFavourites();
              await fetchFavorites();
              toast.success("Favorites cleared");
            } else if (type === "saved") {
              setIsClearingSaved(true);
              await authApi.clearSavedSearches();
              toast.success("Saved searches cleared");
            }
          } catch (err: any) {
            console.error(`Failed to clear ${type}`, err);
            toast.error(`Failed to clear data`);
          } finally {
            if (type === "history") setIsClearingHistory(false);
            if (type === "favs") setIsClearingFavs(false);
            if (type === "saved") setIsClearingSaved(false);
          }
        },
      },
      cancel: {
        label: "No",
        onClick: () => {},
      },
    });
  };

  return (
    <DashboardLayout title="Settings">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, appearance, security, and data preferences.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card icon={User} title="Profile">
          <Row label="Full name">
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name" 
            />
          </Row>
          <Row label="Email">
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Your email" 
            />
          </Row>
          <Row label="Joined">
            <Input 
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""} 
              disabled 
            />
          </Row>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleUpdateProfile}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ai-gradient px-4 py-2 text-sm font-semibold text-white shadow-ai hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </Card>

        <Card icon={Palette} title="Appearance">
          <Row label="Theme">
            <div className="flex items-center gap-2">
              <button onClick={() => theme !== "dark" && toggleTheme()} className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs ${theme === "dark" ? "bg-ai-gradient text-white border-transparent" : "border-border bg-surface"}`}>Dark</button>
              <button onClick={() => theme !== "light" && toggleTheme()} className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs ${theme === "light" ? "bg-ai-gradient text-white border-transparent" : "border-border bg-surface"}`}>Light</button>
            </div>
          </Row>
          <Row label="Accent">
            <div className="flex gap-2">
              {["from-ai-purple","from-ai-indigo","from-ai-electric"].map((c) => (
                <span key={c} className={`h-7 w-7 rounded-full bg-gradient-to-br ${c} to-ai-indigo border border-border`} />
              ))}
            </div>
          </Row>
        </Card>

        <Card icon={Key} title="Security">
          <Row label="Current Password">
            <PasswordInput 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Row>
          <Row label="New Password">
            <PasswordInput 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Row>
          <Row label="Confirm Password">
            <PasswordInput 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Row>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-foreground border border-border hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
              Change password
            </button>
          </div>
        </Card>

        <Card icon={Database} title="Data Management">
          <Row label="Search History">
            <button 
              onClick={() => handleClearData("history")}
              disabled={isClearingHistory}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10 disabled:opacity-50 transition cursor-pointer"
            >
              {isClearingHistory ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Clear History
            </button>
          </Row>
          <Row label="Favorites">
            <button 
              onClick={() => handleClearData("favs")}
              disabled={isClearingFavs}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10 disabled:opacity-50 transition cursor-pointer"
            >
              {isClearingFavs ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Clear Favorites
            </button>
          </Row>
          <Row label="Saved Searches">
            <button 
              onClick={() => handleClearData("saved")}
              disabled={isClearingSaved}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10 disabled:opacity-50 transition cursor-pointer"
            >
              {isClearingSaved ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Clear Saved Searches
            </button>
          </Row>
        </Card>

        <Card icon={Shield} title="Account">
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-destructive/40 text-destructive px-3 py-2 text-xs hover:bg-destructive/10 disabled:opacity-50 transition cursor-pointer"
          >
            {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete account
          </button>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function Card({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card-gradient p-5">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-ai-gradient/15 text-ai-purple"><Icon className="h-4 w-4" /></div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ai-indigo/40 w-full" />;
}

function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input 
        {...props} 
        type={show ? "text" : "password"} 
        className="rounded-xl border border-border bg-surface pl-3 pr-10 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ai-indigo/40 w-full" 
      />
      <button 
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer p-1"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-5 w-9 appearance-none rounded-full bg-white/10 checked:bg-ai-purple relative cursor-pointer transition before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4" />
    </label>
  );
}
