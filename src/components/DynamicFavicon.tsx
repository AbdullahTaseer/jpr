"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function DynamicFavicon() {
  const { faviconUrl } = useSiteSettings();

  useEffect(() => {
    if (!faviconUrl) return;
    // Find or create our own dedicated link element — never touch React-managed nodes
    let link = document.getElementById("__dynamic-favicon") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "__dynamic-favicon";
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  return null;
}
