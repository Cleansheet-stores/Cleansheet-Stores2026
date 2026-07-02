import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  EMAIL,
  ORDER_STATUS_LABELS,
  PHONE_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";
import { formatPrice, parseImages } from "@/lib/utils";
import type { OrderStatus } from "@/lib/constants";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order) notFound();

  const status = order.status as OrderStatus;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-2xl text-white">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold">Order Placed!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your order. We&apos;ll verify your payment shortly.
        </p>
        <p className="mt-4 text-lg font-bold">Order #{order.orderNumber}</p>
        <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
          {ORDER_STATUS_LABELS[status] ?? order.status}
        </span>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-bold">Order Details</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => {
            const images = parseImages(item.product.images);
            return (
              <li key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} — Size {item.size} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-4 font-bold">
          <span>Total Paid</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        {order.utr && (
          <p className="mt-2 text-sm text-gray-500">UTR: {order.utr}</p>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm">
        <p className="font-semibold">Questions about your order?</p>
        <p className="mt-2 text-gray-600">
          WhatsApp us at{" "}
          <a href={WHATSAPP_URL} className="font-semibold underline">
            {PHONE_DISPLAY}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${EMAIL}`} className="font-semibold underline">
            {EMAIL}
          </a>
        </p>
        <p className="mt-1 text-gray-500">
          Please mention your order number: {order.orderNumber}
        </p>
      </div>

      <Link
        href="/shop"
        className="mt-6 block text-center text-sm font-semibold text-brand-primary hover:underline"
      >
        Continue Shopping →
      </Link>
    </div>
  );
}
