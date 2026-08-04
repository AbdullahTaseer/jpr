import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [productCount, vendorCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "VENDOR", vendorStatus: "APPROVED" } }),
  ]);
  return NextResponse.json({ productCount, vendorCount });
}
