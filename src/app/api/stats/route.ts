import { prisma } from "@/lib/prisma";
import { PUBLIC_PRODUCT_WHERE } from "@/lib/products";
import { NextResponse } from "next/server";

export async function GET() {
  const [productCount, vendorCount] = await Promise.all([
    prisma.product.count({ where: PUBLIC_PRODUCT_WHERE }),
    prisma.user.count({ where: { role: "VENDOR", vendorStatus: "APPROVED" } }),
  ]);
  return NextResponse.json({ productCount, vendorCount });
}
