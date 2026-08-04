import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const blogs = await prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, slug: true, excerpt: true, category: true, author: true, featuredImage: true, isFeatured: true, readTime: true, createdAt: true },
    });
    return NextResponse.json({ blogs });
}
