-- Optionally, clear all tables (order matters due to foreign keys)
TRUNCATE "OrderItem", "Order", "Review", "Variant", "Product", "Category" RESTART IDENTITY CASCADE;

-- Create categories
INSERT INTO "Category" (id, name, slug, description, image, "createdAt", "updatedAt") VALUES
('cat1', 'T-Shirts', 't-shirts', 'Premium cotton t-shirts for everyday wear', '/placeholder.svg?height=300&width=300', NOW(), NOW()),
('cat2', 'Hoodies', 'hoodies', 'Comfortable hoodies and sweatshirts', '/placeholder.svg?height=300&width=300', NOW(), NOW()),
('cat3', 'Jeans', 'jeans', 'Classic and modern denim styles', '/placeholder.svg?height=300&width=300', NOW(), NOW()),
('cat4', 'Dresses', 'dresses', 'Elegant dresses for every occasion', '/placeholder.svg?height=300&width=300', NOW(), NOW()),
('cat5', 'Accessories', 'accessories', 'Complete your look with our accessories', '/placeholder.svg?height=300&width=300', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create products
INSERT INTO "Product" (
  id, name, slug, description, price, "comparePrice", images, "categoryId", featured, status, gender, "createdAt", "updatedAt"
) VALUES
('prod1', 'Essential Cotton Tee', 'essential-cotton-tee', 'A timeless essential crafted from 100% organic cotton. Soft, breathable, and perfect for layering or wearing on its own.', 29.99, 39.99, ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'], 'cat1', true, 'ACTIVE', 'UNISEX', NOW(), NOW()),
('prod2', 'Relaxed Fit Hoodie', 'relaxed-fit-hoodie', 'Ultra-comfortable hoodie with a relaxed fit. Made from premium cotton blend for ultimate comfort and durability.', 79.99, 99.99, ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'], 'cat2', true, 'ACTIVE', 'UNISEX', NOW(), NOW()),
('prod3', 'Classic Straight Jeans', 'classic-straight-jeans', 'Timeless straight-leg jeans in premium denim. A versatile piece that pairs perfectly with any top.', 89.99, 119.99, ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'], 'cat3', false, 'ACTIVE', 'UNISEX', NOW(), NOW()),
('prod4', 'Midi Wrap Dress', 'midi-wrap-dress', 'Elegant midi dress with a flattering wrap silhouette. Perfect for both casual and formal occasions.', 119.99, 149.99, ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'], 'cat4', true, 'ACTIVE', 'WOMEN', NOW(), NOW()),
('prod5', 'Minimalist Watch', 'minimalist-watch', 'Clean, modern timepiece with a sleek design. Features a stainless steel case and leather strap.', 199.99, 249.99, ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'], 'cat5', false, 'ACTIVE', 'UNISEX', NOW(), NOW()),
('prod6', 'Oversized Blazer', 'oversized-blazer', 'Contemporary oversized blazer perfect for layering. Crafted from premium wool blend for a structured yet comfortable fit.', 159.99, 199.99, ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'], 'cat4', true, 'ACTIVE', 'WOMEN', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create variants
INSERT INTO "Variant" (id, "productId", size, color, stock, sku, "createdAt", "updatedAt") VALUES
-- Essential Cotton Tee variants
('var1', 'prod1', 'S', 'White', 50, 'ECT-WHT-S', NOW(), NOW()),
('var2', 'prod1', 'M', 'White', 75, 'ECT-WHT-M', NOW(), NOW()),
('var3', 'prod1', 'L', 'White', 60, 'ECT-WHT-L', NOW(), NOW()),
('var4', 'prod1', 'S', 'Black', 45, 'ECT-BLK-S', NOW(), NOW()),
('var5', 'prod1', 'M', 'Black', 80, 'ECT-BLK-M', NOW(), NOW()),
('var6', 'prod1', 'L', 'Black', 55, 'ECT-BLK-L', NOW(), NOW()),

-- Relaxed Fit Hoodie variants
('var7', 'prod2', 'S', 'Gray', 30, 'RFH-GRY-S', NOW(), NOW()),
('var8', 'prod2', 'M', 'Gray', 40, 'RFH-GRY-M', NOW(), NOW()),
('var9', 'prod2', 'L', 'Gray', 35, 'RFH-GRY-L', NOW(), NOW()),
('var10', 'prod2', 'S', 'Navy', 25, 'RFH-NVY-S', NOW(), NOW()),
('var11', 'prod2', 'M', 'Navy', 45, 'RFH-NVY-M', NOW(), NOW()),
('var12', 'prod2', 'L', 'Navy', 30, 'RFH-NVY-L', NOW(), NOW()),

-- Classic Straight Jeans variants
('var13', 'prod3', 'S', 'Blue', 20, 'CSJ-BLU-S', NOW(), NOW()),
('var14', 'prod3', 'M', 'Blue', 35, 'CSJ-BLU-M', NOW(), NOW()),
('var15', 'prod3', 'L', 'Blue', 25, 'CSJ-BLU-L', NOW(), NOW()),
('var16', 'prod3', 'S', 'Black', 15, 'CSJ-BLK-S', NOW(), NOW()),
('var17', 'prod3', 'M', 'Black', 30, 'CSJ-BLK-M', NOW(), NOW()),
('var18', 'prod3', 'L', 'Black', 20, 'CSJ-BLK-L', NOW(), NOW()),

-- Midi Wrap Dress variants
('var19', 'prod4', 'S', 'Black', 12, 'MWD-BLK-S', NOW(), NOW()),
('var20', 'prod4', 'M', 'Black', 18, 'MWD-BLK-M', NOW(), NOW()),
('var21', 'prod4', 'L', 'Black', 15, 'MWD-BLK-L', NOW(), NOW()),
('var22', 'prod4', 'S', 'Navy', 10, 'MWD-NVY-S', NOW(), NOW()),
('var23', 'prod4', 'M', 'Navy', 20, 'MWD-NVY-M', NOW(), NOW()),
('var24', 'prod4', 'L', 'Navy', 12, 'MWD-NVY-L', NOW(), NOW()),

-- Minimalist Watch variants
('var25', 'prod5', 'M', 'Brown', 25, 'MW-BRN-M', NOW(), NOW()),
('var26', 'prod5', 'M', 'Black', 30, 'MW-BLK-M', NOW(), NOW()),

-- Oversized Blazer variants
('var27', 'prod6', 'S', 'Beige', 8, 'OB-BGE-S', NOW(), NOW()),
('var28', 'prod6', 'M', 'Beige', 15, 'OB-BGE-M', NOW(), NOW()),
('var29', 'prod6', 'L', 'Beige', 10, 'OB-BGE-L', NOW(), NOW()),
('var30', 'prod6', 'S', 'Black', 12, 'OB-BLK-S', NOW(), NOW()),
('var31', 'prod6', 'M', 'Black', 18, 'OB-BLK-M', NOW(), NOW()),
('var32', 'prod6', 'L', 'Black', 14, 'OB-BLK-L', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;