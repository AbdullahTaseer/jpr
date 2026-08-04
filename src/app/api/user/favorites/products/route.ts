import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const favorites = await prisma.favoriteProduct.findMany({
        where: { userId: user.userId },
        include: {
            product: {
                include: { vendor: { select: { shopName: true, name: true } }, category: { select: { name: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ favorites });
}

export async function POST(req: NextRequest) {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    try {
        const fav = await prisma.favoriteProduct.create({
            data: { userId: user.userId, productId },
        });
        return NextResponse.json({ favorite: fav }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Already favorited" }, { status: 409 });
    }
}

export async function DELETE(req: NextRequest) {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    await prisma.favoriteProduct.deleteMany({ where: { userId: user.userId, productId } });
    return NextResponse.json({ success: true });
}
