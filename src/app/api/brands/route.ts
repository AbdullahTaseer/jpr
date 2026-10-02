import { prisma } from "@/lib/prisma";
import { PUBLIC_PRODUCT_WHERE } from "@/lib/products";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const homepage = new URL(req.url).searchParams.get("homepage") === "true";
    const brands = await prisma.brand.findMany({
        where: homepage ? { showOnHomepage: true } : undefined,
        include: { _count: { select: { products: { where: PUBLIC_PRODUCT_WHERE } } } },
        orderBy: { name: "asc" },
    });
    if (!homepage) return NextResponse.json({ brands });

    // Homepage "Shop by Brands" also needs each brand's store link and banner photo,
    // which live on the vendor whose shop name matches the brand, plus 3 of its products
    // (new arrivals first). Fetched here in parallel so the homepage makes a single request.
    const [vendors, productsByBrand] = await Promise.all([
        prisma.user.findMany({
            where: {
                role: "VENDOR",
                vendorStatus: "APPROVED",
                isActive: true,
                shopSlug: { not: null },
                shopName: { in: brands.map((b) => b.name) },
            },
            select: { shopName: true, shopSlug: true, bannerImage: true },
        }),
        Promise.all(brands.map((b) => prisma.product.findMany({
            where: { isActive: true, brandId: b.id },
            orderBy: [{ isNewArrival: "desc" }, { createdAt: "desc" }],
            take: 3,
            include: {
                vendor:   { select: { name: true, shopName: true } },
                category: { select: { id: true, name: true } },
                brand:    { select: { id: true, name: true } },
            },
        }))),
    ]);
    const vendorByName = new Map(vendors.map((v) => [v.shopName as string, v]));

    return NextResponse.json({
        brands: brands.map((b, i) => ({
            ...b,
            storeSlug: vendorByName.get(b.name)?.shopSlug ?? null,
            bannerImage: vendorByName.get(b.name)?.bannerImage ?? null,
            products: productsByBrand[i],
        })),
    });
}
