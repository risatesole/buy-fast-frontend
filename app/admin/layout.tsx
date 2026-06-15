import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AppSidebar />
      <div className="lg:pl-56">
        <AdminTopbar />
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
