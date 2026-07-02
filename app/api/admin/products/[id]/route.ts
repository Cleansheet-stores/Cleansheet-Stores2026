import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseImages, slugify } from "@/lib/utils";

async function saveUploadedImages(formData: FormData): Promise<string[]> {
  const files = formData.getAll("images") as File[];
  const urls: string[] = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file.size) continue;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/uploads/${filename}`);
  }

  return urls;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ...product, images: parseImages(product.images) });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

    await prisma.productSize.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: slugify(name),
        description,
        price,
        category,
        featured,
        images: JSON.stringify(allImages),
        sizes: {
          create: sizes.map((s) => ({ size: s.size, stock: s.stock })),
        },
      },
      include: { sizes: true },
    });

    return NextResponse.json({ ...product, images: allImages });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
