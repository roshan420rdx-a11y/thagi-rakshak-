import type { Metadata } from "next";
import Link from "next/link";
import { SourceLine } from "@/components/haq/source-line";
import { ActionLink } from "@/components/ui/action-link";
import { CopyBlock } from "@/components/ui/copy-block";
import { ListenButton } from "@/components/ui/listen-button";
import { Notice } from "@/components/ui/notice";
import { StepCard } from "@/components/ui/step-card";
import { BANK_EMAIL_SAMPLES, SHIKAYAT_STAGES } from "@/modules/shikayat";
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
        <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">ठगी की शिकायत: पूरा रास्ता</h1>
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
            {s.id === "bank"
              ? BANK_EMAIL_SAMPLES.map((m) => (
                  <details key={m.lang} className="rounded-[10px] border border-line bg-paper p-2">
                    <summary className="flex min-h-12 cursor-pointer items-center font-semibold text-brand">{m.labelHi}</summary>
                    <p className="mb-2 text-[14px] text-muted">[ ] वाली जगहें अपनी जानकारी से भरें। पूरा खाता या card नंबर, OTP, PIN कभी न लिखें।</p>
                    <CopyBlock text={m.text} label={m.labelHi} />
                  </details>
                ))
              : null}
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
      <section aria-labelledby="bina-nuksan" className="space-y-2 rounded-xl border border-line bg-paper p-3">
        <h2 id="bina-nuksan" className="text-[19px] font-bold leading-snug">
          पैसे नहीं गए, बस ठगी का call या SMS आया?
        </h2>
        <p>
          उस नंबर की शिकायत दूरसंचार विभाग (DoT) की Sanchar Saathi साइट पर &quot;चक्षु&quot; में करें, ताकि वह नंबर जाँचा और बंद किया
          जा सके। ठग का नंबर, तारीख़-समय और message का screenshot काम आते हैं।
        </p>
        <p>वहीं यह भी देख सकते हैं कि आपके नाम पर कौन-कौन से mobile नंबर चल रहे हैं; जो आपका नहीं, उसकी शिकायत करें।</p>
        <ActionLink action={{ kind: "link", href: "https://sancharsaathi.gov.in", labelHi: "sancharsaathi.gov.in खोलें", external: true }} />
      </section>
      <Notice tone="info">यह जानकारी RBI और सरकारी portal के नियमों पर है, कानूनी सलाह नहीं। नियम बदल सकते हैं; हर पन्ने पर मूल text का link है।</Notice>
      <p>
        <Link href="/turant" className="inline-flex min-h-12 items-center font-semibold text-brand">
          ठगी अभी हुई है? पहले 60 मिनट के कदम →
        </Link>
      </p>
    </div>
  );
}
