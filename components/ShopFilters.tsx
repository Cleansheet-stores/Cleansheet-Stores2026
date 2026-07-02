"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

type ShopFiltersProps = {
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
};

export function ShopFilters({
  currentCategory,
  currentSearch,
  currentSort,
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
      <input
        type="search"
        placeholder="Search jerseys..."
        defaultValue={currentSearch}
        onChange={(e) => update("search", e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <select
        defaultValue={currentCategory ?? "All"}
        onChange={(e) =>
          update("category", e.target.value === "All" ? "" : e.target.value)
        }
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        defaultValue={currentSort ?? "newest"}
        onChange={(e) => update("sort", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
