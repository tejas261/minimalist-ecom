"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const categories = [
  { id: "t-shirts", name: "T-Shirts" },
  { id: "hoodies", name: "Hoodies" },
  { id: "jeans", name: "Jeans" },
  { id: "dresses", name: "Dresses" },
  { id: "accessories", name: "Accessories" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateFilter("search", search ? search : null);
      }
    }, 400);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const clearFilters = () => {
    router.push("/products");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>
          {/* Gender */}
          <div>
            <h3 className="font-semibold mb-3">Gender</h3>
            <RadioGroup
              value={searchParams.get("gender") || ""}
              onValueChange={(value) => updateFilter("gender", value || null)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all" />
                <Label htmlFor="all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="men" id="men" />
                <Label htmlFor="men">Men</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="women" id="women" />
                <Label htmlFor="women">Women</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={searchParams.get("category") === category.id}
                    onCheckedChange={(checked) =>
                      updateFilter("category", checked ? category.id : null)
                    }
                  />
                  <Label htmlFor={category.id}>{category.name}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sale */}
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sale"
                checked={searchParams.get("sale") === "true"}
                onCheckedChange={(checked) =>
                  updateFilter("sale", checked ? "true" : null)
                }
              />
              <Label htmlFor="sale">On Sale</Label>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full bg-transparent"
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={searchParams.get("sort") || "newest"}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
