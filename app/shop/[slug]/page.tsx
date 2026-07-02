import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { sizes: true },
  });

  if (!product) notFound();

  const images = parseImages(product.images);

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: images.length ? images : ["/logo.png"],
        sizes: product.sizes,
      }}
    />
  );
}
