import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function getOwnProduct(vendorId: string, productId: string) {
    return prisma.product.findFirst({
        where: { id: productId, vendorId },
    });
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const product = await prisma.product.findFirst({
        where: { id, vendorId: vendor.userId },
        include: {
            category: { select: { id: true, name: true } },
            brand: { select: { id: true, name: true } },
            _count: { select: { clicks: true } },
        },
    });

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await getOwnProduct(vendor.userId, id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    try {
        const body = await req.json();
        // Explicitly exclude isFeatured and isNewArrival
        const {
            isFeatured: _f,
            isNewArrival: _n,
            vendorId: _v,
            ...rest
        } = body;

        void _f; void _n; void _v;

        const updated = await prisma.product.update({
            where: { id },
            data: {
                ...(rest.title !== undefined && { title: rest.title }),
                ...(rest.slug !== undefined && { slug: rest.slug }),
                ...(rest.description !== undefined && { description: rest.description }),
                ...(rest.shortDesc !== undefined && { shortDesc: rest.shortDesc }),
                ...(rest.price !== undefined && { price: Number(rest.price) }),
                ...(rest.comparePrice !== undefined && { comparePrice: Number(rest.comparePrice) }),
                ...(rest.sku !== undefined && { sku: rest.sku }),
                ...(rest.stock !== undefined && { stock: Number(rest.stock) }),
                ...(rest.images !== undefined && { images: rest.images }),
                ...(rest.redirectUrl !== undefined && { redirectUrl: rest.redirectUrl }),
                ...(rest.categoryId !== undefined && { categoryId: rest.categoryId }),
                ...(rest.brandId !== undefined && { brandId: rest.brandId }),
                ...(rest.isActive !== undefined && { isActive: Boolean(rest.isActive) }),
            },
        });
        return NextResponse.json({ product: updated });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await getOwnProduct(vendor.userId, id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
