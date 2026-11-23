import { expect, test } from "vitest";
import { AKSHAR_KEY, AKSHAR_LEVELS, TEXT_SIZE_PRESCRIPT, aksharLabel, nextAkshar, readAkshar } from "@/modules/ui/text-size";

test("तीन स्तर: सामान्य, बड़े, और बड़े; क्रम से घूमते हैं", () => {
  expect(AKSHAR_LEVELS.map((l) => l.id)).toEqual(["1", "2", "3"]);
  expect(nextAkshar("1")).toBe("2");
  expect(nextAkshar("2")).toBe("3");
  expect(nextAkshar("3")).toBe("1");
  expect(aksharLabel("1")).toBe("सामान्य");
  expect(aksharLabel("3")).toBe("और बड़े");
});

test("ग़लत या ख़ाली मान पर सामान्य", () => {
  expect(readAkshar(null)).toBe("1");
  expect(readAkshar("9")).toBe("1");
  expect(readAkshar("2")).toBe("2");
});

test("पहले से लगने वाली script: सिर्फ़ data-akshar लगाती है, storage न मिले तो चुप", () => {
  expect(TEXT_SIZE_PRESCRIPT).toContain(AKSHAR_KEY);
  expect(TEXT_SIZE_PRESCRIPT).toContain("dataset.akshar");
  expect(TEXT_SIZE_PRESCRIPT).toContain("catch");
  expect(TEXT_SIZE_PRESCRIPT.length).toBeLessThan(300);
});
