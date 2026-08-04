import InquiriesTable from "@/components/admin/InquiriesTable";
export default function InquiriesPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div><h1 className="text-white text-2xl font-bold">Inquiries</h1><p className="text-[#6b7280] text-sm mt-1">Contact form submissions from customers and vendors</p></div>
      <InquiriesTable />
    </div>
  );
}
