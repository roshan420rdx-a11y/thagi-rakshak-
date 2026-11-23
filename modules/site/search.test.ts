import { expect, test } from "vitest";
import { buildSiteIndex, searchSite } from "./search";

const index = buildSiteIndex();
const hrefs = (q: string) => searchSite(index, q).map((h) => h.href);

test("'1930' लिखते ही सबसे ऊपर सीधे call (tel:1930)", () => {
  expect(hrefs("1930")[0]).toBe("tel:1930");
});

test("बैंक का नाम: 'sbi' / 'SBI' → उसी बैंक का पन्ना सबसे ऊपर", () => {
  expect(hrefs("sbi")[0]).toBe("/gyan/bank/sbi");
  expect(hrefs("HDFC")[0]).toBe("/gyan/bank/hdfc");
});

test("हिंदी-अंग्रेज़ी, नुक़्ता और मात्रा का फ़र्क़ नहीं", () => {
  expect(hrefs("loan")).toEqual(expect.arrayContaining(["/turant/loan-app", "/gyan/loan-app"]));
  expect(hrefs("लोन")).toEqual(expect.arrayContaining(["/turant/loan-app"]));
  expect(hrefs("अर्ज़ी")).toContain("/arzi");
  expect(hrefs("OTP")).toContain("/pucho");
  expect(hrefs("पुलिस")).toContain("tel:112");
});

test("ख़ाली या बेमेल खोज पर कुछ नहीं; नतीजे ज़्यादा से ज़्यादा 8", () => {
  expect(searchSite(index, "   ")).toEqual([]);
  expect(searchSite(index, "ज़ज़ज़क्ष")).toEqual([]);
  expect(searchSite(index, "ठगी").length).toBeLessThanOrEqual(8);
});

test("index हल्का (होम पर जाता है): 16KB से कम, हर तरह का हिस्सा", () => {
  expect(JSON.stringify(index).length).toBeLessThan(16_000);
  for (const k of ["tel", "turant", "tool", "gyan", "bank"]) expect(index.some((e) => e.kind === k), k).toBe(true);
  expect(new Set(index.map((e) => e.href)).size).toBe(index.length);
});
