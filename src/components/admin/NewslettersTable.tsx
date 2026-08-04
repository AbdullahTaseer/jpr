"use client";

import { useState, useEffect } from "react";

type Sub = { id: string; email: string; name: string | null; createdAt: string };

const IcoTrash    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
const IcoDownload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;

export default function NewslettersTable() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [total, setTotal] = useState(0);
  const [newThisMonth, setNewThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/newsletters")
      .then(r => r.json())
      .then(d => { setSubs(d.subscriptions ?? []); setTotal(d.total ?? 0); setNewThisMonth(d.newThisMonth ?? 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/newsletters/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setSubs(s => s.filter(x => x.id !== deleteId));
      setTotal(t => t - 1);
    } catch { /* ignore */ }
    setDeleting(false);
    setDeleteId(null);
  };

  const exportCSV = () => {
    const csv = "Email,Name,Date Subscribed\n" + subs.map(s => `${s.email},${s.name ?? ""},${new Date(s.createdAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Subscribers", value: total.toString() },
          { label: "New This Month",    value: newThisMonth.toString() },
        ].map(s => (
          <div key={s.label} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
            <p className="text-[#6b7280] text-xs font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-white text-2xl font-bold">{loading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <h3 className="text-white font-semibold">Subscribers</h3>
          <button onClick={exportCSV} disabled={subs.length === 0} className="flex items-center gap-2 bg-[#1B6FEB]/15 text-[#1B6FEB] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1B6FEB]/25 disabled:opacity-40 transition-colors">
            <IcoDownload /> Export CSV
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Email", "Name", "Date Subscribed", "Action"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-[#6b7280] text-sm">No subscribers yet.</td></tr>
                ) : subs.map(s => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5 text-[#1B6FEB] text-sm">{s.email}</td>
                    <td className="px-5 py-3.5 text-white text-sm font-medium">{s.name ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[#6b7280] text-sm">{new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><IcoTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Remove Subscriber</h3>
            <p className="text-[#9ca3af] text-sm mb-6">This subscriber will be permanently removed from the mailing list.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">Cancel</button>
              <button onClick={doDelete} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
