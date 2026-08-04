import LegalPageEditor, { LegalSection } from "@/components/admin/LegalPageEditor";

const SECTIONS: LegalSection[] = [
    { key: "s1", label: "Information We Collect",      defaultTitle: "1. Information We Collect",      defaultContent: "We collect information you provide directly (name, email, payment info), information collected automatically (browsing behavior, device data, IP address), and information from third parties (payment processors, social login). We use cookies and similar technologies to enhance your experience and analyze site traffic." },
    { key: "s2", label: "How We Use Your Information", defaultTitle: "2. How We Use Your Information", defaultContent: "We use collected information to process orders and payments, personalize your shopping experience, communicate with you about orders and promotions, improve our platform, comply with legal obligations, and prevent fraud. We do not sell your personal data to third parties." },
    { key: "s3", label: "Information Sharing",         defaultTitle: "3. Information Sharing",         defaultContent: "We share your information only with vendors (for order fulfillment), payment processors (for secure transactions), service providers (hosting, analytics, email), and law enforcement when required by law. All third parties are bound by data protection agreements." },
    { key: "s4", label: "Data Security",               defaultTitle: "4. Data Security",               defaultContent: "We implement industry-standard security measures including SSL encryption, secure data centers, and regular security audits. While we take reasonable precautions, no data transmission over the internet is 100% secure. We encourage you to use strong, unique passwords and to contact us immediately if you suspect unauthorized access." },
    { key: "s5", label: "Cookies",                     defaultTitle: "5. Cookies",                     defaultContent: "We use essential cookies (required for platform function), analytical cookies (to understand usage), and marketing cookies (for relevant advertising). You can control cookie preferences in your browser settings. Disabling certain cookies may affect platform functionality." },
    { key: "s6", label: "Your Rights",                 defaultTitle: "6. Your Rights",                 defaultContent: "Depending on your location, you may have the right to access, correct, or delete your personal data; restrict or object to processing; data portability; and to withdraw consent. To exercise these rights, contact us at privacy@latterdayshopping.com. We will respond within 30 days." },
    { key: "s7", label: "Data Retention",              defaultTitle: "7. Data Retention",              defaultContent: "We retain your data for as long as your account is active or as needed to provide services. You may delete your account at any time through your account settings. Transaction records may be retained for up to 7 years for legal and tax compliance purposes." },
    { key: "s8", label: "Children's Privacy",          defaultTitle: "8. Children's Privacy",          defaultContent: "Our platform is not intended for users under 18. We do not knowingly collect personal information from children. If we discover that a child under 18 has provided us with personal information, we will delete it immediately." },
    { key: "s9", label: "Contact Us",                  defaultTitle: "9. Contact Us",                  defaultContent: "For privacy-related inquiries, contact our Data Protection Officer at privacy@latterdayshopping.com or write to: Privacy Team, Latter Day Shopping, Salt Lake City, Utah, United States." },
];

export default function ContentPrivacyPage() {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold">Privacy Policy</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit every section of the Privacy Policy page</p>
            </div>
            <LegalPageEditor page="privacy" sections={SECTIONS} />
        </div>
    );
}
