"use client";

import { useEffect, useState } from "react";
import { AKSHAR_KEY, aksharLabel, nextAkshar, readAkshar, type AksharLevel } from "@/modules/ui/text-size";

// "अ+": दबाने पर अक्षर सामान्य → बड़े → और बड़े → सामान्य। पसंद इसी फ़ोन में याद रहती है। mount से पहले कुछ नहीं।
export function TextSizeButton() {
  const [level, setLevel] = useState<AksharLevel | null>(null);

  useEffect(() => setLevel(readAkshar(document.documentElement.dataset.akshar)), []);
  if (!level) return null;

  function cycle() {
    const n = nextAkshar(level!);
    if (n === "1") delete document.documentElement.dataset.akshar;
    else document.documentElement.dataset.akshar = n;
    try {
      if (n === "1") window.localStorage.removeItem(AKSHAR_KEY);
      else window.localStorage.setItem(AKSHAR_KEY, n);
    } catch {
      // storage बंद हो तो सिर्फ़ इस बार के लिए
    }
    setLevel(n);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`अ+ अक्षर बड़े करें (अभी: ${aksharLabel(level)})`}
      className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-[10px] border border-line bg-paper px-2 text-[18px] font-bold text-brand"
    >
      अ+
    </button>
  );
}
