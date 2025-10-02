import { Suspense } from "react";
import { ProductGrid } from "./product-grid";
import { ProductFilters } from "./product-filters";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchParams {
  gender?: string;
  category?: string;
  sort?: string;
  search?: string;
  sale?: string;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="px-4 w-full py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters />
        </aside>

        {/* Products Grid */}
        <div className="flex-1 w-full">
          <div className="mb-12">
            <h1 className="text-2xl font-bold mb-2">
              {searchParams.gender === "men" && "Men's Collection"}
              {searchParams.gender === "women" && "Women's Collection"}
              {searchParams.search &&
                `Search results for "${searchParams.search}"`}
              {!searchParams.gender && !searchParams.search && "All Products"}
            </h1>
            <p className="text-muted-foreground">
              Discover our carefully curated collection of minimalist essentials
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
