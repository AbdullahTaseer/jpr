import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            vendor: { select: { id: true, name: true, shopName: true } },
            category: { select: { id: true, name: true } },
            brand: { select: { id: true, name: true } },
            _count: { select: { clicks: true } },
        },
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    try {
        const body = await req.json();

        if (body.slug && body.slug !== existing.slug) {
            const clash = await prisma.product.findUnique({ where: { slug: body.slug } });
            if (clash) {
                return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
            }
        }

        if (body.vendorId) {
            const vendor = await prisma.user.findUnique({
                where: { id: body.vendorId, role: "VENDOR" },
            });
            if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
        }

        const updated = await prisma.product.update({
            where: { id },
            data: {
                ...(body.title !== undefined && { title: body.title }),
                ...(body.slug !== undefined && { slug: body.slug }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.shortDesc !== undefined && { shortDesc: body.shortDesc }),
                ...(body.price !== undefined && { price: Number(body.price) }),
                ...(body.comparePrice !== undefined && {
                    comparePrice: body.comparePrice === null || body.comparePrice === ""
                        ? null
                        : Number(body.comparePrice),
                }),
                ...(body.sku !== undefined && { sku: body.sku }),
                ...(body.stock !== undefined && { stock: Number(body.stock) }),
                ...(body.images !== undefined && { images: body.images }),
                ...(body.redirectUrl !== undefined && { redirectUrl: body.redirectUrl }),
                ...(body.categoryId !== undefined && { categoryId: body.categoryId || null }),
                ...(body.brandId !== undefined && { brandId: body.brandId || null }),
                ...(body.vendorId !== undefined && { vendorId: body.vendorId }),
                ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
                ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
                ...(body.isNewArrival !== undefined && { isNewArrival: Boolean(body.isNewArrival) }),
            },
        });

        return NextResponse.json({ product: updated });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const updated = await prisma.product.update({
        where: { id },
        data: {
            ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
            ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
            ...(body.isNewArrival !== undefined && { isNewArrival: Boolean(body.isNewArrival) }),
        },
    });

    return NextResponse.json({ product: updated });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
