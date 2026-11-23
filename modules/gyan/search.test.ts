import { expect, test } from "vitest";
import { GYAN_PAGES } from "@/modules/gyan";
import { buildSearchIndex, filterIndex } from "@/modules/gyan/search";

const index = buildSearchIndex(GYAN_PAGES);
const find = (q: string) => filterIndex(index, q).map((e) => e.slug);

test("ख़ाली खोज पर सारे पन्ने, तय क्रम में", () => expect(find("  ")).toEqual(GYAN_PAGES.map((p) => p.slug)));

test("शब्द के रूप का फ़र्क़ नहीं: अंगूठा / अंगूठे", () => expect(find("अंगूठा")).toContain("aeps-angootha"));

test("नुक़्ता का फ़र्क़ नहीं: ग़लती / गलती", () => {
  expect(find("ग़लती से पैसे")).toContain("galti-se-paise");
  expect(find("गलती से पैसे")).toContain("galti-se-paise");
});

test("हिंदी और अंग्रेज़ी दोनों: लोन / loan, ओटीपी / OTP", () => {
  expect(find("लोन")).toContain("loan-app");
  expect(find("loan")).toContain("loan-app");
  expect(find("ओटीपी")).toEqual(find("otp"));
  expect(find("OTP").length).toBeGreaterThan(0);
});

test("कई शब्द: सब मिलें (digital arrest)", () => {
  expect(find("digital arrest")).toContain("digital-arrest");
  expect(find("digital arrest")).not.toContain("lottery-inaam");
});

test("कुछ न मिले तो ख़ाली सूची", () => expect(find("zzqx")).toEqual([]));

test("index छोटा रहे (browser में जाता है): हर पन्ना 2,500 अक्षर से कम", () => {
  for (const e of index) expect(e.hay.length, e.slug).toBeLessThan(2500);
});
