"use client";

import { useEffect, useState } from "react";
import { CASE_KEY, caseHasData, haqFieldsFromCase, parseCase, type HaqFields } from "@/modules/case";
import { todayInKolkata } from "@/modules/rules-engine";

// plan A2d: फ़ोन में "मेरा केस" हो तो उसकी तारीख़ें और रकम "आपका हक़" के form में एक tap में।
// सिर्फ़ इसी फ़ोन की storage पढ़ता है (कोई network नहीं), और सिर्फ़ डिब्बे भरता है: हिसाब पीड़ित के
// "हिसाब देखें" दबाने पर ही, ताकि "OTP बताया?" जैसे सवाल वह ख़ुद चुने (default से ग़लत नतीजा न बने)।
const IDS = ["txn", "loss", "back", "r1930", "rbank"] as const satisfies readonly (keyof HaqFields)[];

export function CaseFill() {
  const [fields, setFields] = useState<HaqFields | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const c = parseCase(window.localStorage.getItem(CASE_KEY), todayInKolkata(new Date()));
      if (caseHasData(c) && (c.txnDate || c.amount)) setFields(haqFieldsFromCase(c));
    } catch {
      // storage बंद हो तो बटन नहीं; form हाथ से भरा जा सकता है
    }
  }, []);

  if (!fields) return null;

  function fill() {
    for (const id of IDS) {
      const el = document.getElementById(id);
      if (el instanceof HTMLInputElement && fields![id]) el.value = fields![id];
    }
    setDone(true);
    document.getElementById("how")?.focus();
  }

  return (
    <div className="space-y-2 rounded-xl border border-line bg-paper p-3">
      {done ? (
        <p role="status" className="font-semibold">
          &quot;मेरा केस&quot; से तारीख़ें और रकम भर दीं। अब &quot;ठगी कैसे हुई?&quot; और बाकी सवाल चुनें, फिर &quot;हिसाब देखें&quot; दबाएँ।
        </p>
      ) : (
        <>
          <p>आपके फ़ोन में &quot;मेरा केस&quot; भरा है। उसकी तारीख़ें और रकम नीचे भर दें?</p>
          <button type="button" onClick={fill} className="min-h-12 rounded-[10px] border border-line bg-paper px-4 font-semibold text-brand">
            &quot;मेरा केस&quot; से भरें
          </button>
        </>
      )}
    </div>
  );
}
