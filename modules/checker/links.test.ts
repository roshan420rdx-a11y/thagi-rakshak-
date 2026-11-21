import { expect, test } from "vitest";
import { checkMessage, extractDomains } from "@/modules/checker";

test.each([
  ["details: http://bit.ly/abc123", ["bit.ly"]],
  ["visit www.sbi-kyc-update.com now", ["sbi-kyc-update.com"]],
  ["HTTPS://HDFC-Rewards.XYZ/claim?id=1 और https://hdfc-rewards.xyz/x", ["hdfc-rewards.xyz"]],
  ["Join Telegram: t.me/earnfast", ["t.me"]],
  ["https://www.onlinesbi.sbi.bank.in/ पर login करें", ["onlinesbi.sbi.bank.in"]],
  ["VPA shop@okaxis पर ₹500 भेजे, Rs.500 debited", []],
  ["कल शाम मिलते हैं", []],
] as const)("पते निकालें: %s", (text, want) => expect(extractDomains(text)).toEqual(want));

test("ज़्यादा से ज़्यादा 5 पते", () => {
  const t = Array.from({ length: 8 }, (_, i) => `http://site${i}.com`).join(" ");
  expect(extractDomains(t)).toHaveLength(5);
});

test("checkMessage नतीजे में पते देता है", () => {
  expect(checkMessage("update KYC: http://sbi-yono-kyc.xyz").domains).toEqual(["sbi-yono-kyc.xyz"]);
  expect(checkMessage("कल शाम मिलते हैं").domains).toEqual([]);
});

const ids = (t: string) => checkMessage(t).hits.map((h) => h.id);

test.each([
  "visit www.sbi-kyc-update.com now",
  "Claim reward: http://hdfc-rewards.xyz/claim",
  "https://icici-bank-help.in/verify",
  "yono-sbi-update.online पर जाएँ",
])("bank_lookalike पकड़े: %s", (t) => expect(ids(t)).toContain("bank_lookalike"));

test.each([
  "https://www.onlinesbi.sbi.bank.in/ पर login करें",
  "https://meet.google.com/abc-defg-hij",
  "details: http://bit.ly/abc123",
])("bank_lookalike न पकड़े: %s", (t) => expect(ids(t)).not.toContain("bank_lookalike"));
