import type { Metadata } from "next";
import { SiteHit, SiteSearch } from "@/components/site/site-search";
import { pageMeta } from "@/modules/site/meta";
import { buildSiteIndex, type SiteHitKind } from "@/modules/site/search";

export const metadata: Metadata = pageMeta({
  title: "पूरी साइट में खोजें",
  description: "ज़रूरी नंबर, ठगी के बाद के कदम, अर्ज़ियाँ, आपका हक़, ज्ञानकोश और बैंक: एक जगह से खोजें। खोज आपके फ़ोन में ही होती है।",
  path: "/khoj",
});

const GROUPS: readonly { kind: SiteHitKind; titleHi: string }[] = [
  { kind: "tel", titleHi: "ज़रूरी नंबर (दबाते ही call)" },
  { kind: "turant", titleHi: "ठगी हो गई: अभी क्या करें" },
  { kind: "tool", titleHi: "काम के औज़ार" },
  { kind: "gyan", titleHi: "ज्ञानकोश: ठगी के तरीके" },
  { kind: "bank", titleHi: "अपने बैंक को ठगी कैसे बताएँ" },
];

// खोज (plan A2f): ऊपर खोज का डिब्बा, नीचे सब कुछ एक जगह (बिना JS के भी काम आता है)
export default function KhojPage() {
  const index = buildSiteIndex();
  return (
    <div className="space-y-5">
      <h1 className="text-[22px] font-bold leading-snug md:text-[28px]">पूरी साइट में खोजें</h1>
      <SiteSearch index={index} autoFocus />
      <p className="text-[15px] text-muted">खोज आपके फ़ोन में ही होती है; जो लिखते हैं, वह कहीं नहीं भेजा जाता।</p>
      {GROUPS.map((g) => (
        <section key={g.kind} aria-labelledby={`khoj-${g.kind}`} className="space-y-2">
          <h2 id={`khoj-${g.kind}`} className="text-[19px] font-bold">
            {g.titleHi}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {index
              .filter((e) => e.kind === g.kind)
              .map((e) => (
                <li key={e.href}>
                  <SiteHit e={e} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
