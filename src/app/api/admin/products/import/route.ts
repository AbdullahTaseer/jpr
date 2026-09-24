import { requireAdmin } from "@/lib/auth-guard";
import { importProductsForVendor, type ImportRow } from "@/lib/product-import";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const vendorId = body.vendorId as string | undefined;
        const rows: ImportRow[] = body.products;

        if (!vendorId) {
            return NextResponse.json({ error: "vendorId is required" }, { status: 400 });
        }

        const vendor = await prisma.user.findFirst({
            where: { id: vendorId, role: "VENDOR", vendorStatus: "APPROVED", isActive: true },
            select: { id: true },
        });
        if (!vendor) {
            return NextResponse.json({ error: "Vendor not found or not active" }, { status: 404 });
        }

        const result = await importProductsForVendor(vendorId, rows);
        return NextResponse.json(result);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Import failed";
        const status = msg.includes("Maximum") || msg.includes("array") ? 400 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}
