export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const unsplash = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;

const DEFAULT_VALUES = [
  { icon: "🌱", title: "Sustainability",  desc: "Every product on our platform is chosen with environmental responsibility in mind. We partner with vendors who care about the planet." },
  { icon: "🤝", title: "Trust",           desc: "We manually review and approve every vendor, ensuring our shoppers can purchase with full confidence in quality and authenticity." },
  { icon: "💡", title: "Intentionality",  desc: "We believe in mindful commerce — products created with purpose and bought with intention, not impulse." },
  { icon: "🌍", title: "Community",       desc: "More than a marketplace — we're a movement of people who believe business can be a force for good in the world." },
];

const DEFAULT_TIMELINE = [
  { year: "2008", title: "Established", desc: "Our story began in 2008 — building businesses rooted in preparedness, quality, and products families can trust." },
  { year: "Two Brands", title: "Emergency Essentials", desc: "Emergency Essentials / BePrepared is one of our two businesses: food storage, kits, and emergency preparedness supplies." },
  { year: "Two Brands", title: "Secret Garden Bees", desc: "Secret Garden Bees, an NC Veteran Farm, is our second business — honey and farm goods produced with care." },
  { year: "Today", title: "One Marketplace", desc: "Latter Day Shopping is home to those two businesses. We are not a marketplace of thousands of vendors — just two focused brands, side by side." },
];

export default async function AboutPage() {
  const [members, cmsItems, missionProduct] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    prisma.pageContent.findMany({ where: { page: "about" } }),
    prisma.product.findFirst({
      where: { isActive: true, isFeatured: false, isNewArrival: false, images: { isEmpty: false } },
      orderBy: { createdAt: "desc" },
      select: { images: true },
    }),
  ]);

  const cmsMap: Record<string, string> = {};
  cmsItems.forEach(item => { cmsMap[`${item.section}.${item.key}`] = item.value; });
  const c = (section: string, key: string, def: string) => cmsMap[`${section}.${key}`] ?? def;

  const heroImage = c("hero", "image", "") || unsplash("1522202176988-66273c7fd55f", 1600, 900);
  const missionImage = c("mission", "image", "") || missionProduct?.images[0] || unsplash("1521737711867-e3b97375f902", 800, 1000);

  const values = DEFAULT_VALUES.map((dv, i) => ({
    icon:  c("values", `${i}.icon`,  dv.icon),
    title: c("values", `${i}.title`, dv.title),
    desc:  c("values", `${i}.desc`,  dv.desc),
  }));

  const timeline = DEFAULT_TIMELINE.map((dt, i) => ({
    year:  c("timeline", `${i}.year`,  dt.year),
    title: c("timeline", `${i}.title`, dt.title),
    desc:  c("timeline", `${i}.desc`,  dt.desc),
  }));

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <Image src={heroImage} fill alt="Our team"
          className="object-cover object-center" sizes="100vw" priority unoptimized={!!cmsMap["hero.image"]} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070C1B]/95 via-[#070C1B]/75 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#1B6FEB]" />
              <span className="text-[#1B6FEB] text-xs font-black tracking-[0.25em] uppercase">Our Story</span>
            </div>
            <h1 className="font-display font-black text-white text-5xl lg:text-7xl leading-[0.95] mb-6">
              {c("hero", "heading", "About Latter Day Shopping")}
            </h1>
            <p className="text-white/65 text-lg leading-relaxed max-w-md">
              {c("hero", "subtext", "We are a community-driven marketplace built on the belief that commerce can be a force for good — connecting buyers who care with sellers who create with intention.")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Our Mission</span>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-gray-900 mt-3 mb-6 leading-tight">
              {c("mission", "heading", "A marketplace built on trust and shared values")}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              {c("mission", "para1", "Latter Day Shopping was born from a simple but powerful idea: what if shopping could feel good — not just for you, but for the planet and the people behind every product?")}
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              {c("mission", "para2", "We operate two businesses — Emergency Essentials and Secret Garden Bees. Every product on this site comes from those brands, so you always know where your money is going.")}
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              {[
                { v: c("mission", "stat0.value", "2"),     l: c("mission", "stat0.label", "Businesses") },
                { v: c("mission", "stat1.value", "100+"),  l: c("mission", "stat1.label", "Products") },
                { v: c("mission", "stat2.value", "2008"),  l: c("mission", "stat2.label", "Established") },
              ].map(s => (
                <div key={s.l} className="text-center">
                  <p className="font-display font-black text-3xl text-[#1B6FEB]">{s.v}</p>
                  <p className="text-gray-400 text-xs mt-1 font-semibold">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#1B6FEB]/08 rounded-[3rem] -z-10" />
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src={missionImage} fill alt="Mission"
                className="object-cover" sizes="(max-width:1024px)100vw,50vw" unoptimized={!!cmsMap["mission.image"]} />
            </div>
            {/* <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
              <p className="font-black text-gray-900 text-sm">Vendor Approved</p>
              <p className="text-gray-400 text-xs mt-0.5">Every seller is manually verified</p>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(i=><span key={i} className="text-amber-400 text-sm">★</span>)}
                <span className="text-gray-500 text-xs ml-1">4.9/5 platform rating</span>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">What We Stand For</span>
            <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i}
                className={`rounded-3xl p-8 ${i === 0 ? "bg-[#1B6FEB] text-white" : "bg-white border border-gray-100"} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                <div className="text-4xl mb-5">{v.icon}</div>
                <h3 className={`font-black text-lg mb-3 ${i === 0 ? "text-white" : "text-gray-900"}`}>{v.title}</h3>
                <p className={`text-sm leading-relaxed ${i === 0 ? "text-white/75" : "text-gray-500"}`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Our Journey</span>
          <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">How We Got Here</h2>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#1B6FEB] via-[#1B6FEB]/30 to-transparent hidden lg:block" />
          <div className="space-y-12">
            {timeline.map((t, i) => (
              <div key={i} className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                <div className={`lg:w-1/2 ${i % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:text-left lg:pl-16"}`}>
                  <span className="inline-block bg-[#1B6FEB] text-white font-black text-sm px-4 py-1.5 rounded-full mb-3">{t.year}</span>
                  <h3 className="font-display font-black text-2xl text-gray-900 mb-2">{t.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
                <div className="hidden lg:flex w-10 h-10 rounded-full bg-[#1B6FEB] border-4 border-white shadow-lg items-center justify-center flex-shrink-0 z-10">
                  <span className="text-white text-xs font-black">{i+1}</span>
                </div>
                <div className="lg:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      {members.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">The Founder</span>
              <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">
                {members.length === 1 ? "Meet Our Founder" : "Meet Our Team"}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                {members.length === 1
                  ? "The person behind Latter Day Shopping and our two businesses."
                  : "A small, passionate team on a big mission to change the way the world shops."}
              </p>
            </div>
            {members.length === 1 ? (
              <div className="max-w-3xl mx-auto">
                {members.map((m) => (
                  <div key={m.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 md:flex">
                    <div className="relative h-80 md:min-h-[360px] md:w-80 flex-shrink-0 bg-gray-100">
                      {m.imageUrl ? (
                        <Image src={m.imageUrl} fill alt={m.name}
                          className="object-cover object-top"
                          sizes="(max-width:768px)100vw,320px" unoptimized />
                      ) : (
                        <div className="w-full h-full min-h-80 flex items-center justify-center bg-gradient-to-br from-[#1B6FEB]/10 to-[#1B6FEB]/20">
                          <span className="text-[#1B6FEB] font-black text-6xl opacity-30">{m.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <h3 className="font-display font-black text-gray-900 text-2xl">{m.name}</h3>
                      <p className="text-[#1B6FEB] text-sm font-bold mt-1 mb-4">{m.role}</p>
                      {m.bio && <p className="text-gray-500 text-sm leading-relaxed">{m.bio}</p>}
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="text-[#1B6FEB] text-sm mt-5 font-semibold hover:underline truncate">
                          {m.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 min-[470px]:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((m) => (
                  <div key={m.id} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100">
                    <div className="relative h-80 min-[470px]:h-64 overflow-hidden bg-gray-100">
                      {m.imageUrl ? (
                        <Image src={m.imageUrl} fill alt={m.name}
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width:640px)50vw,25vw" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B6FEB]/10 to-[#1B6FEB]/20">
                          <span className="text-[#1B6FEB] font-black text-6xl opacity-30">{m.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1B6FEB]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-black text-gray-900 text-sm">{m.name}</h3>
                      <p className="text-[#1B6FEB] text-xs font-bold mt-0.5 mb-2">{m.role}</p>
                      {m.bio && <p className="text-gray-400 text-xs leading-relaxed">{m.bio}</p>}
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="text-[#1B6FEB]/60 text-xs mt-2 block hover:text-[#1B6FEB] transition-colors truncate">
                          {m.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Vendor CTA ── */}
      <section className="py-24 bg-gradient-to-br from-[#070C1B] via-[#0D2A5E] to-[#1B6FEB]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-white text-5xl mb-6 leading-tight">
            {c("cta", "heading", "Ready to Join Our Community?")}
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            {c("cta", "subtext", "Whether you're a conscious shopper or a vendor with a story to tell, there's a place for you here.")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="bg-white text-[#1B6FEB] font-black px-9 py-4 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
              Start Shopping
            </Link>
            <a href="#" className="border-2 border-white/40 text-white font-bold px-9 py-4 rounded-full hover:bg-white/10 transition-all text-sm">
              Become a Vendor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};