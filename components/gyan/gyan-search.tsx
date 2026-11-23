"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { IconSearch } from "@/components/ui/icons";
import { filterIndex, type SearchEntry } from "@/modules/gyan/search";

// खोज के नतीजे: गिनती, हर पन्ने का नाम और सार; कुछ न मिले तो message सीधे जाँचने का रास्ता
export function GyanResults({ hits }: { hits: readonly SearchEntry[] }) {
  if (!hits.length) {
    return (
      <div className="space-y-2 rounded-xl border border-line bg-paper p-4">
        <p className="font-bold">कोई पन्ना नहीं मिला।</p>
        <p>दूसरा शब्द लिखकर देखें (जैसे OTP, लोन, SIM, आधार), या संदिग्ध message सीधे जाँचें।</p>
        <Link href="/pucho" className="flex min-h-12 items-center font-semibold text-brand">
          message जाँचें →
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <p className="font-semibold text-muted">{hits.length === 1 ? "1 पन्ना मिला" : `${hits.length} पन्ने मिले`}</p>
      <ul className="space-y-3">
        {hits.map((h) => (
          <li key={h.slug}>
            <Link
              href={`/gyan/${h.slug}`}
              className="block min-h-12 rounded-xl border border-line bg-paper p-3 text-ink no-underline transition-colors hover:border-brand"
            >
              <span className="block text-[17px] font-bold text-brand">{h.titleHi} →</span>
              <span className="block text-[15px]">{h.summaryHi}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// /gyan की खोज (plan A2e): लिखते ही पन्ने छँटें। JS से पहले/बिना JS सिर्फ़ पूरी सूची (children), कोई बेकार डिब्बा नहीं।
export function GyanSearch({ index, children }: { index: readonly SearchEntry[]; children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => setMounted(true), []);
  const query = q.trim();
  const hits = mounted && query ? filterIndex(index, query) : null;

  return (
    <>
      {mounted ? (
        <form role="search" onSubmit={(e) => e.preventDefault()} className="space-y-1">
          <label htmlFor="gyan-q" className="block text-[17px] font-bold">
            ज्ञानकोश में खोजें
          </label>
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              id="gyan-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="जैसे: OTP, लोन, अंगूठा, SIM"
              autoComplete="off"
              enterKeyHint="search"
              className="block min-h-12 w-full rounded-[10px] border border-line bg-paper py-2 pl-10 pr-3 text-[17px] text-ink"
            />
          </div>
        </form>
      ) : null}
      <div aria-live="polite">{hits ? <GyanResults hits={hits} /> : null}</div>
      {hits ? null : children}
    </>
  );
}
