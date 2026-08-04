import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const vendors = await prisma.user.findMany({
        where: { role: "VENDOR", vendorStatus: "APPROVED" },
        select: { id: true, name: true, shopName: true },
        orderBy: { name: "asc" },
    });
    return NextResponse.json({ vendors });
}
