import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.shopMember.findUnique({ where: { id } });
    if (!existing || existing.vendorId !== vendor.userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { name, designation, imageUrl } = await req.json();
    const member = await prisma.shopMember.update({
        where: { id },
        data: {
            ...(name !== undefined && { name: name.trim() }),
            ...(designation !== undefined && { designation: designation || null }),
            ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        },
    });

    return NextResponse.json({ member });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.shopMember.findUnique({ where: { id } });
    if (!existing || existing.vendorId !== vendor.userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.shopMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
