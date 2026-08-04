"use client";

import { useState, useEffect } from "react";

type FAQ = { id: string; question: string; answer: string; order: number };

const IcoEdit  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IcoTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
const IcoPlus  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>;
const IcoChev  = () => <svg className="w-4 h-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>;

function Toast({ message, type, onClose }: { message: string; type: "success"|"error"; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
            {message}
        </div>
    );
}

export default function FAQManager() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [editTarget, setEditTarget] = useState<FAQ | null>(null);
    const [addMode, setAddMode] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success"|"error" } | null>(null);
    const [q, setQ] = useState("");
    const [a, setA] = useState("");

    const showToast = (message: string, type: "success"|"error") => setToast({ message, type });

    const load = () => {
        setLoading(true);
        fetch("/api/admin/faqs")
            .then(r => r.json())
            .then(d => setFaqs(d.faqs ?? []))
            .catch(() => showToast("Failed to load FAQs", "error"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openEdit = (faq: FAQ) => { setQ(faq.question); setA(faq.answer); setEditTarget(faq); setAddMode(false); };
    const openAdd  = () => { setQ(""); setA(""); setAddMode(true); setEditTarget(null); };
    const closeForm = () => { setEditTarget(null); setAddMode(false); };

    const save = async () => {
        if (!q.trim() || !a.trim()) return;
        setSaving(true);
        try {
            let res: Response;
            if (addMode) {
                res = await fetch("/api/admin/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, answer: a }) });
            } else {
                res = await fetch(`/api/admin/faqs/${editTarget!.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, answer: a }) });
            }
            if (!res.ok) throw new Error("Failed");
            showToast(addMode ? "FAQ added" : "FAQ updated", "success");
            load(); closeForm();
        } catch {
            showToast("Failed to save FAQ", "error");
        } finally {
            setSaving(false);
        }
    };

    const doDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await fetch(`/api/admin/faqs/${deleteId}`, { method: "DELETE" });
            setFaqs(f => f.filter(x => x.id !== deleteId));
            showToast("FAQ deleted", "success");
        } catch {
            showToast("Failed to delete FAQ", "error");
        }
        setDeleting(false);
        setDeleteId(null);
    };

    const inp = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white font-semibold">FAQ Items</h3>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-[#1B6FEB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1557D0] transition-colors">
                        <IcoPlus /> Add FAQ
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="px-5 py-12 text-center text-[#6b7280] text-sm">No FAQs yet. Add your first one.</div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {faqs.map((faq, i) => (
                            <div key={faq.id}>
                                <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
                                    onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}>
                                    <span className="text-[#6b7280] text-xs font-mono w-5 shrink-0">{i + 1}</span>
                                    <p className="flex-1 text-white text-sm font-medium">{faq.question}</p>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={e => { e.stopPropagation(); openEdit(faq); }} className="p-1.5 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors"><IcoEdit /></button>
                                        <button onClick={e => { e.stopPropagation(); setDeleteId(faq.id); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><IcoTrash /></button>
                                        <span className={`text-[#6b7280] transition-transform duration-200 ${expanded === faq.id ? "rotate-180" : ""}`}><IcoChev /></span>
                                    </div>
                                </div>
                                {expanded === faq.id && (
                                    <div className="px-5 pb-4 ml-8 text-[#9ca3af] text-sm leading-relaxed">{faq.answer}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {(addMode || editTarget) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4">
                        <h3 className="text-white font-semibold text-lg">{addMode ? "Add FAQ" : "Edit FAQ"}</h3>
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Question *" className={inp} />
                        <textarea value={a} onChange={e => setA(e.target.value)} placeholder="Answer *" rows={4} className={inp + " resize-none"} />
                        <div className="flex gap-3 pt-1">
                            <button onClick={closeForm} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">Cancel</button>
                            <button onClick={save} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-semibold hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
                                {saving ? "Saving..." : addMode ? "Add" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-white font-semibold text-lg mb-2">Delete FAQ</h3>
                        <p className="text-[#9ca3af] text-sm mb-6">This FAQ item will be permanently removed.</p>
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
