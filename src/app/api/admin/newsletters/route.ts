import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subs = await prisma.newsletterSubscription.findMany({
        orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = subs.filter(s => new Date(s.createdAt) >= startOfMonth).length;

    return NextResponse.json({ subscriptions: subs, total: subs.length, newThisMonth });
}
