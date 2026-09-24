import { requireVendor } from "@/lib/auth-guard";
import { importProductsForVendor, type ImportRow } from "@/lib/product-import";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const rows: ImportRow[] = body.products;
        const result = await importProductsForVendor(vendor.userId, rows);
        return NextResponse.json(result);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Import failed";
        const status = msg.includes("Maximum") || msg.includes("array") ? 400 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}
