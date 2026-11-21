import { expect, test } from "vitest";
import { evaluateRights } from "./evaluate";
import { liability2025 } from "./rules/rbi-2025-old";
import type { FraudInput } from "./types";

// 1 दिसंबर 2026 (मंगलवार), बीच की कंपनी की गलती, बचत खाता
const base: FraudInput = {
  txnDate: "2026-12-01",
  grossLoss: 40000,
  recovered: 0,
  customerType: "individual",
  howHappened: "unauthorised",
  fault: "third_party",
  instrument: "bank_account",
  accountKind: "savings",
  reportedTo1930On: "2026-12-01",
  reportedToBankOn: "2026-12-01",
  priorCompensation: false,
  crossBorder: false,
};
const old = (i: FraudInput, today = "2026-12-20") => liability2025.evaluate(i, today);

test("3 कार्य-दिवस में → likely ज़ीरो", () => {
  const r = old({ ...base, reportedToBankOn: "2026-12-04" });
  expect(r?.status).toBe("likely");
  expect(r?.amount).toBeUndefined();
});
test("6 कार्य-दिवस → ज़िम्मेदारी ज़्यादा से ज़्यादा 10,000", () =>
  expect(old({ ...base, reportedToBankOn: "2026-12-08" })?.amount).toBe(10000));
test("सीमा नुकसान से ज़्यादा न हो", () =>
  expect(old({ ...base, reportedToBankOn: "2026-12-08", grossLoss: 3000 })?.amount).toBe(3000));
test("BSBD सीमा 5,000; बड़ा खाता 25,000", () => {
  expect(old({ ...base, accountKind: "bsbd", reportedToBankOn: "2026-12-08" })?.amount).toBe(5000);
  expect(old({ ...base, accountKind: "other_current_or_big_card", reportedToBankOn: "2026-12-08" })?.amount).toBe(25000);
});
test("खाते का प्रकार पता नहीं, 4-7 दिन → unclear", () =>
  expect(old({ ...base, accountKind: "unknown", reportedToBankOn: "2026-12-08" })?.status).toBe("unclear"));
test("7 से ज़्यादा कार्य-दिवस → unclear", () => expect(old({ ...base, reportedToBankOn: "2026-12-15" })?.status).toBe("unclear"));
test("अभी नहीं बताया, आज 2रा कार्य-दिवस → deadline (3 कार्य-दिवस)", () => {
  const r = old({ ...base, reportedToBankOn: null }, "2026-12-03");
  expect(r?.status).toBe("likely");
  expect(r?.deadlines).toContainEqual({ labelHi: "ज़ीरो ज़िम्मेदारी के लिए बैंक को इस तारीख़ तक बताएँ", date: "2026-12-04", status: "likely" });
});
test("बैंक की गलती → likely", () => expect(old({ ...base, fault: "bank", reportedToBankOn: null })?.status).toBe("likely"));
test("ग्राहक की लापरवाही → likely, बताने तक का नुकसान ग्राहक का", () =>
  expect(old({ ...base, fault: "customer" })?.reasonsHi.join(" ")).toContain("बैंक को बताने तक का नुकसान"));
test("गलती पता नहीं → unclear", () => expect(old({ ...base, fault: "unknown" })?.status).toBe("unclear"));
test("बताया हो → 90 दिन में हल (confirmed)", () =>
  expect(old(base)?.deadlines).toContainEqual({ labelHi: "शिकायत का हल, ज़्यादा से ज़्यादा", date: "2027-03-01", status: "confirmed" }));
test("2027 के लेन-देन पर यह नियम नहीं, 2026 पर है", () => {
  expect(evaluateRights({ ...base, txnDate: "2027-01-05", reportedToBankOn: "2027-01-05" }, "2027-01-06").some((r) => r.ruleId === "rbi2025.liability")).toBe(false);
  expect(evaluateRights(base, "2026-12-02").some((r) => r.ruleId === "rbi2025.liability")).toBe(true);
});
