import FAQManager from "@/components/admin/FAQManager";
export default function ContentFAQsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div><h1 className="text-white text-2xl font-bold">FAQs</h1><p className="text-[#6b7280] text-sm mt-1">Manage frequently asked questions shown on the website</p></div>
      <FAQManager />
    </div>
  );
}
