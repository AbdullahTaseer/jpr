import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

const FAQS = [
  {
    question: "What is Latter Day Shopping?",
    answer: "A free community marketplace connecting buyers and vendors who share a vision for intentional, sustainable living. Home to two businesses the founders know and stand behind.",
  },
  {
    question: "Who founded Latter Day Shopping, and when?",
    answer: "Founded by John-Paul Register. The business was established in 2008, with its digital presence (this website) launching in 2025.",
  },
  {
    question: "What kind of products can I find here?",
    answer: "Self-sustainable, purpose-driven products from a curated, values-aligned vendor community. Currently 100+ products across 2 businesses.",
  },
  {
    question: "How do I contact support?",
    answer: "Email support@latterdayshopping.com or use the Contact page. Support hours are Mon–Fri, 9am–6pm CST.",
  },
  // For Shoppers
  {
    question: "How do I browse products?",
    answer: "Use the Shop, New Arrivals, Categories, or Brands pages from the main menu.",
  },
  // For Vendors
  {
    question: "How do I become a vendor?",
    answer: "Apply for free via the \"Become a Vendor\" page. Approval typically takes 2–3 business days.",
  },
  {
    question: "Are there fees or commissions?",
    answer: "Free to join, with no listing fees. Commission is 1% in the vendor's first year, rising to 2% in the second year.",
  },
  {
    question: "What are the requirements to sell on the platform?",
    answer: "Products must be legal, safe, and accurately listed. Counterfeit goods, illegal substances, and hate-based content are prohibited. Vendors must agree to the Vendor Terms of Service.",
  },
  {
    question: "What are my responsibilities as a vendor?",
    answer: "You're responsible for listing accuracy, order fulfillment, returns/refunds, inventory updates, and compliance with applicable laws, including sales tax.",
  },
  {
    question: "Does Latter Day Shopping help promote my store?",
    answer: "Yes. Vendors get their own storefront page plus exposure through the platform's affiliate network.",
  },
  {
    question: "Can Latter Day Shopping remove my listing or account?",
    answer: "Yes. They reserve the right to remove vendors or listings that violate community standards, without prior notice.",
  },
  {
    question: "Is Latter Day Shopping liable for disputes between buyers and vendors?",
    answer: "No. Per the vendor terms, Latter Day Shopping and JPR Ventures LLC are not liable for buyer-vendor disputes, product defects, or shipping losses. Vendors agree to indemnify the platform.",
  },
];

async function main() {
  for (const [order, faq] of FAQS.entries()) {
    const existing = await prisma.faqItem.findFirst({ where: { question: faq.question } });
    if (existing) {
      await prisma.faqItem.update({ where: { id: existing.id }, data: { answer: faq.answer, order } });
    } else {
      await prisma.faqItem.create({ data: { ...faq, order } });
    }
  }
  console.log(`Seeded ${FAQS.length} FAQs`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
