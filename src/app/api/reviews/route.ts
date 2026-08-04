import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const reviews = await prisma.review.findMany({
        where: { status: "APPROVED" },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
}
