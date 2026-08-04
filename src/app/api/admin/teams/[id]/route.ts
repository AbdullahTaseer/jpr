import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { name, role, email, bio, imageUrl } = await req.json();
    try {
        const member = await prisma.teamMember.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(role !== undefined && { role }),
                ...(email !== undefined && { email: email || null }),
                ...(bio !== undefined && { bio: bio || null }),
                ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
            },
        });
        return NextResponse.json({ member });
    } catch (err) {
        console.error("[admin/teams PUT]", err);
        return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    try {
        await prisma.teamMember.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/teams DELETE]", err);
        return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
    }
}
