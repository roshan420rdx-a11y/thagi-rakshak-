// "मेरा केस" फ़ोन के अंदर (plan B0): ढाँचा, जाँच और हिसाब। शुद्ध functions: storage पढ़ना-लिखना UI करता है।
// सिर्फ़ तारीख़ें, रकम और शिकायत नंबर; नाम, फ़ोन नंबर, खाता नंबर, OTP या PIN के लिए कोई जगह नहीं।
import { MAX_RUPEES } from "@/modules/haq/money";
import { daysBetween, evaluateRights, isValidIsoDate, type Deadline, type FraudInput } from "@/modules/rules-engine";
import type { ShikayatStageId } from "@/modules/shikayat";

export const CASE_KEY = "thagi-rakshak:mera-case:v1";
export const STAGE_IDS: readonly ShikayatStageId[] = ["call_1930", "ncrp", "bank", "police", "ombudsman"];
export const MAX_NUMBER_CHARS = 40;

export type CaseStage = { on: string | null; number: string };
export type LocalCase = {
  v: 1;
  txnDate: string | null;
  amount: number | null;
  recovered: number | null;
  stages: Record<ShikayatStageId, CaseStage>;
};

export function emptyCase(): LocalCase {
  return {
    v: 1,
    txnDate: null,
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

// अगला पड़ाव: जिसकी तारीख़ अभी नहीं भरी (क्रम से); सब भरे हों तो null
export function nextStage(c: LocalCase): ShikayatStageId | null {
  return STAGE_IDS.find((id) => !c.stages[id].on) ?? null;
}

// आगे की तारीख़ें: सिर्फ़ rules engine से (DISHA)। ठगी की तारीख़ या रकम न हो तो कुछ नहीं (अंदाज़ा नहीं)।
export function caseDeadlines(c: LocalCase, today: string): Deadline[] {
  if (!c.txnDate || !c.amount) return [];
  const reportedNational = [c.stages.call_1930.on, c.stages.ncrp.on].filter((x): x is string => !!x).sort()[0] ?? null;
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
