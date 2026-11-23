import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { href?: string; labelHi: string };

// "पन्ने का रास्ता" (होम › ज्ञानकोश › पन्ना): भीतर के पन्नों पर पता रहे कि कहाँ हैं, और एक tap में ऊपर वाले पन्ने पर
export function Breadcrumb({ items }: { items: readonly Crumb[] }) {
  const all: Crumb[] = [{ href: "/", labelHi: "होम" }, ...items];
  return (
    <nav aria-label="पन्ने का रास्ता" className="print:hidden">
      <ol className="flex flex-wrap items-center gap-x-1.5 text-[15px] text-muted">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <Fragment key={`${c.labelHi}-${i}`}>
              {i > 0 ? (
                <li aria-hidden="true" className="select-none">
                  ›
                </li>
              ) : null}
              <li>
                {last || !c.href ? (
                  <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-ink" : undefined}>
                    {c.labelHi}
                  </span>
                ) : (
                  <Link href={c.href} className="inline-flex min-h-11 items-center font-semibold text-brand no-underline hover:underline">
                    {c.labelHi}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
