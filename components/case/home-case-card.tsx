"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CASE_KEY, caseHasData, nextStage, parseCase } from "@/modules/case";
import { todayInKolkata } from "@/modules/rules-engine";
import { SHIKAYAT_STAGES } from "@/modules/shikayat";

// होम पर "आपका केस": जिस फ़ोन में पहले से "मेरा केस" भरा है, वहाँ होम खुलते ही अगला कदम। नए आने वाले को कुछ नहीं दिखता।
// data सिर्फ़ इसी फ़ोन से पढ़ा जाता है; कहीं भेजा नहीं जाता।
export function HomeCaseCard() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    try {
      const c = parseCase(window.localStorage.getItem(CASE_KEY), todayInKolkata(new Date()));
      if (!caseHasData(c)) return;
      const next = nextStage(c);
      const title = SHIKAYAT_STAGES.find((s) => s.id === next)?.titleHi;
      setText(title ? `अगला कदम: ${title}` : "पाँचों जगह शिकायत दर्ज है। आगे की तारीख़ें देखें।");
    } catch {
      // storage बंद हो तो कुछ न दिखाएँ
    }
  }, []);

  if (!text) return null;
  return (
    <Link href="/case" className="block rounded-xl border-2 border-brand bg-brand-bg p-3 text-brand no-underline">
      <span className="block text-[17px] font-bold">आपका केस (इस फ़ोन में)</span>
      <span className="block">{text}</span>
      <span className="block font-semibold">मेरा केस खोलें →</span>
    </Link>
  );
}
