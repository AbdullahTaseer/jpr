import LegalPageEditor, { LegalSection } from "@/components/admin/LegalPageEditor";

const SECTIONS: LegalSection[] = [
    { key: "s1", label: "General Disclaimer",       defaultTitle: "General Disclaimer",       defaultContent: "The information provided on Latter Day Shopping is for general informational purposes only. While we strive to keep all information accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, products, or services available on this platform." },
    { key: "s2", label: "Product Information",      defaultTitle: "Product Information",      defaultContent: "Product descriptions, images, pricing, and availability are provided by individual vendors and are subject to change without notice. Latter Day Shopping acts as a marketplace platform and is not responsible for inaccuracies in vendor-provided content. Always review product details before making a purchase." },
    { key: "s3", label: "Vendor Responsibility",    defaultTitle: "Vendor Responsibility",    defaultContent: "While we carefully vet and approve all vendors, Latter Day Shopping is not responsible for the actions, products, or claims of individual sellers. Transactions are between the buyer and vendor directly. We encourage all users to review vendor ratings and product descriptions carefully." },
    { key: "s4", label: "Health & Wellness Claims", defaultTitle: "Health & Wellness Claims", defaultContent: "Any health, wellness, or nutritional claims made by vendors have not been evaluated by the Food and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement or wellness routine." },
    { key: "s5", label: "External Links",           defaultTitle: "External Links",           defaultContent: "Our platform may contain links to third-party websites. These links are provided for convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them." },
];

export default function ContentDisclaimerPage() {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold">Disclaimer</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit every section of the Disclaimer page</p>
            </div>
            <LegalPageEditor page="disclaimer" sections={SECTIONS} />
        </div>
    );
}
