import { verifyToken, COOKIE_NAME } from "./jwt";
import type { JWTPayload } from "./jwt";
import type { NextRequest } from "next/server";

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
    return user;
}

export async function requireVendor(req: NextRequest): Promise<JWTPayload | null> {
    const user = await getAuthUser(req);
    if (!user || user.role !== "VENDOR") return null;
    return user;
}

export async function requireUser(req: NextRequest): Promise<JWTPayload | null> {
    return getAuthUser(req);
}
