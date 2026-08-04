import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, slug: true, category: true, author: true, status: true, isFeatured: true, featuredImage: true, readTime: true, createdAt: true },
    });
    return NextResponse.json({ blogs });
}

export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { title, slug, excerpt, content, category, author, featuredImage, status, isFeatured, readTime } = data;

    if (!title?.trim() || !slug?.trim()) {
        return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const blog = await prisma.blog.create({
        data: { title: title.trim(), slug: slug.trim(), excerpt, content: content ?? "", category: category ?? "General", author: author ?? "Admin", featuredImage, status: status ?? "DRAFT", isFeatured: isFeatured ?? false, readTime: readTime ? Number(readTime) : null },
    });
    return NextResponse.json({ blog }, { status: 201 });
}
