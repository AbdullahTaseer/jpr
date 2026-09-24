export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PUBLIC_PRODUCT_WHERE } from "@/lib/products";

const GRADIENTS = [
  "from-[#1B6FEB] to-[#0A2070]",
  "from-[#0891b2] to-[#0e7490]",
  "from-[#059669] to-[#047857]",
  "from-[#dc2626] to-[#b91c1c]",
  "from-[#d97706] to-[#b45309]",
  "from-[#7c3aed] to-[#6d28d9]",
  "from-[#16a34a] to-[#15803d]",
  "from-[#db2777] to-[#be185d]",
  "from-[#b45309] to-[#92400e]",
  "from-[#6d28d9] to-[#5b21b6]",
];

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: { where: PUBLIC_PRODUCT_WHERE } } } },
    orderBy: { name: "asc" },
  });

  const vendors = await prisma.user.findMany({
    where: {
      role: "VENDOR",
      vendorStatus: "APPROVED",
      isActive: true,
      shopSlug: { not: null },
      shopName: { in: brands.map((b) => b.name) },
    },
    select: { shopName: true, shopSlug: true },
  });
  const vendorSlugByBrandName = new Map(
    vendors.map((v) => [v.shopName as string, v.shopSlug as string])
  );

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#070C1B] via-[#0A1E4A] to-[#1B3A8A] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Brands</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#60A5FA] text-xs font-black uppercase tracking-[0.25em]">Our Vendors</span>
              <h1 className="font-display font-black text-white text-5xl lg:text-7xl mt-3 mb-5 leading-tight">
                Discover<br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#1B6FEB] to-sky-300">Top Brands</span>
              </h1>
              <p className="text-white/55 text-lg leading-relaxed">
                Every brand on our platform is manually verified. These are makers, creators, and small businesses who pour their values into every product.
              </p>
            </div>
            {/* Brand logo collage */}
            <div className="grid grid-cols-3 gap-3">
              {brands.slice(0, 6).map((b, i) => (
                <div key={b.id} className={`relative h-24 rounded-2xl overflow-hidden bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} border border-white/10 flex flex-col items-center justify-center gap-2 p-2`}>
                  {b.logoUrl && (
                    <Image src={b.logoUrl} alt={b.name} width={36} height={36} className="rounded-lg opacity-90" unoptimized />
                  )}
                  <p className="text-white font-black text-[10px] text-center leading-tight">{b.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display font-black text-gray-900 text-4xl">All Brands</h2>
            <p className="text-gray-400 text-sm mt-1">{brands.length} verified brands</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b, i) => {
            const grad = GRADIENTS[i % GRADIENTS.length];
            const vendorSlug = vendorSlugByBrandName.get(b.name);
            const href = vendorSlug ? `/vendor/${vendorSlug}` : `/shop?brandId=${b.id}`;
            return (
              <Link key={b.id} href={href}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#1B6FEB]/20 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">

                {/* Card header — gradient with logo */}
                <div className={`relative h-44 bg-gradient-to-br ${grad} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
                  {b.logoUrl ? (
                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <Image src={b.logoUrl} alt={b.name} width={40} height={40} className="rounded-xl" unoptimized />
                      </div>
                      <p className="text-white font-black text-lg drop-shadow-lg">{b.name}</p>
                    </div>
                  ) : (
                    <p className="text-white font-black text-2xl relative z-10 drop-shadow-lg">{b.name}</p>
                  )}
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-black text-gray-900 text-sm">{b.name}</p>
                    {b.website && (
                      <p className="text-gray-400 text-xs mt-0.5 truncate max-w-[160px]">{b.website.replace(/^https?:\/\//, "")}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-base">{b._count.products}</p>
                    <p className="text-gray-400 text-xs">products</p>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="w-full text-center text-xs font-bold text-[#1B6FEB] border-2 border-[#1B6FEB]/25 py-2.5 rounded-2xl group-hover:bg-[#1B6FEB] group-hover:text-white group-hover:border-[#1B6FEB] transition-all duration-200">
                    VIEW PRODUCTS
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Join Our Community</span>
          <h2 className="font-display font-black text-gray-900 text-5xl mt-3 mb-5">Want to be listed here?</h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto mb-9">
            Apply to become a vendor and join thousands of purpose-driven brands already selling on Latter Day Shopping.
          </p>
          <Link href="/vendor" className="inline-flex items-center gap-2 bg-[#1B6FEB] text-white font-black px-10 py-4 rounded-full hover:bg-[#1557D0] transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 text-sm">
            Become a Vendor →
          </Link>
        </div>
      </section>
    </div>
  );
}
