"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CopyBlock } from "@/components/ui/copy-block";
import { Notice } from "@/components/ui/notice";
import { HOW_OPTIONS, LETTER_KINDS, buildLetter, type LetterInput, type LetterKind } from "@/modules/arzi";
import { CASE_KEY, emptyCase, parseCase, type LocalCase } from "@/modules/case";
import { todayInKolkata } from "@/modules/rules-engine";

// मुफ़्त अर्ज़ियाँ (plan B1)। तारीख़ें और शिकायत नंबर "मेरा केस" (फ़ोन) से; नाम, पता वगैरह सिर्फ़ इसी पन्ने पर,
// कहीं सेव नहीं। print में सिर्फ़ पत्र (#arzi-print) छपता है। कोई network नहीं।
const INPUT = "min-h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-[18px] text-ink";
type Fields = Omit<LetterInput, "case">;
const EMPTY: Fields = { name: "", address: "", mobile: "", bankName: "", branch: "", accountLast4: "", utr: "", suspect: "", what: "", how: "" };

const FIELDS: { key: Exclude<keyof Fields, "how">; label: string; kinds: LetterKind[]; long?: boolean; mode?: "numeric" | "tel" }[] = [
  { key: "name", label: "आपका नाम", kinds: ["bank", "police"] },
  { key: "address", label: "आपका पता", kinds: ["bank", "police"] },
  { key: "mobile", label: "आपका mobile नंबर", kinds: ["bank", "police"], mode: "tel" },
  { key: "bankName", label: "बैंक का नाम", kinds: ["bank", "police", "ombudsman"] },
  { key: "branch", label: "शाखा का नाम", kinds: ["bank", "ombudsman"] },
  { key: "accountLast4", label: "खाते के सिर्फ़ आख़िरी 4 अंक", kinds: ["bank", "police", "ombudsman"], mode: "numeric" },
  { key: "utr", label: "लेन-देन नंबर (UTR)", kinds: ["bank", "police", "ombudsman"] },
  { key: "suspect", label: "ठग का नंबर, UPI ID या link", kinds: ["police"] },
  { key: "what", label: "क्या हुआ, अपने शब्दों में", kinds: ["bank", "police", "ombudsman"], long: true },
];

export function ArziBuilder() {
  const [today, setToday] = useState("");
  const [c, setC] = useState<LocalCase | null>(null);
  const [kind, setKind] = useState<LetterKind>("bank");
  const [f, setF] = useState<Fields>(EMPTY);

  useEffect(() => {
    const t = todayInKolkata(new Date());
    let loaded = emptyCase();
    try {
      loaded = parseCase(window.localStorage.getItem(CASE_KEY), t);
    } catch {
      // storage बंद हो तो ख़ाली केस; पत्र में [ ] ख़ाली जगहें रहेंगी
    }
    setToday(t);
    setC(loaded);
  }, []);

  if (!c) return null;

  const lines = buildLetter(kind, { ...f, case: c }, today);
  const caseEmpty = !c.txnDate && !c.amount;
  const set = (key: Exclude<keyof Fields, "how">, value: string) =>
    setF((old) => ({ ...old, [key]: key === "accountLast4" ? value.replace(/\D/g, "").slice(0, 4) : value.slice(0, key === "what" ? 600 : 120) }));

  return (
    <div className="space-y-4">
      <Notice tone="warn">यह मसौदा है: वकील की जाँच अभी बाकी है। इसमें सिर्फ़ तथ्य और माँग है, कोई क़ानूनी धारा नहीं। भेजने से पहले एक बार पढ़ लें।</Notice>
      <Notice tone="info">नाम, पता और बाकी बातें कहीं सेव नहीं होतीं, पन्ना बंद करते ही मिट जाती हैं। तारीख़ें और शिकायत नंबर &quot;मेरा केस&quot; से आते हैं।</Notice>
      {caseEmpty ? (
        <p>
          पहले{" "}
          <Link href="/case" className="font-semibold text-brand">
            &quot;मेरा केस&quot;
          </Link>{" "}
          में ठगी की तारीख़, रकम और शिकायत नंबर भरें, तो पत्र में अपने-आप आएँगे।
        </p>
      ) : null}

      <fieldset className="space-y-2">
        <legend className="mb-1 text-[17px] font-bold">कौन-सा पत्र?</legend>
        {LETTER_KINDS.map((k) => (
          <label key={k.id} className="flex min-h-12 items-center gap-3 rounded-[10px] border border-line bg-paper px-3 py-2">
            <input type="radio" name="kind" value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} className="h-5 w-5" />
            <span>
              <span className="block font-semibold">{k.labelHi}</span>
              <span className="block text-[14px] text-muted">{k.hintHi}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {/* plan A2d: पत्र सच्चा रहे; न चुनें तो पत्र में [ ] वाली ख़ाली जगह */}
      <fieldset className="space-y-2">
        <legend className="mb-1 text-[17px] font-bold">पैसे कैसे गए?</legend>
        {HOW_OPTIONS.map((o) => (
          <label key={o.id} className="flex min-h-12 items-center gap-3 rounded-[10px] border border-line bg-paper px-3 py-2">
            <input
              type="radio"
              name="how"
              value={o.id}
              checked={f.how === o.id}
              onChange={() => setF((old) => ({ ...old, how: o.id }))}
              className="h-5 w-5 shrink-0"
            />
            <span>{o.labelHi}</span>
          </label>
        ))}
      </fieldset>

      <section aria-labelledby="arzi-fields" className="space-y-3 rounded-xl border border-line bg-paper p-3">
        <h2 id="arzi-fields" className="text-[19px] font-bold">
          अपनी जानकारी (ख़ाली छोड़ें तो पत्र में [ ] रहेगा)
        </h2>
        {FIELDS.filter((x) => x.kinds.includes(kind)).map((x) => (
          <label key={x.key} className="block space-y-1">
            <span className="block font-semibold">{x.label}</span>
            {x.long ? (
              <textarea rows={4} value={f[x.key]} onChange={(e) => set(x.key, e.target.value)} className={`${INPUT} py-2`} />
            ) : (
              <input
                type="text"
                inputMode={x.mode}
                autoComplete="off"
                value={f[x.key]}
                onChange={(e) => set(x.key, e.target.value)}
                className={INPUT}
              />
            )}
          </label>
        ))}
        <p className="text-[14px] text-muted">पूरा खाता या card नंबर, OTP, PIN, CVV कभी न लिखें।</p>
      </section>

      <section aria-labelledby="arzi-preview" className="space-y-2">
        <h2 id="arzi-preview" className="text-[19px] font-bold">
          पत्र
        </h2>
        <article id="arzi-print" data-print-area="letter" className="space-y-1 rounded-xl border border-line bg-paper p-4 text-[16px] leading-relaxed text-ink">
          {lines.map((l, i) => (l ? <p key={i}>{l}</p> : <div key={i} className="h-3" aria-hidden="true" />))}
        </article>
        {kind === "ombudsman" ? (
          <CopyBlock text={lines.join("\n")} label="RBI Ombudsman के लिए text" />
        ) : (
          <button type="button" onClick={() => window.print()} className="min-h-12 rounded-[10px] bg-brand px-6 font-bold text-paper">
            Print / PDF बनाएँ
          </button>
        )}
        {kind !== "ombudsman" ? (
          <p className="text-[14px] text-muted">फ़ोन पर: Print खुलने पर printer की जगह &quot;Save as PDF&quot; चुनें, PDF फ़ोन में सेव हो जाएगी।</p>
        ) : (
          <p className="text-[14px] text-muted">cms.rbi.org.in पर शिकायत के &quot;क्या हुआ&quot; वाले डिब्बे में चिपकाएँ; बाकी खाने वहीं भरें।</p>
        )}
      </section>
    </div>
  );
}
