"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type SiteSettingsData = {
    siteName: string;
    tagline: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    pinterest: string | null;
    youtube: string | null;
    tiktok: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    googleAnalyticsId: string | null;
    announcementEnabled: boolean;
    announcementText: string | null;
    announcementBg: string;
};

const DEFAULTS: SiteSettingsData = {
    siteName: "Latter Day Shopping",
    tagline: null,
    logoUrl: null,
    faviconUrl: null,
    email: "support@latterdayshopping.com",
    phone: null,
    address: null,
    facebook: null,
    twitter: null,
    instagram: null,
    linkedin: null,
    pinterest: null,
    youtube: null,
    tiktok: null,
    metaTitle: null,
    metaDescription: null,
    googleAnalyticsId: null,
    announcementEnabled: false,
    announcementText: null,
    announcementBg: "#1B6FEB",
};

const SiteSettingsContext = createContext<SiteSettingsData>(DEFAULTS);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SiteSettingsData>(DEFAULTS);

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(d => { if (d.settings) setSettings({ ...DEFAULTS, ...d.settings }); })
            .catch(() => {});
    }, []);

    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}
