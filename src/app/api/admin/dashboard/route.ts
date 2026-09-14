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

    // 8-month click trend (with product breakdown for chart tooltip)
    const monthlyClicks: {
        month: string;
        clicks: number;
        products: { title: string; clicks: number }[];
    }[] = [];

    for (let i = 7; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);

        const grouped = await prisma.productClick.groupBy({
            by: ["productId"],
            where: { clickedAt: { gte: d, lte: end } },
            _count: { productId: true },
            orderBy: { _count: { productId: "desc" } },
            take: 12,
        });

        const ids = grouped.map((g) => g.productId);
        const details = ids.length
            ? await prisma.product.findMany({
                where: { id: { in: ids } },
                select: { id: true, title: true },
            })
            : [];
        const titleMap = new Map(details.map((p) => [p.id, p.title]));

        const products = grouped.map((g) => ({
            title: titleMap.get(g.productId) ?? "Unknown product",
            clicks: g._count.productId,
        }));
        const count = products.reduce((sum, p) => sum + p.clicks, 0);

        // If more than top 12 products, include remainder so bar total matches
        const totalInMonth = await prisma.productClick.count({
            where: { clickedAt: { gte: d, lte: end } },
        });
        if (totalInMonth > count) {
            products.push({
                title: `Other products (${totalInMonth - count} clicks)`,
                clicks: totalInMonth - count,
            });
        }

        monthlyClicks.push({
            month: d.toLocaleString("en-US", { month: "short" }),
            clicks: totalInMonth,
            products,
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
