import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status"); // PENDING | APPROVED | REJECTED | null (all)

    const vendors = await prisma.user.findMany({
        where: {
            role: "VENDOR",
            ...(status ? { vendorStatus: status as "PENDING" | "APPROVED" | "REJECTED" } : {}),
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone: true,
            companyName: true,
            shopName: true,
            shopSlug: true,
            vendorStatus: true,
            isActive: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vendors });
}
