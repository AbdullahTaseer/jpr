import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
export default function SiteSettingsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div><h1 className="text-white text-2xl font-bold">Site Setting</h1><p className="text-[#6b7280] text-sm mt-1">Global platform configuration and branding</p></div>
      <SiteSettingsForm />
    </div>
  );
}
