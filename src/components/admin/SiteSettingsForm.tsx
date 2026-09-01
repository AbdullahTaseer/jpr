"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

type Settings = {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  pinterest: string;
  youtube: string;
  tiktok: string;
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementBg: string;
};

const EMPTY: Settings = {
  siteName: "", tagline: "", logoUrl: "", faviconUrl: "",
  email: "", phone: "", address: "",
  facebook: "", twitter: "", instagram: "", linkedin: "", pinterest: "", youtube: "", tiktok: "",
  metaTitle: "", metaDescription: "", googleAnalyticsId: "",
  announcementEnabled: false, announcementText: "", announcementBg: "#1B6FEB",
};

type SectionKey = "general" | "contact" | "social" | "seo" | "announcement";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-5">
      <h2 className="text-white font-semibold text-base border-b border-white/10 pb-4">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-white text-sm font-semibold">{label}</label>
      {children}
      {hint && <p className="text-[#6b7280] text-xs">{hint}</p>}
    </div>
  );
}

const inp = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors";

const IcoUpload = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
  </svg>
);

function ImageUpload({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (files: FileList | null) => {
    if (!files?.[0]) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", files[0]);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="w-24 h-24 rounded-2xl bg-[#242424] border-2 border-dashed border-white/15 flex flex-col items-center justify-center cursor-pointer hover:border-[#1B6FEB]/50 transition-colors overflow-hidden relative"
        onClick={() => ref.current?.click()}
      >
        {uploading ? (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : value ? (
          <Image src={value} alt={label} fill className="object-contain p-1" unoptimized />
        ) : (
          <>
            <IcoUpload />
            <span className="text-[#6b7280] text-xs mt-1">{label}</span>
          </>
        )}
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => handle(e.target.files)} />
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-[10px] text-red-400 hover:text-red-300 text-left w-24"
        >
          Remove
        </button>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

function SaveRow({ saving, saved, error }: { saving: boolean; saved: boolean; error: string }) {
  return (
    <div className="flex items-center justify-end gap-3">
      {saved && !saving && <span className="text-green-400 text-xs font-medium">Saved successfully</span>}
      {error && !saving && <span className="text-red-400 text-xs">{error}</span>}
      <button
        type="submit"
        disabled={saving}
        className="bg-[#1B6FEB] text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function useSectionSave() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = useCallback(async (payload: Partial<Settings>) => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, []);

  return { saving, saved, error, save };
}

export default function SiteSettingsForm() {
  const [s, setS] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);

  const general = useSectionSave();
  const contact = useSectionSave();
  const social = useSectionSave();
  const seo = useSectionSave();
  const announcement = useSectionSave();

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          const raw = d.settings;
          setS({
            siteName: raw.siteName ?? "",
            tagline: raw.tagline ?? "",
            logoUrl: raw.logoUrl ?? "",
            faviconUrl: raw.faviconUrl ?? "",
            email: raw.email ?? "",
            phone: raw.phone ?? "",
            address: raw.address ?? "",
            facebook: raw.facebook ?? "",
            twitter: raw.twitter ?? "",
            instagram: raw.instagram ?? "",
            linkedin: raw.linkedin ?? "",
            pinterest: raw.pinterest ?? "",
            youtube: raw.youtube ?? "",
            tiktok: raw.tiktok ?? "",
            metaTitle: raw.metaTitle ?? "",
            metaDescription: raw.metaDescription ?? "",
            googleAnalyticsId: raw.googleAnalyticsId ?? "",
            announcementEnabled: raw.announcementEnabled ?? false,
            announcementText: raw.announcementText ?? "",
            announcementBg: raw.announcementBg ?? "#1B6FEB",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setS(prev => ({ ...prev, [key]: e.target.value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* General Settings */}
      <form onSubmit={e => { e.preventDefault(); general.save({ siteName: s.siteName, tagline: s.tagline, logoUrl: s.logoUrl }); }}>
        <Section title="General Settings">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Row label="Site Name">
              <input value={s.siteName} onChange={set("siteName")} className={inp} placeholder="Latter Day Shopping" />
            </Row>
            <Row label="Tagline">
              <input value={s.tagline} onChange={set("tagline")} className={inp} placeholder="Discover & Shop. Inspire." />
            </Row>
          </div>
          <div className="flex items-end gap-8">
            <div>
              <p className="text-white text-sm font-semibold mb-3">Site Logo</p>
              <ImageUpload label="Logo" value={s.logoUrl} onChange={url => setS(p => ({ ...p, logoUrl: url }))} />
            </div>
          </div>
          <SaveRow saving={general.saving} saved={general.saved} error={general.error} />
        </Section>
      </form>

      {/* Contact Information */}
      <form onSubmit={e => { e.preventDefault(); contact.save({ email: s.email, phone: s.phone, address: s.address }); }}>
        <Section title="Contact Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Row label="Support Email">
              <input type="email" value={s.email} onChange={set("email")} className={inp} placeholder="support@example.com" />
            </Row>
            <Row label="Phone Number">
              <input type="tel" value={s.phone} onChange={set("phone")} className={inp} placeholder="Hidden on site when empty" />
            </Row>
            <Row label="Address">
              <input value={s.address} onChange={set("address")} className={inp} placeholder="Hidden on site when empty" />
            </Row>
          </div>
          <SaveRow saving={contact.saving} saved={contact.saved} error={contact.error} />
        </Section>
      </form>

      {/* Social Media Links */}
      <form onSubmit={e => {
        e.preventDefault();
        social.save({ facebook: s.facebook, twitter: s.twitter, instagram: s.instagram, linkedin: s.linkedin, pinterest: s.pinterest, youtube: s.youtube, tiktok: s.tiktok });
      }}>
        <Section title="Social Media Links">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {([
              { key: "facebook",  label: "Facebook",   placeholder: "https://facebook.com/yourpage" },
              { key: "twitter",   label: "Twitter / X", placeholder: "https://x.com/yourhandle" },
              { key: "instagram", label: "Instagram",  placeholder: "https://instagram.com/yourhandle" },
              { key: "linkedin",  label: "LinkedIn",   placeholder: "https://linkedin.com/company/yourpage" },
              { key: "pinterest", label: "Pinterest",  placeholder: "https://pinterest.com/yourprofile" },
              { key: "youtube",   label: "YouTube",    placeholder: "https://youtube.com/@yourchannel" },
              { key: "tiktok",    label: "TikTok",     placeholder: "https://tiktok.com/@yourhandle" },
            ] as const).map(({ key, label, placeholder }) => (
              <Row key={key} label={label}>
                <input
                  type="url"
                  value={s[key]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  className={inp}
                />
              </Row>
            ))}
          </div>
          <SaveRow saving={social.saving} saved={social.saved} error={social.error} />
        </Section>
      </form>

      {/* SEO Settings */}
      <form onSubmit={e => {
        e.preventDefault();
        seo.save({ metaTitle: s.metaTitle, metaDescription: s.metaDescription, googleAnalyticsId: s.googleAnalyticsId });
      }}>
        <Section title="SEO Settings">
          <Row label="Meta Title" hint="Shown in browser tab and search results">
            <input value={s.metaTitle} onChange={set("metaTitle")} className={inp} placeholder="Your Site — Tagline" />
          </Row>
          <Row label="Meta Description" hint="Up to 160 characters for best results">
            <textarea
              value={s.metaDescription}
              onChange={set("metaDescription")}
              rows={3}
              className={inp + " resize-none"}
              placeholder="A short description of your site for search engines…"
            />
          </Row>
          <Row label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX">
            <input value={s.googleAnalyticsId} onChange={set("googleAnalyticsId")} placeholder="G-XXXXXXXXXX" className={inp} />
          </Row>
          <SaveRow saving={seo.saving} saved={seo.saved} error={seo.error} />
        </Section>
      </form>

      {/* Announcement Bar */}
      <form onSubmit={e => {
        e.preventDefault();
        announcement.save({ announcementEnabled: s.announcementEnabled, announcementText: s.announcementText, announcementBg: s.announcementBg });
      }}>
        <Section title="Announcement Bar">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-semibold">Show Announcement Bar</span>
            <button
              type="button"
              onClick={() => setS(p => ({ ...p, announcementEnabled: !p.announcementEnabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${s.announcementEnabled ? "bg-[#1B6FEB]" : "bg-white/15"}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${s.announcementEnabled ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <Row label="Announcement Text">
            <input
              value={s.announcementText}
              onChange={set("announcementText")}
              className={inp}
              placeholder="🔥 Get up to 30% OFF — Store-wide sale · Limited time only"
            />
          </Row>
          <Row label="Background Color" hint="Hex colour for the announcement bar">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={s.announcementBg}
                onChange={set("announcementBg")}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5"
              />
              <input
                value={s.announcementBg}
                onChange={set("announcementBg")}
                className={inp + " flex-1"}
                placeholder="#1B6FEB"
                maxLength={7}
              />
            </div>
          </Row>
          {s.announcementEnabled && s.announcementText && (
            <div className="rounded-xl px-4 py-2.5 text-white text-xs text-center font-medium" style={{ backgroundColor: s.announcementBg }}>
              <span dangerouslySetInnerHTML={{ __html: s.announcementText }} />
            </div>
          )}
          <SaveRow saving={announcement.saving} saved={announcement.saved} error={announcement.error} />
        </Section>
      </form>

    </div>
  );
}
