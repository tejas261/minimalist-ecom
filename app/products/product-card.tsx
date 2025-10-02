import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    reviews: { rating: number }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="relative group cursor-pointer border-0 shadow-none hover:shadow-lg transition-shadow">
        <CardContent className="p-0 flex flex-col justify-between">
          <div className="overflow-hidden rounded-lg mb-4">
            {hasDiscount && (
              <Badge className="bg-red-500 z-[50] text-white absolute top-2">
                Sale
              </Badge>
            )}
            <Image
              src={
                product.images[0] ||
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
              }
              alt={product.name}
              width={50}
              height={50}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="space-y-2 mx-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              {product.name}
            </h3>
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground ml-1">
                    {Number(averageRating || 0).toFixed(1)} (
                    {product.reviews.length})
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.price}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.comparePrice}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
