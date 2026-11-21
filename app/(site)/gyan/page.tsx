import type { Metadata } from "next";
import Link from "next/link";
import { GYAN_PAGES } from "@/modules/gyan";

export const metadata: Metadata = {
  title: "ठगी का ज्ञानकोश — ठगी रक्षक",
  description: "डिजिटल ठगी के आम प्रकार: कैसे होती है, कैसे पहचानें, कैसे बचें, और हो जाए तो क्या करें। आसान हिंदी में, मुफ़्त।",
};

const TOOLS = [
  { href: "/turant", label: "ठगी हो गई: पहले 60 मिनट में क्या करें" },
  { href: "/haq/thagi", label: "आपका हक़: पूरा पैसा वापस या मुआवज़ा?" },
  { href: "/haq/frozen-money", label: "ठग के खाते में पैसा रुका: वापस कैसे माँगें" },
  { href: "/gyan/bank", label: "अपने बैंक को ठगी कैसे बताएँ" },
  { href: "/pucho", label: "ठगी के 7 आम निशान" },
] as const;

export default function GyanIndexPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">ठगी का ज्ञानकोश</h1>
      <p>ठगी कैसे होती है, कैसे पहचानें, और हो जाए तो क्या करें। आसान भाषा में।</p>
      <ul className="space-y-3">
        {GYAN_PAGES.map((p) => (
          <li key={p.slug}>
            <Link href={`/gyan/${p.slug}`} className="block min-h-12 rounded-xl border border-line bg-paper p-3 text-ink no-underline">
              <span className="block text-[17px] font-bold text-brand">{p.navTitleHi} →</span>
              <span className="block text-[15px]">{p.summaryHi[0]}</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-[19px] font-bold">काम के रास्ते</h2>
      <ul className="space-y-2">
        {TOOLS.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="flex min-h-12 items-center font-semibold text-brand">
              {t.label} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
