import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const [productCount, orderCount, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending_payment" } }),
  ]);

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Total Jerseys</p>
            <p className="mt-1 text-3xl font-bold">{productCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="mt-1 text-3xl font-bold">{orderCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Pending Payment</p>
            <p className="mt-1 text-3xl font-bold text-yellow-600">
              {pendingOrders}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-secondary"
          >
            + Add Jersey
          </Link>
          <Link
            href="/admin/products"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            Manage Jerseys
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
