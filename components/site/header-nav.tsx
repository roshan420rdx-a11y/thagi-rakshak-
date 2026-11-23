"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_NAV, isCurrentPath } from "@/modules/site";

// desktop: logo वाली पंक्ति के नीचे पूरी चौड़ाई की menu पट्टी; चालू पन्ने के नीचे रेखा। फ़ोन पर छिपी (वहाँ नीचे वाला menu)।
export function HeaderNavView({ current }: { current: string }) {
  return (
    <nav aria-label="ऊपर का menu" className="hidden border-t border-line md:block">
      <ul className="mx-auto flex max-w-[1040px] flex-wrap px-2 lg:px-1">
        {HEADER_NAV.map((item) => {
          const on = isCurrentPath(item.href, current);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`inline-flex min-h-12 items-center border-b-[3px] px-3 font-semibold no-underline transition-colors ${
                  on ? "border-brand text-brand" : "border-transparent text-ink hover:border-line hover:text-brand"
                }`}
              >
                {item.labelHi}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function HeaderNav() {
  return <HeaderNavView current={usePathname() ?? "/"} />;
}
