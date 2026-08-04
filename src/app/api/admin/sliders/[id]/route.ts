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
    const { title, subtitle, cta, ctaLink, imageUrl, isActive } = await req.json();
    try {
        const slider = await prisma.slider.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(subtitle !== undefined && { subtitle: subtitle || null }),
                ...(cta !== undefined && { cta: cta || null }),
                ...(ctaLink !== undefined && { ctaLink: ctaLink || null }),
                ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
                ...(isActive !== undefined && { isActive: Boolean(isActive) }),
            },
        });
        return NextResponse.json({ slider });
    } catch (err) {
        console.error("[admin/sliders PUT]", err);
        return NextResponse.json({ error: "Failed to update slider" }, { status: 500 });
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
        await prisma.slider.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/sliders DELETE]", err);
        return NextResponse.json({ error: "Failed to delete slider" }, { status: 500 });
    }
}
