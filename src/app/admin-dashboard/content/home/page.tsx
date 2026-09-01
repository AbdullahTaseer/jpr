"use client";

import { useState, useEffect, useRef } from "react";
import { useCmsPage } from "@/hooks/useCmsPage";

const inp = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";
const area = inp + " resize-none";

function Section({ title, onSave, saving, children }: { title: string; onSave: () => void; saving: boolean; children: React.ReactNode }) {
    return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-base">{title}</h2>
                <button onClick={onSave} disabled={saving}
                    className="bg-[#1B6FEB] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
                    {saving ? "Saving…" : "Save"}
                </button>
            </div>
            {children}
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}

function Grid2({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

type HpProduct = {
    id: string; slug: string; title: string; images: string[];
    price: number; comparePrice: number | null;
    category: { id: string; name: string } | null;
};

function HeroProductSlot({
    slot, get, set, inpCls,
}: {
    slot: number;
    get: (section: string, key: string, def: string) => string;
    set: (section: string, key: string, value: string) => void;
    inpCls: string;
}) {
    const slotKey = `slot${slot}`;
    const selectedId = get("hero_products", `${slotKey}.id`, "");
    const selectedTitle = get("hero_products", `${slotKey}.title`, "");
    const selectedImg = get("hero_products", `${slotKey}.image`, "");
    const selectedPrice = get("hero_products", `${slotKey}.price`, "");

    const [search, setSearch] = useState("");
    const [results, setResults] = useState<HpProduct[]>([]);
    const [searching, setSearching] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const doSearch = async (q: string) => {
        setSearch(q);
        if (!q.trim()) { setResults([]); setOpen(false); return; }
        setSearching(true);
        try {
            const res = await fetch(`/api/admin/products?search=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.products ?? []);
            setOpen(true);
        } catch { /* silent */ }
        setSearching(false);
    };

    const select = (p: HpProduct) => {
        set("hero_products", `${slotKey}.id`, p.id);
        set("hero_products", `${slotKey}.slug`, p.slug);
        set("hero_products", `${slotKey}.title`, p.title);
        set("hero_products", `${slotKey}.image`, p.images[0] || "");
        set("hero_products", `${slotKey}.price`, `$${p.price.toFixed(2)}`);
        set("hero_products", `${slotKey}.comparePrice`, p.comparePrice ? `$${p.comparePrice.toFixed(2)}` : "");
        set("hero_products", `${slotKey}.category`, p.category?.name || "");
        setSearch(""); setResults([]); setOpen(false);
    };

    const clear = () => {
        ["id", "slug", "title", "image", "price", "comparePrice", "category"].forEach(k =>
            set("hero_products", `${slotKey}.${k}`, "")
        );
    };

    return (
        <div className="bg-[#242424] rounded-xl p-4 space-y-3">
            <p className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">Card {slot + 1}</p>
            {selectedId ? (
                <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                    {selectedImg && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={selectedImg} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate">{selectedTitle}</p>
                        <p className="text-[#1B6FEB] text-xs font-black">{selectedPrice}</p>
                    </div>
                    <button onClick={clear}
                        className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0 text-xl leading-none font-bold">×</button>
                </div>
            ) : (
                <div ref={wrapRef} className="relative">
                    <input
                        value={search}
                        onChange={e => doSearch(e.target.value)}
                        onFocus={() => results.length > 0 && setOpen(true)}
                        placeholder={`Search product for card ${slot + 1}…`}
                        className={inpCls}
                    />
                    {searching && <p className="text-[#6b7280] text-[11px] mt-1">Searching…</p>}
                    {open && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 bg-[#1a1a1a] border border-white/10 rounded-xl mt-1 max-h-52 overflow-y-auto shadow-2xl">
                            {results.map(p => (
                                <button key={p.id} onClick={() => select(p)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 text-left border-b border-white/[0.04] last:border-0 transition-colors">
                                    {p.images[0] ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-lg bg-[#333] flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-xs font-semibold truncate">{p.title}</p>
                                        <p className="text-[#1B6FEB] text-[10px] font-bold">${p.price.toFixed(2)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ContentHomePage() {
    const { get, set, saveSection, saving, toast } = useCmsPage("home");

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.message}
                </div>
            )}

            <div>
                <h1 className="text-white text-2xl font-bold">Home</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit every section of the homepage</p>
            </div>

            {/* ── Hero ── */}
            <Section title="Hero Section" onSave={() => saveSection("hero")} saving={saving}>
                <Grid2>
                    <Field label="Label (above headline)">
                        <input value={get("hero","label","Two Businesses. One Shop.")} onChange={e=>set("hero","label",e.target.value)} className={inp} />
                    </Field>
                    <Field label="Headline Line 1">
                        <input value={get("hero","headline1","Discover &")} onChange={e=>set("hero","headline1",e.target.value)} className={inp} />
                    </Field>
                    <Field label="Headline Line 2 (italic accent)">
                        <input value={get("hero","headline2","Shop. Inspire.")} onChange={e=>set("hero","headline2",e.target.value)} className={inp} />
                    </Field>
                    <Field label="Body Text">
                        <textarea rows={3} value={get("hero","body","A marketplace built on trust and shared values.")} onChange={e=>set("hero","body",e.target.value)} className={area}/>
                    </Field>
                    <Field label="CTA 1 — Text">
                        <input value={get("hero","cta1Text","Shop Now")} onChange={e=>set("hero","cta1Text",e.target.value)} className={inp}/>
                    </Field>
                    <Field label="CTA 1 — Link">
                        <input value={get("hero","cta1Link","/shop")} onChange={e=>set("hero","cta1Link",e.target.value)} className={inp}/>
                    </Field>
                    <Field label="CTA 2 — Text">
                        <input value={get("hero","cta2Text","Become a Vendor")} onChange={e=>set("hero","cta2Text",e.target.value)} className={inp}/>
                    </Field>
                    <Field label="CTA 2 — Link">
                        <input value={get("hero","cta2Link","/vendor")} onChange={e=>set("hero","cta2Link",e.target.value)} className={inp}/>
                    </Field>
                </Grid2>
            </Section>

            {/* ── Hero Products ── */}
            <Section title="Hero Floating Cards (up to 3 products)" onSave={() => saveSection("hero_products")} saving={saving}>
                <p className="text-[#6b7280] text-sm">Search and select up to 3 products to display as floating product cards in the hero section. Click × to remove a selection.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    {[0, 1, 2].map(slot => (
                        <HeroProductSlot key={slot} slot={slot} get={get} set={set} inpCls={inp} />
                    ))}
                </div>
            </Section>

            {/* ── Hero Stats ── */}
            <Section title="Hero Stats (3 counters)" onSave={() => saveSection("stats")} saving={saving}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[{k:"0",dv:"2",dl:"Businesses"},{k:"1",dv:"100+",dl:"Products"},{k:"2",dv:"2008",dl:"Established"}].map(s=>(
                        <div key={s.k} className="bg-[#242424] rounded-xl p-4 space-y-2">
                            <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide">Stat {+s.k+1}</p>
                            <Field label="Value"><input value={get("stats",`${s.k}.value`,s.dv)} onChange={e=>set("stats",`${s.k}.value`,e.target.value)} className={inp}/></Field>
                            <Field label="Label"><input value={get("stats",`${s.k}.label`,s.dl)} onChange={e=>set("stats",`${s.k}.label`,e.target.value)} className={inp}/></Field>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── New Arrivals ── */}
            <Section title="New Arrivals Section" onSave={() => saveSection("new_arrivals")} saving={saving}>
                <Grid2>
                    <Field label="Heading"><input value={get("new_arrivals","heading","New Arrivals")} onChange={e=>set("new_arrivals","heading",e.target.value)} className={inp}/></Field>
                    <Field label="Subtext"><textarea rows={2} value={get("new_arrivals","subtext","Explore the latest additions from our growing community of vendors.")} onChange={e=>set("new_arrivals","subtext",e.target.value)} className={area}/></Field>
                </Grid2>
            </Section>

            {/* ── Trendy Fashion ── */}
            <Section title="Trendy Fashion Section" onSave={() => saveSection("trendy")} saving={saving}>
                <Grid2>
                    <Field label="Badge Text"><input value={get("trendy","badge","FASHION COLLECTION")} onChange={e=>set("trendy","badge",e.target.value)} className={inp}/></Field>
                    <Field label="Heading Line 1"><input value={get("trendy","heading1","Shop Trendy")} onChange={e=>set("trendy","heading1",e.target.value)} className={inp}/></Field>
                    <Field label="Heading Line 2 (italic)"><input value={get("trendy","heading2","Fashion")} onChange={e=>set("trendy","heading2",e.target.value)} className={inp}/></Field>
                    <Field label="Body Text"><textarea rows={2} value={get("trendy","subtext","Discover fashion that blends style with purpose.")} onChange={e=>set("trendy","subtext",e.target.value)} className={area}/></Field>
                    <Field label="CTA Button Text"><input value={get("trendy","ctaText","SHOP ALL COLLECTION")} onChange={e=>set("trendy","ctaText",e.target.value)} className={inp}/></Field>
                    <Field label="CTA Sub-label"><input value={get("trendy","ctaSub","50,000+ styles")} onChange={e=>set("trendy","ctaSub",e.target.value)} className={inp}/></Field>
                </Grid2>
            </Section>

            {/* ── Popular Categories ── */}
            <Section title="Popular Categories Section" onSave={() => saveSection("categories")} saving={saving}>
                <Grid2>
                    <Field label="Heading"><input value={get("categories","heading","Popular Categories")} onChange={e=>set("categories","heading",e.target.value)} className={inp}/></Field>
                    <Field label="Subtext"><textarea rows={2} value={get("categories","subtext","Browse categories that reflect what our community values most.")} onChange={e=>set("categories","subtext",e.target.value)} className={area}/></Field>
                </Grid2>
            </Section>

            {/* ── Featured Products ── */}
            <Section title="Featured Products Section" onSave={() => saveSection("featured")} saving={saving}>
                <Grid2>
                    <Field label="Heading"><input value={get("featured","heading","Featured Products")} onChange={e=>set("featured","heading",e.target.value)} className={inp}/></Field>
                    <Field label="Subtext"><textarea rows={2} value={get("featured","subtext","A curated selection of products chosen for exceptional quality and purposeful design.")} onChange={e=>set("featured","subtext",e.target.value)} className={area}/></Field>
                </Grid2>
            </Section>

            {/* ── Vendor CTA ── */}
            <Section title="Vendor CTA Section" onSave={() => saveSection("vendor_cta")} saving={saving}>
                <Grid2>
                    <Field label="Badge Text"><input value={get("vendor_cta","badge","FOR VENDORS")} onChange={e=>set("vendor_cta","badge",e.target.value)} className={inp}/></Field>
                    <Field label="Heading Line 1"><input value={get("vendor_cta","heading1","Grow Your")} onChange={e=>set("vendor_cta","heading1",e.target.value)} className={inp}/></Field>
                    <Field label="Heading Line 2 (gold italic)"><input value={get("vendor_cta","heading2","Business With Us.")} onChange={e=>set("vendor_cta","heading2",e.target.value)} className={inp}/></Field>
                    <Field label="Body Text"><textarea rows={3} value={get("vendor_cta","body","Latter Day Shopping is home to two businesses we know and stand behind.")} onChange={e=>set("vendor_cta","body",e.target.value)} className={area}/></Field>
                    <Field label="CTA Button Text"><input value={get("vendor_cta","ctaText","BECOME A VENDOR")} onChange={e=>set("vendor_cta","ctaText",e.target.value)} className={inp}/></Field>
                </Grid2>

                <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide mt-2">Bullet Points</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        {k:"0",dt:"Quick & easy vendor registration",ds:"Get started in under 10 minutes"},
                        {k:"1",dt:"Admin approval within 24 hours",ds:"Fast-tracked onboarding process"},
                        {k:"2",dt:"Add unlimited products to your store",ds:"No listing caps, ever"},
                        {k:"3",dt:"Reach shoppers who buy with intention",ds:"A focused audience, not a mass marketplace"},
                    ].map(b=>(
                        <div key={b.k} className="bg-[#242424] rounded-xl p-3 space-y-2">
                            <Field label={`Bullet ${+b.k+1} — Main Text`}><input value={get("vendor_cta",`bullet${b.k}.text`,b.dt)} onChange={e=>set("vendor_cta",`bullet${b.k}.text`,e.target.value)} className={inp}/></Field>
                            <Field label="Sub Text"><input value={get("vendor_cta",`bullet${b.k}.sub`,b.ds)} onChange={e=>set("vendor_cta",`bullet${b.k}.sub`,e.target.value)} className={inp}/></Field>
                        </div>
                    ))}
                </div>

                <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide mt-2">Stats Grid (4 cards)</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        {k:"0",di:"🏪",dv:"2",dl:"Businesses"},
                        {k:"1",di:"📦",dv:"100+",dl:"Products Listed"},
                        {k:"2",di:"📅",dv:"2008",dl:"Established"},
                        {k:"3",di:"⭐",dv:"2",dl:"Brands We Stand Behind"},
                    ].map(s=>(
                        <div key={s.k} className="bg-[#242424] rounded-xl p-3 space-y-2">
                            <p className="text-[#6b7280] text-[11px] font-semibold">Card {+s.k+1}</p>
                            <Field label="Icon"><input value={get("vendor_cta",`stat${s.k}.icon`,s.di)} onChange={e=>set("vendor_cta",`stat${s.k}.icon`,e.target.value)} className={inp}/></Field>
                            <Field label="Value"><input value={get("vendor_cta",`stat${s.k}.value`,s.dv)} onChange={e=>set("vendor_cta",`stat${s.k}.value`,e.target.value)} className={inp}/></Field>
                            <Field label="Label"><input value={get("vendor_cta",`stat${s.k}.label`,s.dl)} onChange={e=>set("vendor_cta",`stat${s.k}.label`,e.target.value)} className={inp}/></Field>
                        </div>
                    ))}
                </div>

                <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide mt-2">Vendor Testimonial</p>
                <Grid2>
                    <Field label="Quote Text"><textarea rows={2} value={get("vendor_cta","quote","\"We built Latter Day Shopping around two businesses we know and stand behind.\"")} onChange={e=>set("vendor_cta","quote",e.target.value)} className={area}/></Field>
                    <Field label="Attribution (name + title)"><input value={get("vendor_cta","quoteName","John-Paul Register — Founder")} onChange={e=>set("vendor_cta","quoteName",e.target.value)} className={inp}/></Field>
                </Grid2>
            </Section>

            {/* ── Reviews ── */}
            <Section title="Reviews Section" onSave={() => saveSection("reviews")} saving={saving}>
                <Grid2>
                    <Field label="Heading"><input value={get("reviews","heading","What Our Customers Say")} onChange={e=>set("reviews","heading",e.target.value)} className={inp}/></Field>
                    <Field label="Subtext"><textarea rows={2} value={get("reviews","subtext","Real stories from vendors and shoppers building a better marketplace together.")} onChange={e=>set("reviews","subtext",e.target.value)} className={area}/></Field>
                </Grid2>
            </Section>

            {/* ── Newsletter ── */}
            <Section title="Newsletter Section" onSave={() => saveSection("newsletter")} saving={saving}>
                <Grid2>
                    <Field label="Heading"><input value={get("newsletter","heading","Stay Connected")} onChange={e=>set("newsletter","heading",e.target.value)} className={inp}/></Field>
                    <Field label="Subtext"><textarea rows={2} value={get("newsletter","subtext","Be the first to know about new arrivals, exclusive offers, and community highlights.")} onChange={e=>set("newsletter","subtext",e.target.value)} className={area}/></Field>
                </Grid2>
            </Section>
        </div>
    );
}