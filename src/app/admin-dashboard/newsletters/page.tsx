import NewslettersTable from "@/components/admin/NewslettersTable";
export default function NewslettersPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div><h1 className="text-white text-2xl font-bold">Newsletters</h1><p className="text-[#6b7280] text-sm mt-1">Manage newsletter subscribers and export lists</p></div>
      <NewslettersTable />
    </div>
  );
}
