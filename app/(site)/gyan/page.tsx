import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";
import { GyanSearch } from "@/components/gyan/gyan-search";
import { GYAN_GROUPS, GYAN_PAGES, getGyanPage } from "@/modules/gyan";
import { buildSearchIndex } from "@/modules/gyan/search";
import { SCAM_SIGNS } from "@/modules/site";

export const metadata: Metadata = pageMeta({
  title: "ठगी का ज्ञानकोश",
  description:
    "डिजिटल ठगी के आम प्रकार: कैसे होती है, कैसे पहचानें, कैसे बचें, और हो जाए तो क्या करें। आसान हिंदी में, मुफ़्त।",
  path: "/gyan",
});

const TOOLS = [
  { href: "/turant", label: "ठगी हो गई: पहले 60 मिनट में क्या करें" },
  { href: "/haq/thagi", label: "आपका हक़: पूरा पैसा वापस या मुआवज़ा?" },
  { href: "/haq/frozen-money", label: "ठग के खाते में पैसा रुका: वापस कैसे माँगें" },
  { href: "/shikayat-rasta", label: "शिकायत का पूरा रास्ता: 1930 से RBI Ombudsman तक" },
  { href: "/gyan/bank", label: "अपने बैंक को ठगी कैसे बताएँ" },
  { href: "/pucho", label: `message जाँचें और ठगी के ${SCAM_SIGNS.length} आम निशान` },
  { href: "/abhyas", label: "ख़ुद को परखें: ठगी या असली? (अभ्यास)" },
] as const;

export default function GyanIndexPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">ठगी का ज्ञानकोश</h1>
      <p>ठगी कैसे होती है, कैसे पहचानें, और हो जाए तो क्या करें। आसान भाषा में।</p>
      <Link
        href="/abhyas"
        className="flex min-h-12 items-center rounded-xl border-2 border-brand bg-brand-bg px-4 py-2 font-bold text-brand no-underline"
      >
        ख़ुद को परखें: ठगी या असली? (8 message, 2 मिनट) →
      </Link>
      {/* plan A2e: लिखते ही पन्ने छँटें; बिना JS के यही पूरी सूची */}
      <GyanSearch index={buildSearchIndex(GYAN_PAGES)}>
        {GYAN_GROUPS.map((g) => (
          <section key={g.titleHi} className="space-y-2">
            <h2 className="text-[19px] font-bold">{g.titleHi}</h2>
            <ul className="space-y-3">
              {g.slugs.map((slug) => {
                const p = getGyanPage(slug)!;
                return (
                  <li key={slug}>
                    <Link href={`/gyan/${slug}`} className="block min-h-12 rounded-xl border border-line bg-paper p-3 text-ink no-underline transition-colors hover:border-brand">
                      <span className="block text-[17px] font-bold text-brand">{p.navTitleHi} →</span>
                      <span className="block text-[15px]">{p.summaryHi[0]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </GyanSearch>
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
