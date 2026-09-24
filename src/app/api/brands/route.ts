import { prisma } from "@/lib/prisma";
import { PUBLIC_PRODUCT_WHERE } from "@/lib/products";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const homepage = new URL(req.url).searchParams.get("homepage") === "true";
    const brands = await prisma.brand.findMany({
        where: homepage ? { showOnHomepage: true } : undefined,
        include: { _count: { select: { products: { where: PUBLIC_PRODUCT_WHERE } } } },
        orderBy: { name: "asc" },
    });
    return NextResponse.json({ brands });
}
