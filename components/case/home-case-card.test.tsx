import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { caseHasData, emptyCase } from "@/modules/case";
import { HomeCaseCard } from "./home-case-card";

test("HomeCaseCard: mount से पहले कुछ नहीं", () => {
  expect(renderToStaticMarkup(<HomeCaseCard />)).toBe("");
});

test("caseHasData: ख़ाली केस नहीं, कुछ भी भरा हो तो हाँ", () => {
  expect(caseHasData(emptyCase())).toBe(false);
  const c = emptyCase();
  c.stages.bank.number = "B-1";
  expect(caseHasData(c)).toBe(true);
  const d = emptyCase();
  d.txnDate = "2026-11-20";
  expect(caseHasData(d)).toBe(true);
});
