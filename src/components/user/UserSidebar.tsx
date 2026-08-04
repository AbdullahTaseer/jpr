"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const IcoGrid    = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
const IcoHeart   = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;
const IcoStar    = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>;
const IcoLogout  = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>;
const IcoMenu    = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>;
const IcoClose   = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;

const NAV = [
  { label: "Overview",  href: "/user-dashboard",           icon: IcoGrid,  exact: true },
  { label: "Favorites", href: "/user-dashboard/favorites", icon: IcoHeart },
  { label: "My Reviews",href: "/user-dashboard/reviews",   icon: IcoStar },
];

type UserInfo = { name: string; email: string };

function NavItem({ label, href, icon: Icon, exact, onClick }: { label: string; href: string; icon: () => React.ReactElement; exact?: boolean; onClick?: () => void }) {
  const path = usePathname();
  const active = exact ? path === href : path.startsWith(href);
  return (
    <Link href={href} onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
        ${active ? "bg-[#1B6FEB]/15 text-[#1B6FEB] border border-[#1B6FEB]/30" : "text-[#9ca3af] hover:text-white hover:bg-white/5 border border-transparent"}`}>
      <span className={`transition-colors ${active ? "text-[#1B6FEB]" : "text-[#6b7280] group-hover:text-white"}`}><Icon /></span>
      {label}
    </Link>
  );
}

export default function UserSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();
  const s = useSiteSettings();
  const logoSrc = s.logoUrl || "/images/logo.png";

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d?.user) setUser({ name: d.user.name, email: d.user.email });
    }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "U";

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/"><Image src={logoSrc} alt={s.siteName} width={150} height={40} className="h-16 w-auto m-auto" priority unoptimized={!!s.logoUrl} /></Link>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map(item => <NavItem key={item.href} {...item} onClick={() => setMobileOpen(false)} />)}
      </nav>
      <div className="px-3 py-5 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#1B6FEB]/20 flex items-center justify-center text-[#1B6FEB] text-xs font-bold">{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name ?? "Loading..."}</p>
            <p className="text-[#6b7280] text-xs truncate">{user?.email ?? ""}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9ca3af] hover:text-white hover:bg-white/5 transition-all">
          <IcoLogout /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#1a1a1a] border border-white/10 text-white"
        onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <IcoClose /> : <IcoMenu />}
      </button>
      {mobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-[#111111] border-r border-white/10 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {content}
      </aside>
    </>
  );
}
