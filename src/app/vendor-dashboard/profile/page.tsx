import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function ProfilePage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 w-full">
      <div>
        <h1 className="text-white text-2xl font-bold">Profile Settings</h1>
        <p className="text-[#6b7280] text-sm mt-1">Manage your vendor account and shop details</p>
      </div>
      <ProfileSettings />
    </div>
  );
}
