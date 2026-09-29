import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { createResetToken, resetUrl } from "@/lib/password-reset";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { email } = await req.json().catch(() => ({}));
    if (!email || typeof email !== "string") {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
        where: { email: { equals: email.trim(), mode: "insensitive" } },
    });

    if (user) {
        try {
            const token = await createResetToken(user);
            await sendPasswordResetEmail(user.email, user.name, resetUrl(token));
        } catch (err) {
            console.error("[email] password reset failed:", err instanceof Error ? err.message : err);
        }
    }

    // Same response whether or not the account exists, so emails can't be enumerated
    return NextResponse.json({ ok: true });
}
