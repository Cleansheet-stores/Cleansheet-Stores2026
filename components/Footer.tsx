import Link from "next/link";
import {
  EMAIL,
  PHONE,
  PHONE_DISPLAY,
  STORE_NAME,
  UPI_ID,
  WHATSAPP_URL,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-brand-primary text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="text-lg font-bold text-white">{STORE_NAME}</h3>
          <p className="mt-2 text-sm text-gray-400">
            Premium football jerseys for club fans and collectors. Authentic
            quality, fast delivery across India.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-white">
                Shop All Jerseys
              </Link>
            </li>
            <li>
              <Link href="/size-guide" className="hover:text-white">
                Size Guide
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Contact & Payment</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`tel:+91${PHONE}`} className="hover:text-white">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-white">
                {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp Us
              </a>
            </li>
            <li className="text-gray-400">UPI: {UPI_ID}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
