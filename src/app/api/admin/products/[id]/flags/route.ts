import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { isFeatured, isNewArrival } = body;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const updated = await prisma.product.update({
        where: { id },
        data: {
            ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
            ...(isNewArrival !== undefined && { isNewArrival: Boolean(isNewArrival) }),
        },
    });

    return NextResponse.json({ product: updated });
}
