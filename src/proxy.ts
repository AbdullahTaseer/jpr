import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

const DASHBOARD_ROUTES = [
    { prefix: "/admin-dashboard",  role: "ADMIN"  },
    { prefix: "/vendor-dashboard", role: "VENDOR" },
    { prefix: "/user-dashboard",   role: "USER"   },
];

// Public pages that logged-in users should be redirected away from
const AUTH_REDIRECT_PATHS = ["/login", "/register"];

const ROLE_HOME: Record<string, string> = {
    ADMIN:  "/admin-dashboard",
    VENDOR: "/vendor-dashboard",
    USER:   "/user-dashboard",
};

// Redirect to login and clear the session cookie
function logoutRedirect(req: NextRequest) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    return res;
}

// The JWT alone can't tell us if the account was deleted/deactivated since login
async function isAccountValid(userId: string, role: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, isActive: true, vendorStatus: true },
    });
    if (!user || !user.isActive || user.role !== role) return false;
    if (user.role === "VENDOR" && user.vendorStatus !== "APPROVED") return false;
    return true;
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(COOKIE_NAME)?.value;

    // --- Protect dashboard routes ---
    const rule = DASHBOARD_ROUTES.find(r => pathname.startsWith(r.prefix));
    if (rule) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        let payload;
        try {
            payload = await verifyToken(token);
        } catch {
            return logoutRedirect(req);
        }
        if (!(await isAccountValid(payload.userId, payload.role))) {
            // Deleted, deactivated or suspended since login
            return logoutRedirect(req);
        }
        if (payload.role !== rule.role) {
            // Wrong role — send them to their own dashboard
            return NextResponse.redirect(new URL(ROLE_HOME[payload.role] ?? "/", req.url));
        }
        return NextResponse.next();
    }

    // --- Redirect logged-in users away from login/register ---
    if (AUTH_REDIRECT_PATHS.includes(pathname) && token) {
        try {
            const payload = await verifyToken(token);
            const home = ROLE_HOME[payload.role];
            if (home) return NextResponse.redirect(new URL(home, req.url));
        } catch {
            // invalid token — let them through
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin-dashboard/:path*",
        "/vendor-dashboard/:path*",
        "/user-dashboard/:path*",
        "/login",
        "/register",
    ],
};
