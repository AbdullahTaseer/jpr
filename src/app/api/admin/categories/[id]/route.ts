import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { name, imageUrl, slug, showOnHomepage } = body;

    try {
        const updated = await prisma.category.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(showOnHomepage !== undefined && { showOnHomepage: Boolean(showOnHomepage) }),
                ...(slug !== undefined ? { slug } : name !== undefined ? { slug: slugify(name) } : {}),
            },
        });
        return NextResponse.json({ category: updated });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unique constraint") || msg.includes("unique constraint")) {
            return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });
        }
        console.error("[admin/categories PUT]", err);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/categories DELETE]", err);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
