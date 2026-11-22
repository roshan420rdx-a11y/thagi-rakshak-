import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import { notFound } from "next/navigation";
import { BankChannelView } from "@/components/banks/bank-channel";
import { BankTips } from "@/components/banks/bank-tips";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert } from "@/components/ui/icons";
import { Notice } from "@/components/ui/notice";
import { BANKS, getBank, liveChannels, liveSite } from "@/modules/banks";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return BANKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = getBank((await params).slug);
  return b
    ? pageMeta({
        title: `${b.nameHi}: ठगी कैसे बताएँ`,
        description: `${b.nameHi} के खाते से ठगी हुई? बैंक को ठगी बताने का सही रास्ता, असली वेबसाइट (.bank.in) पहचानना, और पहले 30 मिनट में क्या करें।`,
        path: `/gyan/bank/${b.slug}`,
      })
    : {};
}

export default async function BankPage({ params }: Props) {
  const b = getBank((await params).slug);
  if (!b) notFound();
  const channels = liveChannels(b);
  const site = liveSite(b);

  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">{b.nameHi}: ठगी कैसे बताएँ</h1>

      {channels.length > 0 ? (
        <section className="space-y-2 rounded-xl border border-line bg-paper p-3">
          <h2 className="text-[19px] font-bold">बैंक के आधिकारिक रास्ते</h2>
          {channels.map((c) => (
            <BankChannelView key={`${c.kind}-${c.value}`} channel={c} />
          ))}
        </section>
      ) : (
        <Notice tone="info">
          इस बैंक के फ़ोन नंबर अभी जाँच में हैं। तब तक: debit card के पीछे, passbook में, या बैंक के ऐप में लिखा नंबर ही लगाएँ।
        </Notice>
      )}

      {site ? (
        <p>
          बैंक की असली वेबसाइट:{" "}
          <a href={site} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand">
            {new URL(site).hostname}
          </a>
        </p>
      ) : null}

      <Notice tone="warn">नंबर Google पर न खोजें। नकली &quot;customer care&quot; नंबर ठगी का बड़ा जाल हैं।</Notice>
      <BankTips />
      <BigDoor href="/turant" title="पैसे जा चुके हैं?" subtitle="पहले 60 मिनट में क्या करें" tone="danger" icon={<IconAlert className="h-8 w-8" />} />
    </div>
  );
}
