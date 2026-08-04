import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sliders = await prisma.slider.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ sliders });
}

export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { imageUrl } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: "Image is required" }, { status: 400 });

    const count = await prisma.slider.count();
    try {
        const slider = await prisma.slider.create({
            data: { title: "", imageUrl, order: count },
        });
        return NextResponse.json({ slider }, { status: 201 });
    } catch (err) {
        console.error("[admin/sliders POST]", err);
        return NextResponse.json({ error: "Failed to create slider" }, { status: 500 });
    }
}
