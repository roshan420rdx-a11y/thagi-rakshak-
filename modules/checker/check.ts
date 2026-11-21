import { extractDomains } from "./links";
import { normalizeText } from "./normalize";
import { CHECKER_RULES, stripNegations, type RuleLevel } from "./patterns";

// "पहले पूछो" की जाँच: शुद्ध function, फ़ोन (browser) में ही चलता है। कोई network, AI या storage नहीं।
// नतीजा कभी "सुरक्षित" नहीं कहता: सबसे अच्छा नतीजा "आम निशान नहीं मिले" है।

export type Level = RuleLevel | "no_signals";

export type Hit = Omit<(typeof CHECKER_RULES)[number], "test">;

export type CheckResult = { level: Level; hits: Hit[]; domains: string[] };

export const MAX_CHECK_CHARS = 20_000;

export function checkMessage(input: string): CheckResult {
  const text = normalizeText(input.slice(0, MAX_CHECK_CHARS));
  if (!text.trim()) return { level: "no_signals", hits: [], domains: [] };
  const domains = extractDomains(text);
  const checked = { text, stripped: stripNegations(text), domains };
  const hits: Hit[] = CHECKER_RULES.filter((r) => r.test(checked)).map(toHit);
  hits.sort((a, b) => rank(a.level) - rank(b.level));
  const level: Level = hits.some((h) => h.level === "danger") ? "danger" : hits.length ? "warn" : "no_signals";
  return { level, hits, domains };
}

function toHit(rule: (typeof CHECKER_RULES)[number]): Hit {
  const { id, level, labelHi, explainHi, gyan, turant } = rule;
  return { id, level, labelHi, explainHi, ...(gyan && { gyan }), ...(turant && { turant }) };
}

function rank(level: RuleLevel): number {
  return level === "danger" ? 0 : 1;
}
