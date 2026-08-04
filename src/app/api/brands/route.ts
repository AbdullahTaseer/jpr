import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const homepage = new URL(req.url).searchParams.get("homepage") === "true";
    const brands = await prisma.brand.findMany({
        where: homepage ? { showOnHomepage: true } : undefined,
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
    });
    return NextResponse.json({ brands });
}
