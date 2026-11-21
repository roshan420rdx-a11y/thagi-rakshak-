// /haq के GET form (searchParams) को जाँचकर rules engine का input बनाना। ग़लतियाँ हिंदी में।
import { z } from "zod";
import { TAT_ROWS, daysBetween, isValidIsoDate } from "@/modules/rules-engine";
import type { AccountKind, FraudInput, HowHappened, Instrument, TatChannel } from "@/modules/rules-engine";

type Params = Record<string, string | string[] | undefined>;
type Parsed<T> = { ok: true; input: T } | { ok: false; errorsHi: string[] } | { ok: "empty" };

const one = (p: Params, k: string): string => {
  const v = p[k];
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
};

function pick<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

const Money = z.coerce.number().int().min(0).max(1_000_000_000);

const HOW: readonly HowHappened[] = ["credentials_taken", "coerced", "self_sent_deceived", "unauthorised", "unknown"];
const INST: readonly Instrument[] = ["bank_account", "credit_card", "wallet"];
const ACCT: readonly AccountKind[] = ["bsbd", "savings", "small_current_or_card", "other_current_or_big_card", "unknown"];
const SHARED_TO_FAULT = { yes: "customer", no: "unknown", bank: "bank", app: "third_party" } as const;

function checkTxnDate(txn: string, today: string, errors: string[], label = "ठगी की तारीख़") {
  if (!isValidIsoDate(txn)) errors.push(`${label} सही नहीं है।`);
  else if (daysBetween(today, txn) > 0) errors.push(`${label} आज के बाद की नहीं हो सकती।`);
}

function optionalReport(value: string, txn: string, today: string, errors: string[]): string | null {
  if (!value) return null;
  if (!isValidIsoDate(value)) {
    errors.push("रिपोर्ट की तारीख़ सही नहीं है।");
    return null;
  }
  if (isValidIsoDate(txn) && daysBetween(txn, value) < 0) errors.push("रिपोर्ट की तारीख़ ठगी से पहले की नहीं हो सकती।");
  if (daysBetween(today, value) > 0) errors.push("रिपोर्ट की तारीख़ आज के बाद की नहीं हो सकती।");
  return value;
}

export function parseFraudForm(params: Params, today: string): Parsed<FraudInput> {
  const txn = one(params, "txn");
  const lossRaw = one(params, "loss");
  if (!txn && !lossRaw) return { ok: "empty" };

  const errors: string[] = [];
  checkTxnDate(txn, today, errors);
  const loss = Money.safeParse(lossRaw);
  if (!loss.success || loss.data <= 0) errors.push("कितने पैसे गए, सही रकम लिखें।");
  const backRaw = one(params, "back");
  const back = Money.safeParse(backRaw || "0");
  if (!back.success) errors.push("वापस मिली रकम सही लिखें।");
  const r1930 = optionalReport(one(params, "r1930"), txn, today, errors);
  const rbank = optionalReport(one(params, "rbank"), txn, today, errors);
  if (errors.length > 0) return { ok: false, errorsHi: [...new Set(errors)] };

  const shared = pick(one(params, "shared"), ["yes", "no", "bank", "app"] as const, "no");
  return {
    ok: true,
    input: {
      txnDate: txn,
      grossLoss: loss.data!,
      recovered: back.data!,
      customerType: pick(one(params, "who"), ["individual", "sole_proprietor", "other"] as const, "individual"),
      howHappened: pick(one(params, "how"), HOW, "unknown"),
      fault: SHARED_TO_FAULT[shared],
      instrument: pick(one(params, "inst"), INST, "bank_account"),
      accountKind: pick(one(params, "acct"), ACCT, "unknown"),
      reportedTo1930On: r1930,
      reportedToBankOn: rbank,
      priorCompensation: one(params, "prior") === "yes",
      crossBorder: one(params, "abroad") === "on",
    },
  };
}

export type FailedInput = { channel: TatChannel; txnDate: string; resolvedOn: string | null };

export function parseFailedForm(params: Params, today: string): Parsed<FailedInput> {
  const ch = one(params, "ch");
  const txn = one(params, "txn");
  if (!ch && !txn) return { ok: "empty" };

  const errors: string[] = [];
  if (!(ch in TAT_ROWS)) errors.push("किस तरह का लेन-देन था, चुनें।");
  checkTxnDate(txn, today, errors, "लेन-देन की तारीख़");
  const res = one(params, "res");
  if (res) {
    if (!isValidIsoDate(res)) errors.push("पैसा लौटने की तारीख़ सही नहीं है।");
    else if (isValidIsoDate(txn) && daysBetween(txn, res) < 0) errors.push("पैसा लौटने की तारीख़ लेन-देन से पहले की नहीं हो सकती।");
    else if (daysBetween(today, res) > 0) errors.push("पैसा लौटने की तारीख़ आज के बाद की नहीं हो सकती।");
  }
  if (errors.length > 0) return { ok: false, errorsHi: errors };
  return { ok: true, input: { channel: ch as TatChannel, txnDate: txn, resolvedOn: res || null } };
}
