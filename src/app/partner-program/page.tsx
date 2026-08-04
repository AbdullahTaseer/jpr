import Image from "next/image";
import Link from "next/link";

const unsplash = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;

const PARTNER_TYPES = [
  {
    icon: "🤝",
    title: "Affiliate Partners",
    desc: "Earn a commission for every customer you refer who makes a purchase on our platform. Perfect for bloggers, influencers, and content creators.",
    earn: "Up to 8% commission",
    color: "bg-blue-50 border-blue-200",
    accent: "text-[#1B6FEB]",
  },
  {
    icon: "🏢",
    title: "Business Partners",
    desc: "Strategic partnerships for businesses that want to integrate or co-market with Latter Day Shopping. Co-branded campaigns and revenue sharing.",
    earn: "Custom revenue share",
    color: "bg-purple-50 border-purple-200",
    accent: "text-purple-600",
  },
  {
    icon: "🎓",
    title: "Community Partners",
    desc: "Organizations, nonprofits, and communities that share our values. We offer special rates, co-branding opportunities, and mutual support.",
    earn: "Mutual value exchange",
    color: "bg-emerald-50 border-emerald-200",
    accent: "text-emerald-600",
  },
  {
    icon: "🛠️",
    title: "Technology Partners",
    desc: "Integrate your tools with our platform via API. Build apps, plugins, and integrations that enhance the seller and buyer experience.",
    earn: "API access + revenue",
    color: "bg-amber-50 border-amber-200",
    accent: "text-amber-600",
  },
];

const HOW = [
  { n: "01", title: "Apply",    desc: "Submit a brief application describing your audience, reach, and how you'd like to partner with us." },
  { n: "02", title: "Approve",  desc: "Our partnerships team reviews your application within 3 business days and reaches out with next steps." },
  { n: "03", title: "Onboard",  desc: "Get your unique referral links, co-marketing assets, and access to the partner dashboard." },
  { n: "04", title: "Earn",     desc: "Start sharing and earning. Payouts are processed monthly with transparent reporting." },
];

const CURRENT = [
  { name: "The Conscious Consumer Podcast", type: "Media Partner",   img: "1556742049-0cfed4f6a45d" },
  { name: "GreenLife Magazine",             type: "Editorial Partner",img: "1498837167922-ddd27525d352" },
  { name: "EcoHub Community",              type: "Community Partner",img: "1521737604082-14667f68a36a" },
];

export default function PartnerProgramPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#070C1B] via-[#0A1E4A] to-[#1B3A8A] py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <span className="text-white">Partner Program</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#60A5FA] text-xs font-black uppercase tracking-[0.25em]">Partnerships</span>
              <h1 className="font-display font-black text-white text-5xl lg:text-7xl mt-3 mb-6 leading-tight">
                Grow Together<br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">With Purpose</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Whether you&apos;re a content creator, business, or community — our partner program lets you share in our mission while earning real rewards.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#apply" className="inline-flex items-center gap-2 bg-[#1B6FEB] text-white font-black px-9 py-4 rounded-full hover:bg-blue-500 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
                  Apply to Partner →
                </a>
                <a href="#types" className="border border-white/25 text-white/80 font-semibold px-9 py-4 rounded-full hover:bg-white/10 transition-all text-sm">
                  See Partner Types
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "8%",    l: "Max Commission",     bg: "bg-[#1B6FEB]" },
                { v: "500+",  l: "Active Partners",    bg: "bg-white/10 border border-white/15" },
                { v: "$2M+",  l: "Partner Earnings",   bg: "bg-white/10 border border-white/15" },
                { v: "30d",   l: "Cookie Window",      bg: "bg-amber-500/90" },
              ].map(s => (
                <div key={s.l} className={`${s.bg} rounded-3xl p-7 text-center`}>
                  <p className="font-display font-black text-3xl text-white">{s.v}</p>
                  <p className="text-white/60 text-xs mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section id="types" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Options</span>
          <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">Partner Types</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">Find the partnership model that works best for you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PARTNER_TYPES.map(pt => (
            <div key={pt.title} className={`rounded-3xl border-2 ${pt.color} p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
              <div className="text-4xl mb-5">{pt.icon}</div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-black text-gray-900 text-xl">{pt.title}</h3>
                <span className={`text-xs font-black ${pt.accent} whitespace-nowrap bg-white px-3 py-1.5 rounded-full border`}>{pt.earn}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Process</span>
            <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">How to Get Started</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW.map((h, i) => (
              <div key={h.n} className={`rounded-3xl p-7 ${i === 0 ? "bg-[#1B6FEB]" : "bg-white border border-gray-100 shadow-sm"}`}>
                <p className={`font-display font-black text-5xl leading-none mb-5 ${i === 0 ? "text-white/20" : "text-gray-100"}`}>{h.n}</p>
                <h3 className={`font-black text-xl mb-3 ${i === 0 ? "text-white" : "text-gray-900"}`}>{h.title}</h3>
                <p className={`text-sm leading-relaxed ${i === 0 ? "text-white/70" : "text-gray-500"}`}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current partners */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display font-black text-5xl text-gray-900 mb-4">Our Partners</h2>
          <p className="text-gray-400 text-sm">A few of the amazing organizations we work with.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CURRENT.map(p => (
            <div key={p.name} className="group relative h-48 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <Image src={unsplash(p.img, 600, 400)} fill alt={p.name} className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white/60 text-xs font-bold mb-1">{p.type}</p>
                <p className="text-white font-black text-base">{p.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Apply CTA */}
      <section id="apply" className="py-20 bg-gradient-to-br from-[#070C1B] to-[#1045A8]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-white text-5xl mb-5 leading-tight">
            Ready to Partner<br />
            <span className="italic text-yellow-300">With Us?</span>
          </h2>
          <p className="text-white/55 text-base leading-relaxed mb-9 max-w-lg mx-auto">
            Drop us a message and our partnerships team will respond within 3 business days with a personalised proposal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#1B6FEB] font-black px-9 py-4 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
              Apply to Partner →
            </Link>
            <a href="mailto:partnerships@latterdayshopping.com"
              className="border border-white/25 text-white/80 font-semibold px-9 py-4 rounded-full hover:bg-white/10 transition-all text-sm">
              Email Partnerships Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
