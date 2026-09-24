import type { Prisma } from "../generated/prisma/client";

// Products shown publicly on the storefront: active and belonging to one of our brands
// (Emergency Essentials, Secret Garden Bees). Used for public product counts so they
// match what the Shop page lists.
export const PUBLIC_PRODUCT_WHERE = {
  isActive: true,
  brandId: { not: null },
} satisfies Prisma.ProductWhereInput;
