import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const payload = await verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                phone: true,
                role: true,
                companyName: true,
                shopName: true,
                shopSlug: true,
                isActive: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.isActive) {
            return NextResponse.json(
                { error: "Account is deactivated", code: "ACCOUNT_INACTIVE" },
                { status: 401 }
            );
        }

        if (user.role === "VENDOR") {
            const vendor = await prisma.user.findUnique({
                where: { id: user.id },
                select: { vendorStatus: true },
            });
            if (vendor?.vendorStatus !== "APPROVED") {
                return NextResponse.json(
                    { error: "Vendor account is not approved", code: "VENDOR_INACTIVE" },
                    { status: 401 }
                );
            }
        }

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
