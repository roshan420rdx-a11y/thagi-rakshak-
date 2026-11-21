import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { RULES } from "./evaluate";
import { TAT_SOURCE } from "./rules/tat-2019";

// हर नियम का quote, docs/sources/rbi की मूल फ़ाइल में जस का तस हो (spaces को छोड़कर)
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

test.each(RULES.map((r) => [r.id, r] as const))("%s: quote मूल फ़ाइल में जस का तस", (_id, rule) => {
  const text = readFileSync(path.resolve(__dirname, "../..", rule.source.file), "utf8");
  expect(rule.source.quote.length).toBeGreaterThan(40);
  expect(norm(text)).toContain(norm(rule.source.quote));
  expect(rule.verifiedBy).toContain("claude");
  expect(rule.source.url).toMatch(/^https:\/\/www\.rbi\.org\.in\//);
});

test("rule ids अलग-अलग", () => expect(new Set(RULES.map((r) => r.id)).size).toBe(RULES.length));

test("TAT का quote मूल फ़ाइल में", () => {
  const text = readFileSync(path.resolve(__dirname, "../..", TAT_SOURCE.file), "utf8");
  expect(norm(text)).toContain(norm(TAT_SOURCE.quote));
});
