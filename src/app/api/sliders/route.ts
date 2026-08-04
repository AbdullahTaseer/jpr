import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const sliders = await prisma.slider.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: { id: true, imageUrl: true, order: true },
    });
    return NextResponse.json({ sliders });
}
