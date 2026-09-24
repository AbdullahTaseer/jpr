import { verifyToken, COOKIE_NAME } from "./jwt";
import type { JWTPayload } from "./jwt";
import type { NextRequest } from "next/server";
import { prisma } from "./prisma";

export async function getAuthUser(req: NextRequest): Promise<JWTPayload | null> {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
        return await verifyToken(token);
    } catch {
        return null;
    }
}

export async function requireAdmin(req: NextRequest): Promise<JWTPayload | null> {
    const user = await getAuthUser(req);
    if (!user || user.role !== "ADMIN") return null;

    const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { isActive: true, role: true },
    });
    if (!dbUser || dbUser.role !== "ADMIN" || !dbUser.isActive) return null;
    return user;
}

export async function requireVendor(req: NextRequest): Promise<JWTPayload | null> {
    const user = await getAuthUser(req);
    if (!user || user.role !== "VENDOR") return null;

    const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { isActive: true, role: true, vendorStatus: true },
    });
    if (
        !dbUser ||
        dbUser.role !== "VENDOR" ||
        !dbUser.isActive ||
        dbUser.vendorStatus !== "APPROVED"
    ) {
        return null;
    }
    return user;
}

export async function requireUser(req: NextRequest): Promise<JWTPayload | null> {
    const user = await getAuthUser(req);
    if (!user) return null;

    const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { isActive: true },
    });
    if (!dbUser || !dbUser.isActive) return null;
    return user;
}
