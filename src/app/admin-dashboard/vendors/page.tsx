import VendorsTable from "@/components/admin/VendorsTable";

export default function AdminVendorsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div><h1 className="text-white text-2xl font-bold">Vendors</h1><p className="text-[#6b7280] text-sm mt-1">Manage all vendor accounts and their status</p></div>
      <VendorsTable />
    </div>
  );
}
