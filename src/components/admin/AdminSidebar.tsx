"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useAdminTheme } from "@/context/AdminThemeContext";

const IcoDashboard  = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
const IcoBox        = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11"/></svg>;
const IcoUpload     = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>;
const IcoVendors    = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IcoTag        = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg>;
const IcoAward      = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="8" r="6"/><path strokeLinecap="round" strokeLinejoin="round" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IcoTeam       = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>;
const IcoSliders    = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="18" height="14" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M8 21h8"/></svg>;
const IcoBlog       = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>;
const IcoStar       = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>;
const IcoInquiry    = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>;
const IcoMail       = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const IcoReport     = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>;
const IcoContent    = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
const IcoSettings   = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoChevRight  = () => <svg className="w-3.5 h-3.5 shrink-0 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>;
const IcoLogout     = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>;
const IcoSun        = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="4"/><path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
const IcoMoon       = () => <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const IcoMenu       = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>;
const IcoClose      = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;

const NAV = [
  { label: "Dashboard",    href: "/admin-dashboard",             icon: IcoDashboard, exact: true },
  { label: "Products",     href: "/admin-dashboard/products",    icon: IcoBox },
  { label: "Import CSV",   href: "/admin-dashboard/import",      icon: IcoUpload },
  { label: "Vendors",      href: "/admin-dashboard/vendors",     icon: IcoVendors },
  { label: "Categories",   href: "/admin-dashboard/categories",  icon: IcoTag },
  { label: "Brands",       href: "/admin-dashboard/brands",      icon: IcoAward },
  { label: "Teams",        href: "/admin-dashboard/teams",       icon: IcoTeam },
  { label: "Sliders",      href: "/admin-dashboard/sliders",     icon: IcoSliders },
  { label: "Blogs",        href: "/admin-dashboard/blogs",       icon: IcoBlog },
  { label: "Reviews",      href: "/admin-dashboard/testimonials",icon: IcoStar },
  { label: "Inquiries",    href: "/admin-dashboard/inquiries",   icon: IcoInquiry },
  { label: "Newsletters",  href: "/admin-dashboard/newsletters", icon: IcoMail },
];

const CONTENT_PAGES = [
  { label: "Home",               href: "/admin-dashboard/content/home" },
  { label: "About Us",           href: "/admin-dashboard/content/about" },
  { label: "Contact Us",         href: "/admin-dashboard/content/contact" },
  { label: "Blog",               href: "/admin-dashboard/content/blog" },
  { label: "FAQs",               href: "/admin-dashboard/content/faqs" },
  { label: "Terms & Conditions", href: "/admin-dashboard/content/terms" },
  { label: "Privacy Policy",     href: "/admin-dashboard/content/privacy" },
  { label: "Disclaimer",         href: "/admin-dashboard/content/disclaimer" },
  { label: "Affiliate Disclosure",href: "/admin-dashboard/content/affiliate-disclosure" },
  { label: "Become a Vendor",    href: "/admin-dashboard/content/become-vendor" },
  { label: "Careers",            href: "/admin-dashboard/content/careers" },
  { label: "Sign Up",            href: "/admin-dashboard/content/signup" },
  { label: "Sign In",            href: "/admin-dashboard/content/signin" },
];

function NavItem({ label, href, icon: Icon, exact, onClick, light }: { label: string; href: string; icon: () => React.ReactElement; exact?: boolean; onClick?: () => void; light?: boolean }) {
  const path = usePathname();
  const active = exact ? path === href : path.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors rounded-lg
        ${active
          ? light ? "text-gray-900 bg-gray-100" : "text-white bg-white/10"
          : light ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50" : "text-[#9ca3af] hover:text-white hover:bg-white/5"}`}
    >
      <span className={active ? "text-[#1B6FEB]" : light ? "text-gray-400" : "text-[#6b7280]"}><Icon /></span>
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const path = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const s = useSiteSettings();
  const { theme, toggleTheme } = useAdminTheme();
  const logoSrc = s.logoUrl || "/images/logo.png";
  const isLight = theme === "light";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
  };

  useEffect(() => {
    if (path.startsWith("/admin-dashboard/content")) setContentOpen(true);
  }, [path]);

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={`px-4 py-4 border-b shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <Link href="/">
          <Image src={logoSrc} alt={s.siteName} width={150} height={40} className="h-16 w-auto m-auto" priority unoptimized={!!s.logoUrl} />
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className={`mt-3 w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold border transition-colors ${
            isLight
              ? "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
          }`}
          aria-label={isLight ? "Switch to night mode" : "Switch to day mode"}
        >
          <span className="flex items-center gap-2">
            {isLight ? <IcoMoon /> : <IcoSun />}
            {isLight ? "Night Mode" : "Day Mode"}
          </span>
          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              isLight ? "bg-gray-300" : "bg-[#1B6FEB]"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                isLight ? "translate-x-1" : "translate-x-4"
              }`}
            />
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV.map(item => (
          <NavItem key={item.href} {...item} light={isLight} onClick={() => setMobileOpen(false)} />
        ))}

        <div>
          <button
            onClick={() => setContentOpen(!contentOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors rounded-lg
              ${path.startsWith("/admin-dashboard/content")
                ? isLight ? "text-gray-900 bg-gray-100" : "text-white bg-white/10"
                : isLight ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50" : "text-[#9ca3af] hover:text-white hover:bg-white/5"}`}
          >
            <span className={path.startsWith("/admin-dashboard/content") ? "text-[#1B6FEB]" : isLight ? "text-gray-400" : "text-[#6b7280]"}><IcoContent /></span>
            <span className="flex-1 text-left">Content Management</span>
            <span className={`transition-transform duration-200 ${contentOpen ? "rotate-90" : ""}`}><IcoChevRight /></span>
          </button>
          {contentOpen && (
            <div className={`ml-7 mt-0.5 space-y-0.5 border-l pl-3 ${isLight ? "border-gray-200" : "border-white/10"}`}>
              {CONTENT_PAGES.map(p => {
                const active = path === p.href;
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2 text-[12px] font-medium transition-colors truncate
                      ${active ? "text-[#1B6FEB]" : isLight ? "text-gray-400 hover:text-gray-900" : "text-[#6b7280] hover:text-white"}`}
                  >
                    {p.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <NavItem label="Site Setting" href="/admin-dashboard/site-settings" icon={IcoSettings} light={isLight} onClick={() => setMobileOpen(false)} />
      </nav>

      <div className={`px-2 py-3 border-t shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-7 h-7 rounded-full bg-[#1B6FEB]/20 flex items-center justify-center text-[#1B6FEB] text-[10px] font-bold shrink-0">SA</div>
          <div className="flex-1 min-w-0">
            <p className={`text-[12px] font-semibold truncate ${isLight ? "text-gray-900" : "text-white"}`}>Super Admin</p>
            <p className="text-[#6b7280] text-[11px] truncate">admin@latterdayshopping.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
            isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-[#9ca3af] hover:text-white hover:bg-white/5"
          }`}
        >
          <IcoLogout />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#1a1a1a] border border-white/10 text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <IcoClose /> : <IcoMenu />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-56 border-r transition-transform duration-300
        ${isLight ? "bg-white border-gray-200" : "bg-[#111111] border-white/10"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
