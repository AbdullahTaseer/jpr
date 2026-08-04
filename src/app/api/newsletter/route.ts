import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { email, name } = await req.json();
    if (!email?.trim()) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    try {
        const sub = await prisma.newsletterSubscription.create({
            data: { email: email.trim().toLowerCase(), name: name?.trim() || null },
        });
        return NextResponse.json({ subscription: sub }, { status: 201 });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unique constraint") || msg.includes("unique constraint")) {
            return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
        }
        console.error("[newsletter POST]", err);
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }
}
