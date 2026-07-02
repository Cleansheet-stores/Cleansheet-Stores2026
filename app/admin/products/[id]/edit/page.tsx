import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { JerseyForm } from "@/components/JerseyForm";
import { parseImages } from "@/lib/utils";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true },
  });

  if (!product) notFound();

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Edit Jersey</h1>
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <JerseyForm
            mode="edit"
            initial={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              description: product.description,
              price: product.price,
              category: product.category,
              featured: product.featured,
              images: parseImages(product.images),
              sizes: product.sizes.map((s) => ({
                size: s.size,
                stock: s.stock,
              })),
            }}
          />
        </div>
      </div>
    </div>
  );
}
