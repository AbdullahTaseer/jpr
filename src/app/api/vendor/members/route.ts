import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const members = await prisma.shopMember.findMany({
        where: { vendorId: vendor.userId },
        orderBy: { order: "asc" },
    });

    return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, designation, imageUrl } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const count = await prisma.shopMember.count({ where: { vendorId: vendor.userId } });

    const member = await prisma.shopMember.create({
        data: { vendorId: vendor.userId, name: name.trim(), designation: designation || null, imageUrl: imageUrl || null, order: count },
    });

    return NextResponse.json({ member }, { status: 201 });
}
