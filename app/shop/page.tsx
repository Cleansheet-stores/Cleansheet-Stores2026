import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";

type SearchParams = Promise<{
  category?: string;
  search?: string;
  sort?: string;
}>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;
  const sort = params.sort ?? "newest";

  const products = await prisma.product.findMany({
    where: {
      ...(category && category !== "All" ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { category: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shop Jerseys</h1>
        <p className="mt-1 text-gray-600">
          Browse our full collection of premium football jerseys
        </p>
      </div>

      <Suspense fallback={<div className="h-16 rounded-xl bg-gray-100" />}>
        <ShopFilters
          currentCategory={category}
          currentSearch={search}
          currentSort={sort}
        />
      </Suspense>

      {products.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const images = parseImages(product.images);
            return (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={images[0] ?? "/logo.png"}
                category={product.category}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-lg text-gray-500">No jerseys found</p>
          <p className="mt-2 text-sm text-gray-400">
            Try a different filter or check back soon
          </p>
        </div>
      )}
    </div>
  );
}
