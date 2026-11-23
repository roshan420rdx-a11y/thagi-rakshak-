"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ListenButton } from "@/components/ui/listen-button";
import { ABHYAS_ITEMS, judge, pickRound, scoreMessage, type AbhyasItem } from "@/modules/abhyas";
import { whatsappShareLink } from "@/modules/checker/share";

// "ठगी या असली?" अभ्यास (plan A3f)। सब इसी फ़ोन में: कुछ सेव नहीं, कुछ भेजा नहीं।
// round random है, इसलिए server पर कुछ नहीं बनता (mount के बाद ही; बिना JS के पन्ना साफ़ संदेश दिखाता है)।
const BTN = "min-h-12 rounded-[10px] px-4 font-bold";

export function AbhyasQuiz({ pageUrl }: { pageUrl: string }) {
  const [round, setRound] = useState<AbhyasItem[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [said, setSaid] = useState<boolean[]>([]);
  const focusRef = useRef<HTMLHeadingElement>(null);
  const touched = useRef(false); // पहली बार पन्ना खुलने पर focus न छीनें

  useEffect(() => setRound(pickRound(ABHYAS_ITEMS)), []);
  useEffect(() => {
    if (touched.current) focusRef.current?.focus();
  }, [idx, said.length]);

  if (!round) return null;

  const total = round.length;
  const restart = () => {
    touched.current = true;
    setRound(pickRound(ABHYAS_ITEMS));
    setIdx(0);
    setSaid([]);
  };

  if (idx >= total) {
    const right = round.filter((item, i) => said[i] === item.scam).length;
    const missed = round.map((item, i) => ({ item, said: said[i] })).filter((x) => x.said !== x.item.scam);
    const share = whatsappShareLink(`मैंने ठगी पहचानने के अभ्यास में ${total} में से ${right} सही किए। आप भी करें (मुफ़्त, 2 मिनट): ${pageUrl}`);
    return (
      <section aria-labelledby="abhyas-done" className="space-y-4">
        <div className="space-y-2 rounded-xl border-2 border-brand bg-brand-bg p-3">
          <h2 id="abhyas-done" ref={focusRef} tabIndex={-1} className="text-[22px] font-bold leading-snug">
            आपने {total} में से {right} पहचाने
          </h2>
          <p>{scoreMessage(right, total)}</p>
        </div>

        {missed.length ? (
          <div className="space-y-2">
            <h3 className="text-[19px] font-bold">जो छूट गए</h3>
            <ul className="space-y-2">
              {missed.map(({ item }) => (
                <li key={item.id} data-missed className="space-y-1 rounded-xl border border-line bg-paper p-3">
                  <p className="text-[15px] text-muted">{item.channelHi}</p>
                  <p>&ldquo;{item.text}&rdquo;</p>
                  <p className={`font-bold ${item.scam ? "text-danger" : "text-safe"}`}>{item.scam ? "यह ठगी थी।" : "यह असली था।"}</p>
                  <p>{item.whyHi}</p>
                  {item.gyan ? (
                    <Link href={`/gyan/${item.gyan}`} className="inline-flex min-h-12 items-center font-semibold text-brand">
                      इस ठगी के बारे में और पढ़ें →
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-2 rounded-xl border border-line bg-paper p-3">
          <h3 className="text-[19px] font-bold">3 बातें हमेशा याद रखें</h3>
          <ol className="list-decimal space-y-1 pl-6">
            <li>OTP, PIN या password कभी किसी को न बताएँ, बैंक या पुलिस को भी नहीं।</li>
            <li>पैसे पाने के लिए कभी PIN डालना या QR scan करना नहीं पड़ता।</li>
            <li>पैसे चले जाएँ, तो तुरंत 1930 पर call करें।</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={restart} className={`${BTN} bg-brand text-paper`}>
            फिर से अभ्यास करें (नए message)
          </button>
          <a href={share} target="_blank" rel="noopener noreferrer" className={`${BTN} inline-flex items-center bg-safe text-on-safe no-underline`}>
            परिवार को भेजें (WhatsApp)
          </a>
        </div>
      </section>
    );
  }

  const item = round[idx];
  const answered = said.length > idx;
  const v = answered ? judge(item, said[idx]) : null;

  return (
    <section aria-labelledby="abhyas-q-title" className="space-y-3">
      <div className="space-y-1">
        <p className="text-[15px] font-semibold text-muted">
          सवाल {idx + 1} / {total}
        </p>
        <div className="h-2 rounded-full bg-line" aria-hidden="true">
          <div className="h-2 rounded-full bg-brand" style={{ width: `${((idx + (answered ? 1 : 0)) / total) * 100}%` }} />
        </div>
      </div>
      <h2 id="abhyas-q-title" ref={answered ? undefined : focusRef} tabIndex={-1} className="text-[19px] font-bold leading-snug">
        यह ठगी है, या असली?
      </h2>
      <figure id="abhyas-q" data-scam={String(item.scam)} className="space-y-2 rounded-xl border border-line bg-paper p-3">
        <figcaption className="text-[15px] font-semibold text-muted">{item.channelHi}</figcaption>
        <blockquote className="rounded-lg bg-surface p-3 text-[17px] leading-relaxed text-ink">{item.text}</blockquote>
      </figure>
      <ListenButton targetId="abhyas-q" />

      {!v ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              touched.current = true;
              setSaid([...said, true]);
            }}
            className={`${BTN} min-h-14 border-2 border-danger bg-paper text-danger`}
          >
            ठगी है
          </button>
          <button
            type="button"
            onClick={() => {
              touched.current = true;
              setSaid([...said, false]);
            }}
            className={`${BTN} min-h-14 border-2 border-safe bg-paper text-safe`}
          >
            असली लगता है
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div id="abhyas-fb-box" className={`space-y-2 rounded-xl border-2 p-3 ${v.correct ? "border-safe bg-safe-bg" : "border-warn bg-warn-bg"}`}>
            <h3 id="abhyas-feedback" ref={focusRef} tabIndex={-1} className={`text-[19px] font-bold leading-snug ${v.correct ? "text-safe" : "text-warn"}`}>
              {v.titleHi}
            </h3>
            {!v.correct && item.scam ? <p className="text-ink">कोई बात नहीं: ठग ऐसे message असली जैसे बनाते हैं।</p> : null}
            {v.signsHi.length ? (
              <div className="text-ink">
                <p className="font-semibold">पहचान के निशान:</p>
                <ul className="list-disc space-y-1 pl-6">
                  {v.signsHi.map((s) => (
                    <li key={s} data-sign>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="text-ink">{v.whyHi}</p>
          </div>
          <ListenButton targetId="abhyas-fb-box" />
          <button type="button" onClick={() => setIdx(idx + 1)} className={`${BTN} w-full bg-brand text-paper`}>
            {idx + 1 < total ? "अगला सवाल →" : "नतीजा देखें →"}
          </button>
        </div>
      )}
    </section>
  );
}
