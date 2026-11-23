"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DONE_KEY, parseDone, pendingProgress, type Pending, type ProgressPage } from "@/modules/scams/done";

// होम पर "बाकी कदम" (plan A2f): /turant पर कुछ कदम "हो गया" किए हों, तो लौटकर आने पर वहीं से आगे। सिर्फ़ इसी फ़ोन में।
export function HomeProgress({ pages }: { pages: readonly ProgressPage[] }) {
  const [list, setList] = useState<Pending[]>([]);
  useEffect(() => {
    try {
      setList(pendingProgress(parseDone(window.localStorage.getItem(DONE_KEY)), pages));
    } catch {
      // storage बंद हो तो कुछ नहीं
    }
  }, [pages]);
  if (!list.length) return null;
  return (
    <section aria-labelledby="baki-kadam" className="space-y-2 rounded-xl border-2 border-safe bg-safe-bg p-3 text-safe">
      <h2 id="baki-kadam" className="text-[17px] font-bold">
        आपके बाकी कदम (इस फ़ोन में)
      </h2>
      <ul className="space-y-1">
        {list.map((p) => (
          <li key={p.slug}>
            <Link href={`/turant/${p.slug}`} className="inline-flex min-h-11 items-center font-semibold text-safe">
              {p.titleHi}: {p.total} में से {p.done} कदम हो गए, बाकी देखें →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
