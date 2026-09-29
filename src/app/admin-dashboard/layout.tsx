"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import SessionGuard from "@/components/SessionGuard";
import { AdminThemeProvider, useAdminTheme } from "@/context/AdminThemeContext";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { theme } = useAdminTheme();
  return (
    <div
      data-admin-theme={theme}
      className={`admin-shell flex fixed inset-0 overflow-hidden ${
        theme === "dark" ? "bg-[#0a0a0a] text-white" : "bg-[#f4f6f9] text-gray-900"
      }`}
    >
      <SessionGuard />
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
    </div>
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminShell>{children}</AdminShell>
    </AdminThemeProvider>
  );
}
