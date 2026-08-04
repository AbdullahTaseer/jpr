"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

const unsplash = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;

const DEFAULT_PERKS = [
  { icon: "🚀", title: "0% Commission",       desc: "Keep 100% of what you earn. We never take a cut of your sales." },
  { icon: "🆓", title: "Free to List",         desc: "No setup fee, no monthly subscription, no hidden charges." },
  { icon: "📣", title: "Affiliate Traffic",    desc: "Our affiliate network promotes your products for you." },
  { icon: "🏪", title: "Your Own Storefront",  desc: "A dedicated shop page with your story, brand, and full catalog." },
  { icon: "🌿", title: "Sustainable Audience", desc: "Reach buyers who specifically seek eco-conscious, purposeful products." },
  { icon: "📊", title: "Seller Dashboard",     desc: "Manage orders, track views, and monitor your performance in one place." },
];

const DEFAULT_STEPS = [
  { n: "01", title: "Apply",             desc: "Submit your vendor application with basic business information." },
  { n: "02", title: "Get Approved",      desc: "Our team reviews your application within 2–3 business days." },
  { n: "03", title: "Set Up Your Shop",  desc: "Add your logo, story, and list your first products." },
  { n: "04", title: "Start Selling",     desc: "Go live and let our affiliate network drive buyers to your store." },
];

const DEFAULT_REQS = [
  "Products must be legally compliant and safe for consumer use.",
  "Listings must be accurate, honest, and not misleading.",
  "Vendors must fulfill orders in a timely manner and communicate with buyers professionally.",
  "Products involving counterfeit goods, illegal substances, or hate-based content are strictly prohibited.",
  "Vendors must agree to our Vendor Terms of Service before going live.",
];

export default function VendorPage() {
  const [cms, setCms] = useState<Record<string, string>>({});

  const c = (section: string, key: string, def: string) => cms[`${section}.${key}`] ?? def;

  useEffect(() => {
    fetch("/api/cms/vendor", { cache: "no-store" })
      .then(r => r.json()).then(d => setCms(d.content ?? {})).catch(() => {});
  }, []);

  const perks = DEFAULT_PERKS.map((p, i) => ({
    icon:  c("why", `perk${i}.icon`,  p.icon),
    title: c("why", `perk${i}.title`, p.title),
    desc:  c("why", `perk${i}.desc`,  p.desc),
  }));

  const steps = DEFAULT_STEPS.map((s, i) => ({
    n:     s.n,
    title: c("how", `step${i}.title`, s.title),
    desc:  c("how", `step${i}.desc`,  s.desc),
  }));

  const reqs = DEFAULT_REQS.map((r, i) => c("who", `req${i}`, r));

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative min-h-[72vh] flex items-center overflow-hidden">
        <Image src={unsplash("1556742049-0cfed4f6a45d", 1600, 900)} fill alt="Vendor" className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04080F]/97 via-[#070C1B]/90 to-[#070C1B]/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Become a Vendor</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#1B6FEB]/20 border border-[#1B6FEB]/30 text-[#60A5FA] text-xs font-black px-4 py-1.5 rounded-full mb-6">
              🏪 {c("hero", "badge", "For Sellers & Makers")}
            </div>
            <h1 className="font-display font-black text-white text-4xl lg:text-6xl leading-tight mb-6">
              {c("hero", "headline", "Become a Vendor on Latter Day Shopping")}
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
              {c("hero", "subheadline", "Join a growing community of independent sellers, sustainable brands, and passionate creators all in one free marketplace.")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/vendor/register" className="inline-flex items-center gap-2 bg-[#1B6FEB] text-white font-black px-9 py-4 rounded-full hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-0.5 text-sm">
                {c("hero", "cta1", "Apply Now — It's Free →")}
              </Link>
              <a href="#how" className="border border-white/25 text-white/80 font-semibold px-9 py-4 rounded-full hover:bg-white/10 transition-all text-sm">
                {c("hero", "cta2", "See How It Works")}
              </a>
            </div>
            <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/[0.08]">
              {[
                [c("hero","stat0.value","0%"),     c("hero","stat0.label","Commission")],
                [c("hero","stat1.value","$0"),      c("hero","stat1.label","Listing Fees")],
                [c("hero","stat2.value","2–3 Days"),c("hero","stat2.label","Approval Time")],
                [c("hero","stat3.value","Free"),    c("hero","stat3.label","To Get Started")],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display font-black text-3xl text-white">{v}</p>
                  <p className="text-white/40 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why sell with us ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Benefits</span>
          <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-5">
            {c("why", "heading", "Why sell with us?")}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            {c("why", "body", "Latter Day Shopping isn't just another marketplace. We are a community-first platform built to give independent vendors a real chance to grow without paying listing fees, commissions, or subscriptions.")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map(p => (
            <div key={p.title} className="group bg-white rounded-3xl border border-gray-100 shadow-sm p-7 hover:shadow-xl hover:border-[#1B6FEB]/20 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-5">{p.icon}</div>
              <h3 className="font-black text-gray-900 text-lg mb-2 group-hover:text-[#1B6FEB] transition-colors">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who can become a vendor ── */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Eligibility</span>
              <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-6">
                {c("who", "heading", "Who can become a vendor?")}
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                {c("who", "body", "We welcome all independent sellers, small businesses, and creators who offer products that align with our platform values. Whether you make handmade goods, source sustainable products, or offer digital downloads — there is a place for you here.")}
              </p>
              <Link href="/vendor/register" className="inline-flex items-center gap-2 bg-[#1B6FEB] text-white font-black px-8 py-3.5 rounded-full hover:bg-[#1557D0] transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5 text-sm">
                Apply Now →
              </Link>
            </div>
            <div>
              <p className="text-gray-700 text-sm font-bold mb-5">
                {c("who", "reqHeading", "To maintain the quality and integrity of our marketplace, all vendors must meet the following standards:")}
              </p>
              <ul className="space-y-4">
                {reqs.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1B6FEB] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600 text-sm leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Process</span>
            <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">
              {c("how", "heading", "How it works")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className={`rounded-3xl p-7 relative ${i === 0 ? "bg-[#1B6FEB] text-white" : "bg-white border border-gray-100 shadow-sm"}`}>
                <div className={`font-display font-black text-5xl leading-none mb-5 ${i === 0 ? "text-white/20" : "text-gray-100"}`}>{s.n}</div>
                <h3 className={`font-black text-lg mb-3 ${i === 0 ? "text-white" : "text-gray-900"}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed ${i === 0 ? "text-white/70" : "text-gray-500"}`}>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1B6FEB] text-white items-center justify-center z-10 text-xs font-black">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vendor Responsibilities ── */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Responsibilities</span>
              <h2 className="font-display font-black text-4xl text-gray-900 mt-3 mb-5">
                {c("responsibilities", "heading", "Vendor responsibilities")}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                {c("responsibilities", "intro", "As a vendor on Latter Day Shopping, you are solely responsible for:")}
              </p>
              <ul className="space-y-3">
                {[
                  "The accuracy and legality of your product listings.",
                  "Fulfilling orders promptly and handling returns or refunds per your stated policy.",
                  "Maintaining adequate stock levels and updating listings when items are unavailable.",
                  "Complying with all applicable local, state, and federal laws, including sales tax obligations.",
                  "Providing honest and transparent descriptions, pricing, and shipping timelines.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#1B6FEB] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm leading-relaxed">
                      {c("responsibilities", `item${i}`, item)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-400 text-xs mt-6 italic">
                {c("responsibilities", "note", "Latter Day Shopping reserves the right to remove any vendor or listing that violates our community standards, without prior notice.")}
              </p>
            </div>

            {/* Platform protection */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="text-4xl mb-5">🛡️</div>
              <h3 className="font-black text-gray-900 text-2xl mb-4">
                {c("protection", "heading", "Platform Protection")}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {c("protection", "body", "By registering as a vendor, you agree that Latter Day Shopping and JPR Ventures LLC are not liable for disputes between vendors and buyers, product defects, shipping losses, or any losses arising from the use of the platform. Vendors indemnify and hold Latter Day Shopping harmless from any claims arising from their product listings or business conduct.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ready to Join CTA ── */}
      <section className="bg-gradient-to-br from-[#070C1B] to-[#1045A8] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-white text-5xl mb-5">
            {c("cta", "heading", "Ready to join?")}
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8">
            {c("cta", "body", "Create your free vendor account today and start reaching thousands of conscious shoppers.")}
          </p>
          {c("cta", "email", "support@latterdayshopping.com") && (
            <p className="text-white/40 text-sm mb-8">
              Have questions? Email us at{" "}
              <a href={`mailto:${c("cta", "email", "support@latterdayshopping.com")}`}
                className="text-[#60A5FA] hover:underline">
                {c("cta", "email", "support@latterdayshopping.com")}
              </a>
            </p>
          )}
          <Link href="/vendor/register" className="inline-flex items-center gap-2 bg-white text-[#1B6FEB] font-black px-10 py-4 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
            Apply Now — It&apos;s Free →
          </Link>
        </div>
      </section>

    
    </div>
  );
}
