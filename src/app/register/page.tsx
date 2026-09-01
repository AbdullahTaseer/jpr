"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function RegisterPage() {
  const s = useSiteSettings();
  const logoSrc = s.logoUrl || "/images/logo.png";
  const siteName = s.siteName || "Latter Day Shopping";

  const [cms, setCms] = useState<Record<string, string>>({});
  const c = (section: string, key: string, def: string) => cms[`${section}.${key}`] ?? def;
  useEffect(() => {
    fetch("/api/cms/signup", { cache: "no-store" }).then(r => r.json()).then(d => setCms(d.content ?? {})).catch(() => {});
  }, []);

  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      router.push("/");
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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1b3e 0%, #1B6FEB 60%, #3b82f6 100%)" }}>
        <div className="absolute inset-0 hero-glow opacity-40" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 -right-16 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <Image src={logoSrc} alt={siteName} width={240} height={240} className="rounded-xl" unoptimized={!!s.logoUrl} />
            
          </Link>

          <div className="space-y-6">
            <div className="w-14 h-1 rounded-full bg-white/40" />
            <h1 className="font-display text-5xl font-bold text-white leading-tight">
              {c("hero", "heading", "Join our community.")}
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-xs">
              {c("hero", "subtext", "Discover purposeful products from independent vendors who share your values.")}
            </p>
          </div>

          <div className="flex gap-8">
            {[["2", "Businesses"], ["2008", "Established"], ["100+", "Products"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-white text-2xl font-bold">{n}</p>
                <p className="text-blue-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Image src={logoSrc} alt={siteName} width={32} height={32} className="rounded-lg" unoptimized={!!s.logoUrl} />
            <span className="font-semibold text-gray-900">{siteName}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{c("form", "heading", "Create account")}</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Already have an account?{" "}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address <span className="text-red-500">*</span>
              </label>
              <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required value={form.password}
                    onChange={(e) => set("password", e.target.value)} placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      {showPw
                        ? <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} required value={form.confirm}
                    onChange={(e) => set("confirm", e.target.value)} placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      {showConfirm
                        ? <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all
                disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #1B6FEB 0%, #3b82f6 100%)" }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </span>
              ) : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Want to sell?{" "}
            <Link href="/vendor/register" className="font-medium" style={{ color: "#1B6FEB" }}>
              {c("form", "vendorCta", "Apply as a Vendor")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};