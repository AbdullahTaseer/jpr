"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Field = "name" | "username" | "email" | "phone" | "password" | "confirmPassword"
  | "companyName" | "ein" | "shopName" | "shopSlug";

const INITIAL = {
  name: "", username: "", email: "", phone: "",
  password: "", confirmPassword: "",
  companyName: "", ein: "", shopName: "", shopSlug: "",
};

export default function VendorRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleShopName(value: string) {
    setForm((f) => ({
      ...f,
      shopName: value,
      shopSlug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/vendor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#1B6FEB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application submitted!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your vendor application is under review. We&apos;ll send you an email at{" "}
            <strong className="text-gray-700">{form.email}</strong> once it&apos;s been approved.
          </p>
          <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700 mb-6">
            Review typically takes <strong>1–2 business days</strong>.
          </div>
          <Link href="/"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "#1B6FEB" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1b3e 0%, #1B6FEB 60%, #3b82f6 100%)" }}>
        <div className="absolute inset-0 hero-glow opacity-40" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 -right-16 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Latter Day Shopping" width={240} height={240} className="rounded-xl" />
           
          </Link>

          <div className="space-y-6">
            <div className="w-14 h-1 rounded-full bg-white/40" />
            <h1 className="font-display text-5xl font-bold text-white leading-tight">
              Start<br />selling<br />today.
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-xs">
              Join 10,000+ vendors reaching conscious shoppers who care about quality and sustainability.
            </p>

            {/* Perks */}
            <ul className="space-y-3">
              {["Zero listing fees", "Built-in audience of 200K+ shoppers", "Simple dashboard to manage orders"].map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-blue-100 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.2)" }}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-8">
            {[["10K+", "Vendors"], ["50K+", "Products"], ["99%", "Satisfaction"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-white text-2xl font-bold">{n}</p>
                <p className="text-blue-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full flex items-start justify-center px-6 py-12">
          <div className="w-full max-w-lg">
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <Image src="/images/logo.png" alt="Latter Day Shopping" width={32} height={32} className="rounded-lg" />
              <span className="font-semibold text-gray-900">Latter Day Shopping</span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Vendor Registration</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Already registered?{" "}
                <Link href="/login" className="font-medium" style={{ color: "#1B6FEB" }}>Sign in</Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Full Name + Username */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)}
                    placeholder="Jane Smith" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Username <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.username} onChange={(e) => set("username", e.target.value)}
                    placeholder="janesmith" className={inputCls} />
                </div>
              </div>

              {/* Row 2: Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email address <span className="text-red-500">*</span></label>
                  <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    placeholder="+1 555 000 0000" className={inputCls} />
                </div>
              </div>

              {/* Row 3: Password + Confirm */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} required value={form.password}
                      onChange={(e) => set("password", e.target.value)} placeholder="••••••••"
                      className={`${inputCls} pr-10`} />
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        {showPw
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirm Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} required value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)} placeholder="••••••••"
                      className={`${inputCls} pr-10`} />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        {showConfirm
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-gray-400 text-xs font-medium">Business Details</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Row 4: Company Name + EIN */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Company Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.companyName} onChange={(e) => set("companyName", e.target.value)}
                    placeholder="Acme LLC" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>
                    Employer Identification Number (EIN) <span className="text-red-500">*</span>
                  </label>
                  <input type="text" required value={form.ein} onChange={(e) => set("ein", e.target.value)}
                    placeholder="12-3456789" className={inputCls} />
                </div>
              </div>

              {/* Row 5: Shop Name + Shop URL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Shop Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.shopName}
                    onChange={(e) => handleShopName(e.target.value)}
                    placeholder="Jane&apos;s Boutique" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Shop URL <span className="text-red-500">*</span></label>
                  <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="px-3 py-3 bg-gray-50 text-gray-400 text-sm border-r border-gray-200 whitespace-nowrap">
                      /store/
                    </span>
                    <input type="text" required value={form.shopSlug}
                      onChange={(e) => set("shopSlug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="janes-boutique"
                      className="flex-1 px-3 py-3 text-gray-900 text-sm outline-none bg-white placeholder:text-gray-400" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all
                  disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] mt-2"
                style={{ background: "linear-gradient(135deg, #1B6FEB 0%, #3b82f6 100%)" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating your store…
                  </span>
                ) : "Create Vendor Account"}
              </button>

              <p className="text-center text-xs text-gray-400 pb-4">
                By registering you agree to our{" "}
                <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{" "}and{" "}
                <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
