import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, imageUrl } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

    const trimmed = name.trim();
    const slug = slugify(trimmed);

    try {
        const category = await prisma.category.create({
            data: { name: trimmed, slug, imageUrl: imageUrl ?? null, showOnHomepage: false },
        });
        return NextResponse.json({ category }, { status: 201 });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unique constraint") || msg.includes("unique constraint")) {
            return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });
        }
        console.error("[vendor/categories POST]", err);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
