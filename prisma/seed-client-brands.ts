/**
 * Seeds client brands + products, removes dummy catalog data.
 *
 * - Emergency Essentials (BePrepared) — affiliate product links
 * - Secret Garden Bees (NC Veteran Farm) — live products from secretgardenbees.com
 *
 * Set BEPREPARED_AFFILIATE_ID in .env (replaces XXXXXXXX in utm_term + affid).
 * Run: npx tsx prisma/seed-client-brands.ts
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

const AFF_ID = process.env.BEPREPARED_AFFILIATE_ID?.trim() || "XXXXXXXX";

const DUMMY_BRAND_SLUGS = [
  "nestwell", "threadline", "pureform", "voltedge", "pageturn",
  "joyblock", "trailforce", "glowritual", "harvestco", "craftroot",
];

const DUMMY_VENDOR_EMAILS = [
  "ava.harrison@vendor.com", "liam.nguyen@vendor.com", "sofia.patel@vendor.com",
  "ethan.brooks@vendor.com", "mia.castillo@vendor.com", "noah.williams@vendor.com",
  "isabella.scott@vendor.com", "james.turner@vendor.com", "chloe.adams@vendor.com",
  "lucas.martin@vendor.com",
];

/** Product path handles from client affiliate doc (homepage counted separately). */
const BEPREPARED_HANDLES = [
  "ultimate-fruit-veggie-kit-2",
  "freeze-dried-white-chicken-cooked-and-seasoned",
  "1-year-emergency-food-kit-emergency-essentials",
  "vesta-self-powered-indoor-space-heater-stove-by-instafire-with-canned-heat-24-cans",
  "3300w-emp-solar-generator-by-grid-doctor",
  "instant-nonfat-fortified-dry-milk-large-can",
  "emergency-essentials-freeze-dried-strawberry-slices-large-can",
  "freeze-dried-beef-cooked-large-can",
  "whole-egg-powder-large-can",
  "freeze-dried-peach-slices-large-can",
  "freeze-dried-whole-blueberries-large-can",
  "6-month-emergency-food-kit-emergency-essentials",
  "premium-veggie-kit",
  "freeze-dried-mushroom-slices-large-can",
  "alexapure-pro-water-filtration-system",
  "canned-heat-cooking-fuel-24-total-cans-by-instafire",
  "vesta-self-powered-indoor-space-heater-stove-by-instafire-with-canned-heat-cooking-fuel",
  "freeze-dried-tomato-chunks",
  "ember-oven-by-instafire",
  "expansion-battery-2200w-by-grid-doctor",
  "butter-powder-large-can",
  "30-day-premium-emergency-meal-kit",
  "large-faraday-bag-by-grid-doctor-110-liter",
  "emergency-essentials®-pork-sausage-crumbles-large-10-can",
  "72-hour-kit-by-beyond-outdoor-meals-9-pouches-18-servings",
  "apple-slices-large-can",
  "freeze-dried-sweet-potato-dices-with-peel-large-can",
  "freeze-dried-broccoli-large-can",
  "emergency-essentials®-3-month-1-person-emergency-food-kit",
  "freeze-dried-green-beans-large-can",
  "tomato-powder-large-can",
  "emergency-food-supply-30-days",
  "mixed-vegetables-for-stew-large-can",
  "2-week-true-survival-food-kit",
  "carrot-dices-large-can",
  "emergency-essentials-scrambled-egg-mix-large-can",
  "alexapure-pro-certified-replacement-filter",
  "family-favorites-preparedness-bundle",
  "emergency-essentials®-honey-wheat-bread-large-can",
  "freeze-dried-potato-dices-large-can",
  "white-flour-large-can",
  "dehydrated-banana-slices-large-can",
  "lentils-large-can",
  "emergency-water-pouch-case-pack-64-pouches-by-ready-hour",
  "yellow-cornmeal-large-can",
  "z_legacy_freeze-dried-super-sweet-corn-large-can",
  "franklins-finest-coffee-10-can-360-servings",
  "refried-beans-large-can",
  "dehydrated-chopped-onions-large-can",
  "hash-brown-potatoes-large-can",
  "ee-white-cheddar-mac-and-cheese-large-can",
  "honey-granules-large-can",
  "solar-generator-300w-by-grid-doctor",
  "freeze-dried-chopped-spinach-large-can",
  "franklins-finest-survival-coffee-720",
  "solar-panel-200w-by-grid-doctor",
  "freeze-dried-cauliflower-large-can",
  "complete-instant-mashed-potatoes-large-can",
  "100-hour-candle-by-ready-hour-3-pack",
  "freeze-dried-green-peas-large-can",
  "z_legacy_zf_nogluten_gluten-free-kit",
  "white-rice-large-can",
  "super-stews-kit",
  "z_legacy_125_powdered-peanut-butter-65-servings",
  "12-complete-meal-mre-food-supply",
  "vegetable-beef-soup-kit",
  "deluxe-baking-kit",
  "brown-sugar-large-can",
  "egg-noodle-pasta-large-can",
  "white-sugar-large-can",
  "potassium-iodide-anti-radiation-tablets-by-ready-hour-family-pack-6-pack",
  "cooking-essentials-kit",
  "shortening-powder-large-can",
  "ready-hour-buttermilk-pancake-mix",
  "waterproof-faraday-backpack",
  "nine-grain-cracked-cereal-large-can",
  "alexapure-emergency-water-bank",
  "new-ready-hour-travelers-stew-10-can-21-servings",
  "survival-seed-vault",
  "iodized-salt-large-can",
  "z_legacy_46_orange-energy-drink-mix-63",
  "emergency-ration-bars-7-pack-2400-calories-per-package-16-800-calories-total",
  "chicken-soup-kit",
  "canned-heat-extra-hot-cooking-fuel-by-instafire",
  "freeze-dried-green-bell-pepper-dices-large-can",
  "emergency-essentials®-soup-and-stew-starter-kit",
  "emergency-essentials-chili-kit",
  "pinto-beans-large-can",
];

function slug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function affUrl(productPath?: string) {
  const base = productPath
    ? `https://www.beprepared.com/products/${productPath}`
    : "https://www.beprepared.com/";
  const q =
    `?_ef_transaction_id=&utm_source=everflow&utm_medium=aff&utm_campaign=` +
    `&utm_term=${encodeURIComponent(AFF_ID)}&utm_content=&oid=2&affid=${encodeURIComponent(AFF_ID)}`;
  return base + q;
}

function titleFromHandle(handle: string) {
  return handle
    .replace(/^z_legacy(_\d+)?_?/i, "")
    .replace(/^zf_nogluten_/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bEe\b/g, "EE")
    .replace(/\bEmp\b/g, "EMP")
    .replace(/\bMre\b/g, "MRE")
    .trim();
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "LatterDayShoppingSeed/1.0" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  images?: { src: string }[];
  variants?: { price: string }[];
};

async function cleanDummyData() {
  console.log("\n── Removing dummy catalog ──");

  const dummyBrands = await prisma.brand.findMany({
    where: { slug: { in: DUMMY_BRAND_SLUGS } },
    select: { id: true, name: true },
  });
  if (dummyBrands.length) {
    const ids = dummyBrands.map((b) => b.id);
    const deletedProducts = await prisma.product.deleteMany({ where: { brandId: { in: ids } } });
    await prisma.brand.deleteMany({ where: { id: { in: ids } } });
    console.log(`  deleted ${dummyBrands.length} brands, ${deletedProducts.count} branded products`);
  }

  const dummyVendors = await prisma.user.findMany({
    where: { email: { in: DUMMY_VENDOR_EMAILS } },
    select: { id: true, email: true },
  });
  if (dummyVendors.length) {
    const ids = dummyVendors.map((v) => v.id);
    const deleted = await prisma.product.deleteMany({ where: { vendorId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    console.log(`  deleted ${dummyVendors.length} dummy vendors, ${deleted.count} leftover products`);
  }

  // Also remove leftover example.com affiliate stubs tied to old seeds
  const stub = await prisma.product.deleteMany({
    where: { redirectUrl: { contains: "example.com" } },
  });
  if (stub.count) console.log(`  deleted ${stub.count} example.com stub products`);
}

async function upsertVendor(opts: {
  name: string;
  email: string;
  companyName: string;
  shopName: string;
  password: string;
}) {
  const shopSlug = slug(opts.shopName);
  const existing = await prisma.user.findUnique({ where: { email: opts.email } });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: opts.name,
        companyName: opts.companyName,
        shopName: opts.shopName,
        shopSlug,
        role: "VENDOR",
        vendorStatus: "APPROVED",
        isActive: true,
      },
    });
  }
  return prisma.user.create({
    data: {
      name: opts.name,
      email: opts.email,
      password: opts.password,
      role: "VENDOR",
      companyName: opts.companyName,
      shopName: opts.shopName,
      shopSlug,
      vendorStatus: "APPROVED",
      isActive: true,
    },
  });
}

async function upsertBrand(opts: {
  name: string;
  website: string;
  logoUrl: string;
  showOnHomepage?: boolean;
}) {
  const s = slug(opts.name);
  return prisma.brand.upsert({
    where: { slug: s },
    create: {
      name: opts.name,
      slug: s,
      website: opts.website,
      logoUrl: opts.logoUrl,
      showOnHomepage: opts.showOnHomepage ?? true,
    },
    update: {
      name: opts.name,
      website: opts.website,
      logoUrl: opts.logoUrl,
      showOnHomepage: opts.showOnHomepage ?? true,
    },
  });
}

async function upsertCategory(name: string, imageUrl: string, showOnHomepage = true) {
  const s = slug(name);
  return prisma.category.upsert({
    where: { slug: s },
    create: { name, slug: s, imageUrl, showOnHomepage },
    update: { name, imageUrl, showOnHomepage },
  });
}

async function upsertProduct(data: {
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: number;
  images: string[];
  redirectUrl: string;
  vendorId: string;
  categoryId: string;
  brandId: string;
  sku?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}) {
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return prisma.product.update({
      where: { id: existing.id },
      data: {
        title: data.title,
        description: data.description,
        shortDesc: data.shortDesc,
        price: data.price,
        images: data.images,
        redirectUrl: data.redirectUrl,
        vendorId: data.vendorId,
        categoryId: data.categoryId,
        brandId: data.brandId,
        sku: data.sku,
        isFeatured: data.isFeatured ?? false,
        isNewArrival: data.isNewArrival ?? false,
        isActive: true,
        stock: Math.max(existing.stock, 50),
      },
    });
  }
  return prisma.product.create({
    data: {
      ...data,
      stock: 100,
      isActive: true,
      isFeatured: data.isFeatured ?? false,
      isNewArrival: data.isNewArrival ?? false,
    },
  });
}

async function seedSecretGarden(vendorId: string, brandId: string, categoryId: string) {
  console.log("\n── Secret Garden Bees products ──");
  const data = await fetchJson<{ products: ShopifyProduct[] }>(
    "https://secretgardenbees.com/products.json?limit=250"
  );
  if (!data?.products?.length) {
    console.error("  ! Could not fetch secretgardenbees.com products.json");
    return 0;
  }

  let count = 0;
  for (const p of data.products) {
    const plain = stripHtml(p.body_html || "");
    const shortDesc = plain.slice(0, 180) + (plain.length > 180 ? "…" : "");
    const price = Number(p.variants?.[0]?.price ?? 0) || 0;
    const images = (p.images || []).map((i) => i.src).filter(Boolean);
    await upsertProduct({
      title: p.title,
      slug: `sg-${p.handle}`,
      description: p.body_html || `<p>${plain}</p>`,
      shortDesc: shortDesc || p.title,
      price,
      images: images.length ? images : [],
      redirectUrl: `https://secretgardenbees.com/products/${p.handle}`,
      vendorId,
      categoryId,
      brandId,
      sku: `SG-${p.id}`,
      isFeatured: /honey/i.test(p.title),
      isNewArrival: true,
    });
    count++;
    console.log(`  ✓ ${p.title}`);
  }
  return count;
}

async function seedBePrepared(vendorId: string, brandId: string, categoryId: string) {
  console.log("\n── Emergency Essentials / BePrepared products ──");
  console.log(`  affiliate id: ${AFF_ID === "XXXXXXXX" ? "PLACEHOLDER (set BEPREPARED_AFFILIATE_ID)" : AFF_ID}`);

  // Only the 88 product links from the client doc. The homepage "best link" is not a product.

  let count = 0;
  for (const handle of BEPREPARED_HANDLES) {
    const encoded = encodeURI(handle);
    const remote = await fetchJson<{ product: ShopifyProduct }>(
      `https://www.beprepared.com/products/${encoded}.json`
    );
    const product = remote?.product;
    const title = product?.title || titleFromHandle(handle);
    const plain = stripHtml(product?.body_html || "");
    const shortDesc =
      (plain.slice(0, 180) + (plain.length > 180 ? "…" : "")) ||
      `${title} — Emergency Essentials / BePrepared.`;
    const price = Number(product?.variants?.[0]?.price ?? 0) || 0;
    const images = (product?.images || []).map((i) => i.src).filter(Boolean);
    const productSlug = `ee-${slug(handle.replace(/®/g, ""))}`;

    await upsertProduct({
      title,
      slug: productSlug,
      description: product?.body_html || `<p>${shortDesc}</p>`,
      shortDesc,
      price,
      images,
      redirectUrl: affUrl(handle),
      vendorId,
      categoryId,
      brandId,
      sku: product ? `EE-${product.id}` : `EE-${slug(handle).slice(0, 40)}`,
      isFeatured: count < 6,
      isNewArrival: count < 12,
    });
    count++;
    console.log(`  ✓ ${title}${product ? "" : " (meta fallback)"}`);
    // gentle pacing for Shopify
    await new Promise((r) => setTimeout(r, 80));
  }
  return count;
}

async function main() {
  console.log("Seeding client brands…");
  if (AFF_ID === "XXXXXXXX") {
    console.warn("⚠ BEPREPARED_AFFILIATE_ID not set — links will keep XXXXXXXX placeholders.");
  }

  await cleanDummyData();

  const password = await bcrypt.hash("Vendor@LDS2026!", 10);

  const catFood = await upsertCategory(
    "Food & Gourmet",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
    true
  );
  const catEmergency = await upsertCategory(
    "Emergency Preparedness",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
    true
  );

  const eeBrand = await upsertBrand({
    name: "Emergency Essentials",
    website: "https://www.beprepared.com/",
    logoUrl: "https://ui-avatars.com/api/?name=Emergency+Essentials&background=1B6FEB&color=fff&size=128",
    showOnHomepage: true,
  });
  const sgBrand = await upsertBrand({
    name: "Secret Garden Bees",
    website: "https://secretgardenbees.com/",
    logoUrl: "https://ui-avatars.com/api/?name=Secret+Garden+Bees&background=B45309&color=fff&size=128",
    showOnHomepage: true,
  });

  const eeVendor = await upsertVendor({
    name: "Emergency Essentials",
    email: "emergency.essentials@vendor.com",
    companyName: "Emergency Essentials / BePrepared",
    shopName: "Emergency Essentials",
    password,
  });
  const sgVendor = await upsertVendor({
    name: "Secret Garden Bees",
    email: "secret.garden@vendor.com",
    companyName: "Secret Garden Bees | NC Veteran Farm",
    shopName: "Secret Garden Bees",
    password,
  });

  // Hide phone + address site-wide
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", phone: null, address: null },
    update: { phone: null, address: null },
  });
  console.log("\n── Site settings: phone & address cleared ──");

  const sgCount = await seedSecretGarden(sgVendor.id, sgBrand.id, catFood.id);
  const eeCount = await seedBePrepared(eeVendor.id, eeBrand.id, catEmergency.id);

  console.log("\n✓ Done");
  console.log(`  Secret Garden products : ${sgCount}`);
  console.log(`  BePrepared products    : ${eeCount}`);
  console.log("  Vendor password        : Vendor@LDS2026!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
