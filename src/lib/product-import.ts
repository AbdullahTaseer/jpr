import { prisma } from "@/lib/prisma";

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type ImportRow = {
  title: string;
  slug?: string;
  price: number | string;
  categoryName?: string;
  brandName?: string;
  description?: string;
  shortDesc?: string;
  sku?: string;
  stock?: number | string;
  redirectUrl?: string;
  images?: string[];
  isActive?: boolean;
};

export type ImportResult = {
  imported: number;
  updated: number;
  skipped: number;
  createdCategories: number;
  createdBrands: number;
  errors: string[];
};

async function resolveCategory(
  name: string,
  catMap: Map<string, string>
): Promise<{ id: string; created: boolean }> {
  const key = name.trim().toLowerCase();
  const existing = catMap.get(key);
  if (existing) return { id: existing, created: false };

  let base = slugify(name);
  if (!base) base = "category";
  let slug = base;
  let n = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const created = await prisma.category.create({
    data: { name: name.trim(), slug, showOnHomepage: false },
  });
  catMap.set(key, created.id);
  return { id: created.id, created: true };
}

async function resolveBrand(
  name: string,
  brandMap: Map<string, string>
): Promise<{ id: string; created: boolean }> {
  const key = name.trim().toLowerCase();
  const existing = brandMap.get(key);
  if (existing) return { id: existing, created: false };

  let base = slugify(name);
  if (!base) base = "brand";
  let slug = base;
  let n = 1;
  while (await prisma.brand.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const created = await prisma.brand.create({
    data: { name: name.trim(), slug, showOnHomepage: false },
  });
  brandMap.set(key, created.id);
  return { id: created.id, created: true };
}

/** Import/upsert products for a vendor. Creates missing categories & brands. */
export async function importProductsForVendor(
  vendorId: string,
  rows: ImportRow[]
): Promise<ImportResult> {
  if (!Array.isArray(rows)) {
    throw new Error("products must be an array");
  }
  if (rows.length > 500) {
    throw new Error("Maximum 500 rows per import");
  }

  const allCategories = await prisma.category.findMany({ select: { id: true, name: true } });
  const allBrands = await prisma.brand.findMany({ select: { id: true, name: true } });
  const catMap = new Map(allCategories.map((c) => [c.name.toLowerCase(), c.id]));
  const brandMap = new Map(allBrands.map((b) => [b.name.toLowerCase(), b.id]));

  const existingProducts = await prisma.product.findMany({
    select: { id: true, slug: true, vendorId: true },
  });
  const bySlug = new Map(existingProducts.map((p) => [p.slug, p]));

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  let createdCategories = 0;
  let createdBrands = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    if (!row.title?.trim()) {
      errors.push(`Row ${rowNum}: missing title`);
      skipped++;
      continue;
    }

    const price = Number(row.price);
    if (isNaN(price) || price < 0) {
      errors.push(`Row ${rowNum}: invalid price "${row.price}"`);
      skipped++;
      continue;
    }

    const slug = (row.slug?.trim() || slugify(row.title)).toLowerCase();
    if (!slug) {
      errors.push(`Row ${rowNum}: could not generate slug`);
      skipped++;
      continue;
    }

    let categoryId: string | null = null;
    let brandId: string | null = null;

    try {
      if (row.categoryName?.trim()) {
        const res = await resolveCategory(row.categoryName, catMap);
        categoryId = res.id;
        if (res.created) createdCategories++;
      }
      if (row.brandName?.trim()) {
        const res = await resolveBrand(row.brandName, brandMap);
        brandId = res.id;
        if (res.created) createdBrands++;
      }

      const isActive = row.isActive !== false;
      const data = {
        title: row.title.trim(),
        slug,
        price,
        description: row.description ?? null,
        shortDesc: row.shortDesc ?? null,
        sku: row.sku ?? null,
        stock: row.stock !== undefined && row.stock !== "" ? Number(row.stock) : 0,
        redirectUrl: row.redirectUrl ?? null,
        images: row.images ?? [],
        categoryId,
        brandId,
        isActive,
      };

      const existing = bySlug.get(slug);
      if (existing) {
        if (existing.vendorId !== vendorId) {
          errors.push(`Row ${rowNum}: slug "${slug}" belongs to another vendor, skipped`);
          skipped++;
          continue;
        }
        await prisma.product.update({
          where: { id: existing.id },
          data,
        });
        updated++;
      } else {
        await prisma.product.create({
          data: {
            ...data,
            vendorId,
            isFeatured: false,
            isNewArrival: false,
          },
        });
        bySlug.set(slug, { id: "new", slug, vendorId });
        imported++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      errors.push(`Row ${rowNum}: ${msg}`);
      skipped++;
    }
  }

  return { imported, updated, skipped, createdCategories, createdBrands, errors };
}

/** Strip inline color/background from HTML so dark/light themes stay readable. */
export function stripInlineColors(html: string): string {
  if (!html) return html;
  return html
    .replace(/\s*style="([^"]*)"/gi, (_m, styles: string) => {
      const cleaned = styles
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => !/^(color|background(-color)?)\s*:/i.test(s))
        .join("; ");
      return cleaned ? ` style="${cleaned}"` : "";
    })
    .replace(/\s*color="[^"]*"/gi, "");
}
