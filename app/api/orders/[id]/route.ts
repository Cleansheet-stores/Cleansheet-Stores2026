import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const enriched = {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        images: parseImages(item.product.images),
      },
    })),
  };

  return NextResponse.json(enriched);
}
