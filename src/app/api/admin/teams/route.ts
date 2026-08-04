import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, role, email, bio, imageUrl } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const count = await prisma.teamMember.count();
    try {
        const member = await prisma.teamMember.create({
            data: { name: name.trim(), role: role?.trim() || "", email: email?.trim() || null, bio: bio?.trim() || null, imageUrl: imageUrl || null, order: count },
        });
        return NextResponse.json({ member }, { status: 201 });
    } catch (err) {
        console.error("[admin/teams POST]", err);
        return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
    }
}
