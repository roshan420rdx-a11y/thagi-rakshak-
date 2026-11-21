import { expect, test } from "vitest";
import { GLOSSARY, parseLocale, translate } from "@/modules/i18n";

test("अनुवाद न हो तो हिंदी", () => expect(translate("en", "नया वाक्य")).toBe("नया वाक्य"));
test("vars भरते हैं", () => expect(translate("hi", "{n} दिन बाकी", { n: 4 })).toBe("4 दिन बाकी"));
test("parseLocale: अनजान मान पर हिंदी", () => {
  expect(parseLocale("en")).toBe("en");
  expect(parseLocale("xx")).toBe("hi");
  expect(parseLocale(undefined)).toBe("hi");
});
test("glossary में UTR का तय शब्द", () => {
  expect(GLOSSARY.find((g) => g.term === "UTR")?.hi).toBe("लेन-देन नंबर (UTR)");
});
test("glossary में spec की 10 लाइनें", () => expect(GLOSSARY).toHaveLength(10));
