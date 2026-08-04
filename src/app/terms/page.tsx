export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const DEFAULT_SECTIONS = [
  { id: "s1", title: "1. Acceptance of Terms",     content: "By accessing or using Latter Day Shopping, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and your continued use of the platform after such changes constitutes your acceptance of the new terms." },
  { id: "s2", title: "2. Eligibility",             content: "You must be at least 18 years of age to use our platform as a vendor or to make purchases. By using Latter Day Shopping, you represent and warrant that you meet this age requirement. Latter Day Shopping is available to users worldwide, though some features may be restricted based on your location." },
  { id: "s3", title: "3. User Accounts",           content: "To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms." },
  { id: "s4", title: "4. Vendor Terms",            content: "Vendors must apply and be approved before listing products. Approved vendors agree to accurately represent their products, fulfill orders in a timely manner, and maintain a minimum satisfaction rating. Latter Day Shopping charges a commission on each successful sale. Vendors may not list counterfeit, illegal, or harmful products." },
  { id: "s5", title: "5. Purchases & Payments",    content: "All transactions are processed securely through our payment providers. Prices are listed in USD and may be subject to applicable taxes. Once an order is placed, it is subject to the vendor's return and cancellation policy, which is displayed on each product page before purchase." },
  { id: "s6", title: "6. Prohibited Activities",   content: "Users may not engage in fraudulent activity, harassment, spam, or any activity that disrupts the platform. Scraping, reverse engineering, or attempting to circumvent security measures is strictly prohibited. Violation of these rules may result in immediate account termination and legal action where applicable." },
  { id: "s7", title: "7. Intellectual Property",   content: "All content on Latter Day Shopping, including logos, text, images, and software, is the property of Latter Day Shopping or its licensors. Vendors retain ownership of their product listings but grant us a license to display this content. You may not reproduce or distribute our content without express written permission." },
  { id: "s8", title: "8. Limitation of Liability", content: "Latter Day Shopping is a marketplace platform and is not responsible for the quality, accuracy, or legality of vendor products. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform." },
  { id: "s9", title: "9. Contact",                 content: "If you have questions about these Terms of Service, please contact us at support@latterdayshopping.com or write to us at: Latter Day Shopping, Salt Lake City, Utah, United States." },
];

export default async function TermsPage() {
  const items = await prisma.pageContent.findMany({ where: { page: "terms" } });
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
            <span>/</span><span className="text-white">Terms of Service</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-6xl mb-4">Terms of Service</h1>
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
                Please read these Terms of Service carefully before using our platform. By using Latter Day Shopping, you agree to these terms in full.
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
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-10">
              <p className="text-gray-500 text-sm">
                Have questions about our terms? <Link href="/contact" className="text-[#1B6FEB] font-bold hover:underline">Contact us</Link> — we&apos;re happy to help clarify anything.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
