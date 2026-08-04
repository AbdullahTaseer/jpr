import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function slugify(s: string) {
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

type ImportRow = {
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
};

export async function POST(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const rows: ImportRow[] = body.products;

    if (!Array.isArray(rows)) {
        return NextResponse.json({ error: "products must be an array" }, { status: 400 });
    }
    if (rows.length > 500) {
        return NextResponse.json({ error: "Maximum 500 rows per import" }, { status: 400 });
    }

    // Pre-fetch all categories and brands for lookup
    const allCategories = await prisma.category.findMany({ select: { id: true, name: true } });
    const allBrands = await prisma.brand.findMany({ select: { id: true, name: true } });

    const catMap = new Map(allCategories.map((c) => [c.name.toLowerCase(), c.id]));
    const brandMap = new Map(allBrands.map((b) => [b.name.toLowerCase(), b.id]));

    // Get existing slugs to check for duplicates
    const existingSlugs = new Set(
        (await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug)
    );

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 1;

        if (!row.title) {
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

        const slug = row.slug ? row.slug : slugify(row.title);

        if (existingSlugs.has(slug)) {
            errors.push(`Row ${rowNum}: slug "${slug}" already exists, skipped`);
            skipped++;
            continue;
        }

        const categoryId = row.categoryName
            ? (catMap.get(row.categoryName.toLowerCase()) ?? null)
            : null;
        const brandId = row.brandName
            ? (brandMap.get(row.brandName.toLowerCase()) ?? null)
            : null;

        try {
            await prisma.product.create({
                data: {
                    title: row.title,
                    slug,
                    price,
                    description: row.description ?? null,
                    shortDesc: row.shortDesc ?? null,
                    sku: row.sku ?? null,
                    stock: row.stock !== undefined ? Number(row.stock) : 0,
                    redirectUrl: row.redirectUrl ?? null,
                    images: row.images ?? [],
                    vendorId: vendor.userId,
                    categoryId,
                    brandId,
                    isFeatured: false,
                    isNewArrival: false,
                    isActive: true,
                },
            });
            existingSlugs.add(slug);
            imported++;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            errors.push(`Row ${rowNum}: ${msg}`);
            skipped++;
        }
    }

    return NextResponse.json({ imported, skipped, errors });
}
