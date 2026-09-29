"use client";

import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

const FALLBACK = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=600&q=85&auto=format&fit=crop";

type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  vendor: { name: string; shopName: string | null };
  category: { id: string; name: string } | null;
  brand: { name: string } | null;
};

export default function NewArrivalsGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map(p => {
        const disc = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : null;
        const img = p.images[0] || FALLBACK;
        const vendor = p.vendor.shopName || p.vendor.name;
        return (
          <Link
            key={p.id}
            href={`/shop/${p.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#1B6FEB]/20 hover:shadow-2xl hover:shadow-[#1B6FEB]/08 hover:-translate-y-1.5 transition-all duration-400"
          >
            <div className="relative aspect-[5/4] overflow-hidden rounded-t-3xl bg-white">
              <Image
                src={img}
                fill
                alt={p.title}
                className="object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width:640px)50vw,(max-width:1024px)33vw,25vw"
                unoptimized={!img.includes("unsplash.com")}
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white bg-emerald-500">NEW</span>
                {disc && <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-400 text-white">-{disc}%</span>}
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <FavoriteButton productId={p.id} />
              </div>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold text-[#1B6FEB] uppercase tracking-widest mb-1">{vendor}</p>
              <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">{p.title}</h3>
              {p.category && (
                <p className="text-[10px] text-gray-400 mb-2">
                  {p.category.name}{p.brand ? ` · ${p.brand.name}` : ""}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[#1B6FEB] font-black text-base">${p.price.toFixed(2)}</span>
                  {p.comparePrice && <span className="text-gray-400 text-xs line-through">${p.comparePrice.toFixed(2)}</span>}
                </div>
                {disc && <span className="text-emerald-600 text-xs font-bold">Save {disc}%</span>}
              </div>
              <p className="text-emerald-500 text-[10px] font-bold mt-1.5 mb-3">✓ In stock</p>
              <div className="w-full text-center text-xs font-bold text-[#1B6FEB] border-2 border-[#1B6FEB]/25 py-2.5 rounded-2xl group-hover:bg-[#1B6FEB] group-hover:text-white group-hover:border-[#1B6FEB] transition-all duration-200">
                VIEW DETAIL
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};