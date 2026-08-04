"use client";

import { useCmsPage } from "@/hooks/useCmsPage";
import ImageUploadField from "@/components/dashboard/ImageUploadField";
import FAQManager from "@/components/admin/FAQManager";

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

export default function ContentContactPage() {
    const { get, set, saveSection, saving, toast } = useCmsPage("contact");

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.message}
                </div>
            )}

            <div>
                <h1 className="text-white text-2xl font-bold">Contact Us</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit the contact page hero, office image, and FAQ items</p>
            </div>

            {/* Hero */}
            <Section title="Hero Section" onSave={() => saveSection("hero")} saving={saving}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Heading">
                        <input value={get("hero", "heading", "Contact Us")} onChange={e => set("hero", "heading", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Subtext">
                        <textarea rows={3} value={get("hero", "subtext", "Have a question, idea, or just want to say hello? We'd love to hear from you.")} onChange={e => set("hero", "subtext", e.target.value)} className={area} />
                    </Field>
                </div>
            </Section>

            {/* Office Image */}
            <Section title="Office / Location Image" onSave={() => saveSection("office")} saving={saving}>
                <ImageUploadField
                    label="Office Photo (shown beside the contact form)"
                    value={get("office", "image", "")}
                    onChange={v => set("office", "image", v)}
                />
            </Section>

            {/* FAQ */}
            <div>
                <div className="mb-4">
                    <h2 className="text-white font-semibold text-base">FAQ Items</h2>
                    <p className="text-[#6b7280] text-sm mt-0.5">These appear in the FAQ accordion on the Contact page</p>
                </div>
                <FAQManager />
            </div>
        </div>
    );
}
