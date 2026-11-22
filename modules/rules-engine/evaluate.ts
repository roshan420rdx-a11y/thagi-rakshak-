import { liability2025 } from "./rules/rbi-2025-old";
import { RBI_2027_RULES } from "./rules/rbi-2027";
import { ombudsmanWindow } from "./rules/rbios-2026";
import type { FraudInput, RightResult, Rule } from "./types";

export const RULES: readonly Rule[] = [liability2025, ...RBI_2027_RULES, ombudsmanWindow];

function applies(rule: Rule, txnDate: string): boolean {
  if (rule.txnFrom && txnDate < rule.txnFrom) return false; // "YYYY-MM-DD" strings की तुलना तारीख़ों जैसी ही होती है
  if (rule.txnTo && txnDate > rule.txnTo) return false;
  return true;
}

// लेन-देन की तारीख़ पर जो नियम लागू हैं, उनके नतीजे (null वाले छोड़कर)
export function evaluateRights(input: FraudInput, today: string, rules: readonly Rule[] = RULES): RightResult[] {
  return rules.filter((r) => applies(r, input.txnDate)).flatMap((r) => r.evaluate(input, today) ?? []);
}
