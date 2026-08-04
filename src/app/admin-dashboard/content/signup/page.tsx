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

export default function ContentSignupPage() {
    const { get, set, saveSection, saving, toast } = useCmsPage("signup");

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.message}
                </div>
            )}

            <div>
                <h1 className="text-white text-2xl font-bold">Sign Up</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit the sign-up page text</p>
            </div>

            {/* Left brand panel */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold text-base">Left Brand Panel</h2>
                    <button onClick={() => saveSection("hero")} disabled={saving}
                        className="bg-[#1B6FEB] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
                        {saving ? "Saving…" : "Save"}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Main Heading">
                        <input value={get("hero", "heading", "Join our community.")} onChange={e => set("hero", "heading", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Sub Text">
                        <textarea rows={3} value={get("hero", "subtext", "Discover purposeful products from independent vendors who share your values.")} onChange={e => set("hero", "subtext", e.target.value)} className={area} />
                    </Field>
                </div>
            </div>

            {/* Right form panel */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold text-base">Right Form Panel</h2>
                    <button onClick={() => saveSection("form")} disabled={saving}
                        className="bg-[#1B6FEB] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#1557D0] disabled:opacity-50 transition-colors">
                        {saving ? "Saving…" : "Save"}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Form Heading">
                        <input value={get("form", "heading", "Create account")} onChange={e => set("form", "heading", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Vendor CTA Text">
                        <input value={get("form", "vendorCta", "Apply as a Vendor")} onChange={e => set("form", "vendorCta", e.target.value)} className={inp} />
                    </Field>
                </div>
            </div>
        </div>
    );
}
