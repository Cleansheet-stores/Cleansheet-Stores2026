"use client";

import { useState } from "react";
import { EMAIL } from "@/lib/constants";

export function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Clean Sheet Stores - Message from ${name}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-bold">Send a Message</h2>
      <div className="mt-4">
        <label className="text-sm font-medium">Your Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
      <div className="mt-4">
        <label className="text-sm font-medium">Message</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-brand-primary py-3 text-sm font-bold text-white hover:bg-brand-secondary"
      >
        Send via Email
      </button>
    </form>
  );
}
