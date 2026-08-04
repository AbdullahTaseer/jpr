"use client";

import { useCmsPage } from "@/hooks/useCmsPage";
import ImageUploadField from "@/components/dashboard/ImageUploadField";

const inp = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}

const DEFAULT_VALUES = [
    { icon: "🌱", title: "Sustainability", desc: "Every product on our platform is chosen with environmental responsibility in mind." },
    { icon: "🤝", title: "Trust",          desc: "We manually review and approve every vendor." },
    { icon: "💡", title: "Intentionality", desc: "We believe in mindful commerce — products created with purpose." },
    { icon: "🌍", title: "Community",      desc: "More than a marketplace — we're a movement." },
];

const DEFAULT_TIMELINE = [
    { year: "2022", title: "The Idea",          desc: "Frustrated by a marketplace full of mass-produced goods, our founder imagined a space built around purpose." },
    { year: "2023", title: "Building the Dream",desc: "A small team spent a year building the platform and vetting the first 50 vendors." },
    { year: "2024", title: "Launch Day",        desc: "Latter Day Shopping launched to the public with 50 vendors and 1,200 curated products." },
    { year: "2026", title: "Growing Together",  desc: "Today we host 10,000+ vendors, 50,000+ products, and serve 200,000+ conscious shoppers." },
];

export default function ContentAboutPage() {
    const { get, set, saveSection, saving, toast } = useCmsPage("about");

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.message}
                </div>
            )}

            <div>
                <h1 className="text-white text-2xl font-bold">About Us</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit the company story, values, mission, and timeline</p>
            </div>

            {/* Hero */}
            <Section title="Hero Section" onSave={() => saveSection("hero")} saving={saving}>
                <ImageUploadField label="Background Image" value={get("hero", "image", "")} onChange={v => set("hero", "image", v)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Heading">
                        <input value={get("hero", "heading", "About Latter Day Shopping")} onChange={e => set("hero", "heading", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Subtext">
                        <textarea rows={3} value={get("hero", "subtext", "")} onChange={e => set("hero", "subtext", e.target.value)} className={area} />
                    </Field>
                </div>
            </Section>

            {/* Mission */}
            <Section title="Mission Section" onSave={() => saveSection("mission")} saving={saving}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Heading">
                        <input value={get("mission", "heading", "A marketplace built on trust and shared values")} onChange={e => set("mission", "heading", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Paragraph 1">
                        <textarea rows={3} value={get("mission", "para1", "")} onChange={e => set("mission", "para1", e.target.value)} className={area} />
                    </Field>
                    <Field label="Paragraph 2">
                        <textarea rows={3} value={get("mission", "para2", "")} onChange={e => set("mission", "para2", e.target.value)} className={area} />
                    </Field>
                </div>
                <ImageUploadField label="Side Image" value={get("mission", "image", "")} onChange={v => set("mission", "image", v)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    {[
                        { k: "0", defV: "10K+", defL: "Vendors" },
                        { k: "1", defV: "50K+", defL: "Products" },
                        { k: "2", defV: "200K+", defL: "Shoppers" },
                    ].map(s => (
                        <div key={s.k} className="bg-[#242424] rounded-xl p-4 space-y-2">
                            <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide">Stat {parseInt(s.k)+1}</p>
                            <Field label="Value">
                                <input value={get("mission", `stat${s.k}.value`, s.defV)} onChange={e => set("mission", `stat${s.k}.value`, e.target.value)} className={inp} />
                            </Field>
                            <Field label="Label">
                                <input value={get("mission", `stat${s.k}.label`, s.defL)} onChange={e => set("mission", `stat${s.k}.label`, e.target.value)} className={inp} />
                            </Field>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Values */}
            <Section title="Core Values (4 Cards)" onSave={() => saveSection("values")} saving={saving}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DEFAULT_VALUES.map((dv, i) => (
                        <div key={i} className="bg-[#242424] rounded-xl p-4 space-y-3">
                            <p className="text-white text-xs font-semibold">Card {i + 1}</p>
                            <Field label="Icon (emoji)">
                                <input value={get("values", `${i}.icon`, dv.icon)} onChange={e => set("values", `${i}.icon`, e.target.value)} className={inp} />
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

            {/* Timeline */}
            <Section title="Timeline (4 Items)" onSave={() => saveSection("timeline")} saving={saving}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DEFAULT_TIMELINE.map((dt, i) => (
                        <div key={i} className="bg-[#242424] rounded-xl p-4 space-y-3">
                            <p className="text-white text-xs font-semibold">Item {i + 1}</p>
                            <Field label="Year">
                                <input value={get("timeline", `${i}.year`, dt.year)} onChange={e => set("timeline", `${i}.year`, e.target.value)} className={inp} />
                            </Field>
                            <Field label="Title">
                                <input value={get("timeline", `${i}.title`, dt.title)} onChange={e => set("timeline", `${i}.title`, e.target.value)} className={inp} />
                            </Field>
                            <Field label="Description">
                                <textarea rows={2} value={get("timeline", `${i}.desc`, dt.desc)} onChange={e => set("timeline", `${i}.desc`, e.target.value)} className={area} />
                            </Field>
                        </div>
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <Section title="Bottom CTA Banner" onSave={() => saveSection("cta")} saving={saving}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Heading">
                        <input value={get("cta", "heading", "Ready to Join Our Community?")} onChange={e => set("cta", "heading", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Subtext">
                        <textarea rows={2} value={get("cta", "subtext", "")} onChange={e => set("cta", "subtext", e.target.value)} className={area} />
                    </Field>
                </div>
            </Section>
        </div>
    );
}
