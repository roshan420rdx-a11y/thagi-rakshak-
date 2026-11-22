import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";
import { DraftBanner } from "@/components/legal/draft-banner";

export const metadata: Metadata = pageMeta({
  title: "नियम और नीतियाँ",
  description:
    "ठगी रक्षक के नियम और नीतियाँ: निजता (privacy), सेवा की शर्तें, और शिकायत अधिकारी।",
  path: "/legal",
});

const ITEMS = [
  { href: "/legal/privacy", title: "निजता (privacy)", body: "हम कौन-सी जानकारी लेते हैं और कौन-सी नहीं" },
  { href: "/legal/terms", title: "सेवा की शर्तें", body: "यह सेवा क्या है और क्या नहीं" },
  { href: "/legal/shikayat", title: "शिकायत अधिकारी", body: "हमारी सेवा के बारे में शिकायत कहाँ करें" },
] as const;

export default function LegalIndexPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">नियम और नीतियाँ</h1>
      <DraftBanner />
      <ul className="space-y-3">
        {ITEMS.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="block min-h-12 rounded-xl border border-line bg-paper p-3 text-ink no-underline">
              <span className="block text-[17px] font-bold text-brand">{i.title} →</span>
              <span className="block text-[15px]">{i.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
