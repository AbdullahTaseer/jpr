"use client";

import { useCmsPage } from "@/hooks/useCmsPage";

const inp  = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";
const area = inp + " resize-none";

function Section({ title, onSave, saving, children }: { title: string; onSave: () => void; saving: boolean; children: React.ReactNode }) {
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

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

export default function ContentBecomeVendorPage() {
  const { get, set, saveSection, saving, toast } = useCmsPage("vendor");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Become a Vendor</h1>
        <p className="text-[#6b7280] text-sm mt-1">Edit the vendor acquisition page content</p>
      </div>

      {/* Hero Section */}
      <Section title="Hero Section" onSave={() => saveSection("hero")} saving={saving}>
        <Grid2>
          <Field label="Badge Text">
            <input className={inp} value={get("hero", "badge", "For Sellers & Makers")}
              onChange={e => set("hero", "badge", e.target.value)} />
          </Field>
          <Field label="Hero Headline">
            <input className={inp} value={get("hero", "headline", "Become a Vendor on Latter Day Shopping")}
              onChange={e => set("hero", "headline", e.target.value)} />
          </Field>
        </Grid2>
        <Field label="Hero Subheadline">
          <textarea className={area} rows={2} value={get("hero", "subheadline", "Join a growing community of independent sellers, sustainable brands, and passionate creators all in one free marketplace.")}
            onChange={e => set("hero", "subheadline", e.target.value)} />
        </Field>
        <Grid2>
          <Field label="CTA Button 1 Text">
            <input className={inp} value={get("hero", "cta1", "Apply Now — It's Free →")}
              onChange={e => set("hero", "cta1", e.target.value)} />
          </Field>
          <Field label="CTA Button 2 Text">
            <input className={inp} value={get("hero", "cta2", "See How It Works")}
              onChange={e => set("hero", "cta2", e.target.value)} />
          </Field>
        </Grid2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ["stat0", "0%",      "Commission"],
            ["stat1", "$0",      "Listing Fees"],
            ["stat2", "2–3 Days","Approval Time"],
            ["stat3", "Free",    "To Get Started"],
          ].map(([key, dv, dl]) => (
            <div key={key} className="space-y-2">
              <Field label={`Stat: ${dl} Value`}>
                <input className={inp} value={get("hero", `${key}.value`, dv)}
                  onChange={e => set("hero", `${key}.value`, e.target.value)} />
              </Field>
              <Field label="Label">
                <input className={inp} value={get("hero", `${key}.label`, dl)}
                  onChange={e => set("hero", `${key}.label`, e.target.value)} />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* Why Sell With Us */}
      <Section title="Why Sell With Us" onSave={() => saveSection("why")} saving={saving}>
        <Grid2>
          <Field label="Section Heading">
            <input className={inp} value={get("why", "heading", "Why sell with us?")}
              onChange={e => set("why", "heading", e.target.value)} />
          </Field>
        </Grid2>
        <Field label="Section Body">
          <textarea className={area} rows={2} value={get("why", "body", "Latter Day Shopping isn't just another marketplace. We are a community-first platform built to give independent vendors a real chance to grow without paying listing fees, commissions, or subscriptions.")}
            onChange={e => set("why", "body", e.target.value)} />
        </Field>
        <div className="space-y-4">
          <p className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">Perks (6)</p>
          {[
            ["perk0", "🚀", "0% Commission",       "Keep 100% of what you earn. We never take a cut of your sales."],
            ["perk1", "🆓", "Free to List",         "No setup fee, no monthly subscription, no hidden charges."],
            ["perk2", "📣", "Affiliate Traffic",    "Our affiliate network promotes your products for you."],
            ["perk3", "🏪", "Your Own Storefront",  "A dedicated shop page with your story, brand, and full catalog."],
            ["perk4", "🌿", "Sustainable Audience", "Reach buyers who specifically seek eco-conscious, purposeful products."],
            ["perk5", "📊", "Seller Dashboard",     "Manage orders, track views, and monitor your performance in one place."],
          ].map(([key, di, dt, dd]) => (
            <div key={key} className="bg-[#242424] rounded-xl p-4 space-y-3">
              <p className="text-white text-xs font-bold uppercase tracking-wide">{`${key.replace("perk", "Perk ")} `}</p>
              <Grid2>
                <Field label="Icon (emoji)">
                  <input className={inp} value={get("why", `${key}.icon`, di)}
                    onChange={e => set("why", `${key}.icon`, e.target.value)} />
                </Field>
                <Field label="Title">
                  <input className={inp} value={get("why", `${key}.title`, dt)}
                    onChange={e => set("why", `${key}.title`, e.target.value)} />
                </Field>
              </Grid2>
              <Field label="Description">
                <input className={inp} value={get("why", `${key}.desc`, dd)}
                  onChange={e => set("why", `${key}.desc`, e.target.value)} />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* Who Can Become a Vendor */}
      <Section title="Who Can Become a Vendor" onSave={() => saveSection("who")} saving={saving}>
        <Field label="Section Heading">
          <input className={inp} value={get("who", "heading", "Who can become a vendor?")}
            onChange={e => set("who", "heading", e.target.value)} />
        </Field>
        <Field label="Section Body">
          <textarea className={area} rows={3} value={get("who", "body", "We welcome all independent sellers, small businesses, and creators who offer products that align with our platform values. Whether you make handmade goods, source sustainable products, or offer digital downloads — there is a place for you here.")}
            onChange={e => set("who", "body", e.target.value)} />
        </Field>
        <Field label="Requirements Intro Text">
          <textarea className={area} rows={2} value={get("who", "reqHeading", "To maintain the quality and integrity of our marketplace, all vendors must meet the following standards:")}
            onChange={e => set("who", "reqHeading", e.target.value)} />
        </Field>
        <div className="space-y-3">
          <p className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">Requirements (5)</p>
          {[
            ["req0", "Products must be legally compliant and safe for consumer use."],
            ["req1", "Listings must be accurate, honest, and not misleading."],
            ["req2", "Vendors must fulfill orders in a timely manner and communicate with buyers professionally."],
            ["req3", "Products involving counterfeit goods, illegal substances, or hate-based content are strictly prohibited."],
            ["req4", "Vendors must agree to our Vendor Terms of Service before going live."],
          ].map(([key, def], i) => (
            <Field key={key} label={`Requirement ${i + 1}`}>
              <input className={inp} value={get("who", key, def)}
                onChange={e => set("who", key, e.target.value)} />
            </Field>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section title="How It Works" onSave={() => saveSection("how")} saving={saving}>
        <Field label="Section Heading">
          <input className={inp} value={get("how", "heading", "How it works")}
            onChange={e => set("how", "heading", e.target.value)} />
        </Field>
        <div className="space-y-4">
          <p className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">Steps (4)</p>
          {[
            ["step0", "Apply",            "Submit your vendor application with basic business information."],
            ["step1", "Get Approved",     "Our team reviews your application within 2–3 business days."],
            ["step2", "Set Up Your Shop", "Add your logo, story, and list your first products."],
            ["step3", "Start Selling",    "Go live and let our affiliate network drive buyers to your store."],
          ].map(([key, dt, dd], i) => (
            <div key={key} className="bg-[#242424] rounded-xl p-4 space-y-3">
              <p className="text-white text-xs font-bold uppercase tracking-wide">Step {i + 1}</p>
              <Field label="Title">
                <input className={inp} value={get("how", `${key}.title`, dt)}
                  onChange={e => set("how", `${key}.title`, e.target.value)} />
              </Field>
              <Field label="Description">
                <input className={inp} value={get("how", `${key}.desc`, dd)}
                  onChange={e => set("how", `${key}.desc`, e.target.value)} />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* Vendor Responsibilities */}
      <Section title="Vendor Responsibilities" onSave={() => saveSection("responsibilities")} saving={saving}>
        <Field label="Section Heading">
          <input className={inp} value={get("responsibilities", "heading", "Vendor responsibilities")}
            onChange={e => set("responsibilities", "heading", e.target.value)} />
        </Field>
        <Field label="Intro Text">
          <input className={inp} value={get("responsibilities", "intro", "As a vendor on Latter Day Shopping, you are solely responsible for:")}
            onChange={e => set("responsibilities", "intro", e.target.value)} />
        </Field>
        <div className="space-y-3">
          <p className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wide">Responsibility Items (5)</p>
          {[
            ["item0", "The accuracy and legality of your product listings."],
            ["item1", "Fulfilling orders promptly and handling returns or refunds per your stated policy."],
            ["item2", "Maintaining adequate stock levels and updating listings when items are unavailable."],
            ["item3", "Complying with all applicable local, state, and federal laws, including sales tax obligations."],
            ["item4", "Providing honest and transparent descriptions, pricing, and shipping timelines."],
          ].map(([key, def], i) => (
            <Field key={key} label={`Item ${i + 1}`}>
              <input className={inp} value={get("responsibilities", key, def)}
                onChange={e => set("responsibilities", key, e.target.value)} />
            </Field>
          ))}
        </div>
        <Field label="Footer Note">
          <textarea className={area} rows={2} value={get("responsibilities", "note", "Latter Day Shopping reserves the right to remove any vendor or listing that violates our community standards, without prior notice.")}
            onChange={e => set("responsibilities", "note", e.target.value)} />
        </Field>
      </Section>

      {/* Platform Protection */}
      <Section title="Platform Protection" onSave={() => saveSection("protection")} saving={saving}>
        <Field label="Heading">
          <input className={inp} value={get("protection", "heading", "Platform Protection")}
            onChange={e => set("protection", "heading", e.target.value)} />
        </Field>
        <Field label="Body">
          <textarea className={area} rows={4} value={get("protection", "body", "By registering as a vendor, you agree that Latter Day Shopping and JPR Ventures LLC are not liable for disputes between vendors and buyers, product defects, shipping losses, or any losses arising from the use of the platform. Vendors indemnify and hold Latter Day Shopping harmless from any claims arising from their product listings or business conduct.")}
            onChange={e => set("protection", "body", e.target.value)} />
        </Field>
      </Section>

      {/* CTA Section */}
      <Section title="CTA Section" onSave={() => saveSection("cta")} saving={saving}>
        <Field label="Heading">
          <input className={inp} value={get("cta", "heading", "Ready to join?")}
            onChange={e => set("cta", "heading", e.target.value)} />
        </Field>
        <Field label="Body">
          <textarea className={area} rows={2} value={get("cta", "body", "Create your free vendor account today and start reaching thousands of conscious shoppers.")}
            onChange={e => set("cta", "body", e.target.value)} />
        </Field>
        <Field label="Support Email">
          <input className={inp} type="email" value={get("cta", "email", "support@latterdayshopping.com")}
            onChange={e => set("cta", "email", e.target.value)} />
        </Field>
      </Section>
    </div>
  );
}
