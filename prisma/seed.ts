import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
    const email = "admin@latterdayshopping.com";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("Admin already exists — skipping.");
        return;
    }

    const password = "Admin@LDS2026!";
    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name: "Super Admin",
            email,
            password: hashed,
            role: "ADMIN",
        },
    });

    console.log("✓ Admin created");
    console.log("  Email   :", email);
    console.log("  Password:", password);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
