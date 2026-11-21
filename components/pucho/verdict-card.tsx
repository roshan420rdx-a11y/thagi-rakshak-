import type { CheckResult } from "@/modules/checker";
import { CHECK_LIMIT_HI, LEVEL_COPY, verdictShareText, whatsappShareLink } from "@/modules/checker/share";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert, IconInfo } from "@/components/ui/icons";

// जाँच का नतीजा। मतलब सिर्फ़ रंग से नहीं: हर स्तर का icon और शब्द।
const LOOK = {
  danger: "border-danger bg-danger-bg text-danger",
  warn: "border-warn bg-warn-bg text-warn",
  no_signals: "border-line bg-brand-bg text-brand",
} as const;

export function VerdictCard({ result, pageUrl }: { result: CheckResult; pageUrl: string }) {
  const copy = LEVEL_COPY[result.level];
  const Icon = result.level === "no_signals" ? IconInfo : IconAlert;
  const turant = result.level === "danger" ? (result.hits.find((h) => h.level === "danger" && h.turant)?.turant ?? "pata-nahi") : null;

  return (
    <section aria-label="जाँच का नतीजा" className="space-y-3">
      <div className={`rounded-[12px] border-2 p-3 ${LOOK[result.level]}`}>
        <h2 className="flex items-center gap-2 text-[20px] font-bold leading-snug">
          <Icon className="h-6 w-6 shrink-0" />
          {copy.emoji ? <span aria-hidden="true">{copy.emoji}</span> : null}
          <span>{copy.titleHi}</span>
        </h2>
        <p className="mt-1 font-semibold">{copy.bodyHi}</p>
      </div>

      {result.hits.length ? (
        <ul className="space-y-2" aria-label="क्यों">
          {result.hits.map((h) => (
            <li key={h.id} className="rounded-xl border border-line bg-paper p-3">
              <h3 className="text-[17px] font-bold leading-snug">{h.labelHi}</h3>
              <p className="mt-1">{h.explainHi}</p>
              {h.gyan ? (
                <a href={`/gyan/${h.gyan}`} className="mt-1 flex min-h-12 items-center font-semibold text-brand">
                  इस ठगी के बारे में पढ़ें →
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {turant ? (
        <BigDoor
          href={`/turant/${turant}`}
          title="पैसे जा चुके हैं?"
          subtitle="अभी क्या करें"
          tone="danger"
          icon={<IconAlert className="h-8 w-8" />}
        />
      ) : null}

      {result.level !== "no_signals" ? (
        <a
          href={whatsappShareLink(verdictShareText(result, pageUrl))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center rounded-[10px] border border-line bg-paper px-4 py-2 font-semibold text-ink no-underline"
        >
          परिवार को भेजें (WhatsApp)
        </a>
      ) : null}

      <p className="text-[15px] text-muted">{CHECK_LIMIT_HI}</p>
    </section>
  );
}
