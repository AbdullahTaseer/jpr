import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = 20;

    const where = search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {};

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                vendor: { select: { id: true, name: true, shopName: true } },
                category: { select: { id: true, name: true } },
                brand: { select: { id: true, name: true } },
                _count: { select: { clicks: true } },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, vendorId, price, slug: rawSlug } = body;
    if (!title || !vendorId || price === undefined) {
        return NextResponse.json({ error: "title, vendorId, and price are required" }, { status: 400 });
    }

    const vendor = await prisma.user.findUnique({ where: { id: vendorId, role: "VENDOR" } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    const slug = rawSlug || slugify(title);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });

    const product = await prisma.product.create({
        data: {
            title,
            slug,
            shortDesc: body.shortDesc ?? null,
            description: body.description ?? null,
            price: Number(price),
            comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
            sku: body.sku ?? null,
            stock: Number(body.stock ?? 0),
            redirectUrl: body.redirectUrl ?? null,
            images: body.images ?? [],
            vendorId,
            categoryId: body.categoryId ?? null,
            brandId: body.brandId ?? null,
            isActive: body.isActive ?? true,
            isFeatured: body.isFeatured ?? false,
            isNewArrival: body.isNewArrival ?? false,
        },
    });
    return NextResponse.json({ product }, { status: 201 });
}
