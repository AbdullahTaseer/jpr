"use client";

import { useCmsPage } from "@/hooks/useCmsPage";

const inp = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";
const area = inp + " resize-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}

export default function ContentBlogPage() {
    const { get, set, saveSection, saving, toast } = useCmsPage("blog");

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.message}
                </div>
            )}

            <div>
                <h1 className="text-white text-2xl font-bold">Blog</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit the blog page hero section</p>
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold text-base">Hero Section</h2>
                    <button onClick={() => saveSection("hero")} disabled={saving}
                        className="bg-[#1B6FEB] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
                        {saving ? "Saving…" : "Save"}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Label (above heading)">
                        <input value={get("hero", "label", "Stories & Insights")} onChange={e => set("hero", "label", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Heading">
                        <input value={get("hero", "heading", "The LDS Blog")} onChange={e => set("hero", "heading", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Subtext">
                        <textarea rows={3} value={get("hero", "subtext", "Insights, stories, and guides from our community of intentional shoppers and purpose-driven vendors.")} onChange={e => set("hero", "subtext", e.target.value)} className={area} />
                    </Field>
                </div>
            </div>
        </div>
    );
}
