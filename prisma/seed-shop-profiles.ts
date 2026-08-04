import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

// ─── Image helpers ─────────────────────────────────────────────────────────────
const unsplash = (id: string, w = 1200, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;

const avatar = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=300&h=300&q=85&auto=format&fit=crop&face`;

// ─── Portrait IDs ──────────────────────────────────────────────────────────────
const P = {
  f1: "1494790108377-be9c29b29330",
  m1: "1507003211169-0a1dd7228f2d",
  f2: "1438761681033-6461ffad8d80",
  m2: "1472099645785-5658abf4ff4e",
  f3: "1544005313-94ddf0286df2",
  m3: "1500648767791-00dcc994a43e",
  f4: "1531746020798-e6953c6e8e04",
  m4: "1552058544-f2b08422138a",
  f5: "1580489944761-15a19d654956",
  m5: "1527980965255-d3b416303d12",
  f6: "1573496359142-b8d87734a5a2",
  m6: "1560250097-0b93528c311a",
  f7: "1569913486515-b74bf7751574",
  m7: "1519085360753-af0119f7cbe7",
};

// ─── Vendor Profile Data ───────────────────────────────────────────────────────
const PROFILES = [
  // ── 1. Ava Harrison — Harrison Home ──────────────────────────────────────────
  {
    email: "ava.harrison@vendor.com",
    profile: {
      aboutTitle: "Curated Comforts for the Modern Home",
      aboutDescription:
        "Harrison Home was founded in 2018 by Ava Harrison with a simple belief: your home should feel like a sanctuary. After years of sourcing handcrafted goods from artisans across the US, Ava launched this shop to make premium, purposeful home décor accessible to everyone.\n\nEvery piece in our collection is chosen for its craftsmanship, sustainability, and the story behind it. We work directly with small-batch makers so you get heirloom-quality items without the department-store markup.",
      aboutCategory: "Home & Living",
      aboutSince: new Date("2018-03-15"),
      profileImage: avatar(P.f1),
      bannerImage: unsplash("1556909114-f6e7ad7d3136", 1600, 700),
      shopPolicies: `<h2>Shipping Policy</h2>
<p>All orders are processed within <strong>1–2 business days</strong>. We ship via USPS Priority Mail and UPS Ground. Estimated delivery times:</p>
<ul>
  <li>Standard (5–7 business days) — Free on orders over $75</li>
  <li>Expedited (2–3 business days) — $12.99</li>
  <li>Overnight (next business day) — $24.99</li>
</ul>
<p>You will receive a tracking number via email once your order ships.</p>

<h2>Return &amp; Exchange Policy</h2>
<p>We accept returns within <strong>30 days</strong> of delivery for unused items in original packaging. To initiate a return, email us at <strong>returns@harrisonhome.com</strong> with your order number.</p>
<ul>
  <li>Items must be unwashed, unused, and in original condition</li>
  <li>Furniture and large items may be subject to a restocking fee of up to 15%</li>
  <li>Sale items are final sale and not eligible for return</li>
</ul>

<h2>Refund Policy</h2>
<p>Once your return is received and inspected, we will process your refund within <strong>5–7 business days</strong> to your original payment method. Shipping costs are non-refundable.</p>

<h2>Damaged or Defective Items</h2>
<p>If your item arrives damaged, please photograph it and contact us within <strong>48 hours</strong> of delivery. We will send a replacement at no additional cost or issue a full refund — your choice.</p>

<h2>Privacy &amp; Data Policy</h2>
<p>We value your privacy. Your personal information is used solely to process and ship your orders. We never sell or share your data with third parties. All payment information is handled securely through our payment processor.</p>`,
    },
    members: [
      { name: "Ava Harrison",    designation: "Founder & Creative Director", imageUrl: avatar(P.f1), order: 0 },
      { name: "Daniel Reyes",    designation: "Head of Operations",          imageUrl: avatar(P.m1), order: 1 },
      { name: "Sophie Lawson",   designation: "Customer Experience Lead",    imageUrl: avatar(P.f2), order: 2 },
    ],
  },

  // ── 2. Liam Nguyen — Nguyen Threads ──────────────────────────────────────────
  {
    email: "liam.nguyen@vendor.com",
    profile: {
      aboutTitle: "Fashion with Purpose, Style with Soul",
      aboutDescription:
        "Nguyen Threads started in a tiny San Francisco studio in 2019 when Liam Nguyen couldn't find sustainable clothing that actually looked good. What began as a personal frustration became a mission: prove that ethical fashion doesn't have to be boring.\n\nWe partner exclusively with GOTS-certified factories and source fabrics with traceable supply chains. Every piece is designed to last seasons — not just a single trend cycle. When you buy from us, you're voting for a fashion industry that treats workers and the planet with respect.",
      aboutCategory: "Fashion & Apparel",
      aboutSince: new Date("2019-07-01"),
      profileImage: avatar(P.m2),
      bannerImage: unsplash("1558618666-fcd25c85cd64", 1600, 700),
      shopPolicies: `<h2>Sizing &amp; Fit</h2>
<p>All our garments are true-to-size. Please refer to our detailed size guide on each product page. If you're between sizes, we recommend sizing up for a relaxed fit. We offer sizes XS through 3XL across most styles.</p>

<h2>Shipping Policy</h2>
<p>Orders ship within <strong>2 business days</strong>. We use carbon-neutral shipping partners:</p>
<ul>
  <li>Free standard shipping on orders over $60</li>
  <li>Standard (4–6 business days) — $7.99</li>
  <li>Express (1–2 business days) — $18.99</li>
</ul>
<p>International orders ship to Canada, UK, and Australia. Duties and taxes are the buyer's responsibility.</p>

<h2>Return Policy</h2>
<p>We accept returns and exchanges within <strong>45 days</strong> of purchase. Items must be unworn, unwashed, and have original tags attached.</p>
<ul>
  <li>Free returns on all domestic orders — prepaid label included</li>
  <li>Exchanges ship free of charge</li>
  <li>Final sale items (marked clearly on the listing) are non-returnable</li>
</ul>

<h2>Sustainability Promise</h2>
<p>We offset 100% of our shipping emissions. Packaging is 100% recycled and recyclable. If you're unhappy with any aspect of your order's environmental footprint, contact us — we'll make it right.</p>

<h2>Privacy Policy</h2>
<p>We collect only what we need to fulfill your order. We use industry-standard SSL encryption and never sell customer data. You may request deletion of your data at any time by contacting us.</p>`,
    },
    members: [
      { name: "Liam Nguyen",      designation: "Founder & Head Designer",    imageUrl: avatar(P.m2), order: 0 },
      { name: "Priya Mehta",      designation: "Sustainability Director",     imageUrl: avatar(P.f3), order: 1 },
      { name: "Carlos Rivera",    designation: "Logistics & Fulfillment",     imageUrl: avatar(P.m3), order: 2 },
    ],
  },

  // ── 3. Sofia Patel — Patel Wellness ──────────────────────────────────────────
  {
    email: "sofia.patel@vendor.com",
    profile: {
      aboutTitle: "Empowering Your Journey to Optimal Health",
      aboutDescription:
        "Patel Wellness was born out of Sofia Patel's personal health journey. After struggling with chronic fatigue and finding little help from conventional approaches, Sofia immersed herself in integrative nutrition and functional wellness — and it changed everything.\n\nFounded in 2017, our shop curates only science-backed supplements, fitness tools, and wellness accessories that meet our rigorous quality standards. Every product we carry has been personally vetted by our in-house wellness team. We believe optimal health isn't a luxury — it's a right.",
      aboutCategory: "Health & Wellness",
      aboutSince: new Date("2017-09-10"),
      profileImage: avatar(P.f3),
      bannerImage: unsplash("1571019613454-1cb2f99b2d8b", 1600, 700),
      shopPolicies: `<h2>Product Quality Standards</h2>
<p>Every product in our store is third-party tested for purity and potency. We only carry supplements manufactured in <strong>FDA-registered, GMP-certified</strong> facilities. Certificates of analysis are available upon request.</p>

<h2>Shipping Policy</h2>
<p>Health-sensitive products are packaged to protect their integrity during transit:</p>
<ul>
  <li>Standard shipping (5–7 days) — Free on orders over $50</li>
  <li>Priority shipping (2–3 days) — $9.99</li>
  <li>Temperature-sensitive items ship with ice packs Monday–Wednesday only</li>
</ul>

<h2>Return &amp; Refund Policy</h2>
<p>Due to the nature of health products, we cannot accept returns on opened supplements. However, we offer a <strong>100% satisfaction guarantee</strong>:</p>
<ul>
  <li>If you're not satisfied with any supplement, contact us within 30 days for a full store credit</li>
  <li>Unopened items may be returned within 21 days for a full refund</li>
  <li>Fitness equipment may be returned within 30 days if unused and in original packaging</li>
</ul>

<h2>Health Disclaimer</h2>
<p>Our products are not intended to diagnose, treat, cure, or prevent any disease. Always consult your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, or taking medication.</p>

<h2>Privacy Policy</h2>
<p>We take your health data seriously. We never share purchase history or personal information with third parties. All data is encrypted at rest and in transit.</p>`,
    },
    members: [
      { name: "Sofia Patel",      designation: "Founder & Wellness Director",  imageUrl: avatar(P.f3), order: 0 },
      { name: "Dr. James Okafor", designation: "Clinical Nutrition Advisor",   imageUrl: avatar(P.m4), order: 1 },
      { name: "Mei Lin",          designation: "Community & Education Manager",imageUrl: avatar(P.f4), order: 2 },
    ],
  },

  // ── 4. Ethan Brooks — Brooks Tech ────────────────────────────────────────────
  {
    email: "ethan.brooks@vendor.com",
    profile: {
      aboutTitle: "Smarter Tools for the Way You Work & Live",
      aboutDescription:
        "Brooks Tech was founded in 2020 by Ethan Brooks, a former Silicon Valley product manager who grew tired of overhyped gadgets that underdelivered. His vision was straightforward: offer only the tech products that actually solve real problems, at prices that don't require a second mortgage.\n\nWe rigorously test every device before listing it — our team puts each product through at minimum 72 hours of real-world use before it earns a place in our catalog. No sponsored content, no fake reviews, just honest recommendations backed by hands-on experience.",
      aboutCategory: "Electronics",
      aboutSince: new Date("2020-01-20"),
      profileImage: avatar(P.m5),
      bannerImage: unsplash("1550745165-9bc0b252726f", 1600, 700),
      shopPolicies: `<h2>Warranty Information</h2>
<p>All products sold by Brooks Tech are covered by the manufacturer's warranty. Additionally, we offer a <strong>Brooks Tech Assurance</strong> program:</p>
<ul>
  <li>30-day hassle-free returns on all electronics</li>
  <li>Extended 90-day store warranty on select products (marked on listing)</li>
  <li>Free technical support for 6 months post-purchase</li>
</ul>

<h2>Shipping Policy</h2>
<p>Electronics require careful handling. All orders are packed in anti-static, double-box packaging:</p>
<ul>
  <li>Standard shipping (3–5 days) — Free on orders over $50</li>
  <li>Priority shipping (2 days) — $12.99</li>
  <li>Signature required on orders over $150</li>
</ul>

<h2>Return Policy</h2>
<p>Returns are accepted within <strong>30 days</strong> of delivery. Products must be in original packaging with all accessories included.</p>
<ul>
  <li>Open-box items are subject to a 10% restocking fee</li>
  <li>Software downloads and digital products are non-refundable once accessed</li>
  <li>Items showing physical damage not caused by manufacture defect are non-returnable</li>
</ul>

<h2>Compatibility Note</h2>
<p>Please verify device compatibility before purchasing. Our product listings include detailed compatibility specs. If unsure, reach out to our tech support team before ordering — we're happy to help.</p>

<h2>Privacy &amp; Security Policy</h2>
<p>We do not store credit card information. All transactions are processed through PCI-DSS compliant payment gateways. Your purchase history is private and never shared with advertisers.</p>`,
    },
    members: [
      { name: "Ethan Brooks",    designation: "Founder & CEO",                imageUrl: avatar(P.m5), order: 0 },
      { name: "Aisha Okonkwo",  designation: "Lead Product Tester",           imageUrl: avatar(P.f5), order: 1 },
      { name: "Ryan Kowalski",  designation: "Customer Technical Support",    imageUrl: avatar(P.m6), order: 2 },
    ],
  },

  // ── 5. Mia Castillo — Castillo Reads ─────────────────────────────────────────
  {
    email: "mia.castillo@vendor.com",
    profile: {
      aboutTitle: "Where Every Page Opens a New World",
      aboutDescription:
        "Castillo Reads was born from a lifelong love of bookshops. Mia Castillo grew up in her grandmother's small-town bookstore in New Mexico and wanted to recreate that feeling of discovery for a new generation of readers — online, but with the same warmth.\n\nFounded in 2016, we curate books and learning resources across every genre and age group. We also carry a thoughtfully chosen selection of journals, games, and creative learning tools. Every purchase supports our literacy initiative: for each order placed, we donate a book to a Title I school library.",
      aboutCategory: "Books & Education",
      aboutSince: new Date("2016-08-22"),
      profileImage: avatar(P.f4),
      bannerImage: unsplash("1481627834876-b7833e8f5570", 1600, 700),
      shopPolicies: `<h2>Shipping Policy</h2>
<p>Books and educational materials are shipped in eco-friendly, padded mailers to prevent damage in transit:</p>
<ul>
  <li>Media Mail (7–14 days) — $3.99 on books only</li>
  <li>Standard (5–7 days) — Free on orders over $35</li>
  <li>Priority (2–3 days) — $8.99</li>
</ul>
<p>Gift wrapping is available at checkout for $3.00 per item.</p>

<h2>Return &amp; Exchange Policy</h2>
<p>We accept returns within <strong>30 days</strong> of delivery:</p>
<ul>
  <li>Books must be in unread condition with no writing, highlighting, or damage</li>
  <li>Games and puzzles must have all pieces and be in original sealed packaging</li>
  <li>Pre-orders are cancellable up to 48 hours before the ship date</li>
</ul>

<h2>Backorder Policy</h2>
<p>Some titles may show as backordered. Backordered items ship within 10–21 days. You will receive an email update if the estimated wait exceeds 21 days, and you may cancel at no charge.</p>

<h2>Literacy Initiative</h2>
<p>For every order placed on Castillo Reads, we donate one book to a Title I school library through our partnership with <strong>Books for All</strong>. Your purchases directly fund reading access for under-resourced students.</p>

<h2>Privacy Policy</h2>
<p>Your reading preferences and purchase history are yours alone. We do not sell or share this data. You may opt out of our book recommendation emails at any time.</p>`,
    },
    members: [
      { name: "Mia Castillo",    designation: "Founder & Chief Book Curator",  imageUrl: avatar(P.f4), order: 0 },
      { name: "Tobias Green",    designation: "Children's Literature Editor",  imageUrl: avatar(P.m7), order: 1 },
      { name: "Hannah Yamamoto", designation: "Literacy Programs Manager",     imageUrl: avatar(P.f6), order: 2 },
    ],
  },

  // ── 6. Noah Williams — Williams Toys ─────────────────────────────────────────
  {
    email: "noah.williams@vendor.com",
    profile: {
      aboutTitle: "Inspiring Little Minds, One Toy at a Time",
      aboutDescription:
        "Williams Toys was founded in 2019 by Noah Williams, a former early childhood educator who was concerned about the quality and safety of mass-produced toys flooding the market. Noah wanted to offer an alternative: toys that are genuinely educational, rigorously safe, and built to withstand the enthusiasm of actual children.\n\nEvery product in our catalog meets or exceeds ASTM F963 and EN 71 safety standards. We prioritize open-ended play that sparks creativity and cognitive development. No batteries required — just imagination.",
      aboutCategory: "Toys & Kids",
      aboutSince: new Date("2019-04-05"),
      profileImage: avatar(P.m6),
      bannerImage: unsplash("1558618047-3f53dd97e7a4", 1600, 700),
      shopPolicies: `<h2>Safety Standards</h2>
<p>Every product sold by Williams Toys has been tested and certified to meet or exceed:</p>
<ul>
  <li><strong>ASTM F963</strong> — US Consumer Product Safety Standard for toys</li>
  <li><strong>EN 71</strong> — European toy safety standard</li>
  <li><strong>CPSIA</strong> — Children's Product Safety Improvement Act requirements</li>
</ul>
<p>All paints and finishes are non-toxic and lead-free. Age recommendations on listings are based on safety, not ability — please follow them.</p>

<h2>Shipping Policy</h2>
<p>Toys ship in double-walled boxes to prevent damage. Gift-ready presentation is available:</p>
<ul>
  <li>Standard shipping (5–7 days) — Free on orders over $40</li>
  <li>Express shipping (2–3 days) — $10.99</li>
  <li>Gift wrapping + handwritten note — $4.99</li>
</ul>

<h2>Return Policy</h2>
<p>We accept returns within <strong>45 days</strong> of purchase:</p>
<ul>
  <li>Toys must be unplayed-with and in original packaging</li>
  <li>Art supplies that have been opened cannot be returned for hygiene reasons</li>
  <li>If a toy breaks under normal use within 90 days, we'll replace it free of charge</li>
</ul>

<h2>Choking Hazard Notice</h2>
<p>Some products contain small parts and are not suitable for children under 3 years of age. Age warnings on all listings must be observed. When in doubt, please contact us before purchasing.</p>

<h2>Privacy Policy</h2>
<p>We never collect data from minors. Parent and guardian contact information is used solely for order fulfillment and is never shared with third parties.</p>`,
    },
    members: [
      { name: "Noah Williams",   designation: "Founder & Child Development Expert", imageUrl: avatar(P.m6), order: 0 },
      { name: "Claire Dupont",   designation: "Head of Product Safety",              imageUrl: avatar(P.f7), order: 1 },
      { name: "Marcus Bell",     designation: "Warehouse & Fulfillment Lead",        imageUrl: avatar(P.m1), order: 2 },
    ],
  },

  // ── 7. Isabella Scott — Scott Sports ─────────────────────────────────────────
  {
    email: "isabella.scott@vendor.com",
    profile: {
      aboutTitle: "Gear Up for Every Adventure",
      aboutDescription:
        "Scott Sports was founded in 2018 by former triathlete and outdoor guide Isabella Scott. After years of testing gear in the field — from mountain trails to open-water swims — Isabella knew which products actually performed and which were just marketing.\n\nWe carry only the gear our team has personally used on real adventures. No fluff, no filler. Whether you're training for your first 5K or tackling a multi-day backpacking trip, we have the right gear at the right price to help you go further.",
      aboutCategory: "Sports & Outdoors",
      aboutSince: new Date("2018-05-12"),
      profileImage: avatar(P.f5),
      bannerImage: unsplash("1534438327431-0240d05bc57", 1600, 700),
      shopPolicies: `<h2>Gear Testing Policy</h2>
<p>Every product listed on Scott Sports has been personally field-tested by a member of our team. We publish honest performance notes on each listing — including any limitations we discovered during testing.</p>

<h2>Shipping Policy</h2>
<p>Large gear items ship via FedEx Ground. Apparel and accessories ship via USPS Priority:</p>
<ul>
  <li>Standard (5–7 days) — Free on orders over $65</li>
  <li>Express (2–3 days) — $14.99</li>
  <li>Oversized items (bikes, kayaks, large tents) may incur additional freight charges — shown at checkout</li>
</ul>

<h2>Return Policy</h2>
<p>We stand behind our gear with a <strong>60-day return window</strong>:</p>
<ul>
  <li>Gear may be returned even after use — we call it the "Try It Outside" guarantee</li>
  <li>Items must be clean and dry for return processing</li>
  <li>Consumables (energy gels, sunscreen, chalk) are non-returnable once opened</li>
  <li>Personalized/custom orders are final sale</li>
</ul>

<h2>Warranty Claims</h2>
<p>Manufacturing defects are covered under each brand's warranty. We'll advocate on your behalf with the manufacturer and facilitate warranty replacements at no cost to you.</p>

<h2>Privacy Policy</h2>
<p>Your purchase and activity data stays with us. We use it only to improve our product recommendations. We never share your information with third parties or advertisers.</p>`,
    },
    members: [
      { name: "Isabella Scott",  designation: "Founder & Head Gear Tester",   imageUrl: avatar(P.f5), order: 0 },
      { name: "Dante Morales",   designation: "Outdoor Gear Specialist",       imageUrl: avatar(P.m7), order: 1 },
      { name: "Yuki Tanaka",     designation: "Customer Experience & Returns", imageUrl: avatar(P.f1), order: 2 },
    ],
  },

  // ── 8. James Turner — Turner Beauty ──────────────────────────────────────────
  {
    email: "james.turner@vendor.com",
    profile: {
      aboutTitle: "Clean Beauty That Delivers Real Results",
      aboutDescription:
        "Turner Beauty was founded in 2020 by formulation chemist James Turner after he spent a decade developing products for luxury skincare brands and grew disillusioned with the industry's opacity. He wanted to offer genuinely clean formulas — with ingredients lists short enough to actually read — at prices that didn't exclude anyone.\n\nEvery product we sell is free of parabens, sulfates, phthalates, synthetic fragrances, and PFAS. We publish the complete formulation rationale for each product, because you deserve to know what you're putting on your skin and why it's there.",
      aboutCategory: "Beauty & Skincare",
      aboutSince: new Date("2020-02-14"),
      profileImage: avatar(P.m7),
      bannerImage: unsplash("1556228578-8c89e6adf883", 1600, 700),
      shopPolicies: `<h2>Ingredient Transparency</h2>
<p>We publish the full INCI ingredient list for every product, along with the purpose and concentration range of each active ingredient. If you have a specific allergy or sensitivity, please contact us before ordering — our team will review formulations with you personally.</p>

<h2>Patch Test Recommendation</h2>
<p>We recommend performing a patch test before using any new skincare product. Apply a small amount to the inside of your wrist and wait 24 hours. If irritation occurs, discontinue use and contact us.</p>

<h2>Shipping Policy</h2>
<p>All skincare products are packed to prevent breakage and temperature damage:</p>
<ul>
  <li>Standard (5–7 days) — Free on orders over $45</li>
  <li>Priority (2–3 days) — $8.99</li>
  <li>We do not ship aerosols internationally due to shipping regulations</li>
</ul>

<h2>Return Policy</h2>
<p>Due to hygiene reasons, we cannot accept returns on opened skincare products. Our guarantee instead:</p>
<ul>
  <li>If your skin doesn't respond positively within <strong>30 days</strong>, contact us for a full store credit</li>
  <li>Unopened products may be returned within 21 days for a full refund</li>
  <li>Damaged or defective products are replaced immediately at no cost</li>
</ul>

<h2>Cruelty-Free &amp; Vegan</h2>
<p>All Turner Beauty products are 100% cruelty-free. The majority of our line is also vegan — those that are not (due to ingredients like beeswax or lanolin) are clearly marked on the listing.</p>

<h2>Privacy Policy</h2>
<p>Your skin concerns and purchase history are sensitive. We treat them as such. We do not sell, rent, or share this data under any circumstances.</p>`,
    },
    members: [
      { name: "James Turner",    designation: "Founder & Formulation Chemist", imageUrl: avatar(P.m7), order: 0 },
      { name: "Layla Hassan",    designation: "Esthetician & Product Lead",    imageUrl: avatar(P.f6), order: 1 },
      { name: "Ben Nakamura",    designation: "Operations & Compliance",       imageUrl: avatar(P.m3), order: 2 },
    ],
  },

  // ── 9. Chloe Adams — Adams Gourmet ───────────────────────────────────────────
  {
    email: "chloe.adams@vendor.com",
    profile: {
      aboutTitle: "Artisan Flavors, Delivered Straight to Your Door",
      aboutDescription:
        "Adams Gourmet was founded in 2017 by classically trained chef Chloe Adams after she spent a decade cooking in Michelin-starred kitchens across Europe and the US. She returned home with a mission: bring the flavors, ingredients, and culinary tools of world-class kitchens to home cooks everywhere.\n\nEvery product in our store is sourced directly from the producers we've personally visited — small family farms, single-estate groves, and artisan food makers who share our obsession with quality. No commodity ingredients, no factory farms. Just remarkable food from remarkable people.",
      aboutCategory: "Food & Gourmet",
      aboutSince: new Date("2017-11-01"),
      profileImage: avatar(P.f6),
      bannerImage: unsplash("1414235077428-338989a2e8c0", 1600, 700),
      shopPolicies: `<h2>Freshness &amp; Quality Guarantee</h2>
<p>All perishable products are shipped with a freshness date of at least <strong>60 days</strong> from the time you receive your order. If any product arrives expired or damaged, we'll replace it immediately or issue a full refund.</p>

<h2>Shipping Policy</h2>
<p>Food products are packed in insulated boxes with ice packs as needed:</p>
<ul>
  <li>Standard ground (5–7 days) — Free on orders over $55</li>
  <li>2-day shipping recommended for fresh/refrigerated items — $14.99</li>
  <li>We do not ship perishables to Hawaii, Alaska, or international addresses due to transit times</li>
  <li>All shipments include food-safe packaging that is 100% recyclable</li>
</ul>

<h2>Allergen Notice</h2>
<p>Our products are sourced from facilities that may handle tree nuts, peanuts, gluten, dairy, soy, and other common allergens. Allergen information is listed on each product page. If you have a severe allergy, please contact us before ordering so we can advise on the safest options for you.</p>

<h2>Return Policy</h2>
<p>Due to food safety regulations, we cannot accept returns on food products. However:</p>
<ul>
  <li>If any product arrives damaged, spoiled, or incorrect — we'll make it right immediately</li>
  <li>Non-food items (kitchen tools, cookware) may be returned within 30 days if unused</li>
  <li>Gift sets may be exchanged if unopened and within 14 days of delivery</li>
</ul>

<h2>Sourcing Standards</h2>
<p>We visit every producer before listing their products. We prioritize family-owned operations, organic and regenerative farming practices, and fair-trade certifications wherever available.</p>

<h2>Privacy Policy</h2>
<p>We use your information only to process and ship your order. We do not sell customer data. You may unsubscribe from our recipe newsletter at any time.</p>`,
    },
    members: [
      { name: "Chloe Adams",     designation: "Founder & Executive Chef",       imageUrl: avatar(P.f6), order: 0 },
      { name: "Marco Ferretti",  designation: "Sourcing & Producer Relations",  imageUrl: avatar(P.m4), order: 1 },
      { name: "Nadia Torres",    designation: "Culinary Content & Education",   imageUrl: avatar(P.f7), order: 2 },
    ],
  },

  // ── 10. Lucas Martin — Martin Crafts ─────────────────────────────────────────
  {
    email: "lucas.martin@vendor.com",
    profile: {
      aboutTitle: "Professional-Grade Supplies for Every Creative",
      aboutDescription:
        "Martin Crafts was founded in 2021 by muralist and illustrator Lucas Martin after years of frustration sourcing quality art supplies at fair prices. Too often, the best materials were locked behind specialty distributors or priced for gallery artists only.\n\nWe believe great tools shouldn't be gatekept. Whether you're a working professional or a Sunday hobbyist, you deserve access to the same quality materials. We curate our catalog with the help of a rotating panel of working artists across painting, drawing, printmaking, fiber arts, and beyond.",
      aboutCategory: "Art & Crafts",
      aboutSince: new Date("2021-03-01"),
      profileImage: avatar(P.m3),
      bannerImage: unsplash("1452195100486-9cc805987862", 1600, 700),
      shopPolicies: `<h2>Product Selection &amp; Quality</h2>
<p>Every product in our catalog is reviewed and approved by our artist advisory panel before listing. We include honest notes on each listing about skill level, intended use, and any limitations we discovered during testing.</p>

<h2>Shipping Policy</h2>
<p>Art supplies require careful packing to prevent damage, especially liquid media and fragile items:</p>
<ul>
  <li>Standard (5–7 days) — Free on orders over $50</li>
  <li>Priority (2–3 days) — $9.99</li>
  <li>Hazardous materials (solvents, aerosol sprays) ship ground-only per carrier regulations</li>
  <li>Large canvas panels and framed art ship in custom crates — freight charges apply</li>
</ul>

<h2>Return Policy</h2>
<p>We accept returns within <strong>30 days</strong> of delivery:</p>
<ul>
  <li>Unopened supplies in original condition are eligible for full refund</li>
  <li>Opened consumables (paints, inks, clay) may not be returned unless defective</li>
  <li>If a product is defective (dried out, contaminated, incorrect color), we will replace it immediately</li>
  <li>Tools with manufacturing defects are covered for 90 days</li>
</ul>

<h2>Artist Community Program</h2>
<p>We offer a <strong>10% discount</strong> to verified art educators and students. Email us with proof of enrollment or teaching credentials to receive your discount code.</p>

<h2>Hazardous Materials Notice</h2>
<p>Some products (oil mediums, varnishes, certain inks) contain regulated materials. These are clearly labeled on product pages. Please follow all safety instructions, ensure adequate ventilation, and store properly out of reach of children.</p>

<h2>Privacy Policy</h2>
<p>Your purchase history and creative preferences are your own. We use this information only to send you relevant recommendations (opt-out available at any time) and to process your orders.</p>`,
    },
    members: [
      { name: "Lucas Martin",    designation: "Founder & Lead Artist",          imageUrl: avatar(P.m3), order: 0 },
      { name: "Sara Kim",        designation: "Artist Advisory Coordinator",    imageUrl: avatar(P.f2), order: 1 },
      { name: "Finn O'Brien",    designation: "Shipping & Materials Handling",  imageUrl: avatar(P.m5), order: 2 },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n── Seeding shop profiles ──\n");

  for (const entry of PROFILES) {
    const vendor = await prisma.user.findUnique({ where: { email: entry.email } });
    if (!vendor) {
      console.log(`  ⚠ Vendor not found: ${entry.email} — skipping`);
      continue;
    }

    // Update vendor profile fields
    await prisma.user.update({
      where: { id: vendor.id },
      data: entry.profile,
    });

    // Replace shop members
    await prisma.shopMember.deleteMany({ where: { vendorId: vendor.id } });
    for (const m of entry.members) {
      await prisma.shopMember.create({
        data: { vendorId: vendor.id, ...m },
      });
    }

    console.log(`  ✓ ${vendor.shopName ?? vendor.name}`);
    console.log(`      Profile image: set`);
    console.log(`      Banner image:  set`);
    console.log(`      Members: ${entry.members.map(m => m.name).join(", ")}`);
  }

  console.log("\n✓ All shop profiles seeded successfully!\n");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
