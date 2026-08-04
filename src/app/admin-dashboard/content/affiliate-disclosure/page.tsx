import LegalPageEditor, { LegalSection } from "@/components/admin/LegalPageEditor";

const SECTIONS: LegalSection[] = [
    { key: "s1", label: "What Is Affiliate Marketing?",    defaultTitle: "What Is Affiliate Marketing?",    defaultContent: "Affiliate marketing is a performance-based arrangement where we may earn a commission when you click certain links on our platform and make a qualifying purchase. This allows us to maintain and improve the platform at no additional cost to you — you pay the same price regardless of whether we earn a commission." },
    { key: "s2", label: "How It Works on Our Platform",   defaultTitle: "How It Works on Our Platform",   defaultContent: "Latter Day Shopping is primarily a marketplace where vendors sell directly to buyers. In some cases, we may link to external vendors or partner products where we have an affiliate relationship. These are always clearly marked wherever they appear — including in our navigation and footer." },
    { key: "s3", label: "Vendor Relationships",           defaultTitle: "Vendor Relationships",           defaultContent: "Our primary business model is a commission earned on marketplace sales. Vendor approval is based solely on product quality, sustainability standards, and values alignment — not on affiliate compensation. We are committed to recommending only products and vendors we genuinely believe in." },
    { key: "s4", label: "Our Commitment to Transparency", defaultTitle: "Our Commitment to Transparency", defaultContent: "We believe in full transparency. Any content that includes affiliate links will be clearly identified. Our editorial recommendations are never influenced by affiliate arrangements. The integrity of our community and the trust of our shoppers will always take priority over any financial arrangement." },
    { key: "s5", label: "Questions About This Disclosure",defaultTitle: "Questions About This Disclosure",defaultContent: "If you have questions about our affiliate relationships or any specific partnership, please contact us at affiliates@latterdayshopping.com. We are committed to answering all inquiries honestly and promptly." },
];

export default function ContentAffiliateDisclosurePage() {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold">Affiliate Disclosure</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit every section of the Affiliate Disclosure page</p>
            </div>
            <LegalPageEditor page="affiliate-disclosure" sections={SECTIONS} />
        </div>
    );
}
