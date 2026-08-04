import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { sendInquiryReplyEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { replyText } = await req.json();
    if (!replyText?.trim()) return NextResponse.json({ error: "Reply text is required" }, { status: 400 });

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });

    try {
        await sendInquiryReplyEmail(
            inquiry.email,
            inquiry.name,
            inquiry.subject,
            inquiry.message,
            replyText.trim()
        );
    } catch (err: unknown) {
        const detail = err instanceof Error ? err.message : JSON.stringify(err);
        console.error("[inquiry reply email]", detail);
        return NextResponse.json({ error: `Email failed: ${detail}` }, { status: 500 });
    }

    const updated = await prisma.inquiry.update({
        where: { id },
        data: { status: "REPLIED" },
    });

    return NextResponse.json({ inquiry: updated });
}
