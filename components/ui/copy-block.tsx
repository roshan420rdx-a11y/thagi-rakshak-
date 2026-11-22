"use client";

import { useEffect, useState } from "react";

// copy करने लायक text (spec 3.4 CopyBlock)। text हमेशा दिखता है, इसलिए बिना JS के भी चुनकर copy हो सकता है;
// JS हो तो "Copy करें" बटन, और दबाने पर "Copy हो गया ✓"। text सिर्फ़ इसी फ़ोन के clipboard में जाता है।
export function CopyBlock({ text, label }: { text: string; label: string }) {
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setCanCopy(typeof navigator !== "undefined" && !!navigator.clipboard), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCanCopy(false); // अनुमति न मिले तो बटन हटाएँ; text चुनकर copy किया जा सकता है
    }
  }

  return (
    <div className="space-y-2">
      <pre aria-label={label} className="whitespace-pre-wrap break-words rounded-[10px] border border-line bg-surface p-3 font-sans text-[15px] text-ink">
        {text}
      </pre>
      {canCopy ? (
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-12 items-center rounded-[10px] border border-line bg-paper px-4 font-semibold text-brand"
        >
          {copied ? "Copy हो गया ✓" : "Copy करें"}
        </button>
      ) : null}
      <p aria-live="polite" className="sr-only">
        {copied ? "Copy हो गया" : ""}
      </p>
    </div>
  );
}
