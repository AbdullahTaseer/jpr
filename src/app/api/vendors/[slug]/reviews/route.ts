import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const vendor = await prisma.user.findUnique({ where: { shopSlug: slug }, select: { id: true } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    const reviews = await prisma.vendorReview.findMany({
        where: { vendorId: vendor.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true, rating: true, comment: true, createdAt: true,
            user: { select: { name: true } },
        },
    });

    return NextResponse.json({ reviews });
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const vendor = await prisma.user.findUnique({ where: { shopSlug: slug }, select: { id: true } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    if (user.userId === vendor.id) {
        return NextResponse.json({ error: "You cannot review your own shop" }, { status: 400 });
    }

    const { rating, comment } = await req.json();
    if (!comment?.trim()) return NextResponse.json({ error: "Comment is required" }, { status: 400 });
    if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });

    const review = await prisma.vendorReview.upsert({
        where: { vendorId_userId: { vendorId: vendor.id, userId: user.userId } },
        update: { rating, comment: comment.trim() },
        create: { vendorId: vendor.id, userId: user.userId, rating, comment: comment.trim() },
        select: {
            id: true, rating: true, comment: true, createdAt: true,
            user: { select: { name: true } },
        },
    });

    return NextResponse.json({ review }, { status: 201 });
}
