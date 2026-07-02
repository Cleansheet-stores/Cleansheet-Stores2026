import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { formatPrice, parseImages } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/lib/constants";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Orders</h1>

        {orders.length === 0 ? (
          <p className="mt-8 text-gray-500">No orders yet.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="text-sm">
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-gray-600">{order.phone}</p>
                    <p className="text-gray-600">{order.email}</p>
                    <p className="mt-1 text-gray-600">
                      {order.address}, {order.city} - {order.pincode}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold">Total:</span>{" "}
                      {formatPrice(order.total)}
                    </p>
                    {order.utr && (
                      <p>
                        <span className="font-semibold">UTR:</span> {order.utr}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {ORDER_STATUS_LABELS[order.status as OrderStatus] ??
                        order.status}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-1 border-t pt-4 text-sm">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} — Size {item.size} × {item.quantity}{" "}
                      ({formatPrice(item.price * item.quantity)})
                    </li>
                  ))}
                </ul>

                {order.paymentScreenshot && (
                  <p className="mt-2 text-sm">
                    <a
                      href={order.paymentScreenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline"
                    >
                      View payment screenshot
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
