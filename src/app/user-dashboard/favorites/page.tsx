"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FavProduct = {
  id: string;
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    images: string[];
    vendor: { shopName: string | null; name: string };
    category: { name: string } | null;
  };
};

const IcoTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function FavoritesPage() {
  const [products, setProducts] = useState<FavProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/favorites/products")
      .then(r => r.json())
      .then(data => setProducts(data?.favorites ?? []))
      .finally(() => setLoading(false));
  }, []);

  const removeProduct = async (productId: string) => {
    await fetch("/api/user/favorites/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setProducts(p => p.filter(x => x.product.id !== productId));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Favourite Products</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          {products.length > 0 ? `${products.length} saved product${products.length !== 1 ? "s" : ""}` : "Your saved products will appear here."}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[#1a1a1a] border border-white/10 rounded-2xl">
          <div className="text-4xl mb-3">🛍️</div>
          <p className="text-white font-semibold mb-1">No favourite products yet</p>
          <p className="text-[#6b7280] text-sm mb-5">Click the heart icon on any product to save it here.</p>
          <Link href="/shop" className="inline-block bg-[#1B6FEB] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(({ product }) => (
            <div key={product.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
              <Link href={`/shop/${product.slug}`} className="block">
                <div className="relative h-44 bg-[#242424]">
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#4b5563] text-sm">No image</div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/shop/${product.slug}`} className="block hover:text-[#1B6FEB] transition-colors">
                  <p className="text-white font-semibold text-sm line-clamp-1">{product.title}</p>
                </Link>
                <p className="text-[#6b7280] text-xs mt-0.5">{product.vendor.shopName ?? product.vendor.name}</p>
                {product.category && <p className="text-[#6b7280] text-xs">{product.category.name}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#1B6FEB] font-bold">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Remove from favourites"
                  >
                    <IcoTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
