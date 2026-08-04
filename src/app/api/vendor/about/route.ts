import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: vendor.userId },
        select: {
            profileImage: true, bannerImage: true,
            aboutTitle: true, aboutDescription: true, aboutCategory: true, aboutSince: true,
            shopPolicies: true,
        },
    });

    return NextResponse.json({ about: user });
}

export async function PUT(req: NextRequest) {
    const vendor = await requireVendor(req);
    if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { profileImage, bannerImage, aboutTitle, aboutDescription, aboutCategory, aboutSince } = await req.json();

    const user = await prisma.user.update({
        where: { id: vendor.userId },
        data: {
            ...(profileImage !== undefined && { profileImage }),
            ...(bannerImage !== undefined && { bannerImage }),
            ...(aboutTitle !== undefined && { aboutTitle }),
            ...(aboutDescription !== undefined && { aboutDescription }),
            ...(aboutCategory !== undefined && { aboutCategory }),
            ...(aboutSince !== undefined && { aboutSince: aboutSince ? new Date(aboutSince) : null }),
        },
        select: { profileImage: true, bannerImage: true, aboutTitle: true, aboutDescription: true, aboutCategory: true, aboutSince: true },
    });

    return NextResponse.json({ about: user });
}
