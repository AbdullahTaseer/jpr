"use client";

import { useState, useEffect, useCallback } from "react";

type Product = {
    id: string;
    title: string;
    price: number;
    stock: number;
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    images: string[];
    vendor: { id: string; name: string; shopName: string | null };
    category: { id: string; name: string } | null;
    _count: { clicks: number };
};

const IcoEdit  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IcoTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
const IcoSearch = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
const IcoPrev  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>;
const IcoNext  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>;

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
    return (
        <button onClick={onChange} disabled={disabled}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${checked ? "bg-[#1B6FEB]" : "bg-[#3a3a3a]"}`}>
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`} />
        </button>
    );
}

function Toast({ message, ok, onClose }: { message: string; ok: boolean; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
            {message}
        </div>
    );
}

export default function AdminProductsTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [toggling, setToggling] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);

    const showToast = (message: string, ok: boolean) => setToast({ message, ok });

    const fetchProducts = useCallback(async (p = page, q = search) => {
        setLoading(true);
        try {
            const qs = new URLSearchParams({ page: String(p), ...(q ? { search: q } : {}) });
            const res = await fetch(`/api/admin/products?${qs}`);
            const data = await res.json();
            setProducts(data.products ?? []);
            setPages(data.pages ?? 1);
            setTotal(data.total ?? 0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(1, search); setPage(1); }, [search]);
    useEffect(() => { fetchProducts(page, search); }, [page]);

    const patchProduct = async (id: string, patch: Record<string, boolean>) => {
        setToggling(id);
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            if (!res.ok) throw new Error();
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
        } catch {
            showToast("Failed to update product", false);
        } finally {
            setToggling(null);
        }
    };

    const doDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setProducts(prev => prev.filter(p => p.id !== deleteId));
            setTotal(t => t - 1);
            showToast("Product deleted", true);
        } catch {
            showToast("Failed to delete product", false);
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <>
            {toast && <Toast message={toast.message} ok={toast.ok} onClose={() => setToast(null)} />}

            {/* Search */}
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]"><IcoSearch /></div>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors"
                />
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-6 h-6 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center text-[#6b7280] text-sm">No products found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    {["Image", "Name", "Vendor", "Category", "Price", "Clicks", "Active", "Featured", "New", "Actions"].map(h => (
                                        <th key={h} className="text-left px-4 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3.5">
                                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#2a2a2a] flex items-center justify-center">
                                                {p.images[0] ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-5 h-5 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/></svg>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-white text-sm font-medium max-w-[160px]"><span className="line-clamp-2">{p.title}</span></td>
                                        <td className="px-4 py-3.5 text-[#9ca3af] text-sm whitespace-nowrap">{p.vendor.shopName ?? p.vendor.name}</td>
                                        <td className="px-4 py-3.5">
                                            {p.category ? (
                                                <span className="bg-[#1B6FEB]/10 text-[#1B6FEB] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">{p.category.name}</span>
                                            ) : <span className="text-[#6b7280] text-sm">—</span>}
                                        </td>
                                        <td className="px-4 py-3.5 text-white text-sm font-semibold whitespace-nowrap">${p.price.toFixed(2)}</td>
                                        <td className="px-4 py-3.5 text-[#9ca3af] text-sm">{p._count.clicks}</td>
                                        <td className="px-4 py-3.5">
                                            <Toggle checked={p.isActive} disabled={toggling === p.id} onChange={() => patchProduct(p.id, { isActive: !p.isActive })} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Toggle checked={p.isFeatured} disabled={toggling === p.id} onChange={() => patchProduct(p.id, { isFeatured: !p.isFeatured })} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Toggle checked={p.isNewArrival} disabled={toggling === p.id} onChange={() => patchProduct(p.id, { isNewArrival: !p.isNewArrival })} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><IcoTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-[#6b7280] text-sm">{total} products total</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="p-2 rounded-lg border border-white/10 text-[#9ca3af] hover:border-white/20 disabled:opacity-40 transition-colors"><IcoPrev /></button>
                        <span className="text-white text-sm px-2">Page {page} of {pages}</span>
                        <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                            className="p-2 rounded-lg border border-white/10 text-[#9ca3af] hover:border-white/20 disabled:opacity-40 transition-colors"><IcoNext /></button>
                    </div>
                </div>
            )}

            {/* Delete modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-white font-semibold text-lg mb-2">Delete Product</h3>
                        <p className="text-[#9ca3af] text-sm mb-6">This product will be permanently removed from the platform.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">Cancel</button>
                            <button onClick={doDelete} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
