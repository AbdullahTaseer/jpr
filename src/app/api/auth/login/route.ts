import { prisma } from "@/lib/prisma";
import { signToken, COOKIE_NAME } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_REDIRECTS: Record<string, string> = {
    ADMIN: "/admin-dashboard",
    VENDOR: "/vendor-dashboard",
    USER: "/user-dashboard",
};

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { error: "Account is deactivated" },
                { status: 403 }
            );
        }

        if (user.role === "VENDOR") {
            if (user.vendorStatus === "PENDING") {
                return NextResponse.json(
                    { error: "Your application is under review. You will receive an email once approved." },
                    { status: 403 }
                );
            }
            if (user.vendorStatus === "REJECTED") {
                return NextResponse.json(
                    { error: "Your vendor application was not approved. Please contact support." },
                    { status: 403 }
                );
            }
        }

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const res = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            redirect: ROLE_REDIRECTS[user.role] ?? "/",
        });

        res.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
