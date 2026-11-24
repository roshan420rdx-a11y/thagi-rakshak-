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

test("सरकारी पता: .gov.in या .nic.in", async () => {
  const { isGovDomain } = await import("@/modules/checker/links");
  expect(isGovDomain("incometax.gov.in")).toBe(true);
  expect(isGovDomain("echallan.parivahan.gov.in")).toBe(true);
  expect(isGovDomain("services.india.nic.in")).toBe(true);
  expect(isGovDomain("echallan-parivahan.xyz")).toBe(false);
  expect(isGovDomain("gov.in.fake-site.com")).toBe(false);
});

// UPI ID (help.me@ybl) और email (ram.kumar@gmail.com) link नहीं हैं: "@" से ठीक पहले या बाद वाला पता नहीं गिना जाता
test.each([
  ["mera upi help.me@ybl hai, us par bhejo", []],
  ["email me at ram.kumar@gmail.com", []],
  ["resume hr.team@company.in par bhejo", []],
] as const)("UPI ID या email पता नहीं: %s", (text, want) => {
  expect(extractDomains(text)).toEqual(want);
  expect(checkMessage(text).hits.map((h) => h.id)).not.toContain("link");
});

test("पर असली link अब भी link: 'help.me' अकेला, या email के साथ अलग से link", () => {
  expect(checkMessage("visit help.me now").hits.map((h) => h.id)).toContain("link");
  expect(checkMessage("mail ram@gmail.com, details: sbi-kyc.top").hits.map((h) => h.id)).toContain("link");
  expect(extractDomains("mail ram@gmail.com, details: sbi-kyc.top")).toEqual(["sbi-kyc.top"]);
});
