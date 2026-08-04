import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const members = await prisma.teamMember.findMany({
        orderBy: { order: "asc" },
    });
    return NextResponse.json({ members });
}
