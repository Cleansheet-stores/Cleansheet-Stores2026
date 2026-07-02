import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") ?? "newest";

  const products = await prisma.product.findMany({
    where: {
      ...(category && category !== "All" ? { category } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { category: { contains: search } },
            ],
          }
        : {}),
    },
    include: { sizes: true },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
  });

  return NextResponse.json(
    products.map((p) => ({
      ...p,
      images: parseImages(p.images),
    })),
  );
}
