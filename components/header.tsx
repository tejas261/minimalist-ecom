"use client";

import type React from "react";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  Shield,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/cart";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";

const navigation = [
  { name: "Men", href: "/products?gender=men" },
  { name: "Women", href: "/products?gender=women" },
  { name: "New Arrivals", href: "/products?sort=newest" },
  { name: "Sale", href: "/products?sale=true" },
];

interface SearchResult {
  id: string;
  name: string;
  price: number;
  comparePrice: number | null;
  slug: string;
  category: {
    name: string;
  };
}

export function Header() {
  const { getTotalItems } = useCart();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const totalItems = getTotalItems();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        const data = await response.json();
        setSearchResults(data.products || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [],
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery,
      )}`;
    }
  };

  // Handle clicking outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle result click
  const handleResultClick = (slug: string) => {
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky px-4 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-lg font-semibold">
                MINIMAL
              </Link>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
              {session && (session?.user as any)?.role === "ADMIN" && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Admin
                    </h3>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Manage Orders
                    </Link>
                    <Link
                      href="/admin/products"
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                    >
                      <Settings className="h-4 w-4" />
                      Manage Products
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            MINIMAL
          </Link>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search and actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[200px] pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowResults(true);
                  }
                }}
              />

              {/* Search Results Overlay */}
              {showResults && (searchResults.length > 0 || isSearching) && (
                <Card className="absolute top-full left-0 w-full mt-1 z-50 shadow-lg border">
                  <CardContent className="p-0">
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="max-h-[300px] overflow-y-auto">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => handleResultClick(product.slug)}
                            className="block p-3 hover:bg-muted/50 border-b last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {product.category.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-2">
                                {product.comparePrice && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    ${Number(product.comparePrice).toFixed(2)}
                                  </span>
                                )}
                                <span className="text-sm font-semibold">
                                  ${Number(product.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                        {searchQuery.trim().length >= 2 && (
                          <div className="p-3 border-t bg-muted/25">
                            <Link
                              href={`/products?search=${encodeURIComponent(
                                searchQuery,
                              )}`}
                              onClick={() => setShowResults(false)}
                              className="text-xs text-primary hover:underline"
                            >
                              View all results for "{searchQuery}"
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )}
            </div>
          </form>

          {/* Admin Panel Button - Show prominently for admin users */}
          {session && (session?.user as any)?.role === "ADMIN" && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link href="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {(session?.user as any)?.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/orders"
                          className="flex items-center gap-2"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Manage Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/products"
                          className="flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Manage Products
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth">Sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth">Sign up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
