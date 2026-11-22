import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";
import { BankTips } from "@/components/banks/bank-tips";
import { Notice } from "@/components/ui/notice";
import { BANKS } from "@/modules/banks";

export const metadata: Metadata = pageMeta({
  title: "अपने बैंक को ठगी कैसे बताएँ",
  description:
    "10 बड़े बैंकों को ठगी बताने का सही रास्ता, और बैंक की असली वेबसाइट (.bank.in) पहचानने का तरीका। Google पर मिले नंबर से बचें।",
  path: "/gyan/bank",
});

export default function BankIndexPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">अपने बैंक को ठगी कैसे बताएँ</h1>
      <Notice tone="warn">नंबर Google पर न खोजें। नकली &quot;customer care&quot; नंबर ठगी का बड़ा जाल हैं।</Notice>
      <BankTips />
      <h2 className="text-[19px] font-bold">अपना बैंक चुनें</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {BANKS.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/gyan/bank/${b.slug}`}
              className="flex min-h-12 items-center rounded-xl border border-line bg-paper px-4 py-2 font-semibold text-ink no-underline"
            >
              {b.nameHi}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
