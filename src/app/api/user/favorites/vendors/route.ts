import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const favorites = await prisma.favoriteVendor.findMany({
        where: { userId: user.userId },
        include: {
            vendor: {
                select: { id: true, name: true, shopName: true, shopSlug: true, createdAt: true,
                    _count: { select: { products: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ favorites });
}

export async function POST(req: NextRequest) {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { vendorId } = await req.json();
    if (!vendorId) return NextResponse.json({ error: "vendorId required" }, { status: 400 });

    try {
        const fav = await prisma.favoriteVendor.create({
            data: { userId: user.userId, vendorId },
        });
        return NextResponse.json({ favorite: fav }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Already following" }, { status: 409 });
    }
}

export async function DELETE(req: NextRequest) {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { vendorId } = await req.json();
    await prisma.favoriteVendor.deleteMany({ where: { userId: user.userId, vendorId } });
    return NextResponse.json({ success: true });
}
