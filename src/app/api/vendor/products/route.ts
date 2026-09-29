import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const products = await prisma.product.findMany({
        where: { vendorId: vendor.userId },
        include: {
            category: { select: { id: true, name: true } },
            brand: { select: { id: true, name: true } },
            _count: { select: { clicks: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const {
            title,
            slug,
            description,
            shortDesc,
            price,
            comparePrice,
            sku,
            stock,
            images,
            redirectUrl,
            categoryId,
            brandId,
            isActive,
        } = body;

        if (!title || !slug || price === undefined) {
            return NextResponse.json(
                { error: "title, slug, and price are required" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                title,
                slug,
                description: description ?? null,
                shortDesc: shortDesc ?? null,
                price: Number(price),
                comparePrice: comparePrice !== undefined ? Number(comparePrice) : null,
                sku: sku ?? null,
                stock: stock !== undefined ? Number(stock) : 0,
                images: images ?? [],
                redirectUrl: redirectUrl ?? null,
                vendorId: vendor.userId,
                categoryId: categoryId ?? null,
                brandId: brandId ?? null,
                isActive: isActive !== undefined ? Boolean(isActive) : true,
                isFeatured: false,
                isNewArrival: false,
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        if (msg.includes("Unique constraint")) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const ids = Array.isArray(body?.ids) ? body.ids.filter((id: unknown): id is string => typeof id === "string") : [];
    if (ids.length === 0) return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });

    // Scoped to the vendor so they can only delete their own products
    const { count } = await prisma.product.deleteMany({ where: { id: { in: ids }, vendorId: vendor.userId } });
    return NextResponse.json({ success: true, count });
}
