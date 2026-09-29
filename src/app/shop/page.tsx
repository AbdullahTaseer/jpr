"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type DbProduct = {
  id: string; slug: string; title: string; price: number; comparePrice: number | null;
  images: string[]; isNewArrival: boolean; isFeatured: boolean;
  vendor: { name: string; shopName: string | null };
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
};
type DbCategory = { id: string; name: string };
type DbBrand    = { id: string; name: string };

const FALLBACK_IMG = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=600&q=85&auto=format&fit=crop";

const PAGE_SIZE = 12;

// Page numbers with ellipses, e.g. 1 … 4 5 6 … 9
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

const SORTS = [
  { label: "Price: Low to High", val: "price-asc"  },
  { label: "Price: High to Low", val: "price-desc" },
  { label: "Newest First",       val: "new"        },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoStar = ({ filled }: { filled: boolean }) => (
  <svg className={`w-3 h-3 ${filled ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>
);
const IcoFilter = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);
const IcoGrid = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
);
const IcoList = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);
const IcoX = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
);

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#EBF3FF] text-[#1B6FEB] text-xs font-bold px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-blue-800 transition-colors"><IcoX /></button>
    </span>
  );
}

function ShopInner() {
  const searchParams = useSearchParams();

  const [products,       setProducts]       = useState<DbProduct[]>([]);
  const [categories,     setCategories]     = useState<DbCategory[]>([]);
  const [brands,         setBrands]         = useState<DbBrand[]>([]);
  const [loading,        setLoading]        = useState(true);

  const [search,         setSearch]         = useState("");
  const [selCats,        setSelCats]        = useState<string[]>(() => { const id = searchParams.get("categoryId"); return id ? [id] : []; });
  const [selBrands,      setSelBrands]      = useState<string[]>(() => { const id = searchParams.get("brandId");   return id ? [id] : []; });
  const [newArrivalsOnly,setNewArrivalsOnly] = useState(() => searchParams.get("newArrival") === "true");
  const [minP,           setMinP]           = useState("");
  const [maxP,           setMaxP]           = useState("");
  const [sort,           setSort]           = useState("price-asc");
  const [gridView,       setGridView]       = useState(true);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  useEffect(() => {
    Promise.all([
      // Shop only lists products from our brands (Emergency Essentials, Secret Garden Bees)
      fetch("/api/products?brandedOnly=true").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/brands").then(r => r.json()),
    ]).then(([pd, cd, bd]) => {
      setProducts(pd.products ?? []);
      setCategories(cd.categories ?? []);
      setBrands(bd.brands ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const toggleCat   = (id: string) => setSelCats(p   => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleBrand = (id: string) => setSelBrands(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const clearAll    = () => { setSearch(""); setSelCats([]); setSelBrands([]); setNewArrivalsOnly(false); setMinP(""); setMaxP(""); };

  const results = useMemo(() => {
    let list = products.filter(p => {
      if (newArrivalsOnly && !p.isNewArrival) return false;
      if (search    && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selCats.length   && !selCats.includes(p.category?.id ?? ""))  return false;
      if (selBrands.length && !selBrands.includes(p.brand?.id ?? ""))   return false;
      if (minP && p.price < parseFloat(minP)) return false;
      if (maxP && p.price > parseFloat(maxP)) return false;
      return true;
    });
    if (sort === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, search, selCats, selBrands, newArrivalsOnly, minP, maxP, sort]);

  // Page resets to 1 whenever filters or sort change
  const filterKey = JSON.stringify([search, selCats, selBrands, newArrivalsOnly, minP, maxP, sort]);
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page       = pageState.key === filterKey ? Math.min(pageState.page, totalPages) : 1;
  const pageItems  = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goToPage   = (n: number) => {
    setPageState({ key: filterKey, page: n });
    document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeFilters = [
    ...(newArrivalsOnly ? [{ label: "New Arrivals", remove: () => setNewArrivalsOnly(false) }] : []),
    ...selCats.map(id   => ({ label: categories.find(c => c.id === id)?.name ?? id, remove: () => toggleCat(id) })),
    ...selBrands.map(id => ({ label: brands.find(b => b.id === id)?.name ?? id,     remove: () => toggleBrand(id) })),
    ...(minP ? [{ label: `Min $${minP}`, remove: () => setMinP("") }] : []),
    ...(maxP ? [{ label: `Max $${maxP}`, remove: () => setMaxP("") }] : []),
  ];

  const sectionHd = (t: string) => (
    <h3 className="text-gray-900 font-black text-xs uppercase tracking-[0.18em] mb-4 flex items-center gap-2">
      <span className="w-4 h-0.5 bg-[#1B6FEB] rounded-full" /> {t}
    </h3>
  );

  const checkRow = (id: string, label: string, checked: boolean, toggle: () => void, count?: number) => (
    <label key={id} className="flex items-center justify-between py-1.5 cursor-pointer group">
      <div className="flex items-center gap-2.5">
        <div onClick={toggle}
          className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer
            ${checked ? "bg-[#1B6FEB] border-[#1B6FEB]" : "border-gray-300 group-hover:border-[#1B6FEB]"}`}>
          {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
        </div>
        <span className={`text-sm transition-colors ${checked ? "text-[#1B6FEB] font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>{label}</span>
      </div>
      {count !== undefined && <span className="text-gray-400 text-xs">{count}</span>}
    </label>
  );

  const sidebar = (
    <aside className="w-72 flex-shrink-0 space-y-7">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 focus:border-[#1B6FEB] rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-black text-gray-900 text-base flex items-center gap-2"><IcoFilter /> Filters</h2>
        {activeFilters.length > 0 && (
          <button onClick={clearAll} className="text-xs font-bold text-[#1B6FEB] hover:text-blue-800 transition-colors">Clear All</button>
        )}
      </div>

      {/* Category */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        {sectionHd("Category")}
        <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-thin">
          {categories.map(cat => {
            const count = products.filter(p => p.category?.id === cat.id).length;
            return checkRow(cat.id, cat.name, selCats.includes(cat.id), () => toggleCat(cat.id), count);
          })}
        </div>
      </div>

      {/* Price */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        {sectionHd("Price Range")}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
            <input type="number" value={minP} onChange={e => setMinP(e.target.value)} placeholder="Min"
              className="w-full pl-7 pr-3 py-2.5 border-2 border-gray-200 focus:border-[#1B6FEB] rounded-xl text-sm focus:outline-none transition-colors" />
          </div>
          <div className="w-4 h-px bg-gray-300 flex-shrink-0" />
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
            <input type="number" value={maxP} onChange={e => setMaxP(e.target.value)} placeholder="Max"
              className="w-full pl-7 pr-3 py-2.5 border-2 border-gray-200 focus:border-[#1B6FEB] rounded-xl text-sm focus:outline-none transition-colors" />
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {([["Under $50","","50"],["$50–$100","50","100"],["$100+","100",""]] as [string,string,string][]).map(([l,mn,mx]) => (
            <button key={l} onClick={() => { setMinP(mn); setMaxP(mx); }}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors border
                ${minP===mn && maxP===mx ? "bg-[#1B6FEB] text-white border-[#1B6FEB]" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#1B6FEB] hover:text-[#1B6FEB]"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        {sectionHd("Brands")}
        <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-thin">
          {brands.map(brand => {
            const count = products.filter(p => p.brand?.id === brand.id).length;
            return checkRow(brand.id, brand.name, selBrands.includes(brand.id), () => toggleBrand(brand.id), count);
          })}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="bg-gray-50/50 min-h-screen">

      {/* ── Page hero ── */}
      <div className="bg-gradient-to-r from-[#070C1B] to-[#1045A8] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white font-semibold">Shop</span>
              </div>
              <h1 className="font-display font-black text-white text-4xl lg:text-5xl leading-tight">All Products</h1>
              <p className="text-white/50 text-sm mt-2">Discover purposeful products from verified vendors</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <div className="hidden lg:block">{sidebar}</div>

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {activeFilters.map(f => <Chip key={f.label} label={f.label} onRemove={f.remove} />)}
              </div>
            )}

            {/* Toolbar */}
            <div id="shop-results" className="scroll-mt-24 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <button className="lg:hidden flex items-center gap-2 text-sm font-bold text-gray-700 border border-gray-200 px-4 py-2 rounded-xl hover:border-[#1B6FEB] hover:text-[#1B6FEB] transition-colors"
                  onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <IcoFilter /> Filters {activeFilters.length > 0 && <span className="bg-[#1B6FEB] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{activeFilters.length}</span>}
                </button>
                <p className="text-gray-500 text-sm">
                  {results.length > 0 ? (
                    <>Showing <span className="font-black text-gray-900">{(page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + pageItems.length}</span> of <span className="font-black text-gray-900">{results.length}</span> products</>
                  ) : (
                    <>Showing <span className="font-black text-gray-900">0</span> products</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="text-sm border-2 border-gray-200 focus:border-[#1B6FEB] rounded-xl px-4 py-2 focus:outline-none text-gray-700 font-semibold bg-white transition-colors">
                  {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
                </select>
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setGridView(true)}
                    className={`p-2.5 transition-colors ${gridView ? "bg-[#1B6FEB] text-white" : "text-gray-400 hover:text-gray-700"}`}>
                    <IcoGrid />
                  </button>
                  <button onClick={() => setGridView(false)}
                    className={`p-2.5 transition-colors ${!gridView ? "bg-[#1B6FEB] text-white" : "text-gray-400 hover:text-gray-700"}`}>
                    <IcoList />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile sidebar panel */}
            {sidebarOpen && (
              <div className="lg:hidden mb-6 bg-white rounded-3xl border border-gray-100 p-5 shadow-xl">
                {sidebar}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="bg-white rounded-3xl border border-gray-100 py-24 text-center">
                <div className="w-10 h-10 border-4 border-[#1B6FEB]/20 border-t-[#1B6FEB] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400 text-sm font-medium">Loading products...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 py-24 text-center">
                <p className="text-6xl mb-4">🔍</p>
                <h3 className="font-black text-gray-900 text-xl mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search term.</p>
                <button onClick={clearAll} className="bg-[#1B6FEB] text-white font-bold px-8 py-3 rounded-full hover:bg-[#1557D0] transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : gridView ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
                {pageItems.map(p => {
                  const disc = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : null;
                  const badge = p.isNewArrival ? "NEW" : (p.comparePrice ? "SALE" : null);
                  const badgeColor = badge === "NEW" ? "bg-[#1B6FEB]" : "bg-rose-500";
                  const img = p.images[0] || FALLBACK_IMG;
                  const vendorLabel = p.vendor.shopName || p.vendor.name;
                  return (
                    <Link key={p.id} href={`/shop/${p.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#1B6FEB]/20 hover:shadow-2xl hover:shadow-[#1B6FEB]/08 hover:-translate-y-1.5 transition-all duration-400">
                      <div className="relative aspect-[5/4] overflow-hidden rounded-t-3xl bg-white">
                        <Image src={img} fill alt={p.title}
                          className="object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width:640px)50vw,(max-width:1280px)33vw,25vw"
                          unoptimized={!img.includes("unsplash.com")} />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {badge && <span className={`text-[10px] font-black px-2.5 py-1 rounded-full text-white ${badgeColor}`}>{badge}</span>}
                          {disc && <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-400 text-white">-{disc}%</span>}
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FavoriteButton productId={p.id} />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-[#1B6FEB] uppercase tracking-widest mb-1">{vendorLabel}</p>
                        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">{p.title}</h3>
                        {p.category && (
                          <p className="text-[10px] text-gray-400 font-medium mb-2">{p.category.name}{p.brand ? ` · ${p.brand.name}` : ""}</p>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[#1B6FEB] font-black text-base">${p.price.toFixed(2)}</span>
                            {p.comparePrice && <span className="text-gray-400 text-xs line-through">${p.comparePrice.toFixed(2)}</span>}
                          </div>
                          {disc && <span className="text-emerald-600 text-xs font-bold">Save {disc}%</span>}
                        </div>
                        <p className="text-emerald-500 text-[10px] font-bold mb-3">✓ In stock</p>
                        <div className="w-full text-xs font-bold text-center text-[#1B6FEB] border-2 border-[#1B6FEB]/25 py-2.5 rounded-2xl group-hover:bg-[#1B6FEB] group-hover:text-white group-hover:border-[#1B6FEB] transition-all duration-200">
                          VIEW DETAIL
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* List view */
              <div className="space-y-4">
                {pageItems.map(p => {
                  const disc = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : null;
                  const badge = p.isNewArrival ? "NEW" : (p.comparePrice ? "SALE" : null);
                  const badgeColor = badge === "NEW" ? "bg-[#1B6FEB]" : "bg-rose-500";
                  const img = p.images[0] || FALLBACK_IMG;
                  const vendorLabel = p.vendor.shopName || p.vendor.name;
                  return (
                    <Link key={p.id} href={`/shop/${p.slug}`} className="group bg-white rounded-2xl border border-gray-100 hover:border-[#1B6FEB]/20 hover:shadow-lg transition-all duration-300 flex overflow-hidden">
                      <div className="relative w-36 h-36 flex-shrink-0 overflow-hidden rounded-l-2xl bg-white">
                        <Image src={img} fill alt={p.title} className="object-cover rounded-l-2xl group-hover:scale-105 transition-transform duration-500" sizes="144px"
                          unoptimized={!img.includes("unsplash.com")} />
                        {badge && (
                          <div className="absolute top-2 left-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white ${badgeColor}`}>{badge}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                        <div>
                          <p className="text-[10px] font-bold text-[#1B6FEB] uppercase tracking-widest mb-1">
                            {vendorLabel}{p.category ? ` · ${p.category.name}` : ""}
                          </p>
                          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-1">{p.title}</h3>
                          {p.brand && <p className="text-[10px] text-gray-400 font-medium mb-2">{p.brand.name}</p>}
                          <p className="text-emerald-500 text-[10px] font-bold">✓ In stock</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[#1B6FEB] font-black text-xl">${p.price.toFixed(2)}</span>
                            {p.comparePrice && <span className="text-gray-400 text-sm line-through">${p.comparePrice.toFixed(2)}</span>}
                            {disc && <span className="text-emerald-600 text-xs font-bold">Save {disc}%</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <FavoriteButton productId={p.id} />
                            <div className="text-xs font-bold text-[#1B6FEB] border-2 border-[#1B6FEB]/30 px-5 py-2 rounded-xl group-hover:bg-[#1B6FEB] group-hover:text-white group-hover:border-[#1B6FEB] transition-all duration-200 whitespace-nowrap">
                              VIEW DETAIL
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-10">
                <button onClick={() => goToPage(page - 1)} disabled={page === 1}
                  className="px-4 h-10 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-700 hover:border-[#1B6FEB] hover:text-[#1B6FEB] transition-colors disabled:opacity-40 disabled:pointer-events-none">
                  ← Prev
                </button>
                {pageList(page, totalPages).map((n, i) =>
                  n === "…" ? (
                    <span key={`gap-${i}`} className="w-10 text-center text-gray-400 text-sm">…</span>
                  ) : (
                    <button key={n} onClick={() => goToPage(n)} aria-current={n === page ? "page" : undefined}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors
                        ${n === page ? "bg-[#1B6FEB] text-white shadow-lg shadow-blue-200" : "border-2 border-gray-200 text-gray-700 hover:border-[#1B6FEB] hover:text-[#1B6FEB]"}`}>
                      {n}
                    </button>
                  )
                )}
                <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}
                  className="px-4 h-10 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-700 hover:border-[#1B6FEB] hover:text-[#1B6FEB] transition-colors disabled:opacity-40 disabled:pointer-events-none">
                  Next →
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopInner />
    </Suspense>
  );
};