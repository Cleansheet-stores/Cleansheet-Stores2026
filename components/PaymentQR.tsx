"use client";

import Image from "next/image";
import { useState } from "react";
import { UPI_ID } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

type PaymentQRProps = {
  total: number;
};

export function PaymentQR({ total }: PaymentQRProps) {
  const [copied, setCopied] = useState(false);

  async function copyUpiId() {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <h3 className="text-lg font-bold text-brand-primary">Pay via UPI / GPay</h3>
      <p className="mt-1 text-sm text-gray-600">
        Scan the QR code and pay the exact amount shown below.
      </p>

      <div className="mt-4 rounded-lg bg-brand-primary p-4 text-center text-white">
        <p className="text-sm opacity-80">Amount to pay</p>
        <p className="text-3xl font-bold">{formatPrice(total)}</p>
      </div>

      <div className="mx-auto mt-6 max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white p-3">
        <Image
          src="/payment-qr.png.jpeg"
          alt="GPay QR Code"
          width={300}
          height={300}
          className="h-auto w-full rounded-lg"
        />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div>
          <p className="text-xs text-gray-500">UPI ID</p>
          <p className="font-mono text-sm font-semibold">{UPI_ID}</p>
        </div>
        <button
          type="button"
          onClick={copyUpiId}
          className="rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-secondary"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-gray-600">
        <li>Scan the QR code with GPay, PhonePe, or any UPI app</li>
        <li>Pay exactly {formatPrice(total)}</li>
        <li>Enter your UPI Transaction ID (UTR) below</li>
        <li>Click Place Order to confirm</li>
      </ol>
    </div>
  );
}
