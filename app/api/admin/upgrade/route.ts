import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/upgrade
// Admin-only endpoint to promote a user to ADMIN by email.
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid body.email" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim();

    const result = await prisma.user.updateMany({
      where: { email: normalizedEmail },
      data: { role: "ADMIN" },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "No user found for the provided email" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      email: normalizedEmail,
      updated: result.count,
      message: "User promoted to ADMIN",
    });
  } catch (error) {
    console.error("Upgrade user to admin error:", error);
    return NextResponse.json(
      { error: "Failed to upgrade user to admin" },
      { status: 500 },
    );
  }
}
