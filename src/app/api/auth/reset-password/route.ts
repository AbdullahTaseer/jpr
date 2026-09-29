import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/password-reset";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const INVALID = "This reset link is invalid or has expired. Please request a new one.";

// Lets the reset page check the link before showing the form
export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    const user = token ? await verifyResetToken(token) : null;
    if (!user) return NextResponse.json({ error: INVALID }, { status: 400 });
    return NextResponse.json({ ok: true, email: user.email });
}

export async function POST(req: NextRequest) {
    const { token, password } = await req.json().catch(() => ({}));

    if (!token || !password) {
        return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const user = await verifyResetToken(token);
    if (!user) return NextResponse.json({ error: INVALID }, { status: 400 });

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return NextResponse.json({ ok: true });
}
