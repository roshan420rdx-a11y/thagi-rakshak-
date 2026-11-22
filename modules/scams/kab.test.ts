import { expect, test } from "vitest";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";
import { KAB_ADVICE, KAB_OPTIONS, TURANT_SLUGS, asksWhen } from "@/modules/scams";

test("चार विकल्प, समय के क्रम में", () =>
  expect(KAB_OPTIONS.map((o) => o.id)).toEqual(["hour", "today", "days", "older"]));

test("हर विकल्प की सलाह: पहला घंटा सबसे ज़रूरी (danger), देर वाला शांत (info)", () => {
  expect(KAB_ADVICE.hour.tone).toBe("danger");
  expect(KAB_ADVICE.today.tone).toBe("warn");
  expect(KAB_ADVICE.older.tone).toBe("info");
  for (const o of KAB_OPTIONS) expect(KAB_ADVICE[o.id].textHi).toMatch(/1930|बैंक/);
});

test("सलाह में कोई वादा नहीं (मना किए शब्द या 'पक्का' नहीं)", () => {
  const all = Object.values(KAB_ADVICE).map((a) => a.textHi).join("\n");
  expect(findForbidden(all, FORBIDDEN_PHRASES)).toEqual([]);
  expect(all).not.toContain("पक्का");
});

test("सवाल सिर्फ़ पैसे वाले प्रकारों पर; धमकी वाले (sextortion, loan-app) पर नहीं", () => {
  expect(TURANT_SLUGS.filter(asksWhen)).toEqual([
    "upi",
    "card",
    "netbanking",
    "wallet",
    "digital-arrest",
    "investment-task",
    "customer-care-fake",
    "pata-nahi",
  ]);
});
