import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";
import { BankArziLink } from "@/components/banks/arzi-link";
import { BankTips } from "@/components/banks/bank-tips";
import { Notice } from "@/components/ui/notice";
import { BANKS } from "@/modules/banks";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = pageMeta({
  title: "अपने बैंक को ठगी कैसे बताएँ",
  description:
    "10 बड़े बैंकों को ठगी बताने का सही रास्ता, और बैंक की असली वेबसाइट (.bank.in) पहचानने का तरीका। Google पर मिले नंबर से बचें।",
  path: "/gyan/bank",
});

export default function BankIndexPage() {
  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ href: "/gyan", labelHi: "ज्ञानकोश" }, { labelHi: "अपना बैंक" }]} />
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">अपने बैंक को ठगी कैसे बताएँ</h1>
      <Notice tone="warn">नंबर Google पर न खोजें। नकली &quot;customer care&quot; नंबर ठगी का बड़ा जाल हैं।</Notice>
      <BankTips />
      <BankArziLink />
      <h2 className="text-[19px] font-bold">अपना बैंक चुनें</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {BANKS.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/gyan/bank/${b.slug}`}
              className="flex min-h-12 items-center rounded-xl border border-line bg-paper px-4 py-2 font-semibold text-ink no-underline transition-colors hover:border-brand"
            >
              {b.nameHi}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
