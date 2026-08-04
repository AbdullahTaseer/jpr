import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const vendorId = vendor.userId;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all vendor products
    const vendorProducts = await prisma.product.findMany({
        where: { vendorId },
        select: { id: true, createdAt: true },
    });

    const productIds = vendorProducts.map((p) => p.id);

    // Click counts
    const [totalClicks, clicksThisMonth, clicksLastMonth] = await Promise.all([
        prisma.productClick.count({ where: { productId: { in: productIds } } }),
        prisma.productClick.count({
            where: {
                productId: { in: productIds },
                clickedAt: { gte: thisMonthStart },
            },
        }),
        prisma.productClick.count({
            where: {
                productId: { in: productIds },
                clickedAt: { gte: lastMonthStart, lt: lastMonthEnd },
            },
        }),
    ]);

    // Product counts
    const totalProducts = vendorProducts.length;
    const productsThisMonth = vendorProducts.filter(
        (p) => p.createdAt >= thisMonthStart
    ).length;
    const productsLastMonth = vendorProducts.filter(
        (p) => p.createdAt >= lastMonthStart && p.createdAt < lastMonthEnd
    ).length;

    const clicksPct =
        clicksLastMonth > 0
            ? ((clicksThisMonth - clicksLastMonth) / clicksLastMonth) * 100
            : 0;
    const productsPct =
        productsLastMonth > 0
            ? ((productsThisMonth - productsLastMonth) / productsLastMonth) * 100
            : 0;

    const avgClickRate = (clicksThisMonth / Math.max(totalProducts, 1)).toFixed(1);

    // Monthly clicks for last 8 calendar months (oldest first)
    const monthlyClicks: { month: string; clicks: number }[] = [];
    for (let i = 7; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const clicks = await prisma.productClick.count({
            where: {
                productId: { in: productIds },
                clickedAt: { gte: start, lt: end },
            },
        });
        const monthLabel = start.toLocaleString("en-US", { month: "short" });
        monthlyClicks.push({ month: monthLabel, clicks });
    }

    // Top 8 products by clicks this month
    const productClicksThisMonth = await prisma.productClick.groupBy({
        by: ["productId"],
        where: {
            productId: { in: productIds },
            clickedAt: { gte: thisMonthStart },
        },
        _count: { productId: true },
        orderBy: { _count: { productId: "desc" } },
        take: 8,
    });

    const topProductIds = productClicksThisMonth.map((p) => p.productId);
    const topProductDetails = await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        select: {
            id: true,
            title: true,
            category: { select: { name: true } },
        },
    });

    const topProductMap = new Map(topProductDetails.map((p) => [p.id, p]));

    const topProducts = productClicksThisMonth.map((row) => {
        const product = topProductMap.get(row.productId);
        const clicks = row._count.productId;
        const ctr =
            ((clicks / Math.max(clicksThisMonth, 1)) * 100).toFixed(1) + "%";
        return {
            id: row.productId,
            title: product?.title ?? "Unknown",
            categoryName: product?.category?.name ?? "Uncategorized",
            clicks,
            ctr,
        };
    });

    return NextResponse.json({
        totalClicks,
        clicksThisMonth,
        clicksLastMonth,
        clicksPct,
        totalProducts,
        productsThisMonth,
        productsLastMonth,
        productsPct,
        avgClickRate,
        monthlyClicks,
        topProducts,
    });
}
