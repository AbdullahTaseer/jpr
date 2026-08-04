"use client";

import { useCmsPage } from "@/hooks/useCmsPage";

const inp  = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";
const area = inp + " resize-none";

function Section({ title, children, onSave, saving }: { title: string; children: React.ReactNode; onSave: () => void; saving: boolean }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-base">{title}</h2>
        <button onClick={onSave} disabled={saving}
          className="bg-[#1B6FEB] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">{label}</label>
      {hint && <p className="text-[#6b7280] text-[11px]">{hint}</p>}
      {children}
    </div>
  );
}

const DEFAULT_VALUES = [
  { emoji: "🤝", title: "Community first",        desc: "Every decision we make starts with what is best for our vendors, affiliates, and shoppers." },
  { emoji: "🔍", title: "Radical transparency",   desc: "We say what we mean, disclose what we should, and operate with full honesty." },
  { emoji: "🌱", title: "Purpose over profit",    desc: "We believe commerce can be a force for good and we build that into everything we do." },
  { emoji: "🏆", title: "Ownership mentality",    desc: "We hire people who treat the platform as their own and take pride in their work." },
  { emoji: "🔄", title: "Continuous improvement", desc: "We are always learning, iterating, and getting better — and we expect the same from our team." },
];

export default function ContentCareersPage() {
  const { get, set, saveSection, saving, toast } = useCmsPage("careers");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="text-white text-2xl font-bold">Careers</h1>
        <p className="text-[#6b7280] text-sm mt-1">Edit the careers page content and manage job openings</p>
      </div>

      {/* Hero */}
      <Section title="Hero Section" onSave={() => saveSection("hero")} saving={saving}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Page Heading">
            <input value={get("hero", "heading", "Careers at Latter Day Shopping")} onChange={e => set("hero", "heading", e.target.value)} className={inp} />
          </Field>
          <Field label="Subtext">
            <textarea rows={2} value={get("hero", "subtext", "Help us build the future of sustainable, community-driven commerce.")} onChange={e => set("hero", "subtext", e.target.value)} className={area} />
          </Field>
        </div>
      </Section>

      {/* Who We Are */}
      <Section title="Who We Are" onSave={() => saveSection("who_we_are")} saving={saving}>
        <Field label="Main Paragraph" hint="Use double line breaks to create separate paragraphs.">
          <textarea rows={6} value={get("who_we_are", "body",
            "Latter Day Shopping is a fast-growing free affiliate marketplace on a mission to make sustainable and purposeful products accessible to everyone. Founded under JPR Ventures LLC and based in Oregon City, Oregon, we are building a platform where independent vendors thrive, affiliates earn, and conscious shoppers find products they love — all without barriers or fees."
          )} onChange={e => set("who_we_are", "body", e.target.value)} className={area} />
        </Field>
        <Field label="Closing Line">
          <input value={get("who_we_are", "closing", "We are a small, driven team with big ambitions. Everyone here wears multiple hats, moves fast, and genuinely cares about the mission. If that sounds like your kind of environment, read on.")}
            onChange={e => set("who_we_are", "closing", e.target.value)} className={inp} />
        </Field>
      </Section>

      {/* Values */}
      <Section title="Our Values (5 Cards)" onSave={() => saveSection("values")} saving={saving}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEFAULT_VALUES.map((dv, i) => (
            <div key={i} className="bg-[#242424] rounded-xl p-4 space-y-3">
              <p className="text-white text-xs font-semibold">Value {i + 1}</p>
              <Field label="Emoji">
                <input value={get("values", `${i}.emoji`, dv.emoji)} onChange={e => set("values", `${i}.emoji`, e.target.value)} className={inp} />
              </Field>
              <Field label="Title">
                <input value={get("values", `${i}.title`, dv.title)} onChange={e => set("values", `${i}.title`, e.target.value)} className={inp} />
              </Field>
              <Field label="Description">
                <textarea rows={2} value={get("values", `${i}.desc`, dv.desc)} onChange={e => set("values", `${i}.desc`, e.target.value)} className={area} />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* Current Openings */}
      <Section title="Current Openings" onSave={() => saveSection("openings")} saving={saving}>
        <div className="bg-[#242424] rounded-xl p-4 space-y-3 mb-4">
          <Field label="Intro Text">
            <textarea rows={2} value={get("openings", "intro", "We hire for attitude, aptitude, and alignment with our mission. Even when a role isn't listed, we always want to hear from great people.")}
              onChange={e => set("openings", "intro", e.target.value)} className={area} />
          </Field>
          <Field label="Application Email" hint="Users will be directed to email this address to apply. Leave blank to hide the apply button.">
            <input type="email" value={get("openings", "email", "")} onChange={e => set("openings", "email", e.target.value)}
              placeholder="e.g. careers@latterdayshopping.com" className={inp} />
          </Field>
        </div>

        <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide mb-3">
          Job Openings — leave Title blank to hide an entry (shows &quot;Coming Soon&quot; when all are empty)
        </p>
        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="bg-[#242424] rounded-xl p-4 space-y-3">
              <p className="text-white text-xs font-semibold">Opening {i + 1}</p>
              <Field label="Job Title">
                <input value={get("openings", `${i}.title`, "")} onChange={e => set("openings", `${i}.title`, e.target.value)}
                  placeholder="e.g. Frontend Engineer" className={inp} />
              </Field>
              <Field label="Description" hint="Describe the role, responsibilities, or requirements. Plain text only.">
                <textarea rows={3} value={get("openings", `${i}.desc`, "")} onChange={e => set("openings", `${i}.desc`, e.target.value)}
                  placeholder="Describe this role…" className={area} />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section title="Bottom CTA" onSave={() => saveSection("cta")} saving={saving}>
        <Field label="Body Text">
          <textarea rows={2} value={get("cta", "body", "We are always looking for passionate people. Send us a note and tell us how you can contribute to our mission.")}
            onChange={e => set("cta", "body", e.target.value)} className={area} />
        </Field>
      </Section>
    </div>
  );
}
