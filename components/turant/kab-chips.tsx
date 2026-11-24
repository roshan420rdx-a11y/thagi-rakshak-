"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { Notice } from "@/components/ui/notice";
// सीधे हल्की files से (barrel नहीं): इमरजेंसी पन्ने पर RBI नियमों वाला भारी हिसाब न आए
import { CASE_KEY, noteWhen, parseCase, serializeCase } from "@/modules/case/store";
import { formatHindiTime, nowTimeInKolkata, todayInKolkata } from "@/modules/rules-engine/dates";
import { KAB_ADVICE, KAB_OPTIONS, type KabId } from "@/modules/scams";

// "यह कब हुआ?": जवाब के हिसाब से कदमों के ऊपर छोटी सलाह। सिर्फ़ browser में; अपने-आप कुछ सेव नहीं होता।
// "1 घंटे से कम" या "आज ही" पर एक छोटा बटन (plan A2h): ठगी का दिन (और लगभग समय) "मेरा केस" में, ताकि पत्र में अपने-आप
// आए। सिर्फ़ तब, जब "मेरा केस" में तारीख़ पहले से न हो (कुछ नहीं मिटता)।
// mount से पहले कुछ नहीं, इसलिए JS बंद हो तो पन्ना पहले जैसा (सिर्फ़ कदम)। हक़ का सटीक हिसाब /haq/thagi पर।
export function KabChips() {
  const [mounted, setMounted] = useState(false);
  const [kab, setKab] = useState<KabId | null>(null);
  const [noted, setNoted] = useState<string | null>(null);
  const [caseHasDate, setCaseHasDate] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      setCaseHasDate(!!parseCase(window.localStorage.getItem(CASE_KEY), todayInKolkata(new Date())).txnDate);
    } catch {
      setCaseHasDate(true); // storage बंद हो तो बटन नहीं (सेव हो ही नहीं पाएगा)
    }
  }, []);
  if (!mounted) return null;

  function note(k: KabId) {
    const today = todayInKolkata(new Date());
    const time = k === "hour" ? nowTimeInKolkata(new Date()) : null;
    try {
      const { next, changed } = noteWhen(parseCase(window.localStorage.getItem(CASE_KEY), today), today, time);
      if (changed) window.localStorage.setItem(CASE_KEY, serializeCase(next));
      setNoted(changed ? `"मेरा केस" में लिख लिया: आज${time ? `, लगभग ${formatHindiTime(time)}` : ""}। ठीक करना हो तो वहाँ बदलें।` : "\"मेरा केस\" में तारीख़ पहले से है।");
      setCaseHasDate(true);
    } catch {
      setNoted("इस browser में सेव नहीं हो पाया। तारीख़ और समय काग़ज़ पर लिख लें।");
    }
  }

  return (
    <section aria-labelledby="kab-title" className="space-y-2">
      <h2 id="kab-title" className="text-[17px] font-bold">
        यह कब हुआ?
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {KAB_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={kab === o.id}
            onClick={() => setKab(o.id)}
            className={`min-h-12 rounded-[10px] border px-2 text-[16px] font-semibold ${
              kab === o.id ? "border-brand bg-brand text-paper" : "border-line bg-paper text-ink"
            }`}
          >
            {o.labelHi}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {kab ? (
          <div className="space-y-1">
            <Notice tone={KAB_ADVICE[kab].tone}>{KAB_ADVICE[kab].textHi}</Notice>
            {/* सलाह "1930 पर call करें" कहती है, तो बटन भी यहीं (सलाह खुलने पर कदमों वाला बटन नीचे खिसक जाता है) */}
            <ActionLink action={{ kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" }} primary />
            <Link href="/haq/thagi" className="inline-flex min-h-12 items-center font-semibold text-brand">
              RBI के नियमों से अपना हक़ देखें →
            </Link>
            {(kab === "hour" || kab === "today") && !caseHasDate && !noted ? (
              <button
                type="button"
                onClick={() => note(kab)}
                className="flex min-h-12 w-full items-center rounded-[10px] border border-line bg-paper px-3 text-left font-semibold text-brand"
              >
                ठगी का दिन{kab === "hour" ? " और समय" : ""} &quot;मेरा केस&quot; में लिख लें (शिकायत के पत्र में काम आएगा)
              </button>
            ) : null}
            {noted ? (
              <p className="text-[15px]">
                {noted}{" "}
                <Link href="/case" className="font-semibold text-brand">
                  मेरा केस →
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
