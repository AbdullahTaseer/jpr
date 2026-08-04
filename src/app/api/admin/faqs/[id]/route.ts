import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const { question, answer } = await req.json();
    const faq = await prisma.faqItem.update({ where: { id }, data: { question: question.trim(), answer: answer.trim() } });
    return NextResponse.json({ faq });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await prisma.faqItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
