import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    // Get dashboard statistics
    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),

      // Pending orders
      prisma.order.count({
        where: { status: "PENDING" },
      }),

      // Total active products
      prisma.product.count({
        where: { status: "ACTIVE" },
      }),

      // Total revenue
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),

      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalProducts,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        user: order.user,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
