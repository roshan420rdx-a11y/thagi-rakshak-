"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { CopyBlock } from "@/components/ui/copy-block";
import { Notice } from "@/components/ui/notice";
import {
  CASE_KEY,
  MAX_NUMBER_CHARS,
  STAGE_IDS,
  caseDeadlines,
  caseIcs,
  caseSummaryText,
  cleanNumber,
  emptyCase,
  nextStage,
  parseCase,
  serializeCase,
  type LocalCase,
} from "@/modules/case";
import { parseRupees } from "@/modules/haq/money";
import { formatHindiDate, todayInKolkata } from "@/modules/rules-engine";
import { SHIKAYAT_STAGES, type ShikayatStageId } from "@/modules/shikayat";

// "मेरा केस" फ़ोन के अंदर (plan B0)। सब कुछ सिर्फ़ इसी browser के localStorage में: कोई network, कोई server नहीं।
// mount से पहले कुछ नहीं (server पर कोई data नहीं होता)।
const INPUT = "min-h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-[18px] text-ink";
const TITLE: Record<ShikayatStageId, string> = Object.fromEntries(SHIKAYAT_STAGES.map((s) => [s.id, s.titleHi])) as Record<ShikayatStageId, string>;

function load(today: string): LocalCase {
  try {
    return parseCase(window.localStorage.getItem(CASE_KEY), today);
  } catch {
    return emptyCase(); // private mode या रोकी गई storage
  }
}

export function MeraCase() {
  const [today, setToday] = useState("");
  const [c, setC] = useState<LocalCase | null>(null);
  const [amountText, setAmountText] = useState("");
  const [backText, setBackText] = useState("");
  const [status, setStatus] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const t = todayInKolkata(new Date());
    const loaded = load(t);
    setToday(t);
    setC(loaded);
    setAmountText(loaded.amount ? String(loaded.amount) : "");
    setBackText(loaded.recovered ? String(loaded.recovered) : "");
  }, []);

  if (!c) return null;

  function save(next: LocalCase) {
    setC(next);
    try {
      window.localStorage.setItem(CASE_KEY, serializeCase(next));
      setStatus("फ़ोन में सेव हो गया");
    } catch {
      setStatus("इस browser में सेव नहीं हो पाया (private mode?)। जानकारी काग़ज़ पर भी लिख लें।");
    }
  }

  function setStage(id: ShikayatStageId, patch: Partial<{ on: string | null; number: string }>) {
    save({ ...c!, stages: { ...c!.stages, [id]: { ...c!.stages[id], ...patch } } });
  }

  function wipe() {
    try {
      window.localStorage.removeItem(CASE_KEY);
    } catch {
      // storage बंद हो तो भी नीचे वाला ख़ाली केस दिखेगा
    }
    setC(emptyCase());
    setAmountText("");
    setBackText("");
    setConfirming(false);
    setStatus("सब मिटा दिया गया");
  }

  const next = nextStage(c);
  const deadlines = caseDeadlines(c, today);

  // तारीख़ें phone के calendar के लिए .ics file में (फ़ोन में ही बनती है, कहीं भेजी नहीं जाती)
  function downloadCalendar() {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const url = URL.createObjectURL(new Blob([caseIcs(deadlines, stamp)], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "thagi-rakshak-tareekhen.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("calendar वाली file बन गई; खोलकर अपने calendar में जोड़ें");
  }

  return (
    <div className="space-y-5">
      <Notice tone="info">
        यह सब सिर्फ़ इसी फ़ोन (इस browser) में सेव होता है, हमारे पास कुछ नहीं आता। फ़ोन किसी और के साथ साझा हो, तो काम के बाद नीचे
        &quot;सब मिटाएँ&quot; दबाएँ। नाम, खाता नंबर, OTP या PIN यहाँ न लिखें।
      </Notice>

      {next ? (
        <section aria-labelledby="case-next" className="space-y-2 rounded-xl border-2 border-danger bg-danger-bg p-3">
          <h2 id="case-next" className="text-[17px] font-bold text-danger">
            अगला कदम: {TITLE[next]}
          </h2>
          <div className="flex flex-wrap gap-2">
            {next === "call_1930" ? <ActionLink action={{ kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" }} primary /> : null}
            <Link href="/shikayat-rasta" className="inline-flex min-h-12 items-center rounded-[10px] border border-line bg-paper px-4 font-semibold text-brand no-underline">
              कैसे करें, देखें
            </Link>
          </div>
        </section>
      ) : (
        <Notice tone="info">पाँचों जगह शिकायत दर्ज है। हर जगह का शिकायत नंबर सँभालकर रखें, और जवाबों पर नज़र रखें।</Notice>
      )}

      <section aria-labelledby="case-thagi" className="space-y-3 rounded-xl border border-line bg-paper p-3">
        <h2 id="case-thagi" className="text-[19px] font-bold">
          ठगी
        </h2>
        <label className="block space-y-1">
          <span className="block font-semibold">ठगी किस तारीख़ को हुई?</span>
          <input type="date" max={today} value={c.txnDate ?? ""} onChange={(e) => save({ ...c, txnDate: e.target.value || null })} className={INPUT} />
        </label>
        <label className="block space-y-1">
          <span className="block font-semibold">कुल कितने पैसे गए? (₹)</span>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amountText}
            onChange={(e) => {
              setAmountText(e.target.value);
              const v = parseRupees(e.target.value);
              save({ ...c, amount: v && v > 0 ? v : null });
            }}
            className={INPUT}
          />
        </label>
        <label className="block space-y-1">
          <span className="block font-semibold">अब तक कितने वापस मिले? (₹)</span>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={backText}
            onChange={(e) => {
              setBackText(e.target.value);
              save({ ...c, recovered: parseRupees(e.target.value) });
            }}
            className={INPUT}
          />
        </label>
      </section>

      <section aria-labelledby="case-stages" className="space-y-3">
        <h2 id="case-stages" className="text-[19px] font-bold">
          मेरी शिकायतें
        </h2>
        <ol className="space-y-3">
          {STAGE_IDS.map((id, i) => {
            const s = c.stages[id];
            return (
              <li key={id} data-stage={id} className="space-y-2 rounded-xl border border-line bg-paper p-3">
                <h3 className="text-[17px] font-bold leading-snug">
                  {i + 1}. {TITLE[id]} {s.on ? <span className="text-safe">✓ हो गया</span> : null}
                </h3>
                <label className="block space-y-1">
                  <span className="block font-semibold">कब की?</span>
                  <input type="date" max={today} value={s.on ?? ""} onChange={(e) => setStage(id, { on: e.target.value || null })} className={INPUT} />
                </label>
                <label className="block space-y-1">
                  <span className="block font-semibold">शिकायत नंबर (हो तो)</span>
                  <input
                    type="text"
                    autoComplete="off"
                    maxLength={MAX_NUMBER_CHARS}
                    value={s.number}
                    onChange={(e) => setStage(id, { number: cleanNumber(e.target.value) })}
                    className={INPUT}
                  />
                </label>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="case-dates" className="space-y-2 rounded-xl border border-line bg-paper p-3">
        <h2 id="case-dates" className="text-[19px] font-bold">
          आगे की तारीख़ें (RBI के नियमों से)
        </h2>
        {deadlines.length ? (
          <ul className="space-y-2">
            {deadlines.map((d) => (
              <li key={`${d.labelHi}|${d.date}`} className="rounded-lg bg-warn-bg p-2 font-semibold text-warn">
                {d.labelHi}: {formatHindiDate(d.date)}
                {d.status === "likely" ? " (अनुमान)" : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>ठगी की तारीख़ और रकम भरें, तो RBI के नियमों से तारीख़ें यहाँ दिखेंगी।</p>
        )}
        {deadlines.length ? (
          <button
            type="button"
            onClick={downloadCalendar}
            className="inline-flex min-h-12 items-center rounded-[10px] border border-line bg-paper px-4 font-semibold text-brand"
          >
            फ़ोन के calendar में जोड़ें
          </button>
        ) : null}
        <Link href="/haq/thagi" className="flex min-h-12 items-center font-semibold text-brand">
          पूरा हिसाब: अपना हक़ देखें →
        </Link>
      </section>

      <details className="rounded-xl border border-line bg-paper p-3">
        <summary className="flex min-h-12 cursor-pointer items-center text-[17px] font-bold text-brand">मेरे केस का सार (copy करें)</summary>
        <p className="mb-2 text-[14px] text-muted">बैंक या थाने में दिखाने या भेजने के लिए। इसमें सिर्फ़ वही है जो आपने ऊपर भरा है।</p>
        <CopyBlock text={caseSummaryText(c, today)} label="मेरे केस का सार" />
      </details>

      <p aria-live="polite" className="text-[15px] text-muted">
        {status}
      </p>

      <section aria-labelledby="case-wipe" className="space-y-2">
        <h2 id="case-wipe" className="sr-only">
          सब मिटाएँ
        </h2>
        {confirming ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={wipe} className="min-h-12 rounded-[10px] bg-danger px-4 font-bold text-on-danger">
              हाँ, सब मिटाएँ
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="min-h-12 rounded-[10px] border border-line bg-paper px-4 font-semibold text-ink">
              रहने दें
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="min-h-12 rounded-[10px] border border-danger bg-paper px-4 font-semibold text-danger">
            सब मिटाएँ
          </button>
        )}
      </section>
    </div>
  );
}
