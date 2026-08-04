import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const faqs = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { question, answer } = await req.json();
    if (!question?.trim() || !answer?.trim())
        return NextResponse.json({ error: "Question and answer required" }, { status: 400 });
    const count = await prisma.faqItem.count();
    const faq = await prisma.faqItem.create({ data: { question: question.trim(), answer: answer.trim(), order: count } });
    return NextResponse.json({ faq }, { status: 201 });
}
