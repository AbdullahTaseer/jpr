"use client";

import { useState, useEffect, useCallback } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import Image from "next/image";
import Link from "next/link";

// ─── Unsplash helper ──────────────────────────────────────────────────────────
const unsplash = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoShipping = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m0 0h3l3 4v4h-3m-3 0H9m0 0a2 2 0 100 4 2 2 0 000-4zm9 0a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);
const IcoShield = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const IcoSupport = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IcoArrow = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IcoChevLeft = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const IcoChevRight = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const IcoChevDown = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
const IcoStar = ({ filled, half }: { filled: boolean; half?: boolean }) => (
  <svg className={`w-3.5 h-3.5 ${filled || half ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const IcoHeart = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const IcoCheck = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);
const IcoQuote = () => (
  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);
const IcoMail = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" />
  </svg>
);

const TRUST = [
  { Icon: IcoShipping, title: "Free Shipping & Return", desc: "Reliable delivery and easy returns for a smooth, worry-free experience" },
  { Icon: IcoShield, title: "Money Back Guarantee", desc: "Shop with confidence knowing every purchase is fully protected" },
  { Icon: IcoSupport, title: "24/7 Online Support", desc: "Our team is available around the clock whenever you need help" },
];

type DbProduct = {
  id: string; slug: string; title: string; price: number; comparePrice: number | null;
  images: string[]; isNewArrival: boolean;
  vendor: { name: string; shopName: string | null };
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
};
type DbCategory = { id: string; name: string; imageUrl: string | null };

function dbToCard(p: DbProduct) {
  return {
    productId: p.id,
    slug: p.slug,
    name: p.title,
    price: `$${p.price.toFixed(2)}`,
    oldPrice: p.comparePrice ? `$${p.comparePrice.toFixed(2)}` : undefined,
    img: p.images[0] || HERO_FALLBACK,
    vendor: p.vendor.shopName || p.vendor.name,
    category: p.category?.name,
    badge: p.isNewArrival ? "NEW" : (p.comparePrice ? "SALE" : undefined),
  };
}

type PublicReview = { id: string; rating: number; title: string | null; body: string; user: { name: string } };

const STATS = [
  { value: "2", label: "Businesses", icon: "🏪" },
  { value: "100+", label: "Products Listed", icon: "📦" },
  { value: "2008", label: "Established", icon: "📅" },
  { value: "2", label: "Brands We Stand Behind", icon: "⭐" },
];
const FOUNDER_PHOTO = "https://res.cloudinary.com/dre9yontg/image/upload/v1787858294/jpr-uploads/o2rwunmyy91rlixv3as4.jpg";

const TRENDY_SLIDES = [
  { id: "1529139574466-a303027c1d8b", label: "Spring Collection", tag: "NEW" },
  { id: "1483985988355-763728e1935b", label: "Summer Sale", tag: "SALE" },
  { id: "1469334031218-e382a71b716b", label: "Style Gallery", tag: "TRENDING" },
  { id: "1581044777550-4cfa60707c03", label: "Limited Edition", tag: "HOT" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => <IcoStar key={i} filled={i <= Math.floor(n)} />)}
    </div>
  );
}

function Discount(price: string, old: string) {
  const p = parseFloat(price.replace("$", ""));
  const o = parseFloat(old.replace("$", ""));
  return Math.round((1 - p / o) * 100);
}

function BadgePill({ label, color = "blue" }: { label: string; color?: string }) {
  const cls: Record<string, string> = {
    blue: "bg-[#1B6FEB] text-white",
    gold: "bg-amber-400 text-white",
    green: "bg-emerald-500 text-white",
    red: "bg-rose-500 text-white",
  };
  return <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full ${cls[color] ?? cls.blue}`}>{label}</span>;
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-5 bg-gray-100 rounded-full w-1/4 mt-1" />
        <div className="h-10 bg-gray-100 rounded-2xl mt-2" />
      </div>
    </div>
  );
}

function CategoryCardSkeleton() {
  return <div className="h-48 rounded-3xl bg-gray-100 animate-pulse" />;
}

function ReviewCardSkeleton({ center }: { center?: boolean }) {
  return (
    <div className={`rounded-3xl p-8 animate-pulse space-y-3 ${center ? "bg-[#1B6FEB]/10" : "bg-white border border-gray-100 shadow-md"}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded-full" />)}
      </div>
      <div className="h-4 bg-gray-200 rounded-full w-3/4" />
      <div className="h-3 bg-gray-200 rounded-full w-full" />
      <div className="h-3 bg-gray-200 rounded-full w-5/6" />
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
        <div className="w-14 h-14 bg-gray-200 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-200 rounded-full w-1/3" />
          <div className="h-2.5 bg-gray-200 rounded-full w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ productId, slug, name, price, oldPrice, img, badge, vendor, rating, reviews, category }: {
  productId?: string; slug?: string; name: string; price: string; img: string; oldPrice?: string; badge?: string; vendor?: string;
  rating?: number; reviews?: number; category?: string;
}) {
  const { isFavorited, toggle } = useFavorites();
  const fav = productId ? isFavorited(productId) : false;
  const detailHref = slug ? `/shop/${slug}` : "/shop";
  const badgeColors: Record<string, string> = { NEW: "blue", SALE: "red", HOT: "gold", ECO: "green" };
  const discPct = oldPrice ? Discount(price, oldPrice) : null;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer border border-gray-100 hover:border-[#1B6FEB]/20 hover:shadow-2xl hover:shadow-[#1B6FEB]/10 hover:-translate-y-1.5">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-50">
        <Image src={img} fill alt={name}
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width:640px)50vw,(max-width:1024px)33vw,25vw"
          unoptimized={!img.includes("unsplash.com") && !img.includes("res.cloudinary.com")} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {badge && <BadgePill label={badge} color={badgeColors[badge] ?? "blue"} />}
          {discPct && <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-400 text-white">-{discPct}%</span>}
        </div>

        {/* Wishlist */}
        {productId && (
          <button
            onClick={() => toggle(productId)}
            title={fav ? "Remove from favourites" : "Add to favourites"}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
              ${fav ? "bg-rose-500 text-white scale-110" : "bg-white/80 backdrop-blur-sm text-gray-400 opacity-0 group-hover:opacity-100"}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        )}

        {/* Category chip */}
        {category && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="glass text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full">{category}</span>
          </div>
        )}

        {/* Quick view */}
        <button className="absolute bottom-3 right-3 bg-white text-[#1B6FEB] text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg whitespace-nowrap">
          Quick View
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        {vendor && <p className="text-[10px] font-semibold text-[#1B6FEB] uppercase tracking-widest mb-1">{vendor}</p>}
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">{name}</h3>

        {/* Rating row */}
        {rating !== undefined && (
          <div className="flex items-center gap-1.5 mb-3">
            <Stars n={rating} />
            <span className="text-amber-500 font-bold text-xs">{rating}</span>
            {reviews !== undefined && <span className="text-gray-400 text-xs">({reviews.toLocaleString()})</span>}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[#1B6FEB] font-black text-lg">{price}</span>
            {oldPrice && <span className="text-gray-400 text-xs line-through">{oldPrice}</span>}
          </div>
          {discPct && <span className="text-emerald-600 text-xs font-bold">Save {discPct}%</span>}
        </div>

        {/* Free shipping */}
        <div className="flex items-center gap-1 mt-2 mb-3">
          <span className="text-emerald-500 text-[10px] font-bold">✓ Free Shipping</span>
          <span className="text-gray-300 text-[10px]">·</span>
          <span className="text-gray-400 text-[10px]">In stock</span>
        </div>

        <Link href={detailHref} className="block w-full text-xs font-bold text-center text-[#1B6FEB] border-2 border-[#1B6FEB]/25 py-2.5 rounded-2xl hover:bg-[#1B6FEB] hover:text-white hover:border-[#1B6FEB] transition-all duration-200 tracking-wide">
          VIEW DETAIL
        </Link>
      </div>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({ name, img }: { name: string; img: string }) {
  return (
    <Link href="/shop" className="group relative h-48 rounded-3xl overflow-hidden block cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300">
      <Image src={img} fill alt={name}
        className="object-cover group-hover:scale-110 transition-transform duration-700"
        sizes="(max-width:640px)50vw,25vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-[#1B6FEB]/0 group-hover:bg-[#1B6FEB]/15 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <span className="text-white font-bold text-sm drop-shadow-lg">{name}</span>
        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <IcoChevRight />
        </div>
      </div>
    </Link>
  );
}

const HERO_FALLBACK = unsplash("1483985988355-763728e1935b", 1200, 1400);

function fmtStat(n: number): string {
  if (n >= 10000) return `${Math.floor(n / 1000)}K+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
  return n > 0 ? `${n}` : "0";
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState("");
  const [slideIdx, setSlideIdx] = useState(0);
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<DbProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<DbProduct[]>([]);
  const [popularCats, setPopularCats] = useState<DbCategory[]>([]);
  const [realStats, setRealStats] = useState<{ productCount: number; vendorCount: number } | null>(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingArrivals, setLoadingArrivals] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // CMS content
  const [cms, setCms] = useState<Record<string, string>>({});
  const c = (section: string, key: string, def: string) => cms[`${section}.${key}`] ?? def;

  // Hero right-panel slideshow
  const [heroSlides, setHeroSlides] = useState<string[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFading, setHeroFading] = useState(false);

  const nextSlide = useCallback(() => setSlideIdx(i => (i + 1) % TRENDY_SLIDES.length), []);
  const prevSlide = useCallback(() => setSlideIdx(i => (i - 1 + TRENDY_SLIDES.length) % TRENDY_SLIDES.length), []);

  // Auto-advance trendy slider
  useEffect(() => {
    const t = setInterval(nextSlide, 4000);
    return () => clearInterval(t);
  }, [nextSlide]);

  // Fetch CMS content
  useEffect(() => {
    fetch("/api/cms/home", { cache: "no-store" }).then(r => r.json()).then(d => setCms(d.content ?? {})).catch(() => {});
  }, []);

  // Fetch real stats (vendor + product counts)
  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(d => setRealStats(d)).catch(() => {});
  }, []);

  // Fetch hero slider images from admin
  useEffect(() => {
    fetch("/api/sliders")
      .then(r => r.json())
      .then(d => {
        const imgs = (d.sliders ?? [])
          .map((s: { imageUrl: string | null }) => s.imageUrl)
          .filter(Boolean) as string[];
        if (imgs.length > 0) setHeroSlides(imgs);
      })
      .catch(() => {});
  }, []);

  // Auto-advance hero slider every 4 seconds with crossfade
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const t = setInterval(() => {
      setHeroFading(true);
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % heroSlides.length);
        setHeroFading(false);
      }, 600);
    }, 4000);
    return () => clearInterval(t);
  }, [heroSlides]);

  useEffect(() => {
    fetch("/api/reviews").then(r => r.json()).then(d => setReviews(d.reviews ?? [])).catch(() => {}).finally(() => setLoadingReviews(false));
  }, []);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=8").then(r => r.json()).then(d => setFeaturedProducts(d.products ?? [])).catch(() => {}).finally(() => setLoadingFeatured(false));
  }, []);

  useEffect(() => {
    fetch("/api/products?newArrival=true&limit=8").then(r => r.json()).then(d => setNewArrivals(d.products ?? [])).catch(() => {}).finally(() => setLoadingArrivals(false));
  }, []);

  useEffect(() => {
    fetch("/api/categories?homepage=true").then(r => r.json()).then(d => setPopularCats(d.categories ?? [])).catch(() => {}).finally(() => setLoadingCats(false));
  }, []);

  // Auto-advance reviews slider
  useEffect(() => {
    if (reviews.length <= 1) return;
    const t = setInterval(() => setReviewIdx(i => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const handleSubscribe = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubLoading(true);
    setSubError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubError(data.error === "Already subscribed" ? "You're already subscribed!" : (data.error || "Something went wrong"));
      } else {
        setSubscribed(true);
        setEmail("");
      }
    } catch {
      setSubError("Something went wrong. Please try again.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ══════ HERO ══════ */}
      <section className="min-h-screen flex flex-col lg:flex-row">

        {/* LEFT dark panel */}
        <div className="relative flex flex-col justify-center w-full lg:w-[44%] bg-[#070C1B] px-8 sm:px-12 lg:px-14 xl:px-20 py-24 overflow-hidden">
          {/* Glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-24 w-80 h-80 bg-[#1B6FEB]/25 rounded-full blur-[90px]" />
            <div className="absolute bottom-1/3 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]" />
          </div>
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

          <div className="relative z-10 max-w-xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-[#1B6FEB]" />
              <span className="text-[#1B6FEB] text-[11px] font-black tracking-[0.28em] uppercase">
                {c("hero", "label", "Two Businesses. One Shop.") === "Multi-Vendor Marketplace"
                  ? "Two Businesses. One Shop."
                  : c("hero", "label", "Two Businesses. One Shop.")}
              </span>
            </div>

            {/* 2-line headline */}
            <h1 className="font-display font-black text-white leading-[0.9] mb-8 ">
              <span className="block text-[4.2rem] sm:text-[5.5rem] xl:text-[5rem]">{c("hero", "headline1", "Discover &")}</span>
              <span className="block text-[4.5rem] sm:text-[5.5rem] xl:text-[5rem] italic text-gradient">{c("hero", "headline2", "Shop. Inspire.")}</span>
            </h1>

            <p className="text-white/55 text-base leading-relaxed mb-10">
              {c("hero", "body", "A marketplace built on trust and shared values. Shop from vendors who create self-sustainable products with purpose and integrity.")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-16">
              <Link href={c("hero", "cta1Link", "/shop")}
                className="inline-flex items-center gap-2 bg-[#1B6FEB] text-white font-bold px-9 py-4 rounded-full hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-0.5 text-sm">
                {c("hero", "cta1Text", "Shop Now")} <IcoArrow />
              </Link>
              <Link href={c("hero", "cta2Link", "/vendor")}
                className="inline-flex items-center gap-2 border border-white/20 text-white/80 font-semibold px-9 py-4 rounded-full hover:border-[#1B6FEB] hover:text-[#1B6FEB] transition-all text-sm">
                {c("hero", "cta2Text", "Become a Vendor")}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-8 border-t border-white/[0.08]">
              {[0, 1, 2].map(i => {
                const defaults = ["2", "100+", "2008"];
                const labels = ["Businesses", "Products", "Established"];
                let value = c("stats", `${i}.value`, defaults[i]);
                if (i === 1 && realStats) value = fmtStat(realStats.productCount);
                return (
                  <div key={i}>
                    <p className="font-display font-black text-5xl sm:text-6xl text-white leading-none">{value}</p>
                    <p className="text-white/40 text-xs mt-1.5 font-sans tracking-wide">{c("stats", `${i}.label`, labels[i])}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        
        <div className="relative flex-1 min-h-[65vh] lg:min-h-screen bg-[#0D1425] overflow-hidden">
          {/* Hero bg image — slides from admin or fallback */}
          {heroSlides.length === 0 ? (
            <Image src={HERO_FALLBACK} fill priority
              alt="Hero" className="object-cover object-center scale-105" sizes="56vw" unoptimized={false} />
          ) : (
            <>
              {heroSlides.map((src, i) => (
                <div
                  key={src}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{ opacity: i === heroIdx ? (heroFading ? 0 : 1) : 0, zIndex: i === heroIdx ? 1 : 0 }}
                >
                  <Image src={src} fill priority={i === 0}
                    alt={`Hero slide ${i + 1}`}
                    className="object-cover object-center scale-105"
                    sizes="56vw" unoptimized />
                </div>
              ))}
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070C1B] via-[#070C1B]/25 to-transparent" style={{ zIndex: 2 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070C1B]/70 via-transparent to-transparent" style={{ zIndex: 2 }} />
          <div className="absolute inset-0 hero-glow pointer-events-none" style={{ zIndex: 2 }} />

          {/* Slide dots — visible only when multiple slides exist */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 10 }}>
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setHeroFading(true); setTimeout(() => { setHeroIdx(i); setHeroFading(false); }, 600); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIdx ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          )}

          {/* Card 1 — Active Vendors (top-left) */}
          {/* <div className="absolute top-10 left-10 glass rounded-2xl p-4 shadow-2xl animate-float z-20 max-w-[190px]">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Live on Platform</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex -space-x-2">
                {["1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d", "1438761681033-6461ffad8d80"].map(id => (
                  <div key={id} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative flex-shrink-0">
                    <Image src={unsplash(id, 80, 80)} fill alt="" className="object-cover" sizes="28px" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-black text-gray-700">{realStats ? fmtStat(realStats.vendorCount) : "10K+"}</span>
            </div>
            <p className="text-[11px] text-gray-600 font-medium">Active vendors selling today</p>
          </div> */}

          {/* Card 2 — Rating (top-right) */}
          {/* <div className="absolute top-10 right-8 glass rounded-2xl p-3.5 shadow-2xl animate-float-delayed z-20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-gray-900">4.9</span>
              <div className="flex flex-col gap-0.5">
                <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <IcoStar key={i} filled />)}</div>
                <span className="text-[10px] text-gray-400">50K+ reviews</span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-[#1B6FEB]">Platform Rating</p>
          </div> */}

          {/* Card 3 — Discount badge (mid-right) */}
          {/* <div className="absolute top-1/3 right-6 animate-float-slow z-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1B6FEB] to-[#0A2070] flex flex-col items-center justify-center shadow-2xl shadow-blue-500/50 border-2 border-white/20">
              <span className="text-yellow-300 font-black text-xl leading-none">30%</span>
              <span className="text-white/80 text-[10px] font-black tracking-wide">OFF</span>
            </div>
          </div> */}

          {/* Card 4 — Product card #1 (bottom-left) */}
          {(() => {
            const hpId = cms["hero_products.slot0.id"];
            if (hpId) {
              return (
                <Link href={`/shop/${cms["hero_products.slot0.slug"] || ""}`} className="absolute bottom-16 left-8 glass rounded-2xl overflow-hidden shadow-2xl animate-float z-20 w-52">
                  <div className="relative h-28">
                    <Image src={cms["hero_products.slot0.image"] || HERO_FALLBACK} fill alt={cms["hero_products.slot0.title"] || ""} className="object-cover" sizes="208px" unoptimized />
                    <div className="absolute top-2 left-2"><BadgePill label="FEATURED" /></div>
                  </div>
                  <div className="p-3">
                    {cms["hero_products.slot0.category"] && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{cms["hero_products.slot0.category"]}</p>}
                    <p className="text-sm font-bold text-gray-900 leading-snug mt-0.5 line-clamp-1">{cms["hero_products.slot0.title"]}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[#1B6FEB] font-black text-sm">{cms["hero_products.slot0.price"]}</span>
                      <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <IcoStar key={i} filled />)}</div>
                    </div>
                  </div>
                </Link>
              );
            }
            return (
              <div className="absolute bottom-16 left-8 glass rounded-2xl overflow-hidden shadow-2xl animate-float z-20 w-52">
                <div className="relative h-28">
                  <Image src={unsplash("1548036328-c9fa89d128fa", 400, 300)} fill alt="Trending" className="object-cover" sizes="208px" />
                  <div className="absolute top-2 left-2"><BadgePill label="TRENDING" /></div>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bags</p>
                  <p className="text-sm font-bold text-gray-900 leading-snug mt-0.5">Artisan Leather Tote</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[#1B6FEB] font-black text-sm">$129.00</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <IcoStar key={i} filled />)}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 5 — Product card #2 (mid-left) */}
          {(() => {
            const hpId = cms["hero_products.slot1.id"];
            if (hpId) {
              return (
                <Link href={`/shop/${cms["hero_products.slot1.slug"] || ""}`} className="absolute top-1/2 left-8 -translate-y-1/2 glass rounded-2xl overflow-hidden shadow-2xl animate-float-delayed z-20 w-44">
                  <div className="relative h-24">
                    <Image src={cms["hero_products.slot1.image"] || HERO_FALLBACK} fill alt={cms["hero_products.slot1.title"] || ""} className="object-cover" sizes="176px" unoptimized />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-1">{cms["hero_products.slot1.title"]}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[#1B6FEB] font-black text-sm">{cms["hero_products.slot1.price"]}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                    </div>
                  </div>
                </Link>
              );
            }
            return (
              <div className="absolute top-1/2 left-8 -translate-y-1/2 glass rounded-2xl overflow-hidden shadow-2xl animate-float-delayed z-20 w-44">
                <div className="relative h-24">
                  <Image src={unsplash("1515372039744-b8f02a3ae446", 400, 300)} fill alt="Dress" className="object-cover" sizes="176px" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-gray-800 leading-snug">Organic Cotton Dress</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[#1B6FEB] font-black text-sm">$49.99</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 6 — New arrivals badge (bottom-right) */}
          {/* <div className="absolute bottom-10 right-8 z-20 animate-float-delayed">
            <div className="bg-emerald-500 text-white rounded-2xl px-4 py-3 text-xs font-black shadow-xl shadow-emerald-500/40">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span>2,400+ New Products</span>
              </div>
              <span className="text-emerald-100 text-[10px] font-medium">Added this week</span>
            </div>
          </div> */}

          {/* Card 7 — Product card #3 (bottom-center) */}
          {(() => {
            const hpId = cms["hero_products.slot2.id"];
            if (hpId) {
              return (
                <Link href={`/shop/${cms["hero_products.slot2.slug"] || ""}`} className="absolute bottom-8 left-1/2 -translate-x-1/2 glass rounded-xl overflow-hidden shadow-2xl z-20 w-40 hidden lg:block">
                  <div className="relative h-20">
                    <Image src={cms["hero_products.slot2.image"] || HERO_FALLBACK} fill alt={cms["hero_products.slot2.title"] || ""} className="object-cover" sizes="160px" unoptimized />
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-gray-900 line-clamp-1">{cms["hero_products.slot2.title"]}</p>
                    <p className="text-[#1B6FEB] font-black text-xs">{cms["hero_products.slot2.price"]}</p>
                  </div>
                </Link>
              );
            }
            return (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass rounded-xl overflow-hidden shadow-2xl z-20 w-40 hidden lg:block">
                <div className="relative h-20">
                  <Image src={unsplash("1523275335684-37898b6baf30", 300, 200)} fill alt="Watch" className="object-cover" sizes="160px" />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-bold text-gray-900">Smart Watch</p>
                  <p className="text-[#1B6FEB] font-black text-xs">$89.50</p>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

     

      {(loadingArrivals || newArrivals.length > 0) && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.28em]">Just Landed</span>
            <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4 leading-tight">{c("new_arrivals", "heading", "New Arrivals")}</h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
              {c("new_arrivals", "subtext", "Explore the latest additions from our growing community of vendors — each product crafted with purpose and selected to support a more mindful way of living.")}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {loadingArrivals
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : newArrivals.map(p => <ProductCard key={p.id} {...dbToCard(p)} />)
            }
          </div>
        </section>
      )}

     
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">

          {/* LEFT — image slider */}
          <div className="relative overflow-hidden min-h-[320px] lg:min-h-auto">
            {TRENDY_SLIDES.map((slide, i) => (
              <div key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ${i === slideIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
                <Image src={unsplash(slide.id, 900, 700)} fill alt={slide.label}
                  className="object-cover object-top" sizes="50vw" />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#060B17]/50" />
              </div>
            ))}

            {/* Slide label */}
            <div className="absolute top-6 left-6 z-10">
              <div className="glass rounded-xl px-4 py-2 inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1B6FEB] rounded-full animate-pulse" />
                <span className="text-gray-800 text-xs font-black">{TRENDY_SLIDES[slideIdx].label}</span>
                <span className="text-[10px] font-black text-white bg-[#1B6FEB] px-2 py-0.5 rounded-full">{TRENDY_SLIDES[slideIdx].tag}</span>
              </div>
            </div>

            {/* Slide number */}
            <div className="absolute top-6 right-6 z-10 glass rounded-lg px-3 py-1.5">
              <span className="text-gray-700 text-xs font-black">{String(slideIdx + 1).padStart(2, "0")}</span>
              <span className="text-gray-400 text-xs"> / {String(TRENDY_SLIDES.length).padStart(2, "0")}</span>
            </div>

            {/* Prev / Next arrows */}
            <button onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xl text-gray-800 transition-all hover:scale-110">
              <IcoChevLeft />
            </button>
            <button onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xl text-gray-800 transition-all hover:scale-110">
              <IcoChevRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {TRENDY_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlideIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === slideIdx ? "w-7 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"}`} />
              ))}
            </div>
          </div>

          {/* RIGHT — content */}
          <div className="bg-gradient-to-br from-[#060B17] via-[#0C1B40] to-[#1A3680] p-10 lg:p-14 flex flex-col justify-center">
            <div className="inline-flex w-fit bg-white/10 border border-white/15 text-white/80 text-[11px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
              {c("trendy", "badge", "FASHION COLLECTION")}
            </div>

            <h2 className="font-display font-black text-white text-4xl lg:text-5xl leading-[1.05] mb-4">
              {c("trendy", "heading1", "Shop Trendy")}<br />
              <span className="italic text-gradient">{c("trendy", "heading2", "Fashion")}</span>
            </h2>

            <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-sm">
              {c("trendy", "subtext", "Discover fashion that blends style with purpose. Designed for everyday wear without compromising on intention or quality.")}
            </p>

            {/* Sub-category thumbnails with real images */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Hats & Caps", img: unsplash("1534351590666-13e3e96b5017", 300, 200), count: "240+" },
                { label: "Footwear", img: unsplash("1542291026-7eec264c27ff", 300, 200), count: "380+" },
                { label: "Jewelry", img: unsplash("1515562141207-7a88fb7ce338", 300, 200), count: "150+" },
                { label: "Scarves & Wraps", img: unsplash("1601924994987-69e26d50dc26", 300, 200), count: "90+" },
              ].map(item => (
                <div key={item.label}
                  className="group relative h-20 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#1B6FEB]/60 transition-all duration-300">
                  <Image src={item.img} fill alt={item.label}
                    className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="160px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-2.5">
                    <span className="text-white text-xs font-bold">{item.label}</span>
                    <span className="text-white/60 text-[10px]">{item.count} items</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/shop"
                className="inline-flex items-center gap-2.5 bg-white text-[#1B6FEB] font-black px-7 py-3.5 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
                {c("trendy", "ctaText", "SHOP ALL COLLECTION")} <IcoArrow />
              </Link>
              <span className="text-white/40 text-sm">{c("trendy", "ctaSub", "50,000+ styles")}</span>
            </div>
          </div>
        </div>
      </section>

  
      {(loadingCats || popularCats.length > 0) && (
        <section className="py-24 bg-gray-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.28em]">Explore</span>
              <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">{c("categories", "heading", "Popular Categories")}</h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
                {c("categories", "subtext", "Browse categories that reflect what our community values most. From everyday essentials to unique finds, each section offers something meaningful.")}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {loadingCats
                ? Array.from({ length: 4 }).map((_, i) => <CategoryCardSkeleton key={i} />)
                : popularCats.map(cat => (
                    <CategoryCard key={cat.id} name={cat.name} img={cat.imageUrl || unsplash("1483985988355-763728e1935b", 600, 440)} />
                  ))
              }
            </div>
            {!loadingCats && (
              <div className="text-center mt-10">
                <Link href="/shop"
                  className="inline-flex items-center gap-2 text-[#1B6FEB] font-bold text-sm border-2 border-[#1B6FEB] px-8 py-3 rounded-full hover:bg-[#1B6FEB] hover:text-white transition-all duration-200">
                  VIEW ALL CATEGORIES <IcoArrow />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

    
      {(loadingFeatured || featuredProducts.length > 0) && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.28em]">Handpicked</span>
            <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">{c("featured", "heading", "Featured Products")}</h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
              {c("featured", "subtext", "A curated selection of products chosen for exceptional quality, purposeful design, and the remarkable people who create them.")}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {loadingFeatured
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map(p => <ProductCard key={p.id} {...dbToCard(p)} />)
            }
          </div>
          {!loadingFeatured && (
            <div className="text-center mt-14">
              <Link href="/shop"
                className="inline-flex items-center gap-2.5 bg-[#1B6FEB] text-white font-black px-12 py-4 rounded-full hover:bg-[#1557D0] transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 text-sm tracking-wide">
                SHOP ALL PRODUCTS <IcoArrow />
              </Link>
            </div>
          )}
        </section>
      )}

   
      <section className="relative overflow-hidden">
        {/* Background: vendor lifestyle image */}
        <div className="absolute inset-0">
          <Image src={unsplash("1556742049-0cfed4f6a45d", 1600, 900)} fill alt="Vendor marketplace"
            className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04080F]/97 via-[#070C1B]/90 to-[#070C1B]/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left — text */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 bg-[#1B6FEB]/20 border border-[#1B6FEB]/30 text-[#60A5FA] text-xs font-black px-4 py-1.5 rounded-full mb-7 tracking-wider">
                🏪 &nbsp;{c("vendor_cta", "badge", "FOR VENDORS")}
              </div>

              {/* 2-line tagline */}
              <h2 className="font-display font-black text-white leading-[1.0] mb-6">
                <span className="block text-5xl lg:text-6xl">{c("vendor_cta", "heading1", "Grow Your")}</span>
                <span className="block text-5xl lg:text-6xl italic text-gradient-gold">{c("vendor_cta", "heading2", "Business With Us.")}</span>
              </h2>

              <p className="text-white/55 text-base leading-relaxed mb-10 max-w-md">
                {c("vendor_cta", "body", "Latter Day Shopping is home to two businesses we know and stand behind. Easy setup, no hidden fees, and a community that invests in purposeful products.")}
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  { text: c("vendor_cta","bullet0.text","Quick & easy vendor registration"), sub: c("vendor_cta","bullet0.sub","Get started in under 10 minutes") },
                  { text: c("vendor_cta","bullet1.text","Admin approval within 24 hours"),   sub: c("vendor_cta","bullet1.sub","Fast-tracked onboarding process") },
                  { text: c("vendor_cta","bullet2.text","Add unlimited products to your store"), sub: c("vendor_cta","bullet2.sub","No listing caps, ever") },
                  { text: c("vendor_cta","bullet3.text","Reach shoppers who buy with intention"), sub: c("vendor_cta","bullet3.sub","A focused audience, not a mass marketplace") },
                ].map(pt => (
                  <li key={pt.text} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#1B6FEB] flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                      <IcoCheck />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-semibold">{pt.text}</p>
                      <p className="text-white/35 text-xs mt-0.5">{pt.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link href="/vendor"
                className="inline-flex items-center gap-2.5 bg-white text-[#1B6FEB] font-black px-10 py-4 rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-0.5 text-sm tracking-wide">
                {c("vendor_cta", "ctaText", "BECOME A VENDOR")} <IcoArrow />
              </Link>
            </div>

            {/* Right — Stats grid */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s, i) => (
                  <div key={i}
                    className={`rounded-3xl p-7 text-center relative overflow-hidden
                      ${i === 0 ? "bg-[#1B6FEB]" : i === 1 ? "bg-white/[0.07] border border-white/[0.1]"
                        : i === 2 ? "bg-white/[0.07] border border-white/[0.1]" : "bg-amber-500/90"}`}>
                    <div className="font-display font-black text-4xl text-white mb-1">{i === 1 && realStats ? fmtStat(realStats.productCount) : c("vendor_cta", `stat${i}.value`, s.value)}</div>
                    <div className="text-white/60 text-xs font-semibold tracking-wide uppercase">{c("vendor_cta", `stat${i}.label`, s.label)}</div>
                    {(i === 0 || i === 3) && (
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/10 blur-xl" />
                    )}
                  </div>
                ))}
              </div>

              {/* Founder */}
              <div className="mt-4 glass rounded-3xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <Image src={c("vendor_cta", "quoteImage", FOUNDER_PHOTO)} fill alt="Founder" className="object-cover object-top" sizes="56px" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">
                    {c("vendor_cta", "quote", "\"We built Latter Day Shopping around two businesses we know and stand behind.\"")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <IcoStar key={i} filled />)}</div>
                    <span className="text-gray-500 text-xs font-bold">{c("vendor_cta", "quoteName", "John-Paul Register — Founder")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {(loadingReviews || reviews.length > 0) && (() => {
        if (loadingReviews) {
          return (
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                  <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.28em]">Reviews</span>
                  <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">{c("reviews", "heading", "What Our Customers Say")}</h2>
                  <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                    {c("reviews", "subtext", "Real stories from vendors and shoppers building a better marketplace together.")}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                  <ReviewCardSkeleton />
                  <ReviewCardSkeleton center />
                  <ReviewCardSkeleton />
                </div>
              </div>
            </section>
          );
        }
        return null;
      })()}
      {!loadingReviews && reviews.length > 0 && (() => {
        const n = reviews.length;
        const prevR = reviews[(reviewIdx - 1 + n) % n];
        const currR = reviews[reviewIdx];
        const nextR = reviews[(reviewIdx + 1) % n];
        const trio = n === 1 ? [currR] : n === 2 ? [prevR, currR] : [prevR, currR, nextR];
        const centerPos = n === 1 ? 0 : n === 2 ? 1 : 1;
        return (
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.28em]">Reviews</span>
                <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">{c("reviews", "heading", "What Our Customers Say")}</h2>
                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                  {c("reviews", "subtext", "Real stories from vendors and shoppers building a better marketplace together.")}
                </p>
              </div>

              {/* Cards — key triggers fade-in animation on each slide change */}
              <div key={reviewIdx} className="grid grid-cols-1 md:grid-cols-3 gap-7"
                style={{ animation: "var(--animate-review-in)" }}>
                {trio.map((r, i) => (
                  <div key={r.id}
                    className={`rounded-3xl p-8 flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl
                      ${i === centerPos ? "bg-[#1B6FEB] text-white" : "bg-white border border-gray-100 shadow-md"}`}>
                    <div className={`mb-4 ${i === centerPos ? "text-white/20" : "text-[#1B6FEB]/15"}`}>
                      <IcoQuote />
                    </div>
                    <Stars n={r.rating} />
                    {r.title && <p className={`text-sm font-bold mt-4 ${i === centerPos ? "text-white" : "text-gray-900"}`}>{r.title}</p>}
                    <p className={`text-[15px] leading-relaxed mt-2 flex-1 font-medium ${i === centerPos ? "text-white/85" : "text-gray-600"}`}>{r.body}</p>
                    <div className={`flex items-center gap-4 mt-8 pt-6 ${i === centerPos ? "border-t border-white/20" : "border-t border-gray-100"}`}>
                      <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xl ring-2 ring-offset-2
                        ${i === centerPos ? "bg-white/20 text-white ring-white/30" : "bg-[#1B6FEB]/10 text-[#1B6FEB] ring-[#1B6FEB]/30"}`}>
                        {r.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-black text-sm ${i === centerPos ? "text-white" : "text-gray-900"}`}>{r.user.name}</p>
                        <p className={`text-xs font-semibold mt-0.5 ${i === centerPos ? "text-white/60" : "text-[#1B6FEB]"}`}>Verified Customer</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / dots / next */}
              {n > 1 && (
                <div className="flex items-center justify-center gap-6 mt-10">
                  <button onClick={() => setReviewIdx(i => (i - 1 + n) % n)}
                    className="w-11 h-11 rounded-full bg-white border-2 border-gray-100 hover:border-[#1B6FEB] hover:text-[#1B6FEB] flex items-center justify-center shadow-md text-gray-600 transition-all hover:scale-110">
                    <IcoChevLeft />
                  </button>
                  <div className="flex gap-2">
                    {reviews.map((_, i) => (
                      <button key={i} onClick={() => setReviewIdx(i)}
                        className={`rounded-full transition-all duration-300 ${i === reviewIdx ? "w-7 h-2.5 bg-[#1B6FEB]" : "w-2.5 h-2.5 bg-gray-200 hover:bg-[#1B6FEB]/50"}`} />
                    ))}
                  </div>
                  <button onClick={() => setReviewIdx(i => (i + 1) % n)}
                    className="w-11 h-11 rounded-full bg-white border-2 border-gray-100 hover:border-[#1B6FEB] hover:text-[#1B6FEB] flex items-center justify-center shadow-md text-gray-600 transition-all hover:scale-110">
                    <IcoChevRight />
                  </button>
                </div>
              )}
              {n > 1 && (
                <p className="text-center text-gray-400 text-xs font-semibold mt-4 tracking-wide">
                  {String(reviewIdx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </p>
              )}
            </div>
          </section>
        );
      })()}

   
      <section className="py-24 bg-gradient-to-br from-[#EBF3FF] via-white to-[#F0F6FF] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#1B6FEB]/06 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-blue-300/08 rounded-full blur-2xl" />
        </div>
        <div className="max-w-xl mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#1B6FEB] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
            <IcoMail />
          </div>
          <div className="text-[#1B6FEB] text-[11px] font-black tracking-[0.28em] uppercase mb-3">Newsletter</div>
          <h2 className="font-display font-black text-gray-900 text-5xl mb-4 leading-tight">
            {c("newsletter", "heading", "Stay Connected")}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-9">
            {c("newsletter", "subtext", "Be the first to know about new arrivals, exclusive offers, and community highlights. Join our newsletter and never miss a deal — no spam, ever.")}
          </p>
          {subscribed ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-2xl py-5 px-6 font-bold text-sm">
              🎉 You&apos;re subscribed! We&apos;ll keep you updated with the latest offers.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-sm mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="Enter your email address"
                disabled={subLoading}
                className="flex-1 border-2 border-gray-200 focus:border-[#1B6FEB] rounded-full px-5 py-3.5 text-sm focus:outline-none transition-colors text-gray-800 placeholder-gray-400 bg-white disabled:opacity-60" />
              <button type="submit" disabled={subLoading}
                className="bg-[#1B6FEB] text-white px-5 py-3.5 rounded-full hover:bg-[#1557D0] transition-all shadow-lg shadow-blue-200 hover:-translate-y-px flex items-center justify-center disabled:opacity-60">
                {subLoading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <IcoArrow />}
              </button>
            </form>
          )}
          {subError && <p className="text-red-500 text-xs mt-3 font-medium">{subError}</p>}
          <p className="text-gray-400 text-xs mt-4">Unsubscribe anytime · No spam guaranteed</p>
        </div>
      </section>

      
     

    </div>
  );
};