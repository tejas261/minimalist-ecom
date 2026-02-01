-- Fix category thumbnails too (your old cat1/cat2 were also pointing to 404 photo IDs)
UPDATE "Categories"
SET image = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&h=600&q=80',
    "updatedAt" = NOW()
WHERE id = 'cat1';

UPDATE "Categories"
SET image = 'https://images.unsplash.com/photo-1557600067-173369923ba5?auto=format&fit=crop&w=600&h=600&q=80',
    "updatedAt" = NOW()
WHERE id = 'cat2';

-- Fix prod1: Essential Cotton Tee (4 working, relevant images)
UPDATE "Products"
SET images = ARRAY[
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&h=1200&q=80',
  'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=1200&h=1200&q=80',
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&h=1200&q=80',
  'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?auto=format&fit=crop&w=1200&h=1200&q=80'
],
"updatedAt" = NOW()
WHERE id = 'prod1';

-- Fix prod2: Relaxed Fit Hoodie (4 working, relevant images)
UPDATE "Products"
SET images = ARRAY[
  'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=1200&h=1200&q=80',
  'https://images.unsplash.com/photo-1597767938316-e3b197db76ee?auto=format&fit=crop&w=1200&h=1200&q=80',
  'https://images.unsplash.com/photo-1557600067-173369923ba5?auto=format&fit=crop&w=1200&h=1200&q=80',
  'https://images.unsplash.com/photo-1769092186364-d521f2ba906f?auto=format&fit=crop&w=1200&h=1200&q=80'
],
"updatedAt" = NOW()
WHERE id = 'prod2';
