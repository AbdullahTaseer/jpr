"use client";

import { useState, useEffect } from "react";
import ImageUploadField from "@/components/dashboard/ImageUploadField";
import RichTextEditor from "@/components/dashboard/RichTextEditor";

type Member = { id: string; name: string; designation: string | null; imageUrl: string | null };

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
      {message}
    </div>
  );
}

const TABS = ["About", "Members", "Policies", "Images"] as const;
type Tab = typeof TABS[number];

const inp   = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";
const label = "text-[#9ca3af] text-xs font-semibold uppercase tracking-wide mb-1.5 block";

export default function ShopProfilePage() {
  const [tab, setTab]         = useState<Tab>("About");
  const [toast, setToast]     = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving]   = useState(false);

  // About
  const [aboutTitle, setAboutTitle]               = useState("");
  const [aboutDescription, setAboutDescription]   = useState("");
  const [aboutCategory, setAboutCategory]         = useState("");
  const [aboutSince, setAboutSince]               = useState("");

  // Images
  const [profileImage, setProfileImage] = useState("");
  const [bannerImage, setBannerImage]   = useState("");

  // Policies
  const [shopPolicies, setShopPolicies] = useState("");

  // Members
  const [members, setMembers]       = useState<Member[]>([]);
  const [memberName, setMemberName] = useState("");
  const [memberDes, setMemberDes]   = useState("");
  const [memberImg, setMemberImg]   = useState("");
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [memberModal, setMemberModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  useEffect(() => {
    fetch("/api/vendor/about")
      .then(r => r.json())
      .then(d => {
        const a = d.about ?? {};
        setAboutTitle(a.aboutTitle ?? "");
        setAboutDescription(a.aboutDescription ?? "");
        setAboutCategory(a.aboutCategory ?? "");
        setAboutSince(a.aboutSince ? new Date(a.aboutSince).toISOString().split("T")[0] : "");
        setProfileImage(a.profileImage ?? "");
        setBannerImage(a.bannerImage ?? "");
      })
      .catch(() => {});

    fetch("/api/vendor/members")
      .then(r => r.json())
      .then(d => setMembers(d.members ?? []))
      .catch(() => {});

    fetch("/api/vendor/about")
      .then(r => r.json())
      .then(d => setShopPolicies(d.about?.shopPolicies ?? ""))
      .catch(() => {});
  }, []);

  const saveAbout = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/about", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutTitle, aboutDescription, aboutCategory, aboutSince: aboutSince || null }),
      });
      if (!res.ok) throw new Error("Failed");
      showToast("About saved", "success");
    } catch { showToast("Failed to save", "error"); }
    setSaving(false);
  };

  const saveImages = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/about", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage, bannerImage }),
      });
      if (!res.ok) throw new Error("Failed");
      showToast("Images saved", "success");
    } catch { showToast("Failed to save", "error"); }
    setSaving(false);
  };

  const savePolicies = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/policies", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopPolicies }),
      });
      if (!res.ok) throw new Error("Failed");
      showToast("Policies saved", "success");
    } catch { showToast("Failed to save", "error"); }
    setSaving(false);
  };

  const openAdd = () => { setEditMember(null); setMemberName(""); setMemberDes(""); setMemberImg(""); setMemberModal(true); };
  const openEdit = (m: Member) => { setEditMember(m); setMemberName(m.name); setMemberDes(m.designation ?? ""); setMemberImg(m.imageUrl ?? ""); setMemberModal(true); };

  const saveMember = async () => {
    if (!memberName.trim()) return;
    setSaving(true);
    try {
      if (editMember) {
        const res = await fetch(`/api/vendor/members/${editMember.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: memberName, designation: memberDes, imageUrl: memberImg }),
        });
        const d = await res.json();
        setMembers(prev => prev.map(m => m.id === editMember.id ? d.member : m));
      } else {
        const res = await fetch("/api/vendor/members", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: memberName, designation: memberDes, imageUrl: memberImg }),
        });
        const d = await res.json();
        setMembers(prev => [...prev, d.member]);
      }
      setMemberModal(false);
      showToast(editMember ? "Member updated" : "Member added", "success");
    } catch { showToast("Failed to save member", "error"); }
    setSaving(false);
  };

  const deleteMember = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/vendor/members/${id}`, { method: "DELETE" });
      setMembers(prev => prev.filter(m => m.id !== id));
      showToast("Member removed", "success");
    } catch { showToast("Failed to delete", "error"); }
    setDeletingId(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 w-full">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-white text-2xl font-bold">Shop Profile</h1>
        <p className="text-[#6b7280] text-sm mt-1">Customize your public vendor page</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-white/10">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-colors -mb-px border-b-2
              ${tab === t ? "text-[#1B6FEB] border-[#1B6FEB]" : "text-[#6b7280] border-transparent hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── About tab ── */}
      {tab === "About" && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-5 max-w-2xl">
          <div>
            <label className={label}>Shop Tagline</label>
            <input value={aboutTitle} onChange={e => setAboutTitle(e.target.value)} placeholder="e.g. Handcrafted goods from Utah" className={inp} />
          </div>
          <div>
            <label className={label}>About Description</label>
            <textarea value={aboutDescription} onChange={e => setAboutDescription(e.target.value)} rows={5}
              placeholder="Tell customers about your shop, your story, and what makes you unique…"
              className={`${inp} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Category</label>
              <input value={aboutCategory} onChange={e => setAboutCategory(e.target.value)} placeholder="e.g. Fashion, Home Décor" className={inp} />
            </div>
            <div>
              <label className={label}>In Business Since</label>
              <input type="date" value={aboutSince} onChange={e => setAboutSince(e.target.value)} className={inp} />
            </div>
          </div>
          <button onClick={saveAbout} disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-bold hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
            {saving ? "Saving…" : "Save About"}
          </button>
        </div>
      )}

      {/* ── Members tab ── */}
      {tab === "Members" && (
        <div className="space-y-4 max-w-2xl">
          <button onClick={openAdd}
            className="px-5 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-bold hover:bg-[#1557D0] transition-colors">
            + Add Member
          </button>

          {members.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 text-center text-[#6b7280] text-sm">
              No team members yet. Add your first one.
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
              {members.map((m, i) => (
                <div key={m.id} className={`flex items-center gap-4 px-5 py-4 ${i !== 0 ? "border-t border-white/5" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-[#1B3A8A] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {m.imageUrl
                      ? <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                      : <span className="text-white text-xs font-black">{m.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{m.name}</p>
                    {m.designation && <p className="text-[#6b7280] text-xs">{m.designation}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors text-xs">Edit</button>
                    <button onClick={() => deleteMember(m.id)} disabled={deletingId === m.id}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs disabled:opacity-50">
                      {deletingId === m.id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Policies tab ── */}
      {tab === "Policies" && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-5 max-w-4xl">
          <div>
            <label className={label}>Shop Policies</label>
            <RichTextEditor
              value={shopPolicies}
              onChange={setShopPolicies}
              placeholder="Write your shop policies here — returns, shipping, privacy, etc."
              minHeight={380}
            />
          </div>
          <button onClick={savePolicies} disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-bold hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
            {saving ? "Saving…" : "Save Policies"}
          </button>
        </div>
      )}

      {/* ── Images tab ── */}
      {tab === "Images" && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-6 max-w-2xl">
          <ImageUploadField label="Profile Image (square, shown as avatar)" value={profileImage} onChange={setProfileImage} placeholder="https://…" />
          <ImageUploadField label="Banner Image (wide, shown as shop header)" value={bannerImage} onChange={setBannerImage} placeholder="https://…" />
          <button onClick={saveImages} disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-bold hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
            {saving ? "Saving…" : "Save Images"}
          </button>
        </div>
      )}

      {/* ── Member modal ── */}
      {memberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-semibold text-lg">{editMember ? "Edit Member" : "Add Member"}</h3>
            <div>
              <label className={label}>Name</label>
              <input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="John Smith" className={inp} />
            </div>
            <div>
              <label className={label}>Designation</label>
              <input value={memberDes} onChange={e => setMemberDes(e.target.value)} placeholder="Founder, Designer…" className={inp} />
            </div>
            <ImageUploadField label="Photo" value={memberImg} onChange={setMemberImg} placeholder="https://…" />
            <div className="flex gap-3 pt-1">
              <button onClick={() => setMemberModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">
                Cancel
              </button>
              <button onClick={saveMember} disabled={saving || !memberName.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-bold hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : editMember ? "Save Changes" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
