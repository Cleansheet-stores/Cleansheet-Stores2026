import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import { CATEGORIES, STORE_NAME, STORE_TAGLINE } from "@/lib/constants";
import { parseImages } from "@/lib/utils";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const latest = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const displayProducts = featured.length ? featured : latest.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-primary text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
              Welcome to
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {STORE_NAME}
            </h1>
            <p className="mt-4 text-lg text-gray-300">{STORE_TAGLINE}</p>
            <p className="mt-2 max-w-lg text-gray-400">
              Authentic club and national team jerseys. Premium quality, fair
              prices, and easy UPI payments.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-primary transition hover:bg-gray-100"
              >
                Shop Jerseys
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-gray-600 px-6 py-3 text-sm font-semibold transition hover:border-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt={STORE_NAME}
              width={400}
              height={400}
              className="h-auto w-full max-w-sm object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-brand-muted py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 text-sm text-gray-600 sm:px-6 lg:px-8">
          <span>✓ Premium Quality Jerseys</span>
          <span>✓ UPI / GPay Accepted</span>
          <span>✓ WhatsApp Support</span>
          <span>✓ All India Delivery</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold">Shop by Category</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="group rounded-xl border border-gray-200 bg-white p-8 text-center transition hover:border-brand-primary hover:shadow-md"
            >
              <p className="text-xl font-bold group-hover:text-brand-primary">
                {cat}
              </p>
              <p className="mt-1 text-sm text-gray-500">Browse collection</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand-muted py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">
              {featured.length ? "Featured Jerseys" : "Latest Jerseys"}
            </h2>
            <Link
              href="/shop"
              className="text-sm font-semibold text-brand-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          {displayProducts.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayProducts.map((product) => {
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
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-gray-500">Jerseys coming soon!</p>
              <p className="mt-2 text-sm text-gray-400">
                Admin can add products at{" "}
                <Link href="/admin" className="font-semibold underline">
                  /admin
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
