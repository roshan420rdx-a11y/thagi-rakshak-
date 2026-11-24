// "मेरा केस" का हल्का हिस्सा: ढाँचा, फ़ोन से पढ़ना/लिखना और जाँच। इसमें RBI नियमों वाला हिसाब (rules engine) नहीं,
// ताकि इमरजेंसी (/turant) जैसे पन्ने इसे लें तो भारी न हों। हिसाब वाले functions local.ts में।
import { MAX_RUPEES } from "@/modules/haq/money";
import { daysBetween, isValidIsoDate, isValidTime } from "@/modules/rules-engine/dates";
import type { ShikayatStageId } from "@/modules/shikayat";

export const CASE_KEY = "thagi-rakshak:mera-case:v1";
export const STAGE_IDS: readonly ShikayatStageId[] = ["call_1930", "ncrp", "bank", "police", "ombudsman"];
export const MAX_NUMBER_CHARS = 40;

export type CaseStage = { on: string | null; number: string };
export type LocalCase = {
  v: 1;
  txnDate: string | null;
  txnTime: string | null; // "HH:MM", लगभग (याद हो तो); पुराने सेव केस में नहीं होता
  amount: number | null;
  recovered: number | null;
  stages: Record<ShikayatStageId, CaseStage>;
};

export function emptyCase(): LocalCase {
  return {
    v: 1,
    txnDate: null,
    txnTime: null,
    amount: null,
    recovered: null,
    stages: Object.fromEntries(STAGE_IDS.map((id) => [id, { on: null, number: "" }])) as Record<ShikayatStageId, CaseStage>,
  };
}

// आज या पहले की सही तारीख़, वरना null
function pastDate(v: unknown, today: string): string | null {
  return typeof v === "string" && isValidIsoDate(v) && daysBetween(today, v) <= 0 ? v : null;
}

function money(v: unknown, min: number): number | null {
  return typeof v === "number" && Number.isFinite(v) && v >= min && v <= MAX_RUPEES ? Math.round(v * 100) / 100 : null;
}

// शिकायत नंबर: छुपे/control अक्षर हटाकर, 40 अक्षर तक
export function cleanNumber(v: unknown): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, MAX_NUMBER_CHARS) : "";
}

// फ़ोन में रखा data पढ़ना: कुछ भी ख़राब हो तो ख़ाली केस (ऐप कभी न टूटे)
export function parseCase(raw: string | null, today: string): LocalCase {
  const c = emptyCase();
  if (!raw) return c;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return c;
  }
  if (!data || typeof data !== "object" || (data as { v?: unknown }).v !== 1) return c;
  const d = data as Record<string, unknown>;
  c.txnDate = pastDate(d.txnDate, today);
  c.txnTime = typeof d.txnTime === "string" && isValidTime(d.txnTime) ? d.txnTime : null;
  c.amount = money(d.amount, 0.01);
  c.recovered = money(d.recovered, 0);
  const stages = (d.stages && typeof d.stages === "object" ? d.stages : {}) as Record<string, unknown>;
  for (const id of STAGE_IDS) {
    const s = (stages[id] && typeof stages[id] === "object" ? stages[id] : {}) as Record<string, unknown>;
    c.stages[id] = { on: pastDate(s.on, today), number: cleanNumber(s.number) };
  }
  return c;
}

export function serializeCase(c: LocalCase): string {
  return JSON.stringify(c);
}

// /turant पर "यह कब हुआ?" के बाद एक tap (plan A2h): ठगी का दिन (और पता हो तो समय) "मेरा केस" में। पहले से तारीख़ भरी हो
// तो कुछ नहीं बदलता (कोई पुराना केस या ख़ुद भरी बात कभी नहीं मिटती)।
export function noteWhen(c: LocalCase, date: string, time: string | null): { next: LocalCase; changed: boolean } {
  if (c.txnDate) return { next: c, changed: false };
  return { next: { ...c, txnDate: date, txnTime: time ?? c.txnTime }, changed: true };
}
