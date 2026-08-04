export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const DEFAULT_SECTIONS = [
  { id: "s1", title: "1. Information We Collect",      content: "We collect information you provide directly (name, email, payment info), information collected automatically (browsing behavior, device data, IP address), and information from third parties (payment processors, social login). We use cookies and similar technologies to enhance your experience and analyze site traffic." },
  { id: "s2", title: "2. How We Use Your Information", content: "We use collected information to process orders and payments, personalize your shopping experience, communicate with you about orders and promotions, improve our platform, comply with legal obligations, and prevent fraud. We do not sell your personal data to third parties." },
  { id: "s3", title: "3. Information Sharing",         content: "We share your information only with vendors (for order fulfillment), payment processors (for secure transactions), service providers (hosting, analytics, email), and law enforcement when required by law. All third parties are bound by data protection agreements." },
  { id: "s4", title: "4. Data Security",               content: "We implement industry-standard security measures including SSL encryption, secure data centers, and regular security audits. While we take reasonable precautions, no data transmission over the internet is 100% secure. We encourage you to use strong, unique passwords and to contact us immediately if you suspect unauthorized access." },
  { id: "s5", title: "5. Cookies",                     content: "We use essential cookies (required for platform function), analytical cookies (to understand usage), and marketing cookies (for relevant advertising). You can control cookie preferences in your browser settings. Disabling certain cookies may affect platform functionality." },
  { id: "s6", title: "6. Your Rights",                 content: "Depending on your location, you may have the right to access, correct, or delete your personal data; restrict or object to processing; data portability; and to withdraw consent. To exercise these rights, contact us at privacy@latterdayshopping.com. We will respond within 30 days." },
  { id: "s7", title: "7. Data Retention",              content: "We retain your data for as long as your account is active or as needed to provide services. You may delete your account at any time through your account settings. Transaction records may be retained for up to 7 years for legal and tax compliance purposes." },
  { id: "s8", title: "8. Children's Privacy",          content: "Our platform is not intended for users under 18. We do not knowingly collect personal information from children. If we discover that a child under 18 has provided us with personal information, we will delete it immediately." },
  { id: "s9", title: "9. Contact Us",                  content: "For privacy-related inquiries, contact our Data Protection Officer at privacy@latterdayshopping.com or write to: Privacy Team, Latter Day Shopping, Salt Lake City, Utah, United States." },
];

export default async function PrivacyPage() {
  const items = await prisma.pageContent.findMany({ where: { page: "privacy" } });
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
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span><span className="text-white">Privacy Policy</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-6xl mb-4">Privacy Policy</h1>
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
                  <a key={s.id} href={`#${s.id}`} className="block text-sm text-gray-500 hover:text-[#1B6FEB] py-1.5 hover:translate-x-1 transition-all leading-snug">{s.title}</a>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-10">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-[#1B6FEB] font-semibold text-sm leading-relaxed">
                Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use Latter Day Shopping.
              </p>
            </div>
            {sections.map(s => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display font-black text-gray-900 text-2xl mb-4 flex items-start gap-3">
                  <span className="w-1.5 h-6 bg-[#1B6FEB] rounded-full mt-1 flex-shrink-0" />
                  {s.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed pl-4 border-l border-gray-100">{s.content}</p>
              </section>
            ))}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-500 text-sm">Questions about privacy? <Link href="/contact" className="text-[#1B6FEB] font-bold hover:underline">Contact us</Link>.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
