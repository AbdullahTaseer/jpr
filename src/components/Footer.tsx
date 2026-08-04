"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const IcoMail = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/>
  </svg>
);
const IcoPhone = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IcoClock = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoFB = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5L14.17.5C10.24.5 9.1 3.3 9.1 5.47V7.46H5.5v4h3.6V23.5h5.4V11.46h3.27Z"/>
  </svg>
);
const IcoIG = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const IcoTW = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IcoPIN = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);
const IcoYT = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);


export default function Footer() {
  const s = useSiteSettings();
  const logoSrc = s.logoUrl || "/images/logo.png";
  const email = s.email || "support@latterdayshopping.com";
  const phone = s.phone?.trim() || null;
  const siteName = s.siteName || "Latter Day Shopping";

  const socialLinks = [
    { label: "Facebook",  Icon: IcoFB,  href: s.facebook  },
    { label: "Instagram", Icon: IcoIG,  href: s.instagram },
    { label: "Twitter",   Icon: IcoTW,  href: s.twitter   },
    { label: "Pinterest", Icon: IcoPIN, href: s.pinterest },
    { label: "YouTube",   Icon: IcoYT,  href: s.youtube   },
  ].filter(x => x.href);

  const contactCards = [
    { Icon: IcoMail,  label: "Email Us", value: email, href: `mailto:${email}` },
    ...(phone
      ? [{ Icon: IcoPhone, label: "Call Us", value: phone, href: `tel:${phone.replace(/\D/g, "")}` }]
      : []),
    { Icon: IcoClock, label: "Hours", value: "Mon–Fri, 9am–6pm CST", href: "#" },
  ];

  return (
    <footer className="bg-[#04080F] text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1B6FEB]/70 to-transparent" />

      {/* Brand Hero Strip */}
      <div className="relative border-b border-white/[0.07]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B6FEB]/08 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">

          {/* Centered logo */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-[#1B6FEB] blur-3xl opacity-35 rounded-3xl scale-125 pointer-events-none" />
              <div className="relative bg-gradient-to-br from-[#1557D0] via-[#1B6FEB] to-[#2D8CF0] rounded-3xl px-10 py-6 border border-white/20 shadow-2xl shadow-blue-900/60">
                <Image src={logoSrc} alt={siteName} width={200} height={50}
                  className="h-12 w-auto brightness-0 invert mx-auto" unoptimized={!!s.logoUrl} />
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className="h-px w-12 bg-white/25" />
                  <span className="text-white/50 text-[10px] font-black tracking-[0.25em] uppercase">Est. 2024</span>
                  <div className="h-px w-12 bg-white/25" />
                </div>
              </div>
            </div>
            <p className="text-white/80 font-semibold text-lg max-w-md leading-snug mb-2">
              Building a community of intentional shoppers &amp; purposeful sellers.
            </p>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              A free marketplace where every purchase supports vendors who create with care, values, and intention.
            </p>
          </div>

          {/* Contact cards */}
          <div className={`grid grid-cols-1 gap-4 max-w-2xl mx-auto ${contactCards.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {contactCards.map(({ Icon, label, value, href }) => (
              <a key={label} href={href}
                className="flex items-center gap-3 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] hover:border-[#1B6FEB]/40 rounded-2xl px-5 py-4 transition-all group text-left">
                <div className="w-9 h-9 rounded-xl bg-[#1B6FEB]/20 group-hover:bg-[#1B6FEB]/35 flex items-center justify-center text-[#60A5FA] flex-shrink-0 transition-colors">
                  <Icon />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{label}</p>
                  <p className="text-white/80 text-xs font-semibold group-hover:text-white truncate transition-colors">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 4-column links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.22em] mb-6 flex items-center gap-2.5">
              <span className="w-5 h-0.5 bg-[#1B6FEB] rounded-full" /> Company
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact",  href: "/contact" },
                { label: "Blog",     href: "/blog" },
                { label: "Careers",  href: "/careers" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 text-sm hover:text-white transition-all inline-flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2.5 h-px bg-[#1B6FEB] transition-all duration-300 rounded-full flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.22em] mb-6 flex items-center gap-2.5">
              <span className="w-5 h-0.5 bg-[#1B6FEB] rounded-full" /> Marketplace
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: "Shop All",     href: "/shop" },
                { label: "New Arrivals", href: "/new-arrivals" },
                { label: "Categories",   href: "/categories" },
                { label: "Brands",       href: "/brands" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 text-sm hover:text-white transition-all inline-flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2.5 h-px bg-[#1B6FEB] transition-all duration-300 rounded-full flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.22em] mb-6 flex items-center gap-2.5">
              <span className="w-5 h-0.5 bg-[#1B6FEB] rounded-full" /> Business
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: "Become a Vendor", href: "/vendor" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-gray-400 text-sm hover:text-white transition-all inline-flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2.5 h-px bg-[#1B6FEB] transition-all duration-300 rounded-full flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.22em] mb-6 flex items-center gap-2.5">
              <span className="w-5 h-0.5 bg-[#1B6FEB] rounded-full" /> Follow Us
            </h4>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, Icon, href }) => (
                  <a key={label} href={href!} target="_blank" rel="noopener noreferrer"
                    title={label}
                    className="w-10 h-10 rounded-xl bg-white/[0.07] hover:bg-[#1B6FEB] border border-white/[0.09] hover:border-[#1B6FEB] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1B6FEB]/30">
                    <Icon />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Coming soon</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} <span className="text-gray-400 font-semibold">{siteName}</span>. All rights reserved. Made with 💜 by <a href="https://leendesignstudio.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Leen Design Studio</a>
              </p>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {[
                { label: "Privacy Policy",      href: "/privacy" },
                { label: "Terms of Service",    href: "/terms" },
                { label: "Disclaimer",          href: "/disclaimer" },
                { label: "Affiliate Disclosure",href: "/affiliate-disclosure" },
              ].map(({ label, href }, i, arr) => (
                <span key={label} className="flex items-center gap-1">
                  <Link href={href} className="text-gray-500 text-xs hover:text-gray-200 transition-colors whitespace-nowrap">{label}</Link>
                  {i < arr.length - 1 && <span className="text-gray-700 text-xs mx-1">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
