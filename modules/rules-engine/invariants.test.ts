// "0 से दोबारा जाँच" (cross-question): नियम-इंजन पर हज़ारों बनावटी मामले (एक तय बीज से, हर बार वही) चलाकर वे बातें जाँचना जो किसी भी मामले में
// सच रहनी चाहिए। एक-एक नियम के unit tests सिर्फ़ वही परखते हैं जो लिखने वाले को सूझा; यह वे रास्ते खोलता है जो नहीं सूझे।
import { expect, test } from "vitest";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";
import { addDays, daysBetween, isValidIsoDate, workingDaysBetween } from "./dates";
import { evaluateRights } from "./evaluate";
import type { AccountKind, Fault, FraudInput, HowHappened, Instrument, RightResult } from "./types";

// छोटा, तय क्रम वाला random (mulberry32): बीज वही तो हर बार वही मामले
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HOW: HowHappened[] = ["credentials_taken", "coerced", "self_sent_deceived", "unauthorised", "unknown"];
const FAULT: Fault[] = ["bank", "third_party", "customer", "unknown"];
const INST: Instrument[] = ["bank_account", "credit_card", "wallet"];
const ACCT: AccountKind[] = ["bsbd", "savings", "small_current_or_card", "other_current_or_big_card", "unknown"];
const WHO: FraudInput["customerType"][] = ["individual", "sole_proprietor", "other"];

function cases(n: number, seed = 20261122): { input: FraudInput; today: string }[] {
  const r = rng(seed);
  const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];
  const out: { input: FraudInput; today: string }[] = [];
  for (let i = 0; i < n; i++) {
    // 2026-11-01 से 2028-02-15 तक की ठगी (नियम बदलने की दोनों सीमाओं, 2027-01-01 और 2028-01-01, के आर-पार)
    const txnDate = addDays("2026-11-01", Math.floor(r() * 472));
    const today = addDays(txnDate, Math.floor(r() * 130));
    const dayAfter = (maybe: boolean, max: number) => (maybe ? addDays(txnDate, Math.min(max, daysBetween(txnDate, today))) : null);
    const grossLoss = pick([1, 499, 500, 29411, 29412, 49999, 50000, 50001, 100000, 2500000]) + (r() < 0.3 ? Math.floor(r() * 5000) : 0);
    out.push({
      today,
      input: {
        txnDate,
        grossLoss,
        recovered: r() < 0.4 ? Math.floor(r() * grossLoss * 1.2) : 0,
        customerType: pick(WHO),
        howHappened: pick(HOW),
        fault: pick(FAULT),
        instrument: pick(INST),
        accountKind: pick(ACCT),
        reportedTo1930On: dayAfter(r() < 0.7, Math.floor(r() * 12)),
        reportedToBankOn: dayAfter(r() < 0.7, Math.floor(r() * 12)),
        priorCompensation: r() < 0.1,
        crossBorder: r() < 0.15,
      },
    });
  }
  return out;
}

const ALL = cases(6000);

function texts(res: RightResult): string[] {
  return [res.titleHi, res.amountLabelHi ?? "", ...res.reasonsHi, ...res.deadlines.map((d) => d.labelHi)];
}

test("हर मामले में इंजन गिरता नहीं, और दो बार चलाने पर नतीजा बिल्कुल वही (शुद्धता)", () => {
  for (const { input, today } of ALL) {
    const a = evaluateRights(input, today);
    const b = evaluateRights(JSON.parse(JSON.stringify(input)), today);
    expect(b).toEqual(a);
  }
});

test("रकम: पूरा अंक, ≥ 0, और कभी कुल नुकसान से ज़्यादा नहीं; मुआवज़ा कभी ₹25,000 या 85% से ऊपर नहीं", () => {
  for (const { input, today } of ALL) {
    for (const res of evaluateRights(input, today)) {
      if (res.amount === undefined) continue;
      const where = `${res.ruleId} ${JSON.stringify(input)}`;
      expect(Number.isInteger(res.amount), where).toBe(true);
      expect(res.amount, where).toBeGreaterThanOrEqual(0);
      expect(res.amount, where).toBeLessThanOrEqual(input.grossLoss);
      if (res.ruleId === "rbi2027.smallValueCompensation") {
        expect(res.amount, where).toBeLessThanOrEqual(25000);
        expect(res.amount, where).toBeLessThanOrEqual(Math.round((input.grossLoss - input.recovered) * 0.85));
      }
    }
  }
});

test("हर deadline एक सही तारीख़ है, ठगी की तारीख़ से पहले की नहीं, और एक नतीजे में दोहराई नहीं गई", () => {
  for (const { input, today } of ALL) {
    for (const res of evaluateRights(input, today)) {
      const labels = new Set<string>();
      for (const d of res.deadlines) {
        const where = `${res.ruleId} ${d.labelHi} ${JSON.stringify(input)}`;
        expect(isValidIsoDate(d.date), where).toBe(true);
        expect(daysBetween(input.txnDate, d.date), where).toBeGreaterThanOrEqual(0);
        expect(labels.has(d.labelHi), `दोहराई deadline: ${where}`).toBe(false);
        labels.add(d.labelHi);
      }
    }
  }
});

test("एक नतीजे में कारण दोहराए नहीं जाते (React की key और पढ़ने वाले, दोनों के लिए)", () => {
  for (const { input, today } of ALL) {
    for (const res of evaluateRights(input, today)) {
      expect(new Set(res.reasonsHi).size, `${res.ruleId} ${JSON.stringify(input)}`).toBe(res.reasonsHi.length);
    }
  }
});

test("इंजन के लिखे हर शब्द में कोई मना किया शब्द नहीं (झूठी तसल्ली, सरकारी नकल)", () => {
  const seen = new Set<string>();
  for (const { input, today } of ALL) {
    for (const res of evaluateRights(input, today)) {
      for (const text of texts(res)) {
        if (seen.has(text)) continue;
        seen.add(text);
        expect(findForbidden(text, FORBIDDEN_PHRASES), text).toEqual([]);
      }
    }
  }
});

test("हर नतीजे के साथ मूल स्रोत की फ़ाइल, link, paragraph और quote है, और जाँचने वाले का नाम", () => {
  for (const { input, today } of ALL.slice(0, 600)) {
    for (const res of evaluateRights(input, today)) {
      expect(res.source.file).toMatch(/^docs\/sources\/rbi\/.+\.txt$/);
      expect(res.source.url).toMatch(/^https:\/\/www\.rbi\.org\.in\//);
      expect(res.source.paragraph.length).toBeGreaterThan(0);
      expect(res.source.quote.length).toBeGreaterThan(30);
      expect(res.verifiedBy.length).toBeGreaterThan(0);
    }
  }
});

test("'पक्का' (confirmed) सिर्फ़ समय-सीमा वाले नतीजे पर: उसके साथ कोई रकम का वादा नहीं", () => {
  for (const { input, today } of ALL) {
    for (const res of evaluateRights(input, today)) {
      if (res.status === "confirmed") expect(res.amount, `${res.ruleId} ${JSON.stringify(input)}`).toBeUndefined();
    }
  }
});

test("2027 से पहले और बाद: ठीक एक पीढ़ी के नियम चलते हैं (पुराने और नए नियम कभी साथ नहीं)", () => {
  for (const { input, today } of ALL) {
    const ids = evaluateRights(input, today).map((r) => r.ruleId);
    const old = ids.some((id) => id.startsWith("rbi2025."));
    const fresh = ids.some((id) => id.startsWith("rbi2027."));
    expect(old && fresh, `${ids.join(",")} ${input.txnDate}`).toBe(false);
    if (input.txnDate >= "2027-01-01") expect(old).toBe(false);
    if (input.txnDate < "2027-01-01") expect(fresh).toBe(false);
  }
});

test("जल्दी बताना कभी नुकसानदेह नहीं: बैंक को पहले बताने पर 2025 वाली ज़िम्मेदारी बढ़ती नहीं, और ज़ीरो-ज़िम्मेदारी की स्थिति घटती नहीं", () => {
  const rank = { confirmed: 3, likely: 3, unclear: 2, not_eligible: 1 } as const;
  const r = rng(77);
  for (let i = 0; i < 1500; i++) {
    const txnDate = addDays("2026-06-01", Math.floor(r() * 500));
    const base: FraudInput = {
      txnDate,
      grossLoss: 8000 + Math.floor(r() * 90000),
      recovered: 0,
      customerType: "individual",
      howHappened: "unauthorised",
      fault: "third_party",
      instrument: "bank_account",
      accountKind: ACCT[Math.floor(r() * 4)],
      reportedTo1930On: null,
      reportedToBankOn: null,
      priorCompensation: false,
      crossBorder: false,
    };
    const a = Math.floor(r() * 14);
    const b = a + Math.floor(r() * 14);
    const today = addDays(txnDate, b + 1);
    const early = evaluateRights({ ...base, reportedToBankOn: addDays(txnDate, a) }, today);
    const late = evaluateRights({ ...base, reportedToBankOn: addDays(txnDate, b) }, today);
    for (const id of ["rbi2025.liability", "rbi2027.zeroLiability"]) {
      const e = early.find((x) => x.ruleId === id);
      const l = late.find((x) => x.ruleId === id);
      if (!e || !l) continue;
      const where = `${id} जल्दी ${addDays(txnDate, a)} देर से ${addDays(txnDate, b)} ठगी ${txnDate}`;
      expect(rank[e.status], where).toBeGreaterThanOrEqual(rank[l.status]);
      if (e.amount !== undefined && l.amount !== undefined) expect(e.amount, where).toBeLessThanOrEqual(l.amount);
    }
  }
});

test("तारीख़ का हिसाब: addDays और daysBetween उलटे हैं (लीप साल, महीने और साल के आर-पार), और कार्य-दिवस कभी कैलेंडर-दिन से ज़्यादा नहीं", () => {
  const r = rng(5);
  for (let i = 0; i < 3000; i++) {
    const from = addDays("2024-01-01", Math.floor(r() * 1500));
    const n = Math.floor(r() * 400);
    const to = addDays(from, n);
    expect(isValidIsoDate(to)).toBe(true);
    expect(daysBetween(from, to)).toBe(n);
    const w = workingDaysBetween(from, to);
    expect(w).toBeLessThanOrEqual(n);
    // 2 और 4 शनिवार + रविवार छोड़कर: हर 7 दिन में कम से कम 4 कार्य-दिवस, और ज़्यादा से ज़्यादा 6
    expect(w).toBeGreaterThanOrEqual(Math.floor(n / 7) * 4);
    expect(w).toBeLessThanOrEqual(Math.ceil(n / 7) * 6);
  }
  expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  expect(addDays("2028-02-29", 1)).toBe("2028-03-01");
  expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  expect(isValidIsoDate("2027-02-29")).toBe(false);
  expect(isValidIsoDate("2028-02-29")).toBe(true);
});
