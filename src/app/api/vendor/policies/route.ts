import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { shopPolicies } = await req.json();

    await prisma.user.update({
        where: { id: vendor.userId },
        data: { shopPolicies: shopPolicies ?? null },
    });

    return NextResponse.json({ success: true });
}
