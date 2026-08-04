import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/jwt";

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

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(COOKIE_NAME)?.value;

    // --- Protect dashboard routes ---
    const rule = DASHBOARD_ROUTES.find(r => pathname.startsWith(r.prefix));
    if (rule) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        try {
            const payload = await verifyToken(token);
            if (payload.role !== rule.role) {
                // Wrong role — send them to their own dashboard
                return NextResponse.redirect(new URL(ROLE_HOME[payload.role] ?? "/", req.url));
            }
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
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
