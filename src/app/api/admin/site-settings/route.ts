import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const settings = await prisma.siteSettings.upsert({
        where: { id: "default" },
        create: { id: "default" },
        update: {},
    });
    return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const allowed = [
        "siteName", "tagline", "logoUrl", "faviconUrl",
        "email", "phone", "address",
        "facebook", "twitter", "instagram", "pinterest", "youtube", "tiktok",
        "metaTitle", "metaDescription", "googleAnalyticsId",
        "announcementEnabled", "announcementText", "announcementBg",
    ] as const;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {};
    for (const key of allowed) {
        if (key in body) data[key] = body[key];
    }

    try {
        const settings = await prisma.siteSettings.upsert({
            where: { id: "default" },
            create: { id: "default", ...data },
            update: data,
        });
        return NextResponse.json({ settings });
    } catch (err) {
        console.error("[admin/site-settings PUT]", err);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
