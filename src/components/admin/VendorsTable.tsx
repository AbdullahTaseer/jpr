"use client";

import { useEffect, useState, useCallback } from "react";

type VendorStatus = "PENDING" | "APPROVED" | "REJECTED";
type Vendor = {
  id: string; name: string; username: string | null; email: string;
  phone: string | null; companyName: string | null; shopName: string | null;
  shopSlug: string | null; vendorStatus: VendorStatus | null;
  isActive: boolean; createdAt: string;
};

type Tab = "ALL" | VendorStatus;
const TABS: { key: Tab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING:  "bg-amber-500/15 text-amber-400",
  APPROVED: "bg-emerald-500/15 text-emerald-400",
  REJECTED: "bg-red-500/15 text-red-400",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected",
};

const IcoCheck = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const IcoX     = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IcoBan   = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M4.93 4.93l14.14 14.14"/></svg>;
const IcoKey   = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>;
const IcoTrash = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function generatePassword() {
  // No ambiguous characters (0/O, 1/l/I) so it's easy to read out to the vendor
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint32Array(14));
  return Array.from(bytes, b => chars[b % chars.length]).join("");
}

function ResetPasswordModal({ vendor, onClose, onDone }: {
  vendor: Vendor;
  onClose: () => void;
  onDone: (msg: string, ok: boolean) => void;
}) {
  const [mode, setMode] = useState<"email" | "set">("email");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (mode === "set" && password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/vendors/${vendor.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "email" ? { mode } : { mode, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Failed to reset password"); return; }
      onDone(mode === "email" ? `Reset link sent to ${vendor.email}.` : "Password updated. Share it with the vendor securely.", true);
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  }

  const option = (key: "email" | "set", title: string, desc: string) => (
    <button type="button" onClick={() => { setMode(key); setError(""); }}
      className={`w-full text-left p-3.5 rounded-xl border transition-colors ${mode === key ? "border-[#1B6FEB] bg-[#1B6FEB]/10" : "border-white/10 hover:border-white/20"}`}>
      <div className="flex items-center gap-2.5">
        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${mode === key ? "border-[#1B6FEB]" : "border-white/25"}`}>
          {mode === key && <span className="w-2 h-2 rounded-full bg-[#1B6FEB]" />}
        </span>
        <span className="text-white text-sm font-medium">{title}</span>
      </div>
      <p className="text-[#6b7280] text-xs mt-1 ml-[26px]">{desc}</p>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-white font-semibold text-lg">Reset Password</h3>
        <p className="text-[#9ca3af] text-sm mt-1 mb-5">
          {vendor.name} · <span className="text-[#6b7280]">{vendor.email}</span>
        </p>

        <div className="space-y-2.5 mb-5">
          {option("email", "Email a reset link", "The vendor gets a secure link, valid for 1 hour, to choose their own password.")}
          {option("set", "Set a new password", "Set it yourself and share it with the vendor. Their old password stops working immediately.")}
        </div>

        {mode === "set" && (
          <div className="mb-5">
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-2">New password</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full bg-[#111] border border-white/10 rounded-xl pl-3.5 pr-16 py-2.5 text-white text-sm font-mono placeholder-[#4b5563] placeholder:font-sans focus:outline-none focus:border-[#1B6FEB]/60 transition-colors"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button type="button" onClick={() => setShow(v => !v)} className="text-[#6b7280] hover:text-white text-xs px-1.5 py-1 transition-colors">
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => { setPassword(generatePassword()); setShow(true); }}
                className="px-3 rounded-xl border border-white/10 text-[#9ca3af] text-xs font-medium hover:border-white/20 hover:text-white transition-colors whitespace-nowrap">
                Generate
              </button>
              <button type="button" onClick={copy} disabled={!password}
                className="px-3 rounded-xl border border-white/10 text-[#9ca3af] text-xs font-medium hover:border-white/20 hover:text-white transition-colors disabled:opacity-40 whitespace-nowrap">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">
            Cancel
          </button>
          <button onClick={submit} disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-semibold hover:bg-[#1557D0] transition-colors disabled:opacity-50">
            {saving ? (mode === "email" ? "Sending..." : "Saving...") : (mode === "email" ? "Send reset link" : "Set password")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendorsTable() {
  const [tab, setTab] = useState<Tab>("ALL");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null); // vendor id being acted on
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [resetVendor, setResetVendor] = useState<Vendor | null>(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const qs = tab !== "ALL" ? `?status=${tab}` : "";
      const res = await fetch(`/api/admin/vendors${qs}`);
      const data = await res.json();
      setVendors(data.vendors ?? []);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function act(id: string, action: "approve" | "reject" | "suspend") {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Action failed", false); return; }

      const label = action === "approve" ? "approved" : action === "reject" ? "rejected" : "suspended";
      showToast(`Vendor ${label} successfully${action === "approve" ? " — email sent" : action === "reject" ? " — email sent" : ""}.`, true);
      fetchVendors();
    } catch {
      showToast("Something went wrong", false);
    } finally {
      setActing(null);
    }
  }

  const counts = {
    ALL: vendors.length,
    PENDING:  vendors.filter(v => v.vendorStatus === "PENDING").length,
    APPROVED: vendors.filter(v => v.vendorStatus === "APPROVED").length,
    REJECTED: vendors.filter(v => v.vendorStatus === "REJECTED").length,
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all
          ${toast.ok ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
          {toast.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#111] rounded-xl w-fit border border-white/10 mb-4">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
              ${tab === t.key ? "bg-[#1B6FEB] text-white" : "text-[#6b7280] hover:text-white"}`}>
            {t.label}
            {t.key !== "ALL" && counts[t.key] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                ${t.key === "PENDING" ? "bg-amber-500/20 text-amber-400" :
                  t.key === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin w-6 h-6 text-[#1B6FEB]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#6b7280]">
            <svg className="w-10 h-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p className="text-sm">No {tab !== "ALL" ? STATUS_LABEL[tab].toLowerCase() : ""} vendors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Vendor", "Contact", "Shop", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    {/* Vendor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1B6FEB]/20 flex items-center justify-center text-[#1B6FEB] text-xs font-bold shrink-0">
                          {initials(v.name)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium whitespace-nowrap">{v.name}</p>
                          {v.companyName && <p className="text-[#6b7280] text-xs">{v.companyName}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-5 py-4">
                      <p className="text-[#9ca3af] text-sm">{v.email}</p>
                      {v.phone && <p className="text-[#6b7280] text-xs">{v.phone}</p>}
                    </td>
                    {/* Shop */}
                    <td className="px-5 py-4">
                      {v.shopName ? (
                        <div>
                          <p className="text-white text-sm">{v.shopName}</p>
                          {v.shopSlug && <p className="text-[#6b7280] text-xs">/store/{v.shopSlug}</p>}
                        </div>
                      ) : <span className="text-[#6b7280] text-sm">—</span>}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[v.vendorStatus ?? "PENDING"]}`}>
                        {STATUS_LABEL[v.vendorStatus ?? "PENDING"]}
                      </span>
                      {!v.isActive && v.vendorStatus === "APPROVED" && (
                        <span className="ml-2 text-xs text-red-400">Suspended</span>
                      )}
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-4 text-[#6b7280] text-sm whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {v.vendorStatus === "PENDING" && (
                          <>
                            <button
                              onClick={() => act(v.id, "approve")}
                              disabled={acting === v.id}
                              title="Approve"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-medium disabled:opacity-50">
                              <IcoCheck /> Approve
                            </button>
                            <button
                              onClick={() => act(v.id, "reject")}
                              disabled={acting === v.id}
                              title="Reject"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium disabled:opacity-50">
                              <IcoX /> Reject
                            </button>
                          </>
                        )}
                        {v.vendorStatus === "APPROVED" && v.isActive && (
                          <button
                            onClick={() => act(v.id, "suspend")}
                            disabled={acting === v.id}
                            title="Suspend"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors text-xs font-medium disabled:opacity-50">
                            <IcoBan /> Suspend
                          </button>
                        )}
                        <button
                          onClick={() => setResetVendor(v)}
                          title="Reset password"
                          className="p-1.5 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors">
                          <IcoKey />
                        </button>
                        <button
                          onClick={() => setDeleteId(v.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          <IcoTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {resetVendor && (
        <ResetPasswordModal vendor={resetVendor} onClose={() => setResetVendor(null)} onDone={showToast} />
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Remove Vendor</h3>
            <p className="text-[#9ca3af] text-sm mb-6">This vendor account will be permanently removed from the platform.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={async () => {
                  if (!deleteId) return;
                  setDeleting(true);
                  try {
                    const res = await fetch(`/api/admin/vendors/${deleteId}`, { method: "DELETE" });
                    if (!res.ok) throw new Error();
                    showToast("Vendor removed successfully.", true);
                    fetchVendors();
                  } catch {
                    showToast("Failed to remove vendor.", false);
                  } finally {
                    setDeleting(false);
                    setDeleteId(null);
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
