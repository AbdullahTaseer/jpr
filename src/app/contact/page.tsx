"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const unsplash = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;

type FaqItem = { id: string; question: string; answer: string };

export default function ContactPage() {
  const s = useSiteSettings();
  const email = s.email || "support@latterdayshopping.com";
  const address = s.address?.trim() || null;

  const [cms, setCms] = useState<Record<string, string>>({});
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const c = (section: string, key: string, def: string) => cms[`${section}.${key}`] ?? def;

  useEffect(() => {
    fetch("/api/cms/contact").then(r => r.json()).then(d => setCms(d.content ?? {})).catch(() => {});
    fetch("/api/faqs").then(r => r.json()).then(d => setFaqs(d.faqs ?? [])).catch(() => {});
  }, []);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border-2 border-gray-200 focus:border-[#1B6FEB] rounded-2xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none transition-colors";

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#070C1B] via-[#0A1E4A] to-[#1B3A8A] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#60A5FA] text-xs font-black uppercase tracking-[0.25em]">Get In Touch</span>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl mt-4 mb-6 leading-tight">
            {c("hero", "heading", "Contact Us")}
          </h1>
          <p className="text-white/55 text-lg max-w-md mx-auto leading-relaxed">
            {c("hero", "subtext", "Have a question, idea, or just want to say hello? We'd love to hear from you.")}
          </p>
        </div>
      </section>

      {/* ── Info cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" /></svg>,
              title: "Email Us", value: email, sub: "We reply within 24 hours", href: `mailto:${email}`,
            },
            ...(address
              ? [{
                  icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                  title: "Visit Us", value: address, sub: "Come say hello", href: "#",
                }]
              : []),
          ].map(card => (
            <a key={card.title} href={card.href}
              className="bg-white rounded-3xl p-7 shadow-xl border border-gray-100 flex items-center gap-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#EBF3FF] group-hover:bg-[#1B6FEB] text-[#1B6FEB] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                {card.icon}
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">{card.title}</p>
                <p className="font-bold text-gray-900 text-sm">{card.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{card.sub}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Form + Image ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Form */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 lg:p-10">
            <h2 className="font-display font-black text-3xl text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-400 text-sm mb-8">Fill out the form and we&apos;ll get back to you as soon as possible.</p>

            {sent ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">Thank you for reaching out. We&apos;ll reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" value={form.name} onChange={set("name")} required placeholder="John Smith" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" value={form.email} onChange={set("email")} required placeholder="john@example.com" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Subject</label>
                  <select value={form.subject} onChange={set("subject")} required className={inputCls}>
                    <option value="">Choose a topic...</option>
                    <option>General Inquiry</option>
                    <option>Vendor Support</option>
                    <option>Order Issue</option>
                    <option>Partnership</option>
                    <option>Press & Media</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Message</label>
                  <textarea value={form.message} onChange={set("message")} required rows={5}
                    placeholder="Tell us how we can help you..."
                    className={`${inputCls} resize-none`} />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#1B6FEB] text-white font-black py-4 rounded-2xl hover:bg-[#1557D0] transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5 text-sm tracking-wide disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> SENDING…</>
                    : "SEND MESSAGE →"}
                </button>
              </form>
            )}
          </div>

          {/* Image + quick info */}
          <div className="space-y-6">
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={c("office", "image", "") || unsplash("1497366216548-37526070297c", 800, 600)}
                fill alt="Our office"
                className="object-cover" sizes="(max-width:1024px)100vw,50vw"
                unoptimized={!!cms["office.image"]} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070C1B]/70 via-transparent to-transparent" />
              {address && (
                <div className="absolute bottom-6 left-6">
                  <p className="text-white font-black text-lg">{address}</p>
                  <p className="text-white/60 text-sm">Our home base</p>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-[#070C1B] to-[#1045A8] rounded-3xl p-8 text-white">
              <h3 className="font-display font-black text-2xl mb-2">Response Times</h3>
              <p className="text-white/55 text-sm mb-6">Our support team is ready to help you succeed.</p>
              {[
                { label: "General Inquiries",  time: "Within 24 hours" },
                { label: "Vendor Support",     time: "Within 4 hours" },
                { label: "Order Issues",       time: "Within 2 hours" },
                { label: "Emergency",          time: "Within 1 hour" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                  <span className="text-white/70 text-sm">{r.label}</span>
                  <span className="text-emerald-400 font-bold text-xs">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#1B6FEB] text-xs font-black uppercase tracking-[0.25em]">Quick Answers</span>
            <h2 className="font-display font-black text-5xl text-gray-900 mt-3 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-5 text-left group">
                  <span className="font-bold text-gray-900 text-sm group-hover:text-[#1B6FEB] transition-colors pr-4">{f.question}</span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-300 ${open === i ? "bg-[#1B6FEB] border-[#1B6FEB] text-white rotate-45" : "group-hover:border-[#1B6FEB] group-hover:text-[#1B6FEB]"}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16"/></svg>
                  </span>
                </button>
                {open === i && (
                  <div className="px-7 pb-6">
                    <p className="text-gray-500 text-sm leading-relaxed">{f.answer}</p>
                  </div>
                )}
              </div>
            ))}
            {faqs.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No FAQs available yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};