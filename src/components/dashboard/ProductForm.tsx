"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import MultiImageUpload from "./MultiImageUpload";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#9ca3af] text-sm">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-[#1B6FEB]" : "bg-[#3a3a3a]"}`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

const IcoChev = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-white text-sm font-semibold">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors"
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full appearance-none bg-[#242424] border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6b7280]"><IcoChev /></div>
    </div>
  );
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

type CategoryOption = { id: string; name: string };
type BrandOption = { id: string; name: string };
type VendorOption = { id: string; name: string; shopName: string | null };

interface Props {
  productId?: string;
  isAdmin?: boolean;
}

export default function ProductForm({ productId, isAdmin }: Props) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("0");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [vendorId, setVendorId] = useState("");

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  useEffect(() => {
    const fetches: Promise<void>[] = [
      fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories ?? [])),
      fetch("/api/brands").then(r => r.json()).then(d => setBrands(d.brands ?? [])),
    ];
    if (isAdmin) {
      fetches.push(
        fetch("/api/admin/vendors/approved").then(r => r.json()).then(d => setVendors(d.vendors ?? []))
      );
    }
    Promise.all(fetches).catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    const url = isAdmin
      ? `/api/admin/products/${productId}`
      : `/api/vendor/products/${productId}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const p = data.product;
        if (!p) return;
        setTitle(p.title ?? "");
        setSlug(p.slug ?? "");
        setShortDesc(p.shortDesc ?? "");
        setDescription(p.description ?? "");
        setPrice(p.price?.toString() ?? "");
        setComparePrice(p.comparePrice?.toString() ?? "");
        setSku(p.sku ?? "");
        setStock(p.stock?.toString() ?? "0");
        setRedirectUrl(p.redirectUrl ?? "");
        setCategoryId(p.categoryId ?? "");
        setBrandId(p.brandId ?? "");
        setIsActive(p.isActive ?? true);
        setIsFeatured(p.isFeatured ?? false);
        setIsNewArrival(p.isNewArrival ?? false);
        setVendorId(p.vendorId ?? "");
        setImages(p.images ?? []);
      })
      .catch(() => showToast("Failed to load product", "error"))
      .finally(() => setLoading(false));
  }, [productId, isAdmin]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !price) {
      showToast("Title, slug, and price are required", "error");
      return;
    }
    if (isAdmin && !vendorId) {
      showToast("Please select a vendor", "error");
      return;
    }
    setSaving(true);
    const payload = {
      title,
      slug,
      shortDesc: shortDesc || null,
      description: description || null,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : null,
      sku: sku || null,
      stock: Number(stock),
      redirectUrl: redirectUrl || null,
      categoryId: categoryId || null,
      brandId: brandId || null,
      isActive,
      images,
      ...(isAdmin && { isFeatured, isNewArrival, vendorId }),
    };

    try {
      const url = isAdmin
        ? isEdit ? `/api/admin/products/${productId}` : "/api/admin/products"
        : isEdit ? `/api/vendor/products/${productId}` : "/api/vendor/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      showToast(isEdit ? "Product updated!" : "Product created!", "success");
      setTimeout(() => router.push(isAdmin ? "/admin-dashboard/products" : "/vendor-dashboard/products"), 1200);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-white font-semibold text-base">Basic Information</h2>
                <p className="text-[#6b7280] text-sm mt-0.5">Enter the basic details of your product</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="shrink-0 bg-white text-[#0a0a0a] text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Product Name" required>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter product name"
                />
              </Field>
              <Field label="Slug" required>
                <div className="space-y-1">
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="product-slug" />
                  <p className="text-[#6b7280] text-xs px-1">URL-friendly version of the name</p>
                </div>
              </Field>
            </div>

            <Field label="Redirect URL">
              <Input
                type="url"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="Product redirect URL"
              />
            </Field>

            <Field label="Short Description">
              <div className="space-y-1">
                <textarea
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value.slice(0, 500))}
                  placeholder="Brief product description (500 characters max)"
                  rows={4}
                  className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors resize-none"
                />
                <p className="text-[#6b7280] text-xs text-right px-1">{shortDesc.length}/500 characters</p>
              </div>
            </Field>

            <Field label="Full Description">
              <RichTextEditor value={description} onChange={setDescription} />
            </Field>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="text-white font-semibold text-base">Product Images</h2>
              <p className="text-[#6b7280] text-sm mt-0.5">Upload files or paste URLs. The first image is the thumbnail.</p>
            </div>
            <MultiImageUpload value={images} onChange={setImages} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="space-y-3 pt-1">
              <Toggle label="Active" checked={isActive} onChange={() => setIsActive(!isActive)} />
              {isAdmin && (
                <>
                  <Toggle label="Featured" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
                  <Toggle label="New Arrival" checked={isNewArrival} onChange={() => setIsNewArrival(!isNewArrival)} />
                </>
              )}
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 space-y-4">
            <Field label="Price" required>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#242424] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors"
                />
              </div>
            </Field>

            <Field label="Compare Price">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#242424] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors"
                />
              </div>
            </Field>

            <Field label="SKU">
              <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-001" />
            </Field>

            <Field label="Stock">
              <Input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
              />
            </Field>

            <Field label="Category">
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">No Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>

            <Field label="Brand">
              <Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                <option value="">No Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </Select>
            </Field>

            {isAdmin && (
              <Field label={isEdit ? "Vendor" : "Assign to Vendor"} required>
                <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                  <option value="">Select vendor...</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.shopName ?? v.name}</option>
                  ))}
                </Select>
              </Field>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
