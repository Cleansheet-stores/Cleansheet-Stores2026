"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { PaymentQR } from "@/components/PaymentQR";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    utr: "",
  });
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-gray-500">Your cart is empty</p>
        <Link href="/shop" className="mt-4 inline-block underline">
          Go to shop
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let paymentScreenshot: string | undefined;

      if (paymentFile) {
        const uploadData = new FormData();
        uploadData.append("file", paymentFile);
        const uploadRes = await fetch("/api/upload-payment", {
          method: "POST",
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadRes.ok) paymentScreenshot = uploadJson.url;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
          paymentScreenshot,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      router.push(`/order/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Shipping Details</h2>
          {(
            [
              ["customerName", "Full Name *"],
              ["phone", "Phone Number *"],
              ["email", "Email *"],
              ["address", "Address *"],
              ["city", "City *"],
              ["pincode", "Pincode *"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}</label>
              <input
                required
                type={key === "email" ? "email" : "text"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          ))}

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold">Order Items</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} ({item.size}) × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t pt-3 font-bold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <PaymentQR total={subtotal} />

          <div>
            <label className="text-sm font-medium">
              UPI Transaction ID (UTR) *
            </label>
            <input
              required
              value={form.utr}
              onChange={(e) => setForm({ ...form, utr: e.target.value })}
              placeholder="Enter 12-digit UTR after payment"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Payment Screenshot (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-primary py-4 text-sm font-bold text-white hover:bg-brand-secondary disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
