export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const DEFAULT_SECTIONS = [
  { id: "s1", title: "What Is Affiliate Marketing?",    content: "Affiliate marketing is a performance-based arrangement where we may earn a commission when you click certain links on our platform and make a qualifying purchase. This allows us to maintain and improve the platform at no additional cost to you — you pay the same price regardless of whether we earn a commission." },
  { id: "s2", title: "How It Works on Our Platform",   content: "Latter Day Shopping is primarily a marketplace where vendors sell directly to buyers. In some cases, we may link to external vendors or partner products where we have an affiliate relationship. These are always clearly marked wherever they appear — including in our navigation and footer." },
  { id: "s3", title: "Vendor Relationships",           content: "Our primary business model is a commission earned on marketplace sales. Vendor approval is based solely on product quality, sustainability standards, and values alignment — not on affiliate compensation. We are committed to recommending only products and vendors we genuinely believe in." },
  { id: "s4", title: "Our Commitment to Transparency", content: "We believe in full transparency. Any content that includes affiliate links will be clearly identified. Our editorial recommendations are never influenced by affiliate arrangements. The integrity of our community and the trust of our shoppers will always take priority over any financial arrangement." },
  { id: "s5", title: "Questions About This Disclosure",content: "If you have questions about our affiliate relationships or any specific partnership, please contact us at affiliates@latterdayshopping.com. We are committed to answering all inquiries honestly and promptly." },
];

export default async function AffiliateDisclosurePage() {
  const items = await prisma.pageContent.findMany({ where: { page: "affiliate-disclosure" } });
  const cms: Record<string, string> = {};
  items.forEach(i => { cms[`${i.section}.${i.key}`] = i.value; });
  const c = (section: string, key: string, def: string) => cms[`${section}.${key}`] ?? def;

  const lastUpdated = c("info", "lastUpdated", "May 15, 2026");
  const sections = DEFAULT_SECTIONS.map(s => ({
    id: s.id,
    title: c(s.id, "title", s.title),
    content: c(s.id, "content", s.content),
  }));

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-br from-[#070C1B] via-[#0A1E4A] to-[#1B3A8A] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-5">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Affiliate Disclosure</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-6xl mb-4">Affiliate Disclosure</h1>
          <p className="text-white/50 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#1B6FEB] rounded-full" /> Contents
              </h3>
              <nav className="space-y-1">
                {sections.map(s => (
                  <a key={s.id} href={`#${s.id}`} className="block text-sm text-gray-500 hover:text-[#1B6FEB] py-1.5 hover:translate-x-1 transition-all">{s.title}</a>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-10">
          
            {sections.map(s => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display font-black text-gray-900 text-2xl mb-4 flex items-start gap-3">
                  <span className="w-1.5 h-6 bg-[#1B6FEB] rounded-full mt-1 flex-shrink-0" />{s.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed pl-4 border-l border-gray-100">{s.content}</p>
              </section>
            ))}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-500 text-sm">Questions about our affiliate practices? <Link href="/contact" className="text-[#1B6FEB] font-bold hover:underline">Contact us</Link>.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
