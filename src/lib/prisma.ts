import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = global as unknown as {
    prisma: PrismaClientInstance;
};

function createClient(): PrismaClientInstance {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL!,
        max: 1,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

export const prisma: PrismaClientInstance =
    globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
