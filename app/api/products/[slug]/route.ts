import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { sizes: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...product,
    images: parseImages(product.images),
  });
}
