"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

type ProductSize = { size: string; stock: number };

type ProductDetailClientProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    sizes: ProductSize[];
  };
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedStock =
    product.sizes.find((s) => s.size === selectedSize)?.stock ?? 0;

  function handleAddToCart() {
    if (!selectedSize) return;
    if (selectedStock < quantity) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                    selectedImage === i
                      ? "border-brand-primary"
                      : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-medium text-white">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-3xl font-bold">{formatPrice(product.price)}</p>

          <p className="mt-6 whitespace-pre-line text-gray-600">
            {product.description}
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Select Size</label>
              <Link
                href="/size-guide"
                className="text-sm text-brand-primary hover:underline"
              >
                Size Guide
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map(({ size, stock }) => (
                <button
                  key={size}
                  type="button"
                  disabled={stock === 0}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    selectedSize === size
                      ? "border-brand-primary bg-brand-primary text-white"
                      : stock === 0
                        ? "cursor-not-allowed border-gray-200 text-gray-300"
                        : "border-gray-300 hover:border-brand-primary"
                  }`}
                >
                  {size}
                  {stock === 0 && " (Out)"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="font-semibold">Quantity</label>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity(Math.min(selectedStock || 99, quantity + 1))
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedSize || selectedStock === 0}
            className="mt-8 w-full rounded-xl bg-brand-primary py-4 text-sm font-bold text-white transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
