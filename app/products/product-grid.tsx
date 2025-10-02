import { prisma } from "@/lib/prisma";
import type { Prisma, Gender } from "@prisma/client";
import { ProductCard } from "./product-card";

/**
 * Type for filtering products in Prisma queries.
 */
type ProductWhere = {
  status: string;
  gender?: string;
  category?: { slug: string };
  OR?: Array<
    | { name: { contains: string; mode: Prisma.QueryMode } }
    | { description: { contains: string; mode: Prisma.QueryMode } }
  >;
  comparePrice?: { not: null };
};

interface SearchParams {
  gender?: string;
  category?: string;
  sort?: string;
  search?: string;
  sale?: string;
}

/**
 * Displays a grid of products based on search/filter params.
 * @param searchParams - Filtering and sorting options from the URL.
 */
export async function ProductGrid({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
  };

  // Filter by gender
  if (searchParams.gender) {
    // Show products for selected gender OR unisex
    where.OR = [
      { gender: searchParams.gender.toUpperCase() as Gender },
      { gender: "UNISEX" as Gender },
    ];
  }

  // Filter by category
  if (searchParams.category) {
    where.category = {
      slug: searchParams.category,
    };
  }

  // Search functionality
  if (searchParams.search) {
    where.OR = [
      {
        name: {
          contains: searchParams.search,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
      {
        description: {
          contains: searchParams.search,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
    ];
  }

  // Sale filter
  if (searchParams.sale === "true") {
    where.comparePrice = { not: null };
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (searchParams.sort === "price-desc") {
    orderBy = { price: "desc" };
  } else if (searchParams.sort === "name") {
    orderBy = { name: "asc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      variants: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            price: Number(product.price),
            comparePrice:
              product.comparePrice !== null &&
              product.comparePrice !== undefined
                ? Number(product.comparePrice)
                : product.comparePrice,
            reviews: Array.isArray(product.reviews) ? product.reviews : [],
          }}
        />
      ))}
    </div>
  );
}
