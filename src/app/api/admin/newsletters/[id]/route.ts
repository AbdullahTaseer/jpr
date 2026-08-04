import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    try {
        await prisma.newsletterSubscription.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/newsletters DELETE]", err);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
