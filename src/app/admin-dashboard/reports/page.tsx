import ReportsPanel from "@/components/admin/ReportsPanel";
export default function ReportsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div><h1 className="text-white text-2xl font-bold">Reports</h1><p className="text-[#6b7280] text-sm mt-1">Platform-wide revenue, orders, and performance analytics</p></div>
      <ReportsPanel />
    </div>
  );
}
