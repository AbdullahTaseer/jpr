"use client";

import { useState, useEffect } from "react";

const IcoEye = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const IcoEyeOff = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-white text-sm font-semibold">{label}</label>
      {children}
      {hint && <p className="text-[#6b7280] text-xs">{hint}</p>}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors disabled:opacity-50"
    />
  );
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
      {message}
    </div>
  );
}

export default function ProfileSettings() {
  // Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopSlug, setShopSlug] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  useEffect(() => {
    fetch("/api/vendor/profile")
      .then((r) => r.json())
      .then((data) => {
        const p = data.profile;
        if (!p) return;
        setName(p.name ?? "");
        setEmail(p.email ?? "");
        setPhone(p.phone ?? "");
        setCompanyName(p.companyName ?? "");
        setShopName(p.shopName ?? "");
        setShopSlug(p.shopSlug ?? "");
      })
      .catch(() => showToast("Failed to load profile", "error"))
      .finally(() => setProfileLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, companyName }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      showToast("Profile updated!", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/vendor/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      showToast("Password updated!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-white font-semibold text-base">Shop Profile</h2>
          <p className="text-[#6b7280] text-sm mt-0.5">Update your public shop information</p>
        </div>

        {profileLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-7 h-7 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </Field>
              <Field label="Email Address">
                <Input type="email" value={email} disabled placeholder="you@example.com" />
              </Field>
              <Field label="Phone Number">
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
              </Field>
              <Field label="Company Name">
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company name" />
              </Field>
              <Field label="Shop Name">
                <Input value={shopName} disabled placeholder="Your shop name" />
              </Field>
              <Field label="Shop Slug">
                <Input value={shopSlug} disabled placeholder="your-shop" />
              </Field>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="bg-[#1B6FEB] text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors disabled:opacity-50"
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-white font-semibold text-base">Change Password</h2>
          <p className="text-[#6b7280] text-sm mt-0.5">Use a strong password with at least 8 characters</p>
        </div>
        <div className="space-y-4">
          <Field label="Current Password">
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors">
                {showCurrent ? <IcoEyeOff /> : <IcoEye />}
              </button>
            </div>
          </Field>
          <Field label="New Password">
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors">
                {showNew ? <IcoEyeOff /> : <IcoEye />}
              </button>
            </div>
          </Field>
          <Field label="Confirm New Password">
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors">
                {showConfirm ? <IcoEyeOff /> : <IcoEye />}
              </button>
            </div>
          </Field>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpdatePassword}
            disabled={passwordSaving}
            className="bg-[#1B6FEB] text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-red-900/30 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-white font-semibold text-base">Danger Zone</h2>
          <p className="text-[#6b7280] text-sm mt-0.5">These actions are irreversible. Proceed with caution.</p>
        </div>
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-red-900/30 bg-red-950/20">
          <div>
            <p className="text-white text-sm font-semibold">Delete Account</p>
            <p className="text-[#9ca3af] text-sm mt-0.5">Permanently delete your vendor account and all associated data.</p>
          </div>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="shrink-0 bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-5">
            <div className="w-12 h-12 rounded-xl bg-red-600/15 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-white font-semibold text-lg">Delete your account?</h3>
              <p className="text-[#9ca3af] text-sm mt-2">This will permanently delete all your products, orders, and shop data. This action cannot be undone.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[#9ca3af] text-sm">Type <span className="text-white font-mono font-semibold">DELETE</span> to confirm</label>
              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-red-600/60 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm font-medium hover:border-white/20 transition-colors">
                Cancel
              </button>
              <button
                disabled={deleteInput !== "DELETE"}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
