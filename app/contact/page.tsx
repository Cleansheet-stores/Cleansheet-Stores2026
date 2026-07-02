import {
  EMAIL,
  PHONE,
  PHONE_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-gray-600">
          Have a question about an order or jersey? Reach out anytime.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold">Phone / WhatsApp</h2>
            <a
              href={`tel:+91${PHONE}`}
              className="mt-2 block text-lg font-semibold text-brand-primary hover:underline"
            >
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold">Email</h2>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-2 block text-lg font-semibold text-brand-primary hover:underline"
            >
              {EMAIL}
            </a>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold">Payment</h2>
            <p className="mt-2 text-gray-600">
              We accept all UPI apps — GPay, PhonePe, Paytm, and more.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
