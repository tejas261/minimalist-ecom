import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

// POST /api/admin/seed
// Seeds database data from scripts/seed-database.sql. Wipes DB first, then seeds.
export async function POST() {
  try {
    // Find the SQL file
    const possiblePaths = [
      path.join(process.cwd(), "scripts", "seed-database.sql"),
      path.join("/app", "scripts", "seed-database.sql"),
    ];

    let sqlPath = "";
    for (const testPath of possiblePaths) {
      try {
        await readFile(testPath, "utf-8");
        sqlPath = testPath;
        break;
      } catch {
        continue;
      }
    }

    if (!sqlPath) {
      throw new Error("Could not find seed-database.sql file");
    }

    console.log("Loading seed file from:", sqlPath);
    const sqlContent = await readFile(sqlPath, "utf-8");

    // Drop all tables and enums first (clean slate)
    console.log("Dropping existing database objects...");
    
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "VerificationTokens" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Sessions" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Accounts" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Reviews" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "OrderItems" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Orders" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Variants" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Products" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Categories" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Users" CASCADE`);

    // Drop enum types
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "Role" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "ProductStatus" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "Gender" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "Size" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "OrderStatus" CASCADE`);

    console.log("✓ Database wiped clean");

    // Create enum types first
    console.log("Creating enum types...");
    await prisma.$executeRawUnsafe(`
      CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN')
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED')
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TYPE "Gender" AS ENUM ('MEN', 'WOMEN', 'UNISEX')
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TYPE "Size" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL')
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
    `);

    console.log("✓ Enum types created");

    // Create all tables
    console.log("Creating tables...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Categories" (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Products" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        "comparePrice" DECIMAL(10,2),
        images TEXT[],
        "categoryId" TEXT NOT NULL REFERENCES "Categories"(id),
        featured BOOLEAN DEFAULT false,
        status "ProductStatus" DEFAULT 'ACTIVE',
        gender "Gender" NOT NULL,
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Variants" (
        id TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL REFERENCES "Products"(id) ON DELETE CASCADE,
        size "Size" NOT NULL,
        color TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        sku TEXT UNIQUE,
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Users" (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" TIMESTAMP(3),
        image TEXT,
        password TEXT,
        role "Role" DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Orders" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "Users"(id),
        total DECIMAL(10,2) NOT NULL,
        status "OrderStatus" DEFAULT 'PENDING',
        "shippingAddress" JSONB NOT NULL,
        "billingAddress" JSONB,
        "paymentMethod" TEXT NOT NULL,
        "paymentId" TEXT,
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "OrderItems" (
        id TEXT PRIMARY KEY,
        "orderId" TEXT NOT NULL REFERENCES "Orders"(id) ON DELETE CASCADE,
        "productId" TEXT NOT NULL REFERENCES "Products"(id),
        "variantId" TEXT REFERENCES "Variants"(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        "createdAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Reviews" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "Users"(id),
        "productId" TEXT NOT NULL REFERENCES "Products"(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL,
        comment TEXT,
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Accounts" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, "providerAccountId")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Sessions" (
        id TEXT PRIMARY KEY,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
        expires TIMESTAMP(3) NOT NULL
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "VerificationTokens" (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMP(3) NOT NULL,
        UNIQUE(identifier, token)
      )
    `);

    // Create indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX "Products_categoryId_idx" ON "Products"("categoryId")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "Products_status_idx" ON "Products"("status")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "Products_gender_idx" ON "Products"("gender")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "Variants_productId_idx" ON "Variants"("productId")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "Orders_userId_idx" ON "Orders"("userId")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "Orders_status_idx" ON "Orders"("status")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "OrderItems_orderId_idx" ON "OrderItems"("orderId")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "Reviews_productId_idx" ON "Reviews"("productId")`);

    console.log("✓ Tables created successfully");

    // Now seed the data
    const statements = sqlContent
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`Executing ${statements.length} seed statements...`);

    let executed = 0;
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
      executed++;
    }

    console.log(`✓ Database seeded successfully with ${executed} statements`);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      statementsExecuted: executed,
    });
  } catch (error) {
    console.error("Seed error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to seed database", details: errorMessage },
      { status: 500 }
    );
  }
}
