import type { Metadata } from "next";
import { TurantSteps } from "@/components/turant/turant-steps";
import { TURANT_SLUGS, getTurantPage } from "@/modules/scams";
import Link from "next/link";

export const metadata: Metadata = { title: "ठगी हो गई? अभी क्या करें — ठगी रक्षक" };

export default function TurantIndex() {
  const types = TURANT_SLUGS.filter((s) => s !== "pata-nahi");
  return (
    <>
      <h1 className="text-[22px] font-bold leading-snug">घबराइए नहीं। क्या हुआ?</h1>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {types.map((slug) => (
          <li key={slug}>
            <Link
              href={`/turant/${slug}`}
              className="flex min-h-12 items-center rounded-xl border border-line bg-paper px-4 py-2 font-semibold text-ink no-underline"
            >
              {getTurantPage(slug).titleHi}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-6 mb-3 text-[19px] font-bold">पता नहीं? ये काम अभी करें</h2>
      <TurantSteps page={getTurantPage("pata-nahi")} />
    </>
  );
}
