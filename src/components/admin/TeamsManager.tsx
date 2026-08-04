"use client";

import { useState, useEffect } from "react";
import ImageUploadField from "@/components/dashboard/ImageUploadField";

type Member = { id: string; name: string; role: string; email: string | null; bio: string | null; imageUrl: string | null; order: number };

const IcoEdit  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IcoTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;

interface Props { externalOpenAdd?: boolean; onExternalAddClose?: () => void; }

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
      {message}
    </div>
  );
}

export default function TeamsManager({ externalOpenAdd, onExternalAddClose }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Member | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [name, setName]       = useState("");
  const [role, setRole]       = useState("");
  const [email, setEmail]     = useState("");
  const [bio, setBio]         = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  const load = () => {
    setLoading(true);
    fetch("/api/admin/teams")
      .then(r => r.json())
      .then(d => setMembers(d.members ?? []))
      .catch(() => showToast("Failed to load team members", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const open = (m?: Member) => {
    setName(m?.name ?? ""); setRole(m?.role ?? ""); setEmail(m?.email ?? ""); setBio(m?.bio ?? ""); setImageUrl(m?.imageUrl ?? "");
    setEditTarget(m ?? null); setModalOpen(true);
  };
  const close = () => setModalOpen(false);

  useEffect(() => { if (externalOpenAdd) { open(); onExternalAddClose?.(); } }, [externalOpenAdd]);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const body = { name, role, email: email || null, bio: bio || null, imageUrl: imageUrl || null };
      let res: Response;
      if (editTarget) {
        res = await fetch(`/api/admin/teams/${editTarget.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        res = await fetch("/api/admin/teams", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to save");
      showToast(editTarget ? "Member updated" : "Member added", "success");
      load(); close();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/teams/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setMembers(m => m.filter(x => x.id !== deleteId));
      showToast("Member removed", "success");
    } catch {
      showToast("Failed to remove member", "error");
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
                  {["Member", "Role", "Email", "Bio", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-[#6b7280] text-sm">No team members yet.</td></tr>
                ) : members.map(m => (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a2a2a] shrink-0 flex items-center justify-center">
                          {m.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[#6b7280] text-sm font-bold">{m.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="text-white text-sm font-medium whitespace-nowrap">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="bg-[#1B6FEB]/10 text-[#1B6FEB] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">{m.role}</span></td>
                    <td className="px-5 py-4 text-[#9ca3af] text-sm">{m.email ?? "—"}</td>
                    <td className="px-5 py-4 text-[#9ca3af] text-sm max-w-[240px]"><span className="line-clamp-2">{m.bio ?? "—"}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => open(m)} className="p-1.5 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors"><IcoEdit /></button>
                        <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><IcoTrash /></button>
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
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-semibold text-lg">{editTarget ? "Edit Member" : "Add Team Member"}</h3>

            <ImageUploadField label="Photo" value={imageUrl} onChange={setImageUrl} placeholder="https://example.com/photo.jpg" />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-white text-sm font-semibold">Full Name <span className="text-red-400">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Mitchell" className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-white text-sm font-semibold">Job Title</label>
                <input value={role} onChange={e => setRole(e.target.value)} placeholder="CEO & Founder" className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white text-sm font-semibold">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@company.com" className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-white text-sm font-semibold">Short Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Brief description..." rows={2} className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors resize-none" />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={close} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-semibold hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : editTarget ? "Save Changes" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Remove Team Member</h3>
            <p className="text-[#9ca3af] text-sm mb-6">This team member will be removed from the public team page.</p>
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
