export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NewArrivalsGrid from "@/components/NewArrivalsGrid";


export default async function NewArrivalsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isNewArrival: true },
    include: {
      vendor:   { select: { name: true, shopName: true } },
      category: { select: { id: true, name: true } },
      brand:    { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#070C1B] via-[#0A1E4A] to-[#1B3A8A] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">New Arrivals</span>
          </div>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black px-4 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Just Landed
            </div>
            <h1 className="font-display font-black text-white text-5xl lg:text-7xl mt-2 mb-5 leading-tight">
              New <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-sky-300">Arrivals</span>
            </h1>
            <p className="text-white/55 text-lg leading-relaxed mb-8">
              The freshest additions from our growing community of vendors — each product crafted with purpose.
            </p>
            <Link href="/shop?newArrival=true"
              className="inline-flex items-center gap-2 bg-white text-[#1B6FEB] font-black px-8 py-3.5 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
              Shop All New Arrivals →
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-white/[0.08]">
            <div>
              <p className="font-display font-black text-3xl text-white">{products.length}</p>
              <p className="text-white/40 text-xs mt-0.5">New Products</p>
            </div>
            <div>
              <p className="font-display font-black text-3xl text-white">10+</p>
              <p className="text-white/40 text-xs mt-0.5">Vendors</p>
            </div>
            <div>
              <p className="font-display font-black text-3xl text-white">10</p>
              <p className="text-white/40 text-xs mt-0.5">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="font-black text-gray-900 text-xl mb-2">No new arrivals yet</h3>
            <p className="text-gray-400 text-sm mb-6">Check back soon — vendors are adding products every day.</p>
            <Link href="/shop" className="bg-[#1B6FEB] text-white font-bold px-8 py-3 rounded-full hover:bg-[#1557D0] transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display font-black text-gray-900 text-3xl">Latest Products</h2>
                <p className="text-gray-400 text-sm mt-1">{products.length} new items added recently</p>
              </div>
              <Link href="/shop?newArrival=true"
                className="text-sm font-bold text-[#1B6FEB] border-2 border-[#1B6FEB]/30 px-6 py-2.5 rounded-full hover:bg-[#1B6FEB] hover:text-white hover:border-[#1B6FEB] transition-all hidden sm:inline-flex items-center gap-2">
                Shop All →
              </Link>
            </div>

            <NewArrivalsGrid products={products} />

            <div className="text-center mt-12">
              <Link href="/shop?newArrival=true"
                className="inline-flex items-center gap-2.5 bg-[#1B6FEB] text-white font-black px-12 py-4 rounded-full hover:bg-[#1557D0] transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 text-sm tracking-wide">
                SHOP ALL NEW ARRIVALS →
              </Link>
            </div>
          </>
        )}
      </section>

    </div>
  );
}
