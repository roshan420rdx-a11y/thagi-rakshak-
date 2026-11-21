import { expect, test } from "vitest";
import { TAT_ROWS, evaluateFailedTxn } from "./rules/tat-2019";

test("UPI: T+1, 4 दिन बाद लौटा → 3 दिन देर → ₹300", () =>
  expect(evaluateFailedTxn({ channel: "upi_transfer", txnDate: "2027-01-10", resolvedOn: "2027-01-14" }, "2027-01-20")).toMatchObject({
    dueDate: "2027-01-11",
    daysLate: 3,
    compensation: 300,
  }));
test("ATM: T+5 के अंदर → 0", () =>
  expect(evaluateFailedTxn({ channel: "atm", txnDate: "2027-01-10", resolvedOn: "2027-01-15" }, "2027-01-20").compensation).toBe(0));
test("अभी नहीं लौटा → आज तक गिनें", () =>
  expect(evaluateFailedTxn({ channel: "atm", txnDate: "2027-01-10", resolvedOn: null }, "2027-01-18").compensation).toBe(300));
test("तय दिन से पहले → 0, ऋणात्मक नहीं", () =>
  expect(evaluateFailedTxn({ channel: "atm", txnDate: "2027-01-10", resolvedOn: null }, "2027-01-11").daysLate).toBe(0));
test("13 channels, सब पर 100, T+1 या T+5", () => {
  expect(Object.keys(TAT_ROWS)).toHaveLength(13);
  for (const r of Object.values(TAT_ROWS)) {
    expect(r.perDay).toBe(100);
    expect([1, 5]).toContain(r.days);
  }
  expect(TAT_ROWS.upi_merchant.days).toBe(5);
  expect(TAT_ROWS.imps.days).toBe(1);
});
test("स्रोत का quote", () =>
  expect(evaluateFailedTxn({ channel: "imps", txnDate: "2027-01-10", resolvedOn: null }, "2027-01-10").source.paragraph).toBe("Annex, para 5, para 6"));
