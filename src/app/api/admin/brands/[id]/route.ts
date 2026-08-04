import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function slugify(s: string) {
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { name, website, logoUrl, slug, showOnHomepage } = body;

    const updated = await prisma.brand.update({
        where: { id },
        data: {
            ...(name !== undefined && { name }),
            ...(website !== undefined && { website }),
            ...(logoUrl !== undefined && { logoUrl }),
            ...(showOnHomepage !== undefined && { showOnHomepage: Boolean(showOnHomepage) }),
            ...(slug !== undefined ? { slug } : name !== undefined ? { slug: slugify(name) } : {}),
        },
    });
    return NextResponse.json({ brand: updated });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
