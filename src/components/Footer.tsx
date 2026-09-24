"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const IcoMail = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/>
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
const IcoLI = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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
  const siteName = s.siteName || "Latter Day Shopping";

  const socialLinks = [
    { label: "Facebook",  Icon: IcoFB,  href: s.facebook  },
    { label: "Instagram", Icon: IcoIG,  href: s.instagram },
    { label: "LinkedIn",  Icon: IcoLI,  href: s.linkedin  },
    // { label: "Pinterest", Icon: IcoPIN, href: s.pinterest },
    // { label: "YouTube",   Icon: IcoYT,  href: s.youtube   },
  ].filter(x => x.href);

  const contactItems = [
    { Icon: IcoMail,  label: "Email Us", value: email, href: `mailto:${email}` as string | null },
  ];

  return (
    <footer className="bg-[#04080F] text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1B6FEB]/70 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

          {/* Left — logo + socials */}
          <div className="flex flex-col items-start">
            <Link href="/" className="inline-block mb-6">
              <Image
                src={logoSrc}
                alt={siteName}
                width={320}
                height={80}
                className="h-20 w-auto"
                unoptimized={!!s.logoUrl}
              />
            </Link>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="w-10 h-10 rounded-xl bg-white/[0.07] hover:bg-[#1B6FEB] border border-white/[0.09] hover:border-[#1B6FEB] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1B6FEB]/30"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Coming soon</p>
            )}
          </div>

          {/* Center — quick links (same as nav) */}
          <div className="md:flex md:flex-col md:items-center">
            <div>
              <h4 className="text-white font-black text-[11px] uppercase tracking-[0.22em] mb-6 flex items-center gap-2.5">
                <span className="w-5 h-0.5 bg-[#1B6FEB] rounded-full" /> Quick Links
              </h4>
              <ul className="space-y-3.5">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 text-sm hover:text-white transition-all inline-flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-2.5 h-px bg-[#1B6FEB] transition-all duration-300 rounded-full flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — contact */}
          <div className="md:flex md:flex-col md:items-end">
            <div>
              <h4 className="text-white font-black text-[11px] uppercase tracking-[0.22em] mb-6 flex items-center gap-2.5">
                <span className="w-5 h-0.5 bg-[#1B6FEB] rounded-full" /> Contact Us
              </h4>
              <ul className="space-y-4">
                {contactItems.map(({ Icon, label, value, href }) => {
                  const inner = (
                    <>
                      <div className="w-9 h-9 rounded-xl bg-[#1B6FEB]/20 group-hover:bg-[#1B6FEB]/35 flex items-center justify-center text-[#60A5FA] flex-shrink-0 transition-colors">
                        <Icon />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{label}</p>
                        <p className="text-white/80 text-sm font-semibold group-hover:text-white truncate transition-colors">{value}</p>
                      </div>
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a href={href} className="flex items-center gap-3 group">
                          {inner}
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 group">
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs">
              ©️ {new Date().getFullYear()} <span className="text-gray-400 font-semibold">{siteName}</span>. All rights reserved. Made with 💜 by <a href="https://leendesignstudio.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Leen Design Studios</a>
            </p>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {[
                { label: "Privacy Policy",       href: "/privacy" },
                { label: "Terms of Service",     href: "/terms" },
                { label: "Disclaimer",           href: "/disclaimer" },
                { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
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
};