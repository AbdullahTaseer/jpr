"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const noShell = ["/vendor-dashboard", "/admin-dashboard", "/user-dashboard", "/login", "/register", "/vendor/register"];
  if (noShell.some((p) => path.startsWith(p))) return <>{children}</>;
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
