import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const settings = await prisma.siteSettings.upsert({
        where: { id: "default" },
        create: { id: "default" },
        update: {},
    });
    return NextResponse.json({ settings });
}
