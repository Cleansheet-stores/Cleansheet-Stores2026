import Link from "next/link";
import Image from "next/image";
import { STORE_NAME } from "@/lib/constants";
import { CartButton } from "./CartButton";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt={STORE_NAME}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-tight text-brand-primary">
              {STORE_NAME}
            </p>
            <p className="text-xs text-gray-500">Premium Jerseys</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition hover:text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartButton />
          <Link
            href="/shop"
            className="hidden rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary sm:inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  );
}
