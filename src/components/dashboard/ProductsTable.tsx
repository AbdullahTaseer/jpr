"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  isActive: boolean;
  images: string[];
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  _count: { clicks: number };
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-[#1B6FEB]" : "bg-[#3a3a3a]"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`} />
    </button>
  );
}

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

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  useEffect(() => {
    fetch("/api/vendor/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => showToast("Failed to load products", "error"))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newStatus = !product.isActive;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p)));
    try {
      const res = await fetch(`/api/vendor/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      showToast("Product updated", "success");
    } catch {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !newStatus } : p)));
      showToast("Failed to update product", "error");
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/vendor/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      showToast("Product deleted", "success");
    } catch {
      showToast("Failed to delete product", "error");
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["Image", "Name", "Category", "Brand", "Price", "Clicks", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#6b7280] text-sm">No products yet. Add your first product!</td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2a2a2a] flex items-center justify-center">
                        {p.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-6 h-6 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white text-sm font-medium max-w-[200px]">
                      <span className="line-clamp-2">{p.title}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-[#1B6FEB]/10 text-[#1B6FEB] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                        {p.category?.name ?? "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#9ca3af] text-sm whitespace-nowrap">{p.brand?.name ?? "—"}</td>
                    <td className="px-5 py-4 text-white text-sm font-semibold whitespace-nowrap">${p.price.toFixed(2)}</td>
                    <td className="px-5 py-4 text-[#9ca3af] text-sm">{p._count.clicks}</td>
                    <td className="px-5 py-4">
                      <Toggle checked={p.isActive} onChange={() => toggleStatus(p.id)} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vendor-dashboard/products/${p.id}/edit`}
                          className="p-2 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors"
                        >
                          <IcoEdit />
                        </Link>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <IcoTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Product</h3>
            <p className="text-[#9ca3af] text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm font-medium hover:border-white/20 transition-colors">
                Cancel
              </button>
              <button onClick={doDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
