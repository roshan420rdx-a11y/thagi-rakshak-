import { expect, test } from "vitest";
import { evaluateRights } from "./evaluate";
import { smallValueCompensation } from "./rules/rbi-2027";
import { BASE_2027 as base } from "./test-helpers";
import type { FraudInput } from "./types";

const comp = (i: FraudInput, today = "2027-03-20") => smallValueCompensation.evaluate(i, today);
const find = (i: FraudInput, today: string, id: string) => evaluateRights(i, today).find((r) => r.ruleId === id);

test("मूल Illustration 1: 40,000 में 15,000 वापस → 21,250", () => {
  const r = comp({ ...base, recovered: 15000 });
  expect(r?.status).toBe("likely");
  expect(r?.amount).toBe(21250);
});
test("ऊपरी सीमा 25,000", () => expect(comp(base)?.amount).toBe(25000));
test("29,411 → 24,999 (85% = 24,999.35)", () => expect(comp({ ...base, grossLoss: 29411 })?.amount).toBe(24999));
test("50,000 ठीक → likely", () => expect(comp({ ...base, grossLoss: 50000 })?.status).toBe("likely"));
test("50,001 → not_eligible", () => expect(comp({ ...base, grossLoss: 50001 })?.status).toBe("not_eligible"));
test("पहले ले चुके → not_eligible", () => expect(comp({ ...base, priorCompensation: true })?.status).toBe("not_eligible"));
test("वापस मिला ≥ नुकसान → not_eligible", () => {
  expect(comp({ ...base, recovered: 40000 })?.status).toBe("not_eligible");
  expect(comp({ ...base, recovered: 45000 })?.amount ?? 0).toBe(0);
});
test("बैंक को 6वें दिन बताया → not_eligible", () =>
  expect(comp({ ...base, reportedToBankOn: "2027-03-16" })?.status).toBe("not_eligible"));
test("5वें दिन ठीक है", () => expect(comp({ ...base, reportedToBankOn: "2027-03-15" })?.status).toBe("likely"));
test("आज 3रा दिन, बैंक को अभी नहीं → likely + deadline", () => {
  const r = comp({ ...base, reportedToBankOn: null }, "2027-03-12");
  expect(r?.status).toBe("likely");
  expect(r?.deadlines[0]).toEqual({ labelHi: "1930 और बैंक, दोनों को इस तारीख़ तक बताएँ", date: "2027-03-15", status: "confirmed" });
});
test("आज 7वाँ दिन, 1930 को अभी नहीं बताया → not_eligible", () =>
  expect(comp({ ...base, reportedTo1930On: null }, "2027-03-17")?.status).toBe("not_eligible"));
test("ख़ुद भेजे (बिना दबाव) → unclear, रकम फिर भी", () => {
  const r = comp({ ...base, howHappened: "self_sent_deceived" });
  expect(r?.status).toBe("unclear");
  expect(r?.amount).toBe(25000);
});
test("दबाव/धमकी (digital arrest) → likely", () => expect(comp({ ...base, howHappened: "coerced" })?.status).toBe("likely"));
test("wallet → unclear", () => expect(comp({ ...base, instrument: "wallet" })?.status).toBe("unclear"));
test("company → not_eligible", () => expect(comp({ ...base, customerType: "other" })?.status).toBe("not_eligible"));
test("sole proprietor → likely", () => expect(comp({ ...base, customerType: "sole_proprietor" })?.status).toBe("likely"));
test("2028-01-01 → unclear, 2028-01-02 → नियम लागू नहीं", () => {
  const d = (x: string): FraudInput => ({ ...base, txnDate: x, reportedTo1930On: x, reportedToBankOn: x });
  expect(find(d("2028-01-01"), "2028-01-02", "rbi2027.smallValueCompensation")?.status).toBe("unclear");
  expect(find(d("2028-01-02"), "2028-01-03", "rbi2027.smallValueCompensation")).toBeUndefined();
});
test("बैंक की गलती → मुआवज़ा नहीं, पर ज़ीरो ज़िम्मेदारी likely", () => {
  expect(find({ ...base, fault: "bank" }, "2027-03-10", "rbi2027.smallValueCompensation")).toBeUndefined();
  expect(find({ ...base, fault: "bank", reportedToBankOn: null }, "2027-04-30", "rbi2027.zeroLiability")?.status).toBe("likely");
});
test("third-party: 5वें दिन तक बताया → likely, 6वें दिन → unclear", () => {
  expect(find({ ...base, fault: "third_party", reportedToBankOn: "2027-03-15" }, "2027-03-20", "rbi2027.zeroLiability")?.status).toBe("likely");
  expect(find({ ...base, fault: "third_party", reportedToBankOn: "2027-03-16" }, "2027-03-20", "rbi2027.zeroLiability")?.status).toBe("unclear");
});
test("third-party, अभी नहीं बताया, आज 2रा दिन → deadline", () =>
  expect(find({ ...base, fault: "third_party", reportedToBankOn: null }, "2027-03-11", "rbi2027.zeroLiability")?.deadlines).toContainEqual({
    labelHi: "बैंक को इस तारीख़ तक बताएँ",
    date: "2027-03-15",
    status: "confirmed",
  }));
test("गलती पता नहीं → zeroLiability unclear (बोझ बैंक पर)", () => {
  const r = find({ ...base, fault: "unknown" }, "2027-03-10", "rbi2027.zeroLiability");
  expect(r?.status).toBe("unclear");
  expect(r?.reasonsHi.join(" ")).toContain("साबित करने का बोझ बैंक पर है");
});
test("ग्राहक की लापरवाही → zeroLiability नहीं", () =>
  expect(find(base, "2027-03-10", "rbi2027.zeroLiability")).toBeUndefined());
test("बैंक जवाब: 45 दिन, विदेशी 60", () => {
  const d = (cb: boolean) => find({ ...base, crossBorder: cb }, "2027-03-10", "rbi2027.bankResponseTime")!.deadlines[0].date;
  expect(d(false)).toBe("2027-04-24");
  expect(d(true)).toBe("2027-05-09");
});
test("बैंक को नहीं बताया → बैंक-जवाब वाला नियम नहीं", () =>
  expect(find({ ...base, reportedToBankOn: null }, "2027-03-10", "rbi2027.bankResponseTime")).toBeUndefined());
test("credit card: shadow reversal 5 दिन", () =>
  expect(find({ ...base, fault: "third_party", instrument: "credit_card" }, "2027-03-10", "rbi2027.zeroLiability")!.deadlines).toContainEqual({
    labelHi: "credit card पर अस्थायी वापसी (shadow reversal)",
    date: "2027-03-15",
    status: "confirmed",
  }));
test("2026 का लेन-देन → 2027 वाला कोई नियम नहीं", () => {
  const d = "2026-12-31";
  expect(evaluateRights({ ...base, txnDate: d, reportedTo1930On: d, reportedToBankOn: d }, "2027-01-02").filter((r) => r.ruleId.startsWith("rbi2027"))).toEqual([]);
});
