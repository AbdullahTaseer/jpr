export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const DEFAULT_SECTIONS = [
  { id: "s1", title: "General Disclaimer",       content: "The information provided on Latter Day Shopping is for general informational purposes only. While we strive to keep all information accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, products, or services available on this platform." },
  { id: "s2", title: "Product Information",      content: "Product descriptions, images, pricing, and availability are provided by individual vendors and are subject to change without notice. Latter Day Shopping acts as a marketplace platform and is not responsible for inaccuracies in vendor-provided content. Always review product details before making a purchase." },
  { id: "s3", title: "Vendor Responsibility",    content: "While we carefully vet and approve all vendors, Latter Day Shopping is not responsible for the actions, products, or claims of individual sellers. Transactions are between the buyer and vendor directly. We encourage all users to review vendor ratings and product descriptions carefully." },
  { id: "s4", title: "Health & Wellness Claims", content: "Any health, wellness, or nutritional claims made by vendors have not been evaluated by the Food and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement or wellness routine." },
  { id: "s5", title: "External Links",           content: "Our platform may contain links to third-party websites. These links are provided for convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them." },
];

export default async function DisclaimerPage() {
  const items = await prisma.pageContent.findMany({ where: { page: "disclaimer" } });
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
            <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Disclaimer</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-6xl mb-4">Disclaimer</h1>
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
              <p className="text-gray-500 text-sm">Questions? <Link href="/contact" className="text-[#1B6FEB] font-bold hover:underline">Contact us</Link>.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
