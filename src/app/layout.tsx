import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import DynamicFavicon from "@/components/DynamicFavicon";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    return {
      title: s?.metaTitle ?? "Latter Day Shopping — Discover & Sell Self-Sustainable Products",
      description: s?.metaDescription ?? "Latter Day Shopping is a free community marketplace connecting buyers and vendors who share a vision for intentional, sustainable living.",
    
    };
  } catch {
    return {
      title: "Latter Day Shopping — Discover & Sell Self-Sustainable Products",
      description: "Latter Day Shopping is a free community marketplace connecting buyers and vendors who share a vision for intentional, sustainable living.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let gaId: string | null = null;
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    gaId = s?.googleAnalyticsId ?? null;
  } catch {}

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}
        <SiteSettingsProvider>
          <FavoritesProvider>
            <DynamicFavicon />
            <ConditionalShell>{children}</ConditionalShell>
          </FavoritesProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
