import Link from "next/link";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert } from "@/components/ui/icons";
import { ListenButton } from "@/components/ui/listen-button";
import type { GyanPage } from "@/modules/gyan";
import { formatHindiDate } from "@/modules/rules-engine";

const H2 = "text-[19px] font-bold";

// ज्ञानकोश का एक पन्ना (spec भाग 2, खंड 10 का क्रम)
export function GyanArticle({ page: p }: { page: GyanPage }) {
  return (
    <article className="space-y-5">
      <h1 className="text-[22px] font-bold leading-snug">{p.titleHi}</h1>
      {/* सुनें: सार, निशान और नियम (पूरा पन्ना बहुत लंबा हो जाता) */}
      <ListenButton targetId={["gyan-summary", "gyan-signs", "gyan-rules"]} />

      <section id="gyan-summary" className="space-y-1 rounded-xl bg-brand-bg p-3 text-brand">
        <h2 className="font-bold">30 सेकंड में</h2>
        {p.summaryHi.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>

      {p.turantSlug ? (
        <BigDoor href={`/turant/${p.turantSlug}`} title="हो गया है?" subtitle="अभी क्या करें, देखें" tone="danger" icon={<IconAlert className="h-8 w-8" />} />
      ) : null}

      <section className="space-y-2">
        <h2 className={H2}>यह ठगी कैसे होती है</h2>
        <ol className="list-decimal space-y-1 pl-6">
          {p.howHi.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section id="gyan-signs" className="space-y-2">
        <h2 className={H2}>पहचान के 5 निशान</h2>
        <ul className="space-y-2">
          {p.signsHi.map((s) => (
            <li key={s} data-sign className="flex gap-2 rounded-xl border border-line bg-paper p-3">
              <span aria-hidden="true" className="shrink-0 font-bold text-danger">
                !
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className={H2}>ऐसे message आते हैं</h2>
        {p.examplesHi.map((e) => (
          <figure key={e} className="rounded-xl border-2 border-dashed border-warn bg-warn-bg p-3">
            <figcaption className="text-[14px] font-bold text-warn">ठग का message (उदाहरण)</figcaption>
            <blockquote className="mt-1">{e}</blockquote>
          </figure>
        ))}
      </section>

      <section id="gyan-rules" className="space-y-2">
        <h2 className={H2}>बचने के 3 नियम</h2>
        <ol className="space-y-2">
          {p.rulesHi.map((r, i) => (
            <li key={r} data-rule className="flex gap-2 rounded-xl bg-safe-bg p-3 text-safe">
              <span className="shrink-0 font-bold">{i + 1}.</span>
              <span className="font-semibold">{r}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className={H2}>अक्सर पूछे सवाल</h2>
        {p.faq.map((f) => (
          <details key={f.qHi} className="rounded-xl border border-line bg-paper p-3">
            <summary className="min-h-12 cursor-pointer font-semibold">{f.qHi}</summary>
            <div className="mt-2 space-y-1">
              <p>{f.aHi}</p>
              {f.link ? (
                <Link href={f.link.href} className="inline-flex min-h-12 items-center font-semibold text-brand">
                  {f.link.labelHi}
                </Link>
              ) : null}
              {f.source ? <p className="text-[13px] text-muted">RBI: {f.source.paragraph}</p> : null}
            </div>
          </details>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className={H2}>आपका हक़</h2>
        <p>
          ठगी में पैसे गए हों, तो RBI के नियमों से जानें कि पूरा पैसा वापस या मुआवज़ा बनता है या नहीं।{" "}
          <Link href="/haq/thagi" className="font-semibold text-brand">
            हिसाब देखें →
          </Link>
        </p>
      </section>

      <p className="text-[13px] text-muted">
        लिखा: {p.author} · {p.reviewer ? `जाँचा: ${p.reviewer.nameHi} (${p.reviewer.roleHi})` : "विशेषज्ञ (वकील या बैंक अधिकारी) की जाँच: अभी बाकी"} ·
        आख़िरी बार जाँचा: {formatHindiDate(p.lastCheckedOn)}
      </p>
    </article>
  );
}
