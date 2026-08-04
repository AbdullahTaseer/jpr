import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: vendor.userId },
        select: {
            name: true,
            username: true,
            email: true,
            phone: true,
            companyName: true,
            shopName: true,
            shopSlug: true,
        },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ profile: user });
}

export async function PUT(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, phone, companyName } = body;

    const updated = await prisma.user.update({
        where: { id: vendor.userId },
        data: {
            ...(name !== undefined && { name }),
            ...(phone !== undefined && { phone }),
            ...(companyName !== undefined && { companyName }),
        },
        select: {
            name: true,
            username: true,
            email: true,
            phone: true,
            companyName: true,
            shopName: true,
            shopSlug: true,
        },
    });

    return NextResponse.json({ profile: updated });
}
