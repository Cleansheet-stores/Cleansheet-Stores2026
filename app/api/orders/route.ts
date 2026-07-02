import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      address,
      city,
      pincode,
      utr,
      items,
      paymentScreenshot,
    } = body;

    if (
      !customerName ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !pincode ||
      !utr ||
      !items?.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0,
    );

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        phone,
        email,
        address,
        city,
        pincode,
        total,
        utr,
        paymentScreenshot: paymentScreenshot || null,
        status: "pending_payment",
        items: {
          create: items.map(
            (item: {
              productId: string;
              size: string;
              quantity: number;
              price: number;
            }) => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
            }),
          ),
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      await prisma.productSize.updateMany({
        where: {
          productId: item.productId,
          size: item.size,
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
