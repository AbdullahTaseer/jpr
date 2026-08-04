import LegalPageEditor, { LegalSection } from "@/components/admin/LegalPageEditor";

const SECTIONS: LegalSection[] = [
    { key: "s1", label: "Acceptance of Terms",    defaultTitle: "1. Acceptance of Terms",    defaultContent: "By accessing or using Latter Day Shopping, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and your continued use of the platform after such changes constitutes your acceptance of the new terms." },
    { key: "s2", label: "Eligibility",            defaultTitle: "2. Eligibility",            defaultContent: "You must be at least 18 years of age to use our platform as a vendor or to make purchases. By using Latter Day Shopping, you represent and warrant that you meet this age requirement. Latter Day Shopping is available to users worldwide, though some features may be restricted based on your location." },
    { key: "s3", label: "User Accounts",          defaultTitle: "3. User Accounts",          defaultContent: "To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms." },
    { key: "s4", label: "Vendor Terms",           defaultTitle: "4. Vendor Terms",           defaultContent: "Vendors must apply and be approved before listing products. Approved vendors agree to accurately represent their products, fulfill orders in a timely manner, and maintain a minimum satisfaction rating. Latter Day Shopping charges a commission on each successful sale. Vendors may not list counterfeit, illegal, or harmful products." },
    { key: "s5", label: "Purchases & Payments",   defaultTitle: "5. Purchases & Payments",   defaultContent: "All transactions are processed securely through our payment providers. Prices are listed in USD and may be subject to applicable taxes. Once an order is placed, it is subject to the vendor's return and cancellation policy, which is displayed on each product page before purchase." },
    { key: "s6", label: "Prohibited Activities",  defaultTitle: "6. Prohibited Activities",  defaultContent: "Users may not engage in fraudulent activity, harassment, spam, or any activity that disrupts the platform. Scraping, reverse engineering, or attempting to circumvent security measures is strictly prohibited. Violation of these rules may result in immediate account termination and legal action where applicable." },
    { key: "s7", label: "Intellectual Property",  defaultTitle: "7. Intellectual Property",  defaultContent: "All content on Latter Day Shopping, including logos, text, images, and software, is the property of Latter Day Shopping or its licensors. Vendors retain ownership of their product listings but grant us a license to display this content. You may not reproduce or distribute our content without express written permission." },
    { key: "s8", label: "Limitation of Liability",defaultTitle: "8. Limitation of Liability",defaultContent: "Latter Day Shopping is a marketplace platform and is not responsible for the quality, accuracy, or legality of vendor products. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform." },
    { key: "s9", label: "Contact",                defaultTitle: "9. Contact",                defaultContent: "If you have questions about these Terms of Service, please contact us at support@latterdayshopping.com or write to us at: Latter Day Shopping, Salt Lake City, Utah, United States." },
];

export default function ContentTermsPage() {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold">Terms &amp; Conditions</h1>
                <p className="text-[#6b7280] text-sm mt-1">Edit every section of the Terms of Service page</p>
            </div>
            <LegalPageEditor page="terms" sections={SECTIONS} />
        </div>
    );
}
