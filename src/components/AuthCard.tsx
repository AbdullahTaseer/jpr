"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400";

export const primaryButtonClass =
  "w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]";
export const primaryButtonStyle = { background: "linear-gradient(135deg, #1B6FEB 0%, #3b82f6 100%)" };

export function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {children}
    </div>
  );
}

export default function AuthCard({ icon, title, subtitle, children }: {
  icon: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  const s = useSiteSettings();
  const logoSrc = s.logoUrl || "/images/logo.png";
  const siteName = s.siteName || "Latter Day Shopping";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#f0f4ff] to-white">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image src={logoSrc} alt={siteName} width={40} height={40} className="rounded-lg" unoptimized={!!s.logoUrl} />
          <span className="font-semibold text-gray-900">{siteName}</span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(27,111,235,0.08)] p-6 sm:p-8">
          <div className="w-12 h-12 rounded-xl bg-[#1B6FEB]/10 text-[#1B6FEB] flex items-center justify-center mb-5">
            {icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-2 mb-6 text-sm leading-relaxed">{subtitle}</p>
          {children}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#1B6FEB" }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
