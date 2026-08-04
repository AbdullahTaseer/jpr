import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { page } = await params;
    const body: Record<string, string> = await req.json();

    const ops = Object.entries(body).map(([compound, value]) => {
        const dotIdx = compound.indexOf(".");
        const section = compound.slice(0, dotIdx);
        const key = compound.slice(dotIdx + 1);
        return prisma.pageContent.upsert({
            where: { page_section_key: { page, section, key } },
            create: { page, section, key, value: String(value) },
            update: { value: String(value) },
        });
    });

    await prisma.$transaction(ops);
    return NextResponse.json({ success: true });
}
