export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const FALLBACK = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=440&q=85&auto=format&fit=crop";
const GRADIENTS = [
  "from-pink-500 to-rose-400",
  "from-blue-600 to-indigo-500",
  "from-green-500 to-emerald-400",
  "from-amber-500 to-orange-400",
  "from-purple-500 to-pink-400",
  "from-teal-500 to-cyan-400",
  "from-red-500 to-rose-400",
  "from-sky-500 to-blue-400",
  "from-lime-500 to-green-400",
  "from-yellow-500 to-amber-400",
];

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ showOnHomepage: "desc" }, { name: "asc" }],
  });

  const featured = categories.slice(0, 3);

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#070C1B] via-[#0A1E4A] to-[#1B3A8A] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Categories</span>
          </div>
          <div className="max-w-2xl">
            <span className="text-[#60A5FA] text-xs font-black uppercase tracking-[0.25em]">Browse</span>
            <h1 className="font-display font-black text-white text-5xl lg:text-7xl mt-3 mb-5 leading-tight">
              All <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#1B6FEB] to-sky-300">Categories</span>
            </h1>
            <p className="text-white/55 text-lg leading-relaxed">
              Explore products across every category — all from verified vendors who create with intention and care.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-white/[0.08]">
            {[
              [String(categories.length), "Categories"],
              [String(categories.reduce((s, c) => s + c._count.products, 0)), "Products"],
              ["2", "Businesses"],
              ["2008", "Established"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display font-black text-3xl text-white">{v}</p>
                <p className="text-white/40 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured — large cards */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-5 h-0.5 bg-[#1B6FEB] rounded-full" />
            <h2 className="font-black text-gray-900 text-sm uppercase tracking-[0.2em]">Most Popular</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featured.map((cat, i) => {
              const img = cat.imageUrl || FALLBACK;
              const grad = GRADIENTS[i % GRADIENTS.length];
              return (
                <Link key={cat.id} href={`/shop?categoryId=${cat.id}`}
                  className="group relative h-72 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 block">
                  <Image src={img} fill alt={cat.name}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width:1024px)100vw,33vw" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-25 transition-opacity duration-500`} />
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                      {cat._count.products.toLocaleString()} products
                    </p>
                    <h3 className="font-display font-black text-white text-2xl mb-3">{cat.name}</h3>
                    <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-semibold">
                      Shop now →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* All categories grid */}
      <section className="py-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-5 h-0.5 bg-[#1B6FEB] rounded-full" />
          <h2 className="font-black text-gray-900 text-sm uppercase tracking-[0.2em]">All Categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => {
            const img = cat.imageUrl || FALLBACK;
            const grad = GRADIENTS[i % GRADIENTS.length];
            return (
              <Link key={cat.id} href={`/shop?categoryId=${cat.id}`}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <Image src={img} fill alt={cat.name}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width:640px)50vw,25vw" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-30 transition-opacity duration-400`} />
                </div>
                <div className="p-4">
                  <h3 className="font-black text-gray-900 text-sm group-hover:text-[#1B6FEB] transition-colors">{cat.name}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">{cat._count.products.toLocaleString()} products</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#070C1B] to-[#1045A8] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-white text-4xl mb-5">Don&apos;t see your category?</h2>
          <p className="text-white/55 mb-8">We&apos;re always expanding. If you&apos;re a vendor with a unique product category, apply to join the platform.</p>
          <Link href="/vendor" className="inline-flex items-center gap-2 bg-white text-[#1B6FEB] font-black px-9 py-4 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
            Become a Vendor →
          </Link>
        </div>
      </section>
    </div>
  );
};