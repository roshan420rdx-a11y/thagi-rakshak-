"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { Notice } from "@/components/ui/notice";
import { KAB_ADVICE, KAB_OPTIONS, type KabId } from "@/modules/scams";

// "यह कब हुआ?": जवाब के हिसाब से कदमों के ऊपर छोटी सलाह। सिर्फ़ browser में, कुछ सेव नहीं होता।
// mount से पहले कुछ नहीं, इसलिए JS बंद हो तो पन्ना पहले जैसा (सिर्फ़ कदम)। हक़ का सटीक हिसाब /haq/thagi पर।
export function KabChips() {
  const [mounted, setMounted] = useState(false);
  const [kab, setKab] = useState<KabId | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section aria-labelledby="kab-title" className="space-y-2">
      <h2 id="kab-title" className="text-[17px] font-bold">
        यह कब हुआ?
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {KAB_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={kab === o.id}
            onClick={() => setKab(o.id)}
            className={`min-h-12 rounded-[10px] border px-2 text-[16px] font-semibold ${
              kab === o.id ? "border-brand bg-brand text-paper" : "border-line bg-paper text-ink"
            }`}
          >
            {o.labelHi}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {kab ? (
          <div className="space-y-1">
            <Notice tone={KAB_ADVICE[kab].tone}>{KAB_ADVICE[kab].textHi}</Notice>
            {/* सलाह "1930 पर call करें" कहती है, तो बटन भी यहीं (सलाह खुलने पर कदमों वाला बटन नीचे खिसक जाता है) */}
            <ActionLink action={{ kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" }} primary />
            <Link href="/haq/thagi" className="inline-flex min-h-12 items-center font-semibold text-brand">
              RBI के नियमों से अपना हक़ देखें →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
