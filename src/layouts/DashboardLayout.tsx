import type { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";

export function DashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-w-0">
          <TopNav title={title} />
          <main className="px-4 lg:px-8 py-6 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
