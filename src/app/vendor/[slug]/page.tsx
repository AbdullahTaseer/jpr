"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Package, CalendarDays, Users, ShieldCheck,
  ChevronLeft, MessageSquare,
  Award, TrendingUp, Clock, FileText, Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Member  = { id: string; name: string; designation: string | null; imageUrl: string | null };
type Review  = { id: string; rating: number; comment: string; createdAt: string; user: { name: string } };
type Product = { id: string; title: string; slug: string; price: number; comparePrice: number | null; images: string[]; isNewArrival: boolean; isFeatured: boolean; category: { id: string; name: string } | null };

type Vendor = {
  id: string;
  shopName: string | null;
  shopSlug: string | null;
  profileImage: string | null;
  brandLogo: string | null;
  bannerImage: string | null;
  aboutTitle: string | null;
  aboutDescription: string | null;
  aboutCategory: string | null;
  aboutSince: string | null;
  shopPolicies: string | null;
  createdAt: string;
  avgRating: number | null;
  shopMembers: Member[];
  vendorReviews: Review[];
  _count: { products: number };
};

type Tab = "products" | "about" | "policies" | "reviews";

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${cls} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const disc = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;
  return (
    <Link href={`/shop/${product.slug}`}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#1B6FEB]/25 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1B6FEB]/8 transition-all duration-300">
      <div className="relative aspect-[5/4] bg-white overflow-hidden rounded-t-2xl">
        {product.images[0] ? (
          <Image src={product.images[0]} fill alt={product.title}
            className="object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px)50vw,(max-width:1024px)33vw,25vw" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
          {product.isNewArrival && (
            <span className="text-[10px] font-black bg-emerald-500 text-white px-2.5 py-1 rounded-full">NEW</span>
          )}
          {product.isFeatured && (
            <span className="text-[10px] font-black bg-[#1B6FEB] text-white px-2.5 py-1 rounded-full">FEATURED</span>
          )}
          {disc && (
            <span className="text-[10px] font-black bg-amber-500 text-white px-2.5 py-1 rounded-full">-{disc}%</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-800 text-sm font-semibold line-clamp-2 group-hover:text-[#1B6FEB] transition-colors leading-snug mb-2">
          {product.title}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[#1B6FEB] font-black text-lg">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-gray-400 text-xs line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> In stock
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Review Form ──────────────────────────────────────────────────────────────
function ReviewForm({ slug, onSuccess }: { slug: string; onSuccess: () => void }) {
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [hover, setHover]     = useState(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/vendors/${slug}/reviews`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");
      setComment(""); setRating(5);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
      <h4 className="text-gray-900 font-bold text-sm flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[#1B6FEB]" /> Write a Review
      </h4>
      <div>
        <p className="text-gray-500 text-xs mb-2">Your rating</p>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} type="button"
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}>
              <Star className={`w-7 h-7 transition-all ${i <= (hover || rating) ? "fill-amber-400 text-amber-400 scale-110" : "fill-gray-200 text-gray-200"}`} />
            </button>
          ))}
          <span className="ml-2 text-gray-500 text-sm">{rating} / 5</span>
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-xs mb-2">Your review</p>
        <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4}
          placeholder="Share your experience with this vendor…"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-[#1B6FEB]/50 resize-none transition-colors" />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button type="submit" disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-[#1B6FEB] text-white text-sm font-bold hover:bg-[#1557D0] disabled:opacity-50 transition-colors flex items-center gap-2">
        {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VendorPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug]         = useState("");
  const [vendor, setVendor]     = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab]           = useState<Tab>("products");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => { params.then(p => setSlug(p.slug)); }, [params]);

  const load = useCallback(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/vendors/${slug}`).then(r => r.json()),
      fetch(`/api/products?vendorSlug=${slug}&sort=price-asc`).then(r => r.json()).catch(() => ({ products: [] })),
    ]).then(([vd, pd]) => {
      if (vd.error) { setNotFound(true); return; }
      setVendor(vd.vendor);
      setProducts(pd.products ?? []);
    }).catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  // After a review is posted, refresh only the vendor (rating, count, list) without the full-page spinner
  const reloadVendor = useCallback(() => {
    if (!slug) return;
    fetch(`/api/vendors/${slug}`, { cache: "no-store" }).then(r => r.json())
      .then(vd => { if (!vd.error) setVendor(vd.vendor); })
      .catch(() => {});
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading vendor profile…</p>
      </div>
    </div>
  );

  if (notFound || !vendor) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
        <Package className="w-8 h-8 text-gray-300" />
      </div>
      <div className="text-center">
        <p className="text-gray-900 text-xl font-bold mb-1">Vendor not found</p>
        <p className="text-gray-400 text-sm">This shop doesn&apos;t exist or is no longer active.</p>
      </div>
      <Link href="/shop" className="flex items-center gap-2 text-[#1B6FEB] text-sm font-bold hover:underline">
        <ChevronLeft className="w-4 h-4" /> Back to Shop
      </Link>
    </div>
  );

  const name        = vendor.shopName ?? "Vendor";
  const initials    = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const avatarSrc   = vendor.profileImage || vendor.brandLogo;
  const sinceYear   = vendor.aboutSince
    ? new Date(vendor.aboutSince).getFullYear()
    : new Date(vendor.createdAt).getFullYear();
  const yearsActive = new Date().getFullYear() - sinceYear;
  const ratingCount = vendor.vendorReviews.length;

  // Product categories for this vendor, in the order they first appear, with counts
  const vendorCats = Array.from(
    products.reduce((m, p) => {
      if (p.category) m.set(p.category.id, { ...p.category, count: (m.get(p.category.id)?.count ?? 0) + 1 });
      return m;
    }, new Map<string, { id: string; name: string; count: number }>()).values()
  );
  const uncategorised = products.filter(p => !p.category);
  const productGroups = [
    ...vendorCats.map(c => ({ key: c.id, name: c.name, items: products.filter(p => p.category?.id === c.id) })),
    ...(uncategorised.length ? [{ key: "other", name: "Other", items: uncategorised }] : []),
  ].filter(g => catFilter === "all" || g.key === catFilter);

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "products", label: `Products (${vendor._count.products})`, icon: <Package className="w-4 h-4" /> },
    { key: "about",    label: "About",                                 icon: <Users className="w-4 h-4" /> },
    { key: "policies", label: "Policies",                              icon: <FileText className="w-4 h-4" /> },
    { key: "reviews",  label: `Reviews (${ratingCount})`,              icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ════ HERO BANNER ════ */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        {vendor.bannerImage ? (
          <Image src={vendor.bannerImage} fill alt="Shop banner" priority unoptimized
            className="object-cover object-center" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E4A] via-[#1B3A8A] to-[#1B6FEB]" />
        )}
        {/* Fade to white at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        {/* Back link */}
        <Link href="/shop"
          className="absolute top-5 left-5 sm:top-6 sm:left-8 flex items-center gap-1.5 text-white text-sm font-semibold bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/50 transition-colors z-10">
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>

      {/* ════ PROFILE HEADER ════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-6 -mt-16 sm:-mt-20 relative z-10">

          {/* Avatar */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 border-white overflow-hidden bg-white flex-shrink-0 shadow-xl shadow-black/15">
            {avatarSrc ? (
              <Image src={avatarSrc} fill alt={name} className="object-contain p-2" unoptimized />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-white font-black text-4xl bg-gradient-to-br from-[#1B3A8A] to-[#1B6FEB]">
                {initials}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-4 sm:pt-16 pb-6">
            {/* Name + verified */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-gray-900 font-black text-3xl sm:text-4xl leading-tight">{name}</h1>
              <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Vendor
              </span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {vendor.aboutCategory && (
                <span className="flex items-center gap-1.5 bg-[#1B6FEB]/8 text-[#1B6FEB] border border-[#1B6FEB]/20 px-3 py-1 rounded-full text-xs font-bold">
                  <Tag className="w-3 h-3" /> {vendor.aboutCategory}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                <CalendarDays className="w-3.5 h-3.5" /> Since {sinceYear}
              </span>
              <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Package className="w-3.5 h-3.5" /> {vendor._count.products} products
              </span>
              {vendor.avgRating !== null && (
                <span className="flex items-center gap-1.5">
                  <Stars rating={vendor.avgRating} size="sm" />
                  <span className="text-amber-500 font-bold text-xs">{vendor.avgRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs">({ratingCount} reviews)</span>
                </span>
              )}
            </div>

            {/* Tagline */}
            {vendor.aboutTitle && (
              <p className="text-gray-500 text-sm italic leading-relaxed max-w-xl">
                &ldquo;{vendor.aboutTitle}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* ════ STATS BAR ════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 mt-2">
          {[
            { icon: <Package className="w-5 h-5" />,      label: "Products",     value: String(vendor._count.products), iconCls: "text-[#1B6FEB] bg-[#1B6FEB]/10", valCls: "text-[#1B6FEB]" },
            { icon: <Star className="w-5 h-5" />,          label: "Avg Rating",   value: vendor.avgRating ? vendor.avgRating.toFixed(1) : "—", iconCls: "text-amber-500 bg-amber-50", valCls: "text-amber-500" },
            { icon: <MessageSquare className="w-5 h-5" />, label: "Reviews",      value: String(ratingCount), iconCls: "text-emerald-600 bg-emerald-50", valCls: "text-emerald-600" },
            { icon: <TrendingUp className="w-5 h-5" />,    label: "Years Active", value: yearsActive > 0 ? `${yearsActive}+` : "< 1", iconCls: "text-purple-600 bg-purple-50", valCls: "text-purple-600" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconCls}`}>{s.icon}</div>
              <div>
                <p className={`font-black text-xl leading-none ${s.valCls}`}>{s.value}</p>
                <p className="text-gray-400 text-xs mt-0.5 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ════ TABS ════ */}
        <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap rounded-t-xl transition-all -mb-px border-b-2 flex-shrink-0
                ${tab === t.key
                  ? "text-[#1B6FEB] border-[#1B6FEB] bg-[#1B6FEB]/5"
                  : "text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ════ PRODUCTS TAB ════ */}
        {tab === "products" && (
          <div className="pb-16">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <Package className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">No products listed yet.</p>
              </div>
            ) : (
              <>
                {/* Category filter — only when the vendor's products span more than one category */}
                {vendorCats.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {[{ id: "all", name: "All Products", count: products.length }, ...vendorCats].map(c => (
                      <button key={c.id} onClick={() => setCatFilter(c.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all
                          ${catFilter === c.id
                            ? "bg-[#1B6FEB] text-white shadow-md shadow-blue-200"
                            : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-[#1B6FEB] hover:text-[#1B6FEB]"}`}>
                        {c.name} <span className={catFilter === c.id ? "text-white/70" : "text-gray-400"}>({c.count})</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-12">
                  {productGroups.map(g => (
                    <section key={g.key}>
                      {vendorCats.length > 1 && (
                        <h3 className="text-gray-900 font-black text-xl mb-5 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-[#1B6FEB]" /> {g.name}
                          <span className="text-gray-400 text-sm font-semibold">({g.items.length})</span>
                        </h3>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {g.items.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </section>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ════ ABOUT TAB ════ */}
        {tab === "about" && (
          <div className="pb-16 space-y-12">

            {vendor.aboutDescription ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Story */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-gray-900 font-black text-2xl flex items-center gap-2">
                    <Award className="w-6 h-6 text-[#1B6FEB]" /> About {name}
                  </h2>
                  {vendor.aboutDescription.split("\n\n").map((para, i) => (
                    <p key={i} className="text-gray-600 text-sm leading-7">{para}</p>
                  ))}
                </div>

                {/* Quick facts */}
                <div className="space-y-3">
                  <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Quick Facts</h3>
                  {[
                    { icon: <CalendarDays className="w-4 h-4" />, label: "In Business Since", value: String(sinceYear) },
                    { icon: <Package className="w-4 h-4" />,      label: "Products",          value: String(vendor._count.products) },
                    { icon: <Users className="w-4 h-4" />,        label: "Team Members",      value: String(vendor.shopMembers.length) },
                    ...(vendor.aboutCategory ? [{ icon: <Tag className="w-4 h-4" />, label: "Category", value: vendor.aboutCategory }] : []),
                    ...(vendor.avgRating !== null ? [{ icon: <Star className="w-4 h-4" />, label: "Avg Rating", value: `${vendor.avgRating.toFixed(1)} / 5.0` }] : []),
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <div className="text-[#1B6FEB] bg-[#1B6FEB]/8 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">{f.icon}</div>
                      <div className="min-w-0">
                        <p className="text-gray-400 text-[11px] font-medium">{f.label}</p>
                        <p className="text-gray-900 font-bold text-sm truncate">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No about information provided yet.</p>
              </div>
            )}

            {/* Team */}
            {vendor.shopMembers.length > 0 && (
              <div>
                <h2 className="text-gray-900 font-black text-2xl flex items-center gap-2 mb-6">
                  <Users className="w-6 h-6 text-[#1B6FEB]" /> Meet the Team
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {vendor.shopMembers.map((m, idx) => (
                    <div key={m.id}
                      className="group bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-[#1B6FEB]/20 transition-all duration-300">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1B3A8A] to-[#1B6FEB] mx-auto mb-4 shadow-md ring-4 ring-gray-100 group-hover:ring-[#1B6FEB]/15 transition-all">
                        {m.imageUrl ? (
                          <Image src={m.imageUrl} fill alt={m.name} className="object-cover" unoptimized sizes="80px" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-white font-black text-xl">
                            {m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        {idx === 0 && (
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#1B6FEB] rounded-tl-lg flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-900 font-bold text-sm">{m.name}</p>
                      {m.designation && (
                        <p className="text-gray-400 text-xs mt-1 leading-snug">{m.designation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ POLICIES TAB ════ */}
        {tab === "policies" && (
          <div className="pb-16">
            <h2 className="text-gray-900 font-black text-2xl flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-[#1B6FEB]" /> Shop Policies
            </h2>
            {vendor.shopPolicies ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-7 sm:p-10 shadow-sm">
                <div
                  className="vendor-policies text-sm leading-relaxed max-w-none"
                  dangerouslySetInnerHTML={{ __html: vendor.shopPolicies }}
                />
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No shop policies provided yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ════ REVIEWS TAB ════ */}
        {tab === "reviews" && (
          <div className="pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: aggregate + form */}
              <div className="space-y-6">
                {vendor.avgRating !== null ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-5">
                      <div className="text-center">
                        <p className="text-gray-900 font-black text-6xl leading-none">{vendor.avgRating.toFixed(1)}</p>
                        <div className="mt-2"><Stars rating={vendor.avgRating} size="md" /></div>
                        <p className="text-gray-400 text-xs mt-1">{ratingCount} review{ratingCount !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = vendor.vendorReviews.filter(r => r.rating === star).length;
                          const pct   = ratingCount ? (count / ratingCount) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                              <span className="text-gray-400 w-2.5 text-right">{star}</span>
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-gray-400 w-4">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                    <Star className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No ratings yet</p>
                  </div>
                )}

                {vendor.shopSlug && <ReviewForm slug={vendor.shopSlug} onSuccess={reloadVendor} />}
              </div>

              {/* Right: review list */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-gray-900 font-bold text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {ratingCount > 0 ? "Latest Reviews" : "No Reviews Yet"}
                </h3>
                {vendor.vendorReviews.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
                    <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Be the first to leave a review!</p>
                  </div>
                ) : (
                  vendor.vendorReviews.map(r => (
                    <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B3A8A] to-[#1B6FEB] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-black">
                              {r.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-bold text-sm">{r.user.name}</p>
                            <p className="text-gray-400 text-xs">
                              {new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <Stars rating={r.rating} size="sm" />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Policies HTML styles — light theme */}
      <style>{`
        .vendor-policies h2 { color:#111827; font-size:1.1rem; font-weight:700; margin:1.5em 0 0.5em; padding-bottom:0.4em; border-bottom:1px solid #f3f4f6; }
        .vendor-policies h3 { color:#1f2937; font-size:0.95rem; font-weight:700; margin:1.2em 0 0.4em; }
        .vendor-policies p  { margin:0.5em 0; color:#4b5563; }
        .vendor-policies span, .vendor-policies font { color: inherit !important; }
        .vendor-policies [style*="color"] { color: inherit !important; }
        .vendor-policies ul,
        .vendor-policies ol { padding-left:1.4em; margin:0.5em 0; color:#4b5563; }
        .vendor-policies ul { list-style:disc; }
        .vendor-policies ol { list-style:decimal; }
        .vendor-policies li { margin:0.3em 0; }
        .vendor-policies strong { color:#111827; font-weight:700; }
        .vendor-policies a  { color:#1B6FEB; text-decoration:underline; }
        .vendor-policies blockquote { border-left:3px solid #1B6FEB; padding-left:1em; color:#6b7280; margin:0.75em 0; }
        .vendor-policies h2:first-child { margin-top:0; }
      `}</style>
    </div>
  );
};