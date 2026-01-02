import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Initialize Razorpay inside the POST function for runtime
  const razorpay = new Razorpay({
    key_id: process.env.RZP_KEY_ID!,
    key_secret: process.env.RZP_KEY_SECRET!,
  });

  // Check authentication first
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      {
        error: "Authentication required",
        message: "You must be signed in to place an order",
      },
      { status: 401 }
    );
  }

  // Validate environment variables before processing
  if (!process.env.RZP_KEY_ID || !process.env.RZP_KEY_SECRET) {
    return NextResponse.json(
      {
        error: "Razorpay configuration error",
        details: "Missing RZP_KEY_ID or RZP_KEY_SECRET environment variables",
      },
      { status: 500 }
    );
  }

  const { items, shippingAddress, billingAddress } = await req.json();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items in cart." }, { status: 400 });
  }

  if (
    !shippingAddress ||
    !shippingAddress.name ||
    !shippingAddress.address ||
    !shippingAddress.city
  ) {
    return NextResponse.json(
      { error: "Shipping address is required." },
      { status: 400 }
    );
  }

  const total = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const amount = Math.round(total * 100); // Razorpay expects paise

  const options = {
    amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    // Validate inventory for all items
    for (const item of items) {
      if (!item.variantId) {
        return NextResponse.json(
          { error: `Invalid variant for item ${item.name}` },
          { status: 400 }
        );
      }

      const variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Product variant not found for ${item.name}` },
          { status: 404 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${variant.product.name}. Available: ${variant.stock}, Requested: ${item.quantity}`,
          },
          { status: 400 }
        );
      }
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database
    const dbOrder = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: total,
        status: "PENDING",
        paymentMethod: "RAZORPAY",
        paymentId: razorpayOrder.id,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RZP_KEY_ID,
      dbOrderId: dbOrder.id,
    });
  } catch (err: any) {
    console.error("Checkout Error:", err);
    return NextResponse.json(
      {
        error: "Checkout error",
        details: err.message || "Failed to process order",
        statusCode: err.statusCode,
      },
      { status: err.statusCode || 500 }
    );
  }
}
