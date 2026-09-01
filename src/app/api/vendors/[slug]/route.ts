import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const vendor = await prisma.user.findUnique({
        where: { shopSlug: slug, role: "VENDOR", vendorStatus: "APPROVED", isActive: true },
        select: {
            id: true,
            shopName: true,
            shopSlug: true,
            profileImage: true,
            bannerImage: true,
            aboutTitle: true,
            aboutDescription: true,
            aboutCategory: true,
            aboutSince: true,
            shopPolicies: true,
            createdAt: true,
            shopMembers: {
                orderBy: { order: "asc" },
                select: { id: true, name: true, designation: true, imageUrl: true, order: true },
            },
            vendorReviews: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true, rating: true, comment: true, createdAt: true,
                    user: { select: { name: true } },
                },
            },
            _count: { select: { products: { where: { isActive: true } } } },
        },
    });

    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    const brand = await prisma.brand.findFirst({
        where: {
            OR: [
                { slug },
                ...(vendor.shopName ? [{ name: vendor.shopName }] : []),
            ],
        },
        select: { logoUrl: true },
    });

    const avgRating = vendor.vendorReviews.length
        ? vendor.vendorReviews.reduce((s, r) => s + r.rating, 0) / vendor.vendorReviews.length
        : null;

    return NextResponse.json({
        vendor: {
            ...vendor,
            avgRating,
            brandLogo: brand?.logoUrl ?? null,
        },
    });
};