import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Buffer } from "buffer";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseImages, slugify } from "@/lib/utils";
import { SIZES } from "@/lib/constants";

async function saveUploadedImages(formData: FormData): Promise<string[]> {
  const files = formData.getAll("images") as File[];
  const urls: string[] = [];

  for (const file of files) {
    if (!file.size) continue;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "cleansheet-products",
    });

    urls.push(result.secure_url);
  }

  return urls;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { sizes: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    products.map((p) => ({ ...p, images: parseImages(p.images) })),
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const category = formData.get("category") as string;
    const featured = formData.get("featured") === "true";
    const existingImages = JSON.parse(
      (formData.get("existingImages") as string) || "[]",
    ) as string[];
    const sizes = JSON.parse(
      (formData.get("sizes") as string) || "[]",
    ) as { size: string; stock: number }[];

    const newImages = await saveUploadedImages(formData);
    const allImages = [...existingImages, ...newImages];

    if (!allImages.length) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 },
      );
    }

    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        category,
        featured,
        images: JSON.stringify(allImages),
        sizes: {
          create: (sizes.length ? sizes : SIZES.map((s) => ({ size: s, stock: 10 }))).map(
            (s) => ({ size: s.size, stock: s.stock }),
          ),
        },
      },
      include: { sizes: true },
    });

    return NextResponse.json({ ...product, images: allImages });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
