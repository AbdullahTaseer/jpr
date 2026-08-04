"use client";

import { useState, useEffect } from "react";
import ImageUploadField from "@/components/dashboard/ImageUploadField";

type Slide = { id: string; imageUrl: string | null; isActive: boolean; order: number };

const IcoEdit   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IcoTrash  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button onClick={onChange} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-[#1B6FEB]" : "bg-[#3a3a3a]"}`}><span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`}/></button>;
}

interface Props { externalOpenAdd?: boolean; onExternalAddClose?: () => void; }

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
      {message}
    </div>
  );
}

export default function SlidersManager({ externalOpenAdd, onExternalAddClose }: Props) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Slide | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [imageUrl, setImageUrl] = useState("");

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  const load = () => {
    setLoading(true);
    fetch("/api/admin/sliders")
      .then(r => r.json())
      .then(d => setSlides(d.sliders ?? []))
      .catch(() => showToast("Failed to load sliders", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const open = (s?: Slide) => {
    setImageUrl(s?.imageUrl ?? "");
    setEditTarget(s ?? null); setModalOpen(true);
  };
  const close = () => setModalOpen(false);

  useEffect(() => { if (externalOpenAdd) { open(); onExternalAddClose?.(); } }, [externalOpenAdd]);

  const save = async () => {
    if (!imageUrl) return;
    setSaving(true);
    try {
      const body = { imageUrl };
      let res: Response;
      if (editTarget) {
        res = await fetch(`/api/admin/sliders/${editTarget.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        res = await fetch("/api/admin/sliders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to save");
      showToast(editTarget ? "Slide updated" : "Slide added", "success");
      load(); close();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (s: Slide) => {
    const next = !s.isActive;
    setSlides(prev => prev.map(x => x.id === s.id ? { ...x, isActive: next } : x));
    await fetch(`/api/admin/sliders/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: next }),
    });
  };

  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/sliders/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setSlides(s => s.filter(x => x.id !== deleteId));
      showToast("Slide deleted", "success");
    } catch {
      showToast("Failed to delete slide", "error");
    }
    setDeleting(false);
    setDeleteId(null);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
                  {["#", "Image", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slides.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-[#6b7280] text-sm">No slides yet. Add your first image above.</td></tr>
                ) : slides.map((s, i) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 text-[#6b7280] text-sm font-mono">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="w-32 h-18 rounded-lg overflow-hidden bg-[#2a2a2a] flex items-center justify-center" style={{ height: "4.5rem" }}>
                        {s.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.imageUrl} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-5 h-5 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/></svg>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4"><Toggle checked={s.isActive} onChange={() => toggleStatus(s)} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => open(s)} className="p-1.5 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors"><IcoEdit /></button>
                        <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><IcoTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-white font-semibold text-lg">{editTarget ? "Change Slide Image" : "Add Slide Image"}</h3>

            <ImageUploadField
              label="Hero Image (recommended: landscape, high resolution)"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://example.com/slide.jpg"
            />

            <div className="flex gap-3 pt-1">
              <button onClick={close} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !imageUrl} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-semibold hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : editTarget ? "Save Changes" : "Add Slide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Slide</h3>
            <p className="text-[#9ca3af] text-sm mb-6">This slide will be permanently removed from the homepage carousel.</p>
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
