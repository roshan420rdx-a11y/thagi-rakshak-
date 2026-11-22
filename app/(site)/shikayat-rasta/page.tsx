import type { Metadata } from "next";
import Link from "next/link";
import { SourceLine } from "@/components/haq/source-line";
import { ActionLink } from "@/components/ui/action-link";
import { ListenButton } from "@/components/ui/listen-button";
import { Notice } from "@/components/ui/notice";
import { StepCard } from "@/components/ui/step-card";
import { SHIKAYAT_STAGES } from "@/modules/shikayat";
import { pageMeta } from "@/modules/site/meta";

export const metadata: Metadata = pageMeta({
  title: "ठगी की शिकायत: पूरा रास्ता",
  description:
    "ठगी के बाद शिकायत कहाँ और किस क्रम में करें: 1930, cybercrime.gov.in, बैंक, पुलिस और RBI Ombudsman। कब, कैसे, और क्या सँभालें। सब मुफ़्त।",
  path: "/shikayat-rasta",
});

// ठगी की शिकायत का पूरा रास्ता: 1930 → cybercrime.gov.in → बैंक → पुलिस → RBI Ombudsman। offline भी खुलता है।
export default function ShikayatRastaPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-[22px] font-bold leading-snug">ठगी की शिकायत: पूरा रास्ता</h1>
        <ListenButton targetId="shikayat-steps" />
      </div>
      <p>ठगी के बाद शिकायत कई जगह होती है। इसी क्रम में चलें, और हर जगह मिला शिकायत नंबर सँभालें। सब जगह शिकायत मुफ़्त है।</p>
      <ol id="shikayat-steps" className="space-y-3">
        {SHIKAYAT_STAGES.map((s, i) => (
          <StepCard key={s.id} n={i + 1} title={s.titleHi}>
            <p>
              <span className="font-semibold">कब: </span>
              {s.whenHi}
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {s.stepsHi.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p>
              <span className="font-semibold">सँभालें: </span>
              {s.keepHi.join(" · ")}
            </p>
            {s.noteHi ? <Notice tone="warn">{s.noteHi}</Notice> : null}
            {s.actions.length ? (
              <div className="flex flex-wrap gap-2">
                {s.actions.map((a, j) => (
                  <ActionLink key={j} action={a} primary={j === 0 && a.kind === "tel"} />
                ))}
              </div>
            ) : null}
            {[...new Map(s.sources.map((src) => [src.paragraph, src])).values()].map((src) => (
              <SourceLine key={src.paragraph} source={src} verifiedBy={["claude"]} />
            ))}
          </StepCard>
        ))}
      </ol>
      <Notice tone="info">यह जानकारी RBI और सरकारी portal के नियमों पर है, कानूनी सलाह नहीं। नियम बदल सकते हैं; हर पन्ने पर मूल text का link है।</Notice>
      <p>
        <Link href="/turant" className="inline-flex min-h-12 items-center font-semibold text-brand">
          ठगी अभी हुई है? पहले 60 मिनट के कदम →
        </Link>
      </p>
    </div>
  );
}
