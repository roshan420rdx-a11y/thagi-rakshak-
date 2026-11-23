"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { IconAlert, IconInfo, IconPhone, IconSearch, IconShield } from "@/components/ui/icons";
import { searchSite, type SiteEntry, type SiteHitKind } from "@/modules/site/search";

const KIND_ICON: Record<SiteHitKind, typeof IconPhone> = {
  tel: IconPhone,
  turant: IconAlert,
  tool: IconSearch,
  gyan: IconInfo,
  bank: IconShield,
};

// एक नतीजा: नंबर हो तो सीधे call (tel:), बाकी पन्ने का link
export function SiteHit({ e }: { e: SiteEntry }) {
  const Icon = KIND_ICON[e.kind];
  const body = (
    <>
      <span
        aria-hidden="true"
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${e.kind === "tel" || e.kind === "turant" ? "bg-danger-bg text-danger" : "bg-brand-bg text-brand"}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-bold leading-snug text-brand">
          {e.kind === "tel" ? `${e.titleHi} (call करें)` : e.titleHi}
        </span>
        <span className="block text-[14px] leading-snug text-muted">{e.hintHi}</span>
      </span>
    </>
  );
  const cls = "flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2 no-underline transition-colors hover:border-brand";
  return e.kind === "tel" ? (
    <a href={e.href} className={cls}>
      {body}
    </a>
  ) : (
    <Link href={e.href} className={cls}>
      {body}
    </Link>
  );
}

// "क्या ढूँढ रहे हैं?": लिखते ही नतीजे (browser में ही, कोई request नहीं)। mount से पहले (और बिना JS के) कुछ नहीं।
export function SiteSearch({
  index,
  autoFocus = false,
  className = "",
}: {
  index: readonly SiteEntry[];
  autoFocus?: boolean;
  className?: string;
}) {
  const id = useId();
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const query = q.trim();
  const hits = query ? searchSite(index, query) : [];

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-[17px] font-bold">
        क्या ढूँढ रहे हैं?
      </label>
      <div className="relative">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="जैसे: 1930, SBI, OTP, loan, अर्ज़ी"
          autoComplete="off"
          enterKeyHint="search"
          autoFocus={autoFocus}
          className="block min-h-12 w-full rounded-[10px] border border-line bg-paper py-2 pl-10 pr-3 text-[17px] text-ink"
        />
      </div>
      <div aria-live="polite">
        {query ? (
          hits.length ? (
            <ul className="space-y-2">
              {hits.map((e) => (
                <li key={e.href}>
                  <SiteHit e={e} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-line bg-paper p-3">
              कुछ नहीं मिला। दूसरा शब्द लिखें, या कोई message आया है तो{" "}
              <Link href="/pucho" className="font-semibold text-brand">
                उसे जाँचें →
              </Link>
            </p>
          )
        ) : null}
      </div>
    </form>
  );
}
