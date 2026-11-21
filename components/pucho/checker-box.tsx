"use client";

import { useEffect, useState } from "react";
import { checkMessage, MAX_CHECK_CHARS, type CheckResult } from "@/modules/checker";
import { VerdictCard } from "./verdict-card";

// "पहले पूछो" का box। जाँच इसी फ़ोन के browser में होती है: message न server पर जाता है, न URL में, न कहीं सेव होता है।
// mount से पहले कुछ नहीं दिखता, इसलिए बिना JS के पन्ना सिर्फ़ 7 आम निशान दिखाता है।
export function CheckerBox({ pageUrl }: { pageUrl: string }) {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="space-y-3 rounded-[14px] border border-line bg-paper p-3">
      <form
        className="space-y-3"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkMessage(text));
        }}
      >
        <label htmlFor="pucho-message" className="block text-[17px] font-bold">
          संदिग्ध message यहाँ चिपकाएँ
        </label>
        <textarea
          id="pucho-message"
          name="message"
          rows={5}
          maxLength={MAX_CHECK_CHARS}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="block w-full rounded-[10px] border border-line bg-surface p-3 text-[17px] text-ink"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!text.trim()}
            className="min-h-12 rounded-[10px] bg-brand px-6 font-bold text-paper disabled:opacity-60"
          >
            जाँचें
          </button>
          {text ? (
            <button
              type="button"
              onClick={() => {
                setText("");
                setResult(null);
              }}
              className="min-h-12 rounded-[10px] border border-line bg-paper px-4 font-semibold text-ink"
            >
              मिटाएँ
            </button>
          ) : null}
        </div>
        <p className="text-[15px] text-muted">आपका message कहीं नहीं भेजा जाता, आपके फ़ोन में ही जाँचा जाता है।</p>
      </form>
      <div aria-live="polite">{result ? <VerdictCard result={result} pageUrl={pageUrl} /> : null}</div>
    </div>
  );
}
