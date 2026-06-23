import { createFileRoute } from "@tanstack/react-router";
import { Bell, Brain, Palette, Shield, User } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, toggleTheme, user } = useApp();
  return (
    <DashboardLayout title="Settings">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, theme, and AI personalization preferences.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card icon={User} title="Profile">
          <Row label="Full name"><Input key={user?.name || user?.fullName} defaultValue={user?.name || user?.fullName || "Guest User"} /></Row>
          <Row label="Email"><Input key={user?.email} defaultValue={user?.email || "Not signed in"} /></Row>
          <Row label="Joined"><Input key={user?.createdAt} defaultValue={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""} disabled /></Row>
        </Card>

        <Card icon={Palette} title="Appearance">
          <Row label="Theme">
            <div className="flex items-center gap-2">
              <button onClick={() => theme !== "dark" && toggleTheme()} className={`rounded-xl border px-3 py-1.5 text-xs ${theme === "dark" ? "bg-ai-gradient text-white border-transparent" : "border-border bg-surface"}`}>Dark</button>
              <button onClick={() => theme !== "light" && toggleTheme()} className={`rounded-xl border px-3 py-1.5 text-xs ${theme === "light" ? "bg-ai-gradient text-white border-transparent" : "border-border bg-surface"}`}>Light</button>
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

        <Card icon={Brain} title="AI personalization">
          <Toggle label="Personalize ranking using my history" defaultChecked />
          <Toggle label="Boost vendors I previously favored" defaultChecked />
          <Toggle label="Enable contextual query expansion" />
          <Toggle label="Use voice-based semantic queries" />
        </Card>

        <Card icon={Bell} title="Notifications">
          <Toggle label="Weekly trend digest" defaultChecked />
          <Toggle label="Price drops on favorited items" defaultChecked />
          <Toggle label="New vendor sources added" />
        </Card>

        <Card icon={Shield} title="Account">
          <Row label="2-factor auth"><Toggle label="" /></Row>
          <button className="mt-2 rounded-xl border border-destructive/40 text-destructive px-3 py-2 text-xs hover:bg-destructive/10">Delete account</button>
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
  return <input {...props} className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ai-indigo/40" />;
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-5 w-9 appearance-none rounded-full bg-white/10 checked:bg-ai-purple relative cursor-pointer transition before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4" />
    </label>
  );
}
