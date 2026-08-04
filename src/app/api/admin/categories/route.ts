import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ categories });
    } catch (err) {
        console.error("[admin/categories GET]", err);
        return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, imageUrl, showOnHomepage } = await req.json();
    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

    const slug = slugify(name);
    try {
        const category = await prisma.category.create({
            data: { name, slug, imageUrl: imageUrl ?? null, showOnHomepage: Boolean(showOnHomepage) },
        });
        return NextResponse.json({ category }, { status: 201 });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("Unique constraint")) return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });
        console.error("[admin/categories POST]", err);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
