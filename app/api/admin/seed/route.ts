import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

// POST /api/admin/seed
// Seeds database data from scripts/seed-database.sql. Intended for development only.
export async function POST() {
  try {
    // Locate SQL file relative to project root
    const sqlPath = path.join(process.cwd(), "scripts", "seed-database.sql");
    const sql = await readFile(sqlPath, "utf-8");

    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    let executed = 0;
    for (const statement of statements) {
      // Using $executeRawUnsafe because we're running static seed statements from file
      // eslint-disable-next-line no-await-in-loop
      await prisma.$executeRawUnsafe(statement);
      executed += 1;
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      statementsExecuted: executed,
    });
  } catch (error) {
    console.error("Seed database error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 },
    );
  }
}
