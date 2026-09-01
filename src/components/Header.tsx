"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const SHOP_LINKS = [
  { label: "Shop All", href: "/shop", desc: "Browse every product" },
  { label: "New Arrivals", href: "/new-arrivals", desc: "Just added by vendors" },
  { label: "Categories", href: "/categories", desc: "Explore by product type" },
  { label: "Brands", href: "/brands", desc: "Discover verified brands" },
];

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/shop", drop: true },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const IcoChevDown = () => (
  <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
const IcoChevRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const IcoMenu = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IcoClose = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IcoDashboard = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IcoFB = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5L14.17.5C10.24.5 9.1 3.3 9.1 5.47V7.46H5.5v4h3.6V23.5h5.4V11.46h3.27Z" />
  </svg>
);
const IcoLI = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const IcoIG = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopExpanded, setShopExpanded] = useState(false);
  const [authUser, setAuthUser] = useState<{ role: "USER" | "VENDOR" | "ADMIN" } | null | undefined>(undefined);
  const path = usePathname();
  const s = useSiteSettings();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => setAuthUser(d?.user ?? null))
      .catch(() => setAuthUser(null));
  }, []);

  const logoSrc = s.logoUrl || "/images/logo.png";
  const socials = [
    { href: s.facebook, Icon: IcoFB, label: "Facebook" },
    { href: s.linkedin, Icon: IcoLI, label: "LinkedIn" },
    { href: s.instagram, Icon: IcoIG, label: "Instagram" },
  ].filter(x => x.href);

  const isShopActive = path.startsWith("/shop") || path.startsWith("/categories") || path.startsWith("/brands") || path.startsWith("/new-arrivals");

  const dashHref =
    authUser?.role === "ADMIN" ? "/admin-dashboard" :
      authUser?.role === "VENDOR" ? "/vendor-dashboard" :
        "/user-dashboard";

  return (
    <>
      {/* Announcement bar */}
      {s.announcementEnabled && s.announcementText && (
        <div className="text-white text-xs text-center py-2.5 px-4 font-medium tracking-wide" style={{ backgroundColor: s.announcementBg }}>
          <span dangerouslySetInnerHTML={{ __html: s.announcementText }} />
          {(s.email || s.phone) && (
            <span className="hidden sm:inline ml-6 pl-6 border-l border-white/25">
              {s.email && <> {s.email}</>}
              {s.email && s.phone && " || "}
              {s.phone && <> {s.phone}</>}
            </span>
          )}
        </div>
      )}

      {/* Main header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src={logoSrc} alt={s.siteName} width={170} height={44} className="h-10 w-auto" priority unoptimized={!!s.logoUrl} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {NAV.map(link => {
                if (link.drop) {
                  return (
                    <div key={link.label} className="relative group">
                      {/* Trigger */}
                      <Link href={link.href}
                        className={`text-sm font-semibold transition-colors flex items-center gap-1 relative pb-1
                          ${isShopActive ? "text-[#1B6FEB]" : "text-gray-700 hover:text-[#1B6FEB]"}`}>
                        {link.label}
                        <IcoChevDown />
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#1B6FEB] rounded-full transition-all duration-300
                          ${isShopActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                      </Link>

                      {/* Dropdown panel */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-64">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                          <div className="p-1.5">
                            {SHOP_LINKS.map(item => (
                              <Link key={item.href} href={item.href}
                                className="flex flex-col px-4 py-3 rounded-xl hover:bg-[#EBF3FF] transition-colors group/item">
                                <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#1B6FEB] transition-colors">{item.label}</p>
                                <p className="text-[11px] text-gray-400">{item.desc}</p>
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                            <Link href="/shop" className="text-xs font-bold text-[#1B6FEB] hover:underline">
                              View all products →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                const active = path === link.href || (link.href !== "/" && path.startsWith(link.href));
                return (
                  <Link key={link.label} href={link.href}
                    className={`text-sm font-semibold transition-colors flex items-center gap-1 group relative
                      ${active ? "text-[#1B6FEB]" : "text-gray-700 hover:text-[#1B6FEB]"}`}>
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#1B6FEB] rounded-full transition-all duration-300
                      ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Right */}
            <div className="hidden md:flex items-center gap-4">
              {socials.length > 0 && (
                <div className="flex gap-3 text-gray-400">
                  {socials.map(({ href, Icon, label }) => (
                    <a key={label} href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-[#1B6FEB] transition-colors">
                      <Icon />
                    </a>
                  ))}
                </div>
              )}
              {authUser ? (
                <Link href={dashHref}
                  className="flex items-center gap-2 bg-[#1B6FEB] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#1557D0] transition-all shadow-md shadow-blue-200 hover:-translate-y-px">
                  <IcoDashboard />
                  DASHBOARD
                </Link>
              ) : authUser === null ? (
                <Link href="/login"
                  className="bg-[#1B6FEB] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#1557D0] transition-all shadow-md shadow-blue-200 hover:-translate-y-px">
                  LOGIN
                </Link>
              ) : null}
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden p-1 text-gray-700" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <IcoClose /> : <IcoMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-5 shadow-xl">
            {NAV.map(link => {
              if (link.drop) {
                return (
                  <div key={link.label}>
                    <button
                      onClick={() => setShopExpanded(!shopExpanded)}
                      className={`flex items-center justify-between w-full text-sm font-semibold py-2.5 border-b border-gray-50 transition-colors
                        ${isShopActive ? "text-[#1B6FEB]" : "text-gray-700"}`}>
                      {link.label}
                      <IcoChevDown />
                    </button>
                    {shopExpanded && (
                      <div className="bg-gray-50 rounded-xl mt-1 mb-2 overflow-hidden">
                        {SHOP_LINKS.map(item => (
                          <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                            className="flex flex-col px-4 py-3 hover:bg-[#EBF3FF] transition-colors border-b border-gray-100 last:border-0">
                            <p className="text-sm font-bold text-gray-900">{item.label}</p>
                            <p className="text-[10px] text-gray-400">{item.desc}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              const active = path === link.href || (link.href !== "/" && path.startsWith(link.href));
              return (
                <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between text-sm font-semibold py-2.5 border-b border-gray-50 transition-colors
                    ${active ? "text-[#1B6FEB]" : "text-gray-700 hover:text-[#1B6FEB]"}`}>
                  {link.label} <IcoChevRight />
                </Link>
              );
            })}
            {authUser ? (
              <Link href={dashHref} className="flex items-center justify-center gap-2 bg-[#1B6FEB] text-white text-sm font-bold px-5 py-3 rounded-full mt-4">
                <IcoDashboard />
                DASHBOARD
              </Link>
            ) : authUser === null ? (
              <Link href="/login" className="block text-center bg-[#1B6FEB] text-white text-sm font-bold px-5 py-3 rounded-full mt-4">
                LOGIN
              </Link>
            ) : null}
          </div>
        )}
      </header>
    </>
  );
}
