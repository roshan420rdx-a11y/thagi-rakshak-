import { expect, test } from "vitest";
import { parseRupees } from "./money";

test.each([
  ["40000", 40000],
  ["40,000", 40000],
  ["4,00,000", 400000],
  ["4999.50", 4999.5],
  ["4,999.5", 4999.5],
  ["₹40,000", 40000],
  ["₹ 12,000/-", 12000],
  ["Rs. 12000", 12000],
  ["rs 500", 500],
  ["12000 रुपये", 12000],
  ["  2500  ", 2500],
  ["४०,०००", 40000],
  ["0", 0],
])("रकम पढ़ें: %s → %s", (raw, want) => expect(parseRupees(raw)).toBe(want));

test.each(["", "abc", "-500", "1.234", "12,00,00,00,000", "40 000 500", "4..5", "₹", "1e5", "0x10", "Infinity", "NaN"])(
  "ग़लत रकम: '%s' → null",
  (raw) => expect(parseRupees(raw)).toBeNull(),
);

test("बहुत बड़ी रकम (100 करोड़ से ज़्यादा) → null", () => {
  expect(parseRupees("1000000000")).toBe(1_000_000_000);
  expect(parseRupees("1000000001")).toBeNull();
});
