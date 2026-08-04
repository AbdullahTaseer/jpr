import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    let source: string | undefined;
    try {
        const body = await req.json();
        source = body.source;
    } catch {
        // body is optional
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.productClick.create({
        data: { productId: id, source: source ?? null },
    });

    return NextResponse.json({ success: true });
}
