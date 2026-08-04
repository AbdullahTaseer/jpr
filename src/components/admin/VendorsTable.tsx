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
const IcoTrash = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function VendorsTable() {
  const [tab, setTab] = useState<Tab>("ALL");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null); // vendor id being acted on
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
