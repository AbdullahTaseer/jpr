export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const DEFAULT_VALUES = [
  { emoji: "🤝", title: "Community first",        desc: "Every decision we make starts with what is best for our vendors, affiliates, and shoppers." },
  { emoji: "🔍", title: "Radical transparency",   desc: "We say what we mean, disclose what we should, and operate with full honesty." },
  { emoji: "🌱", title: "Purpose over profit",    desc: "We believe commerce can be a force for good and we build that into everything we do." },
  { emoji: "🏆", title: "Ownership mentality",    desc: "We hire people who treat the platform as their own and take pride in their work." },
  { emoji: "🔄", title: "Continuous improvement", desc: "We are always learning, iterating, and getting better — and we expect the same from our team." },
];

export default async function CareersPage() {
  const cmsItems = await prisma.pageContent.findMany({ where: { page: "careers" } });
  const map: Record<string, string> = {};
  cmsItems.forEach(r => { map[`${r.section}.${r.key}`] = r.value; });
  const c = (section: string, key: string, def = "") => map[`${section}.${key}`] ?? def;

  const applyEmail = c("openings", "email", "");

  // Collect openings: up to 5
  const openings: { title: string; desc: string }[] = [];
  for (let i = 0; i < 5; i++) {
    const title = c("openings", `${i}.title`, "");
    if (title) openings.push({ title, desc: c("openings", `${i}.desc`, "") });
  }

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-r from-[#070C1B] to-[#1045A8] py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">Careers</span>
          </div>
          <span className="text-[#60A5FA] text-xs font-black uppercase tracking-[0.28em]">Join the Team</span>
          <h1 className="font-display font-black text-white text-5xl lg:text-6xl mt-4 mb-6 leading-tight">
            {c("hero", "heading", "Careers at Latter Day Shopping")}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
            {c("hero", "subtext", "Help us build the future of sustainable, community-driven commerce.")}
          </p>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.28em]">Who We Are</span>
        <h2 className="font-display font-black text-gray-900 text-4xl mt-3 mb-8">Our Story</h2>

        <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4 text-[15px]">
          {c("who_we_are", "body",
            "Latter Day Shopping is a fast-growing free affiliate marketplace on a mission to make sustainable and purposeful products accessible to everyone. Founded under JPR Ventures LLC and based in Oregon City, Oregon, we are building a platform where independent vendors thrive, affiliates earn, and conscious shoppers find products they love — all without barriers or fees."
          ).split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p>
            {c("who_we_are", "closing",
              "We are a small, driven team with big ambitions. Everyone here wears multiple hats, moves fast, and genuinely cares about the mission. If that sounds like your kind of environment, read on."
            )}
          </p>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.28em]">What We Stand For</span>
          <h2 className="font-display font-black text-gray-900 text-4xl mt-3 mb-12">Our Values</h2>
          <div className="space-y-5">
            {DEFAULT_VALUES.map((dv, i) => {
              const title = c("values", `${i}.title`, dv.title);
              const desc  = c("values", `${i}.desc`,  dv.desc);
              return (
                <div key={i} className="flex gap-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] flex items-center justify-center text-2xl flex-shrink-0">
                    {c("values", `${i}.emoji`, dv.emoji)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base mb-1">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Current Openings ── */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.28em]">Join Us</span>
        <h2 className="font-display font-black text-gray-900 text-4xl mt-3 mb-4">Current Openings</h2>
        <p className="text-gray-500 text-sm mb-10 max-w-xl">
          {c("openings", "intro", "We hire for attitude, aptitude, and alignment with our mission. Even when a role isn't listed, we always want to hear from great people.")}
        </p>

        {openings.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF3FF] flex items-center justify-center text-3xl mx-auto mb-5">📋</div>
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-black px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              Coming Soon
            </span>
            <h3 className="font-black text-gray-900 text-xl mb-2">No open positions right now</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              We&apos;re not actively hiring at the moment, but we love meeting great people ahead of time.
            </p>
            {applyEmail && (
              <a href={`mailto:${applyEmail}`}
                className="mt-6 inline-flex items-center gap-2 bg-[#1B6FEB] text-white font-bold px-7 py-3 rounded-full hover:bg-[#1557D0] transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5 text-sm">
                Send Us Your Resume →
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {openings.map((job, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#1B6FEB]/30 transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-lg mb-2">{job.title}</h3>
                    {job.desc && <p className="text-gray-500 text-sm leading-relaxed">{job.desc}</p>}
                  </div>
                  {applyEmail && (
                    <a href={`mailto:${applyEmail}?subject=Application: ${encodeURIComponent(job.title)}`}
                      className="flex-shrink-0 bg-[#1B6FEB] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors text-sm whitespace-nowrap">
                      Apply Now
                    </a>
                  )}
                </div>
              </div>
            ))}
            {applyEmail && (
              <p className="text-gray-400 text-sm text-center pt-4">
                To apply, email <a href={`mailto:${applyEmail}`} className="text-[#1B6FEB] font-semibold hover:underline">{applyEmail}</a> with your resume and the role you&apos;re applying for.
              </p>
            )}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-br from-[#070C1B] to-[#1045A8]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-white text-4xl mb-4">Don&apos;t see a fit?</h2>
          <p className="text-white/55 text-sm mb-8 leading-relaxed">
            {c("cta", "body", "We are always looking for passionate people. Send us a note and tell us how you can contribute to our mission.")}
          </p>
          {applyEmail ? (
            <a href={`mailto:${applyEmail}?subject=General Inquiry`}
              className="inline-flex items-center gap-2 bg-white text-[#1B6FEB] font-black px-9 py-4 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
              Get In Touch →
            </a>
          ) : (
            <Link href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#1B6FEB] font-black px-9 py-4 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm">
              Contact Us →
            </Link>
          )}
        </div>
      </section>

    </div>
  );
}
