"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function LoginPage() {
  const s = useSiteSettings();
  const logoSrc = s.logoUrl || "/images/logo.png";
  const siteName = s.siteName || "Latter Day Shopping";

  const [cms, setCms] = useState<Record<string, string>>({});
  const c = (section: string, key: string, def: string) => cms[`${section}.${key}`] ?? def;
  useEffect(() => {
    fetch("/api/cms/signin", { cache: "no-store" }).then(r => r.json()).then(d => setCms(d.content ?? {})).catch(() => {});
  }, []);

  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      router.push(data.redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#070C1B]">
        {/* Glows (match homepage hero) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-24 w-80 h-80 bg-[#1B6FEB]/25 rounded-full blur-[90px]" />
          <div className="absolute bottom-1/3 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]" />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src={logoSrc} alt={siteName} width={240} height={240}
              className="rounded-xl" unoptimized={!!s.logoUrl} />
          </Link>

          {/* Centre copy */}
          <div className="space-y-6">
            <div className="w-14 h-1 rounded-full bg-[#1B6FEB]" />
            <h1 className="font-display text-5xl font-bold text-white leading-tight">
              {c("hero", "heading", "Welcome back.")}
            </h1>
            <p className="text-white/55 text-lg leading-relaxed max-w-xs">
              {c("hero", "subtext", "Sign in to manage your store, track orders, or continue shopping intentionally.")}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-8 border-t border-white/[0.08]">
            {[["2", "Businesses"], ["100+", "Products"], ["2008", "Established"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-white text-2xl font-bold">{n}</p>
                <p className="text-white/40 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Image src={logoSrc} alt={siteName} width={32} height={32}
              className="rounded-lg" unoptimized={!!s.logoUrl} />
            <span className="font-semibold text-gray-900">{siteName}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{c("form", "heading", "Sign in")}</h2>
            <p className="text-gray-700 mt-2 text-base font-semibold">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold hover:underline" style={{ color: "#1B6FEB" }}>
                Create one
              </Link>
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
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-semibold hover:underline" style={{ color: "#1B6FEB" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPw
                    ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all
                disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #1B6FEB 0%, #3b82f6 100%)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-base font-semibold text-gray-700">
            Want to sell on our platform?{" "}
            <Link href="/vendor/register" className="font-bold hover:underline" style={{ color: "#1B6FEB" }}>
              {c("form", "vendorCta", "Apply as a Vendor")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};