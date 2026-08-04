import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { name, email, subject, message } = await req.json();
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    try {
        const inquiry = await prisma.inquiry.create({
            data: { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() },
        });
        return NextResponse.json({ inquiry }, { status: 201 });
    } catch (err) {
        console.error("[contact POST]", err);
        return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }
}
