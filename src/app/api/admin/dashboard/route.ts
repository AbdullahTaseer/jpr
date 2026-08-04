import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
        totalVendors,
        newVendorsThisMonth,
        newVendorsLastMonth,
        totalProducts,
        productsThisMonth,
        productsLastMonth,
        totalClicks,
        clicksThisMonth,
        clicksLastMonth,
        pendingVendors,
    ] = await Promise.all([
        prisma.user.count({ where: { role: "VENDOR" } }),
        prisma.user.count({ where: { role: "VENDOR", createdAt: { gte: startOfMonth } } }),
        prisma.user.count({ where: { role: "VENDOR", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
        prisma.product.count(),
        prisma.product.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.product.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
        prisma.productClick.count(),
        prisma.productClick.count({ where: { clickedAt: { gte: startOfMonth } } }),
        prisma.productClick.count({ where: { clickedAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
        prisma.user.count({ where: { role: "VENDOR", vendorStatus: "PENDING" } }),
    ]);

    function pct(current: number, previous: number) {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    }

    // 8-month click trend
    const monthlyClicks: { month: string; clicks: number }[] = [];
    for (let i = 7; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const count = await prisma.productClick.count({ where: { clickedAt: { gte: d, lte: end } } });
        monthlyClicks.push({
            month: d.toLocaleString("en-US", { month: "short" }),
            clicks: count,
        });
    }

    return NextResponse.json({
        totalVendors,
        newVendorsThisMonth,
        vendorsPct: pct(newVendorsThisMonth, newVendorsLastMonth),
        totalProducts,
        productsThisMonth,
        productsPct: pct(productsThisMonth, productsLastMonth),
        totalClicks,
        clicksThisMonth,
        clicksPct: pct(clicksThisMonth, clicksLastMonth),
        pendingVendors,
        monthlyClicks,
    });
}
