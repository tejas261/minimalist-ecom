import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";
import banner from "@/public/assets/homepage-banner.jpg";

import featured1 from "@/public/assets/featured/featured-1.jpg";
import featured2 from "@/public/assets/featured/featured-2.jpg";
import featured3 from "@/public/assets/featured/featured-3.jpg";

import men from "@/public/assets/categories/men.jpg";
import women from "@/public/assets/categories/women.jpg";

const featuredProducts = [
  {
    id: 1,
    name: "Essential Cotton Tee",
    price: 299.99,
    originalPrice: 399.99,
    image: featured1,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Relaxed Fit Hoodie",
    price: 799.99,
    originalPrice: 999.99,
    image: featured2,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 3,
    name: "Oversized Trousers",
    price: 1199.99,
    originalPrice: 1499.99,
    image: featured3,
    rating: 4.7,
    reviews: 156,
  },
];

const categories = [
  {
    name: "For HIM",
    image: men,
    href: "/products?gender=men",
  },
  {
    name: "For HER",
    image: women,
    href: "/products?gender=women",
  },
];

export default function HomePage() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* Hero Section */}
      <section className="relative h-[93vh] w-full flex items-center justify-center bg-muted/30 rounded-lg mb-16">
        <div className="absolute w-full inset-0">
          <Image
            src={banner}
            alt="Minimalist clothing hero background"
            fill
            className="object-cover w-full"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Timeless Minimalism
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Discover carefully curated pieces that transcend trends. Sustainable
            fashion for the modern minimalist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 max-w-6xl w-full mb-16">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked essentials that form the foundation of a thoughtful
              wardrobe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer border-0 shadow-none"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-[400px] object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-4 left-4 bg-white text-black">
                      Sale
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        ${product.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 w-full max-w-4xl px-4 md:py-24 bg-muted/30 rounded-lg mb-16">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated collections for men and women
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardContent className="p-0 relative">
                    <div className="relative h-[450px]">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 w-full">
        <div className="w-full">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Be the first to know about new arrivals, exclusive offers, and
              sustainable fashion insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
