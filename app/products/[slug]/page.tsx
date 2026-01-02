export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { ProductDetails } from "./product-details";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ProductDetailsSkeleton() {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <Skeleton className="w-full h-[400px]" />
          </div>
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

function ProductError() {
  return (
    <div className="py-16 text-center" role="alert" aria-live="assertive">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, we couldn't find the product you're looking for.
      </p>
      <a href="/products" className="text-primary underline">
        Back to Products
      </a>
    </div>
  );
}

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];
  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (e) {
    return <ProductError />;
  }

  if (!product) {
    return <ProductError />;
  }

  // Convert price and comparePrice to number for ProductDetails
  const safeProduct = {
    ...product,
    price: Number(product.price),
    comparePrice:
      product.comparePrice !== null && product.comparePrice !== undefined
        ? Number(product.comparePrice)
        : product.comparePrice,
  };

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails product={safeProduct} />
    </Suspense>
  );
}
