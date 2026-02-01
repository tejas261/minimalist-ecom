-- Optionally, clear all tables (order matters due to FKs, but CASCADE handles it)
TRUNCATE "OrderItems", "Orders", "Reviews", "Variants", "Products", "Categories" RESTART IDENTITY CASCADE;

-- -----------------------------
-- CATEGORIES (Unsplash, 600x600)
-- -----------------------------
INSERT INTO "Categories" (id, name, slug, description, image, "createdAt", "updatedAt") VALUES
(
  'cat1',
  'T-Shirts',
  't-shirts',
  'Premium cotton t-shirts for everyday wear',
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600&h=600',
  NOW(),
  NOW()
),
(
  'cat2',
  'Hoodies',
  'hoodies',
  'Comfortable hoodies and sweatshirts',
  'https://images.unsplash.com/photo-1557600067-173369923ba5?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600&h=600',
  NOW(),
  NOW()
),
(
  'cat3',
  'Jeans',
  'jeans',
  'Classic and modern denim styles',
  'https://images.unsplash.com/photo-1746824245653-1bb1575b4689?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600&h=600',
  NOW(),
  NOW()
),
(
  'cat4',
  'Dresses',
  'dresses',
  'Elegant dresses for every occasion',
  'https://images.unsplash.com/photo-1663341124257-ca278dd64e33?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600&h=600',
  NOW(),
  NOW()
),
(
  'cat5',
  'Accessories',
  'accessories',
  'Complete your look with our accessories',
  'https://images.unsplash.com/photo-1765516469356-c18ec65a5745?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600&h=600',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------
-- PRODUCTS (Unsplash, multiple 1200x1200)
-- -----------------------------------------
INSERT INTO "Products" (
  id, name, slug, description, price, "comparePrice", images, "categoryId", featured, status, gender, "createdAt", "updatedAt"
) VALUES

-- Essential Cotton Tee (white) - flatlay, hanger, on-body, studio
(
  'prod1',
  'Essential Cotton Tee',
  'essential-cotton-tee',
  'A timeless essential crafted from 100% organic cotton. Soft, breathable, and perfect for layering or wearing on its own.',
  29.99,
  39.99,
  ARRAY[
    'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1667544417110-403b89341112?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1511500587571-7b710abffba7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200'
  ],
  'cat1',
  true,
  'ACTIVE'::"ProductStatus",
  'UNISEX'::"Gender",
  NOW(),
  NOW()
),

-- Relaxed Fit Hoodie (gray/navy vibe) - portrait, back, moody, lifestyle
(
  'prod2',
  'Relaxed Fit Hoodie',
  'relaxed-fit-hoodie',
  'Ultra-comfortable hoodie with a relaxed fit. Made from premium cotton blend for ultimate comfort and durability.',
  79.99,
  99.99,
  ARRAY[
    'https://images.unsplash.com/photo-1557600067-173369923ba5?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1559436194-ec317a4bafeb?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1559581958-df379578606a?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1618333272197-2ee791c42963?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200'
  ],
  'cat2',
  true,
  'ACTIVE'::"ProductStatus",
  'UNISEX'::"Gender",
  NOW(),
  NOW()
),

-- Classic Straight Jeans (blue/black vibe) - stack, folded, close detail, rack
(
  'prod3',
  'Classic Straight Jeans',
  'classic-straight-jeans',
  'Timeless straight-leg jeans in premium denim. A versatile piece that pairs perfectly with any top.',
  89.99,
  119.99,
  ARRAY[
    'https://images.unsplash.com/photo-1746824245653-1bb1575b4689?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1631112213238-b1bafeaecff3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1754555009599-9f0d848748e7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1634564235572-cd6f37694266?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGljdHVyZXMlMjBvZiUyMG1lbnMlMjBmb2xkZWQlMjBqZWFuc3xlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200'
  ],
  'cat3',
  false,
  'ACTIVE'::"ProductStatus",
  'UNISEX'::"Gender",
  NOW(),
  NOW()
),

-- Midi Wrap Dress (black) - lifestyle + street + studio
(
  'prod4',
  'Midi Wrap Dress',
  'midi-wrap-dress',
  'Elegant midi dress with a flattering wrap silhouette. Perfect for both casual and formal occasions.',
  119.99,
  149.99,
  ARRAY[
    'https://images.unsplash.com/photo-1663341124257-ca278dd64e33?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1643616964756-7e2822e38ee9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1704208316515-a32f81e373ef?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1763906472472-117b55c58948?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200'
  ],
  'cat4',
  true,
  'ACTIVE'::"ProductStatus",
  'WOMEN'::"Gender",
  NOW(),
  NOW()
),

-- Minimalist Watch - product shot + wrist + lifestyle
(
  'prod5',
  'Minimalist Watch',
  'minimalist-watch',
  'Clean, modern timepiece with a sleek design. Features a stainless steel case and leather strap.',
  199.99,
  249.99,
  ARRAY[
    'https://images.unsplash.com/photo-1758887952896-8491d393afe2?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1760532466984-39c3eb7f1254?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1734776580356-15b912494862?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1767779228363-21e8816c7147?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200'
  ],
  'cat5',
  false,
  'ACTIVE'::"ProductStatus",
  'UNISEX'::"Gender",
  NOW(),
  NOW()
),

-- Oversized Blazer (beige/black) - editorials + outfit styling
(
  'prod6',
  'Oversized Blazer',
  'oversized-blazer',
  'Contemporary oversized blazer perfect for layering. Crafted from premium wool blend for a structured yet comfortable fit.',
  159.99,
  199.99,
  ARRAY[
    'https://images.unsplash.com/photo-1747817330508-315506ed9487?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1743664611106-8275a63afb0e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1741817594197-6205d3be914b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200',
    'https://images.unsplash.com/photo-1617566750803-1fbc6c5135c7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&h=1200'
  ],
  'cat4',
  true,
  'ACTIVE'::"ProductStatus",
  'WOMEN'::"Gender",
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------
-- VARIANTS (unchanged)
-- -----------------------------
INSERT INTO "Variants" (id, "productId", size, color, stock, sku, "createdAt", "updatedAt") VALUES
-- Essential Cotton Tee variants
('var1', 'prod1', 'S'::"Size", 'White', 50, 'ECT-WHT-S', NOW(), NOW()),
('var2', 'prod1', 'M'::"Size", 'White', 75, 'ECT-WHT-M', NOW(), NOW()),
('var3', 'prod1', 'L'::"Size", 'White', 60, 'ECT-WHT-L', NOW(), NOW()),
('var4', 'prod1', 'S'::"Size", 'Black', 45, 'ECT-BLK-S', NOW(), NOW()),
('var5', 'prod1', 'M'::"Size", 'Black', 80, 'ECT-BLK-M', NOW(), NOW()),
('var6', 'prod1', 'L'::"Size", 'Black', 55, 'ECT-BLK-L', NOW(), NOW()),

-- Relaxed Fit Hoodie variants
('var7', 'prod2', 'S'::"Size", 'Gray', 30, 'RFH-GRY-S', NOW(), NOW()),
('var8', 'prod2', 'M'::"Size", 'Gray', 40, 'RFH-GRY-M', NOW(), NOW()),
('var9', 'prod2', 'L'::"Size", 'Gray', 35, 'RFH-GRY-L', NOW(), NOW()),
('var10', 'prod2', 'S'::"Size", 'Navy', 25, 'RFH-NVY-S', NOW(), NOW()),
('var11', 'prod2', 'M'::"Size", 'Navy', 45, 'RFH-NVY-M', NOW(), NOW()),
('var12', 'prod2', 'L'::"Size", 'Navy', 30, 'RFH-NVY-L', NOW(), NOW()),

-- Classic Straight Jeans variants
('var13', 'prod3', 'S'::"Size", 'Blue', 20, 'CSJ-BLU-S', NOW(), NOW()),
('var14', 'prod3', 'M'::"Size", 'Blue', 35, 'CSJ-BLU-M', NOW(), NOW()),
('var15', 'prod3', 'L'::"Size", 'Blue', 25, 'CSJ-BLU-L', NOW(), NOW()),
('var16', 'prod3', 'S'::"Size", 'Black', 15, 'CSJ-BLK-S', NOW(), NOW()),
('var17', 'prod3', 'M'::"Size", 'Black', 30, 'CSJ-BLK-M', NOW(), NOW()),
('var18', 'prod3', 'L'::"Size", 'Black', 20, 'CSJ-BLK-L', NOW(), NOW()),

-- Midi Wrap Dress variants
('var19', 'prod4', 'S'::"Size", 'Black', 12, 'MWD-BLK-S', NOW(), NOW()),
('var20', 'prod4', 'M'::"Size", 'Black', 18, 'MWD-BLK-M', NOW(), NOW()),
('var21', 'prod4', 'L'::"Size", 'Black', 15, 'MWD-BLK-L', NOW(), NOW()),
('var22', 'prod4', 'S'::"Size", 'Navy', 10, 'MWD-NVY-S', NOW(), NOW()),
('var23', 'prod4', 'M'::"Size", 'Navy', 20, 'MWD-NVY-M', NOW(), NOW()),
('var24', 'prod4', 'L'::"Size", 'Navy', 12, 'MWD-NVY-L', NOW(), NOW()),

-- Minimalist Watch variants
('var25', 'prod5', 'M'::"Size", 'Brown', 25, 'MW-BRN-M', NOW(), NOW()),
('var26', 'prod5', 'M'::"Size", 'Black', 30, 'MW-BLK-M', NOW(), NOW()),

-- Oversized Blazer variants
('var27', 'prod6', 'S'::"Size", 'Beige', 8, 'OB-BGE-S', NOW(), NOW()),
('var28', 'prod6', 'M'::"Size", 'Beige', 15, 'OB-BGE-M', NOW(), NOW()),
('var29', 'prod6', 'L'::"Size", 'Beige', 10, 'OB-BGE-L', NOW(), NOW()),
('var30', 'prod6', 'S'::"Size", 'Black', 12, 'OB-BLK-S', NOW(), NOW()),
('var31', 'prod6', 'M'::"Size", 'Black', 18, 'OB-BLK-M', NOW(), NOW()),
('var32', 'prod6', 'L'::"Size", 'Black', 14, 'OB-BLK-L', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
