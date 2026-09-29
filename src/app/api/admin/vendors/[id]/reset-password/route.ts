import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { sendPasswordResetEmail } from "@/lib/email";
import { createResetToken, resetUrl } from "@/lib/password-reset";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// body: { mode: "email" } sends the vendor a reset link
//       { mode: "set", password } sets a new password directly
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const vendor = await prisma.user.findUnique({ where: { id } });
    if (!vendor || vendor.role !== "VENDOR") {
        return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (body.mode === "email") {
        try {
            const token = await createResetToken(vendor);
            await sendPasswordResetEmail(vendor.email, vendor.name, resetUrl(token));
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("[email] admin password reset failed:", msg);
            return NextResponse.json({ error: `Failed to send email: ${msg}` }, { status: 502 });
        }
        return NextResponse.json({ ok: true });
    }

    if (body.mode === "set") {
        if (typeof body.password !== "string" || body.password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }
        const hashed = await bcrypt.hash(body.password, 12);
        await prisma.user.update({ where: { id }, data: { password: hashed } });
        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
}
