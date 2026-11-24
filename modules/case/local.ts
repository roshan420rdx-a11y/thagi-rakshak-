// "मेरा केस" का हिसाब (plan B0): RBI नियमों से आगे की तारीख़ें और "आपका हक़" के लिए खाने। ढाँचा, पढ़ना/लिखना और
// हल्की जाँच store.ts में (वहीं से यहाँ भी मिलते हैं)। नाम, फ़ोन नंबर, खाता नंबर, OTP या PIN के लिए कोई जगह नहीं।
import { evaluateRights, type Deadline, type FraudInput } from "@/modules/rules-engine";
import type { LocalCase } from "./store";

export { CASE_KEY, MAX_NUMBER_CHARS, STAGE_IDS, caseHasData, cleanNumber, emptyCase, nextStage, noteWhen, parseCase, serializeCase } from "./store";
export type { CaseStage, LocalCase } from "./store";

// 1930 और cybercrime.gov.in में से जो पहले (RBI के नियम में दोनों एक ही "राष्ट्रीय रिपोर्ट" हैं)
function firstNationalReport(c: LocalCase): string | null {
  return [c.stages.call_1930.on, c.stages.ncrp.on].filter((x): x is string => !!x).sort()[0] ?? null;
}

// "आपका हक़" का form भरने के लिए (plan A2d): सिर्फ़ वही जो केस में है; बाकी सवाल पीड़ित ख़ुद चुने
export type HaqFields = { txn: string; loss: string; back: string; r1930: string; rbank: string };
export function haqFieldsFromCase(c: LocalCase): HaqFields {
  return {
    txn: c.txnDate ?? "",
    loss: c.amount ? String(c.amount) : "",
    back: c.recovered === null ? "" : String(c.recovered),
    r1930: firstNationalReport(c) ?? "",
    rbank: c.stages.bank.on ?? "",
  };
}

// आगे की तारीख़ें: सिर्फ़ rules engine से (DISHA)। ठगी की तारीख़ या रकम न हो तो कुछ नहीं (अंदाज़ा नहीं)।
export function caseDeadlines(c: LocalCase, today: string): Deadline[] {
  if (!c.txnDate || !c.amount) return [];
  const reportedNational = firstNationalReport(c);
  const input: FraudInput = {
    txnDate: c.txnDate,
    grossLoss: c.amount,
    recovered: c.recovered ?? 0,
    customerType: "individual",
    howHappened: "unknown",
    fault: "unknown",
    instrument: "bank_account",
    accountKind: "unknown",
    reportedTo1930On: reportedNational,
    reportedToBankOn: c.stages.bank.on,
    priorCompensation: false,
    crossBorder: false,
  };
  const seen = new Set<string>();
  return evaluateRights(input, today)
    .flatMap((r) => r.deadlines)
    .filter((d) => {
      const key = `${d.labelHi}|${d.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}
