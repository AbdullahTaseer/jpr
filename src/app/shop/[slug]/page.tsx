export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Store, ChevronRight } from "lucide-react";
import BuyNowButton from "./BuyNowButton";
import FavoriteButton from "@/components/FavoriteButton";

const FALLBACK = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=900&q=85&auto=format&fit=crop";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      vendor:   { select: { name: true, shopName: true, shopSlug: true, role: true, profileImage: true, vendorReviews: { select: { rating: true } } } },
      category: { select: { id: true, name: true } },
      brand:    { select: { id: true, name: true, logoUrl: true } },
    },
  });

  if (!product) notFound();

  const disc        = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : null;
  const mainImg     = product.images[0] || FALLBACK;
  const thumbs      = product.images.slice(1, 5);
  const vendorName  = product.vendor.shopName || product.vendor.name;
  const vendorSlug  = product.vendor.shopSlug;
  const isAdmin     = product.vendor.role === "ADMIN";
  const reviews     = product.vendor.vendorReviews;
  const avgRating   = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const isUnsplash  = (u: string) => u.includes("unsplash.com");
  const initials    = vendorName.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
  const vendorAvatar = product.vendor.profileImage || product.brand?.logoUrl || null;

  return (
    <div className="bg-white min-h-screen">

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-[#1B6FEB] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#1B6FEB] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-[260px]">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* ── Images ── */}
          <div className="space-y-4">
            <div className="relative h-[460px] rounded-3xl overflow-hidden bg-white border border-gray-100">
              <Image
                src={mainImg}
                fill
                alt={product.title}
                className="object-contain p-6"
                sizes="(max-width:1024px)100vw,50vw"
                unoptimized={!isUnsplash(mainImg)}
                priority
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.isNewArrival && (
                  <span className="text-xs font-black bg-emerald-500 text-white px-3 py-1.5 rounded-full">NEW</span>
                )}
                {disc && (
                  <span className="text-xs font-black bg-amber-400 text-white px-3 py-1.5 rounded-full">-{disc}% OFF</span>
                )}
                {product.isFeatured && (
                  <span className="text-xs font-black bg-[#1B6FEB] text-white px-3 py-1.5 rounded-full">FEATURED</span>
                )}
              </div>
            </div>
            {thumbs.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {thumbs.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-gray-100 hover:border-[#1B6FEB] transition-colors flex-shrink-0">
                    <Image src={img} fill alt={`${product.title} view ${i + 2}`}
                      className="object-contain p-1.5" sizes="80px" unoptimized={!isUnsplash(img)} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col">

            {/* Category · Brand breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {product.category && (
                <Link href={`/shop?categoryId=${product.category.id}`}
                  className="text-[11px] font-bold text-gray-400 hover:text-[#1B6FEB] transition-colors uppercase tracking-wider">
                  {product.category.name}
                </Link>
              )}
              {product.brand && (
                <>
                  {product.category && <span className="text-gray-300 text-sm">·</span>}
                  <Link href={`/shop?brandId=${product.brand.id}`}
                    className="text-[11px] font-bold text-gray-400 hover:text-[#1B6FEB] transition-colors uppercase tracking-wider">
                    {product.brand.name}
                  </Link>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-gray-900 text-3xl lg:text-4xl leading-tight mb-4">
              {product.title}
            </h1>

            {/* Vendor badge — only for vendor-uploaded products */}
            {!isAdmin && vendorSlug && (
              <Link href={`/vendor/${vendorSlug}`}
                className="inline-flex items-center gap-3 mb-6 group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#1B6FEB]/30 rounded-2xl px-4 py-2.5 transition-all duration-200">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#1B3A8A] flex-shrink-0 border border-gray-200">
                  {vendorAvatar ? (
                    <Image src={vendorAvatar} fill alt={vendorName}
                      className="object-contain p-0.5 bg-white" sizes="36px" unoptimized />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-black">{initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-[#1B6FEB] transition-colors leading-none">{vendorName}</span>
                    {avgRating !== null && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-600">{avgRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                    <Store className="w-3 h-3" /> Visit vendor store
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            )}



            {/* Price */}
            <div className="flex items-end gap-4 mb-2">
              <span className="font-display font-black text-5xl text-[#1B6FEB]">${product.price.toFixed(2)}</span>
              {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through mb-1">${product.comparePrice.toFixed(2)}</span>
              )}
            </div>
            {disc && (
              <div className="mb-6">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-black px-3 py-1 rounded-full">
                  Save {disc}% — ${(product.comparePrice! - product.price).toFixed(2)} off
                </span>
              </div>
            )}

            {/* Stock + SKU */}
            <div className="flex flex-wrap items-center gap-5 mb-6">
              {product.stock > 0 ? (
                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-bold text-rose-500">
                  <span className="w-2 h-2 bg-rose-500 rounded-full" />
                  Out of Stock
                </span>
              )}
              {product.sku && (
                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Short description */}
            {product.shortDesc && (
              <p className="text-gray-600 text-sm leading-relaxed mb-7 border-l-4 border-[#1B6FEB]/30 pl-4 italic">
                {product.shortDesc}
              </p>
            )}

            {/* BUY NOW */}
            <div className="mb-5">
              <div className="flex gap-3 items-stretch mb-2">
                <div className="flex-1">
                  <BuyNowButton productId={product.id} redirectUrl={product.redirectUrl ?? null} />
                </div>
                <FavoriteButton productId={product.id} size="md" />
              </div>
              <p className="text-center text-gray-400 text-xs mt-2.5">
                You will be redirected to the vendor&apos;s store to complete your purchase
              </p>
            </div>

           
          </div>
        </div>

        {/* Full description */}
        {product.description && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="font-display font-black text-gray-900 text-2xl mb-6">Product Description</h2>
            <div
              className="text-gray-600 text-sm leading-relaxed max-w-3xl prose prose-sm prose-p:mb-3 prose-headings:font-black prose-headings:text-gray-900"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Back to shop */}
        <div className="mt-14 text-center">
          <Link href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1B6FEB] border-2 border-[#1B6FEB]/30 px-8 py-3 rounded-full hover:bg-[#1B6FEB] hover:text-white hover:border-[#1B6FEB] transition-all duration-200">
            ← Back to Shop
          </Link>
        </div>
      </section>
    </div>
  );
};