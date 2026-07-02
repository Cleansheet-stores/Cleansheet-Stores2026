"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="mt-4 text-gray-500">Your cart is empty</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/shop/${item.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="font-bold">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity - 1,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded border"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity + 1,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded border"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold">Order Summary</h2>
          <div className="mt-4 flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-bold text-brand-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Shipping calculated at checkout
          </p>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-xl bg-brand-primary py-3 text-center text-sm font-bold text-white hover:bg-brand-secondary"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
