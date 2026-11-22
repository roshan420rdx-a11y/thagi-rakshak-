import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { GYAN_PAGES, getGyanPage, gyanForTurant } from "@/modules/gyan";
import { isValidIsoDate } from "@/modules/rules-engine";
import { isTurantSlug } from "@/modules/scams";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const ALLOWED_LINKS = ["/haq/thagi", "/gyan/bank", "/haq/frozen-money", "/turant"];

test("12 पन्ने, तय क्रम", () =>
  expect(GYAN_PAGES.map((p) => p.slug)).toEqual([
    "digital-arrest",
    "customer-care-fake",
    "upi-pin-qr",
    "task-investment",
    "apk-file",
    "bijli-bill",
    "lottery-inaam",
    "sextortion",
    "loan-app",
    "kyc-link",
    "apna-bankar",
    "galti-se-paise",
  ]));

test.each(GYAN_PAGES.map((p) => [p.slug, p] as const))("%s: ढाँचे के गिनती वाले नियम", (_s, p) => {
  expect(p.summaryHi).toHaveLength(3);
  expect(p.howHi.length).toBeGreaterThanOrEqual(4);
  expect(p.signsHi).toHaveLength(5);
  expect(p.examplesHi.length).toBeGreaterThanOrEqual(2);
  expect(p.rulesHi).toHaveLength(3);
  expect(p.faq.length).toBeGreaterThanOrEqual(2);
  expect(p.descriptionHi.length).toBeLessThanOrEqual(160);
  expect(isTurantSlug(p.turantSlug)).toBe(true);
  expect(isValidIsoDate(p.lastCheckedOn)).toBe(true);
  expect(p.reviewer).toBeNull(); // अभी कोई विशेषज्ञ नहीं जाँचता; गढ़कर नहीं लिखना
});

test.each(GYAN_PAGES.map((p) => [p.slug, p] as const))("%s: हर RBI quote मूल फ़ाइल में, हर link तय सूची में", (_s, p) => {
  for (const f of p.faq) {
    if (f.source) expect(norm(readFileSync(path.resolve(__dirname, "../..", f.source.file), "utf8"))).toContain(norm(f.source.quote));
    if (f.link) expect(ALLOWED_LINKS).toContain(f.link.href);
  }
});

test("हो गया है? का सही /turant पन्ना", () => {
  expect(getGyanPage("digital-arrest")?.turantSlug).toBe("digital-arrest");
  expect(getGyanPage("upi-pin-qr")?.turantSlug).toBe("upi");
  expect(getGyanPage("task-investment")?.turantSlug).toBe("investment-task");
  expect(getGyanPage("bijli-bill")?.turantSlug).toBe("customer-care-fake");
  expect(getGyanPage("lottery-inaam")?.turantSlug).toBe("upi");
  expect(getGyanPage("sextortion")?.turantSlug).toBe("sextortion");
  expect(getGyanPage("loan-app")?.turantSlug).toBe("loan-app");
  expect(getGyanPage("kyc-link")?.turantSlug).toBe("netbanking");
  expect(getGyanPage("apna-bankar")?.turantSlug).toBe("upi");
  expect(getGyanPage("galti-se-paise")?.turantSlug).toBe("upi");
});

test("gyanForTurant: customer-care-fake → customer care, APK और बिजली बिल", () =>
  expect(gyanForTurant("customer-care-fake").map((p) => p.slug)).toEqual(["customer-care-fake", "apk-file", "bijli-bill"]));

test("sextortion पन्ने में Tele-MANAS और 'आपकी गलती नहीं'", () => {
  const text = JSON.stringify(getGyanPage("sextortion"));
  expect(text).toContain("14416");
  expect(text).toContain("आपकी गलती नहीं");
});

test("KYC वाले पन्ने में .bank.in का RBI हवाला", () =>
  expect(getGyanPage("kyc-link")!.faq.some((f) => f.source?.paragraph.startsWith("RBI/2025-26/28"))).toBe(true));

test("loan-app पन्ने में 'loan से पहले fee' वाला सवाल", () =>
  expect(getGyanPage("loan-app")!.faq.some((f) => f.qHi.includes("fee"))).toBe(true));

test("getGyanPage ग़लत slug पर undefined", () => expect(getGyanPage("xyz")).toBeUndefined());

test("digital arrest के FAQ में दबाव/धमकी वाली RBI परिभाषा", () =>
  expect(getGyanPage("digital-arrest")!.faq.some((f) => f.source?.paragraph === "4(15A)")).toBe(true));
