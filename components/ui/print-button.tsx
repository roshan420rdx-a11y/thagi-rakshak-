"use client";

import { useEffect, useState } from "react";

// "Print / PDF बनाएँ": सिर्फ़ JS के साथ दिखता है (बिना JS के browser के menu से छापें)
export function PrintButton({ label = "Print / PDF बनाएँ" }: { label?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return (
    <button type="button" onClick={() => window.print()} className="min-h-12 rounded-[10px] bg-brand px-6 font-bold text-paper">
      {label}
    </button>
  );
}
