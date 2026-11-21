import { expect, test } from "vitest";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";

test("मना किया शब्द पकड़ा जाता है", () => {
  expect(findForbidden("हम 100% सुरक्षित रखते हैं", FORBIDDEN_PHRASES)).toEqual([{ phrase: "100% सुरक्षित", index: 3 }]);
});

test("अंग्रेज़ी में case से फ़र्क नहीं", () => {
  expect(findForbidden("Money GUARANTEE", FORBIDDEN_PHRASES).map((f) => f.phrase)).toEqual(["guarantee"]);
});

test("साफ़ text पर कुछ नहीं", () => expect(findForbidden("1930 पर call करें", FORBIDDEN_PHRASES)).toEqual([]));

test("सूची spec से जस की तस", () => {
  expect([...FORBIDDEN_PHRASES]).toEqual([
    "100% सुरक्षित", "100% safe", "गारंटी", "guarantee", "पक्का पैसा वापस", "ज़रूर मिलेगा", "पैसा वापस दिलाएँगे", "भारत सरकार", "Government of India",
  ]);
});
