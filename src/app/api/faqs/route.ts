import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const faqs = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ faqs });
}
