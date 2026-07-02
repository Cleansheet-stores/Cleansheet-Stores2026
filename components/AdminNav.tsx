"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/products", label: "Jerseys" },
    { href: "/admin/orders", label: "Orders" },
  ];

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <span className="font-bold text-brand-primary">Admin</span>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                pathname.startsWith(link.href)
                  ? "text-brand-primary"
                  : "text-gray-600 hover:text-brand-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            View Store
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
