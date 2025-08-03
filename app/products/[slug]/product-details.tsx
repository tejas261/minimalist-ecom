"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    images: string[];
    variants: {
      id: string;
      size: string;
      color: string;
      stock: number;
    }[];
    reviews: {
      id: string;
      rating: number;
      comment: string | null;
      createdAt: Date;
      user: {
        name: string | null;
        image: string | null;
      };
    }[];
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const availableColors = [...new Set(product.variants.map((v) => v.color))];
  const availableSizes = [...new Set(product.variants.map((v) => v.size))];

  // Set default values to first available options
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || "");

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    if (!selectedVariant || selectedVariant.stock < quantity) {
      toast.error("Not enough stock available");
      return;
    }

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
    });

    toast.success("Added to cart!");
  };

  return (
    <div className=" py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <Image
              src={
                product.images[selectedImage] ||
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
              }
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={
                      image ||
                      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=80&q=80"
                    }
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {Number(averageRating || 0).toFixed(1)} (
                  {product.reviews.length} reviews)
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold">${product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.comparePrice}
                  </span>
                  <Badge variant="destructive">
                    Save $
                    {Number(
                      ((product.comparePrice! - product.price) /
                        product.comparePrice!) *
                        100
                    ).toFixed(0)}
                    %
                  </Badge>
                </>
              )}
            </div>
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Color Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Color</Label>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
              <div className="flex gap-2">
                {availableColors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <RadioGroupItem value={color} id={color} />
                    <Label htmlFor={color} className="capitalize">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Size Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Size</Label>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="flex gap-2">
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={size} />
                    <Label htmlFor={size}>{size}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Quantity */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Quantity
            </Label>
            <Select
              value={quantity.toString()}
              onValueChange={(value) => setQuantity(Number.parseInt(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: Math.min(10, selectedVariant?.stock || 10) },
                  (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Status */}
          {selectedVariant && (
            <div className="text-sm">
              {selectedVariant.stock > 0 ? (
                <span className="text-green-600">
                  In stock ({selectedVariant.stock} available)
                </span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders over $75
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">
                  30-day return policy
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.slice(0, 5).map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {review.user.image ? (
                        <Image
                          src={
                            review.user.image ||
                            "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=40&q=80"
                          }
                          alt={review.user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {review.user.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.user.name}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
