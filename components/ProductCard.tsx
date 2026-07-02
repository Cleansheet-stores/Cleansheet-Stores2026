import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export function ProductCard({
  slug,
  name,
  price,
  image,
  category,
}: ProductCardProps) {
  return (
    <Link
      href={`/shop/${slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={image || "/logo.png"}
          alt={name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-primary px-2.5 py-1 text-xs font-medium text-white">
          {category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brand-primary group-hover:underline">
          {name}
        </h3>
        <p className="mt-1 text-lg font-bold">{formatPrice(price)}</p>
      </div>
    </Link>
  );
}
