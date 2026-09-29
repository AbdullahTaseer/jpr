import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SessionGuard from "@/components/SessionGuard";

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden">
      <SessionGuard />
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
