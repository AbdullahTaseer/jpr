import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {
            name,
            username,
            email,
            phone,
            password,
            confirmPassword,
            companyName,
            ein,
            shopName,
            shopSlug,
        } = await req.json();

        if (!name || !username || !email || !phone || !password || !companyName || !ein || !shopName || !shopSlug) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        const [existingEmail, existingUsername, existingSlug, existingShopName] =
            await Promise.all([
                prisma.user.findUnique({ where: { email } }),
                prisma.user.findUnique({ where: { username } }),
                prisma.user.findUnique({ where: { shopSlug } }),
                prisma.user.findFirst({ where: { shopName: { equals: shopName, mode: "insensitive" } } }),
            ]);

        if (existingEmail) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 409 }
            );
        }
        if (existingUsername) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }
        if (existingSlug) {
            return NextResponse.json(
                { error: "Shop URL already taken" },
                { status: 409 }
            );
        }
        if (existingShopName) {
            return NextResponse.json(
                { error: "A shop with this name already exists" },
                { status: 409 }
            );
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                phone,
                password: hashed,
                role: "VENDOR",
                vendorStatus: "PENDING",
                isActive: false,
                companyName,
                ein,
                shopName,
                shopSlug,
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                shopName: true,
                shopSlug: true,
            },
        });

        return NextResponse.json(
            { message: "Application submitted. You will receive an email once your account is reviewed." },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
