import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured    = searchParams.get("featured") === "true";
  const newArrival  = searchParams.get("newArrival") === "true";
  const categoryId  = searchParams.get("categoryId") || undefined;
  const brandId     = searchParams.get("brandId") || undefined;
  const brandedOnly = searchParams.get("brandedOnly") === "true";
  const vendorSlug  = searchParams.get("vendorSlug") || undefined;
  const search      = searchParams.get("search") || undefined;
  const minPrice    = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
  const maxPrice    = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
  const sort        = searchParams.get("sort") || "new";
  const limit       = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(featured    && { isFeatured: true }),
      ...(newArrival  && { isNewArrival: true }),
      ...(categoryId  && { categoryId }),
      ...(brandId     ? { brandId } : brandedOnly && { brandId: { not: null } }),
      ...(vendorSlug  && { vendor: { shopSlug: vendorSlug } }),
      ...(search      && { title: { contains: search, mode: "insensitive" } }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    },
    orderBy:
      sort === "price-asc"  ? { price: "asc" } :
      sort === "price-desc" ? { price: "desc" } :
      { createdAt: "desc" },
    take: limit,
    include: {
      vendor:   { select: { name: true, shopName: true } },
      category: { select: { id: true, name: true } },
      brand:    { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ products });
}
