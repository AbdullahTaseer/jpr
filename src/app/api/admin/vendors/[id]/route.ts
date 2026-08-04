import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { sendVendorApprovedEmail, sendVendorRejectedEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { action } = await req.json(); // "approve" | "reject" | "suspend"

    if (!["approve", "reject", "suspend"].includes(action)) {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const vendor = await prisma.user.findUnique({ where: { id } });
    if (!vendor || vendor.role !== "VENDOR") {
        return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const updateData =
        action === "approve"
            ? { vendorStatus: "APPROVED" as const, isActive: true }
            : action === "reject"
            ? { vendorStatus: "REJECTED" as const, isActive: false }
            : { isActive: false }; // suspend

    const updated = await prisma.user.update({
        where: { id },
        data: updateData,
        select: { id: true, name: true, email: true, shopName: true, vendorStatus: true, isActive: true },
    });

    // Send email notification
    let emailError: string | null = null;
    if (action === "approve" && vendor.shopName) {
        try {
            await sendVendorApprovedEmail(vendor.email, vendor.name, vendor.shopName);
        } catch (err) {
            emailError = err instanceof Error ? err.message : String(err);
            console.error("[email] approve failed:", emailError);
        }
    } else if (action === "reject" && vendor.shopName) {
        try {
            await sendVendorRejectedEmail(vendor.email, vendor.name, vendor.shopName);
        } catch (err) {
            emailError = err instanceof Error ? err.message : String(err);
            console.error("[email] reject failed:", emailError);
        }
    }

    return NextResponse.json({ vendor: updated, emailError });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const vendor = await prisma.user.findUnique({ where: { id } });
    if (!vendor || vendor.role !== "VENDOR") {
        return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
