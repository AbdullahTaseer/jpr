"use client";

import { useState, useEffect } from "react";
import ImageUploadField from "./ImageUploadField";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type Category = { id: string; name: string; slug: string; imageUrl: string | null; showOnHomepage: boolean; _count: { products: number } };

const IcoEdit = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const IcoTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

type ModalState = { mode: "add" } | { mode: "edit"; cat: Category } | null;

interface Props {
  readonly?: boolean;
  vendorMode?: boolean;
  externalOpenAdd?: boolean;
  onExternalAddClose?: () => void;
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

export default function CategoryManager({ readonly, vendorMode, externalOpenAdd, onExternalAddClose }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  const fetchCategories = () => {
    const url = (!readonly && !vendorMode) ? "/api/admin/categories" : "/api/categories";
    fetch(url)
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => showToast("Failed to load categories", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setName(""); setSlug(""); setImageUrl(""); setShowOnHomepage(false); setModal({ mode: "add" }); };
  const openEdit = (cat: Category) => { setName(cat.name); setSlug(cat.slug); setImageUrl(cat.imageUrl ?? ""); setShowOnHomepage(cat.showOnHomepage); setModal({ mode: "edit", cat }); };
  const closeModal = () => setModal(null);

  useEffect(() => {
    if (externalOpenAdd && (vendorMode || !readonly)) { openAdd(); onExternalAddClose?.(); }
  }, [externalOpenAdd]);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (modal?.mode === "add") {
        const endpoint = vendorMode ? "/api/vendor/categories" : "/api/admin/categories";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, imageUrl: imageUrl || null, ...(!vendorMode && { showOnHomepage }) }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error ?? "Failed to create category");
        showToast("Category created", "success");
      } else if (modal?.mode === "edit") {
        const res = await fetch(`/api/admin/categories/${modal.cat.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug: slug || slugify(name), imageUrl: imageUrl || null, showOnHomepage }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error ?? "Failed to update category");
        showToast("Category updated", "success");
      }
      fetchCategories();
      closeModal();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      showToast("Category deleted", "success");
    } catch {
      showToast("Failed to delete category", "error");
    }
    setDeleteId(null);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Image", "Name", "Slug", "Products", ...(!readonly && !vendorMode ? ["Homepage", "Actions"] : [])].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={!readonly && !vendorMode ? 6 : 4} className="px-5 py-12 text-center text-[#6b7280] text-sm">No categories yet.</td></tr>
                ) : categories.map(cat => (
                  <tr key={cat.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2a2a2a] flex items-center justify-center">
                        {cat.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-5 h-5 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" /></svg>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white text-sm font-medium">{cat.name}</td>
                    <td className="px-5 py-4"><code className="bg-[#242424] text-[#9ca3af] text-xs px-2 py-1 rounded font-mono">{cat.slug}</code></td>
                    <td className="px-5 py-4">
                      <span className="bg-[#1B6FEB]/10 text-[#1B6FEB] text-xs font-semibold px-2.5 py-1 rounded-full">{cat._count?.products ?? 0} products</span>
                    </td>
                    {!readonly && !vendorMode && (
                      <>
                        <td className="px-5 py-4">
                          <button
                            onClick={async () => {
                              const next = !cat.showOnHomepage;
                              setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, showOnHomepage: next } : c));
                              await fetch(`/api/admin/categories/${cat.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ showOnHomepage: next }),
                              });
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${cat.showOnHomepage ? "bg-[#1B6FEB]" : "bg-[#3a3a3a]"}`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${cat.showOnHomepage ? "translate-x-4.5" : "translate-x-0.5"}`} />
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(cat)} className="p-2 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors"><IcoEdit /></button>
                            <button onClick={() => setDeleteId(cat.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><IcoTrash /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (vendorMode || !readonly) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-5">
            <h3 className="text-white font-semibold text-lg">{modal.mode === "add" ? "Add Category" : "Edit Category"}</h3>

            <ImageUploadField
              label="Category Image"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://example.com/image.jpg"
            />

            <div className="space-y-1.5">
              <label className="text-white text-sm font-semibold">Category Name <span className="text-red-400">*</span></label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)); }}
                placeholder="e.g. Women Fashion"
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white text-sm font-semibold">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="women-fashion"
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors"
              />
            </div>

            {!vendorMode && (
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white text-sm font-semibold">Show on Homepage</p>
                  <p className="text-[#6b7280] text-xs mt-0.5">Displays this category in the homepage section</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOnHomepage(v => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showOnHomepage ? "bg-[#1B6FEB]" : "bg-[#3a3a3a]"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${showOnHomepage ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            )}

            {vendorMode && (
              <p className="text-[#6b7280] text-xs bg-[#242424] rounded-xl px-4 py-3">
                New categories are hidden from public pages until an admin approves them for display.
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm font-medium hover:border-white/20 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-semibold hover:bg-[#1557D0] transition-colors disabled:opacity-50">
                {saving ? "Saving..." : modal.mode === "add" ? "Add Category" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && !readonly && !vendorMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Category</h3>
            <p className="text-[#9ca3af] text-sm mb-6">Products in this category will not be deleted but will become uncategorized.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm font-medium hover:border-white/20 transition-colors">Cancel</button>
              <button onClick={doDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
