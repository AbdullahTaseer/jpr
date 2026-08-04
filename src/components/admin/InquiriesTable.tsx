"use client";

import { useState, useEffect } from "react";

type InquiryStatus = "NEW" | "READ" | "REPLIED";
type Inquiry = { id: string; name: string; email: string; subject: string; message: string; status: InquiryStatus; createdAt: string };

const STATUS_STYLES: Record<InquiryStatus, string> = {
  NEW:     "bg-amber-500/15 text-amber-400",
  READ:    "bg-[#6b7280]/15 text-[#9ca3af]",
  REPLIED: "bg-emerald-500/15 text-emerald-400",
};

const STATUS_LABELS: Record<InquiryStatus, string> = { NEW: "New", READ: "Read", REPLIED: "Replied" };

const IcoEye   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>;
const IcoTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;

export default function InquiriesTable() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/inquiries")
      .then(r => r.json())
      .then(d => setItems(d.inquiries ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    setItems(i => i.map(x => x.id === id ? { ...x, status } : x));
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const openView = async (inq: Inquiry) => {
    if (inq.status === "NEW") await updateStatus(inq.id, "READ");
    setViewing({ ...inq, status: inq.status === "NEW" ? "READ" : inq.status });
    setReply("");
    setReplyError("");
  };

  const sendReply = async () => {
    if (!viewing || !reply.trim()) return;
    setReplying(true);
    setReplyError("");
    try {
      const res = await fetch(`/api/admin/inquiries/${viewing.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText: reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reply");
      setItems(i => i.map(x => x.id === viewing.id ? { ...x, status: "REPLIED" } : x));
      setViewing(null);
    } catch (e) {
      setReplyError(e instanceof Error ? e.message : "Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setItems(i => i.filter(x => x.id !== deleteId));
    } catch { /* ignore */ }
    setDeleting(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["From", "Subject", "Message", "Date", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-[#6b7280] text-sm">No inquiries yet.</td></tr>
                ) : items.map(inq => (
                  <tr key={inq.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${inq.status === "NEW" ? "bg-[#1B6FEB]/3" : ""}`}>
                    <td className="px-5 py-4">
                      <p className={`text-sm font-medium whitespace-nowrap ${inq.status === "NEW" ? "text-white" : "text-[#9ca3af]"}`}>{inq.name}</p>
                      <p className="text-[#6b7280] text-xs">{inq.email}</p>
                    </td>
                    <td className="px-5 py-4 text-white text-sm max-w-[160px]"><span className="line-clamp-1 font-medium">{inq.subject}</span></td>
                    <td className="px-5 py-4 text-[#9ca3af] text-sm max-w-[240px]"><span className="line-clamp-2">{inq.message}</span></td>
                    <td className="px-5 py-4 text-[#6b7280] text-sm whitespace-nowrap">{new Date(inq.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                    <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[inq.status]}`}>{STATUS_LABELS[inq.status]}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openView(inq)} className="p-1.5 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors"><IcoEye /></button>
                        <button onClick={() => setDeleteId(inq.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><IcoTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold text-lg">{viewing.subject}</h3>
                <p className="text-[#6b7280] text-sm mt-0.5">{viewing.name} · {viewing.email} · {new Date(viewing.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[viewing.status]}`}>{STATUS_LABELS[viewing.status]}</span>
            </div>
            <div className="bg-[#242424] rounded-xl p-4 text-[#9ca3af] text-sm leading-relaxed">{viewing.message}</div>
            <div className="space-y-2">
              <label className="text-white text-sm font-semibold">Reply</label>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors resize-none"
              />
            </div>
            {replyError && <p className="text-red-400 text-xs">{replyError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setViewing(null)} disabled={replying} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors disabled:opacity-50">Close</button>
              <button onClick={sendReply} disabled={!reply.trim() || replying} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-semibold hover:bg-[#1557D0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                {replying
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                  : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Inquiry</h3>
            <p className="text-[#9ca3af] text-sm mb-6">This inquiry will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">Cancel</button>
              <button onClick={doDelete} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
