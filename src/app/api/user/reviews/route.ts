import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const reviews = await prisma.review.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rating, title, body } = await req.json();
    if (!body?.trim()) return NextResponse.json({ error: "Review text is required" }, { status: 400 });
    if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });

    const review = await prisma.review.create({
        data: { userId: user.userId, rating: Number(rating), title: title?.trim() || null, body: body.trim() },
    });
    return NextResponse.json({ review }, { status: 201 });
}
