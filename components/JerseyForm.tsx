"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, SIZES } from "@/lib/constants";

type SizeEntry = { size: string; stock: number };

type ProductData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
  images: string[];
  sizes: SizeEntry[];
};

type JerseyFormProps = {
  initial?: ProductData;
  mode: "create" | "edit";
};

export function JerseyForm({ initial, mode }: JerseyFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [existingImages, setExistingImages] = useState<string[]>(
    initial?.images ?? [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [sizes, setSizes] = useState<SizeEntry[]>(
    initial?.sizes ??
      SIZES.map((size) => ({ size, stock: 10 })),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateSizeStock(size: string, stock: number) {
    setSizes((prev) =>
      prev.map((s) => (s.size === size ? { ...s, stock } : s)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("featured", String(featured));
    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("sizes", JSON.stringify(sizes));
    newFiles.forEach((file) => formData.append("images", file));

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save jersey");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Jersey Name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Barcelona Home 2024/25"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (₹) *</label>
          <input
            required
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Description *</label>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Material, season, player version details..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Jersey Photos</label>
        <p className="text-xs text-gray-500">Upload up to 5 images</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setNewFiles(Array.from(e.target.files ?? []).slice(0, 5))
          }
          className="mt-2 block w-full text-sm"
        />
        {(existingImages.length > 0 || newFiles.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img} className="relative h-20 w-20 overflow-hidden rounded-lg border">
                <Image src={img} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setExistingImages((prev) => prev.filter((i) => i !== img))
                  }
                  className="absolute right-0 top-0 bg-red-500 px-1 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
            {newFiles.map((file, i) => (
              <div
                key={file.name + i}
                className="flex h-20 w-20 items-center justify-center rounded-lg border bg-gray-50 text-xs text-gray-500"
              >
                {file.name.slice(0, 8)}...
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Stock by Size</label>
        <div className="mt-2 grid grid-cols-5 gap-3">
          {sizes.map(({ size, stock }) => (
            <div key={size}>
              <label className="text-xs font-medium text-gray-600">{size}</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) =>
                  updateSizeStock(size, parseInt(e.target.value) || 0)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm font-medium">Show on homepage (Featured)</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-primary px-6 py-2.5 font-semibold text-white hover:bg-brand-secondary disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Add Jersey" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
