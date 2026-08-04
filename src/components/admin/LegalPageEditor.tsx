"use client";

import { useCmsPage } from "@/hooks/useCmsPage";

const inp = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";
const area = inp + " resize-none";

function SectionCard({ title, onSave, saving, children }: { title: string; onSave: () => void; saving: boolean; children: React.ReactNode }) {
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

export type LegalSection = {
    key: string;
    label: string;
    defaultTitle: string;
    defaultContent: string;
};

type Props = {
    page: string;
    sections: LegalSection[];
    defaultLastUpdated?: string;
};

export default function LegalPageEditor({ page, sections, defaultLastUpdated = "May 15, 2026" }: Props) {
    const { get, set, saveSection, saving, toast } = useCmsPage(page);

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.message}
                </div>
            )}

            <SectionCard title="Page Info" onSave={() => saveSection("info")} saving={saving}>
                <Field label="Last Updated">
                    <input value={get("info", "lastUpdated", defaultLastUpdated)} onChange={e => set("info", "lastUpdated", e.target.value)} className={inp} />
                </Field>
            </SectionCard>

            {sections.map((s, i) => (
                <SectionCard key={s.key} title={`Section ${i + 1} — ${s.label}`} onSave={() => saveSection(s.key)} saving={saving}>
                    <Field label="Section Heading">
                        <input value={get(s.key, "title", s.defaultTitle)} onChange={e => set(s.key, "title", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Content">
                        <textarea rows={5} value={get(s.key, "content", s.defaultContent)} onChange={e => set(s.key, "content", e.target.value)} className={area} />
                    </Field>
                </SectionCard>
            ))}
        </div>
    );
}
