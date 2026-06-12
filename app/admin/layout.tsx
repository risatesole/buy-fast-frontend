import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // Preline requires HSStaticMethods.autoInit() — done inside AppSidebar via useEffect
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* ── Sidebar (fixed, 64 = w-64) ── */}
      <AppSidebar />

      {/* ── Main column — offset on desktop to clear the sidebar ── */}
      <div className="lg:ps-64">
        {/* ── Sticky top bar ── */}
        <AdminTopbar />

        {/* ── Page content ── */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
