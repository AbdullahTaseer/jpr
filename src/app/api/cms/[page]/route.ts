import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
    const { page } = await params;
    const items = await prisma.pageContent.findMany({ where: { page } });
    const content: Record<string, string> = {};
    items.forEach(item => { content[`${item.section}.${item.key}`] = item.value; });
    return NextResponse.json({ content }, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
}
