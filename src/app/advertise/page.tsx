import Image from "next/image";
import Link from "next/link";

const unsplash = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;

const PACKAGES = [
  {
    name: "Starter",
    price: "$199",
    period: "/month",
    desc: "Perfect for new brands looking to build awareness.",
    color: "border-gray-200",
    features: ["Featured in category pages", "Sponsored product badge", "Basic analytics dashboard", "Up to 5 boosted products", "Email support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$499",
    period: "/month",
    desc: "Ideal for scaling brands ready to accelerate sales.",
    color: "border-[#1B6FEB]",
    features: ["Homepage banner placement", "Featured vendor spotlight", "Priority search placement", "Up to 20 boosted products", "Advanced analytics & ROI", "Dedicated account manager"],
    cta: "Most Popular",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$1,199",
    period: "/month",
    desc: "Maximum visibility for established brands.",
    color: "border-amber-400",
    features: ["Hero banner on homepage", "Newsletter feature (80K+ subscribers)", "Blog feature article", "Unlimited boosted products", "Custom campaign strategy", "Priority 24/7 support"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const AD_PLACEMENTS = [
  { location: "Homepage Hero",        reach: "200K+ monthly views",  type: "Banner",    img: "1483985988355-763728e1935b" },
  { location: "Category Pages",       reach: "50K+ targeted views",  type: "Sponsored", img: "1484101403633-562f891dc89a" },
  { location: "Search Results",       reach: "30K+ active shoppers", type: "Priority",  img: "1518770660439-4636190af475" },
  { location: "Newsletter Feature",   reach: "80K+ subscribers",     type: "Editorial", img: "1522335789203-aabd1fc54bc9" },
];

export default function AdvertisePage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image src={unsplash("1556742049-0cfed4f6a45d", 1600, 700)} fill alt="Advertise" className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04080F]/97 via-[#070C1B]/90 to-[#1B3A8A]/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <span className="text-white">Advertise With Us</span>
          </div>
          <div className="max-w-2xl">
            <span className="text-[#60A5FA] text-xs font-black uppercase tracking-[0.25em]">Grow Your Brand</span>
            <h1 className="font-display font-black text-white text-5xl lg:text-7xl mt-3 mb-5 leading-tight">
              Advertise<br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#1B6FEB] to-sky-300">With Us</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-9">
              Reach 200,000+ intentional shoppers who are actively looking for exactly what you sell. Our audience is pre-qualified — they shop with purpose.
            </p>
            <div className="flex flex-wrap gap-8">
              {[["200K+", "Monthly Shoppers"], ["4.9★", "Avg. Vendor Rating"], ["80K+", "Newsletter Subscribers"], ["35%", "Avg. CTR on Sponsored"]].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display font-black text-3xl text-white">{v}</p>
                  <p className="text-white/40 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placements */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Placements</span>
            <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">Where Your Brand Appears</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AD_PLACEMENTS.map((p, i) => (
              <div key={p.location} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <Image src={unsplash(p.img, 400, 300)} fill alt={p.location} className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width:640px)100vw,25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 right-3 bg-[#1B6FEB] text-white text-[10px] font-black px-2.5 py-1 rounded-full">{p.type}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-gray-900 text-sm mb-1">{p.location}</h3>
                  <p className="text-[#1B6FEB] text-xs font-bold">{p.reach}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Pricing</span>
          <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">Simple, Transparent Plans</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">No hidden fees. Cancel anytime. All plans include a 14-day free trial.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start">
          {PACKAGES.map(pkg => (
            <div key={pkg.name}
              className={`rounded-3xl border-2 ${pkg.color} ${pkg.highlighted ? "shadow-2xl shadow-blue-100 scale-105" : "shadow-sm"} bg-white overflow-hidden`}>
              {pkg.highlighted && (
                <div className="bg-[#1B6FEB] text-white text-center text-xs font-black tracking-widest py-2.5 uppercase">Most Popular</div>
              )}
              <div className="p-8">
                <h3 className="font-black text-gray-900 text-xl mb-1">{pkg.name}</h3>
                <p className="text-gray-400 text-sm mb-5">{pkg.desc}</p>
                <div className="flex items-baseline gap-1 mb-7">
                  <span className={`font-display font-black text-5xl ${pkg.highlighted ? "text-[#1B6FEB]" : "text-gray-900"}`}>{pkg.price}</span>
                  <span className="text-gray-400 text-sm">{pkg.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-600 text-[10px] font-black">✓</span>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact"
                  className={`block w-full text-center font-black py-3.5 rounded-2xl text-sm transition-all hover:-translate-y-0.5
                    ${pkg.highlighted ? "bg-[#1B6FEB] text-white hover:bg-[#1557D0] shadow-lg shadow-blue-200" : "border-2 border-gray-200 text-gray-700 hover:border-[#1B6FEB] hover:text-[#1B6FEB]"}`}>
                  {pkg.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#070C1B] to-[#1045A8]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-white text-4xl mb-5">Ready to grow your brand?</h2>
          <p className="text-white/55 mb-8">Get in touch and we&apos;ll build a custom advertising strategy for your brand.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#1B6FEB] font-black px-9 py-4 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
            Contact Our Ad Team →
          </Link>
        </div>
      </section>
    </div>
  );
}
