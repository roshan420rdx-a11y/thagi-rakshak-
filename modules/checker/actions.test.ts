import { expect, test } from "vitest";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";
import { RULE_ACTIONS, actionsFor } from "./actions";
import { checkMessage } from "./check";
import { CHECKER_RULES, MANY_SIGNALS } from "./patterns";

test("हर निशान के साथ 'अभी क्या करें' (कम से कम 1 कदम); हर कदम छोटा, पूरा वाक्य", () => {
  for (const id of [...CHECKER_RULES.map((r) => r.id), MANY_SIGNALS.id]) {
    const a = RULE_ACTIONS[id];
    expect(a?.length, id).toBeGreaterThan(0);
    for (const line of a!) {
      expect(line.length, `${id}: ${line}`).toBeLessThanOrEqual(150);
      expect(line.trim().endsWith("।"), `${id}: ${line}`).toBe(true);
    }
  }
  expect(Object.keys(RULE_ACTIONS).every((id) => id === MANY_SIGNALS.id || CHECKER_RULES.some((r) => r.id === id))).toBe(true);
});

test("कदमों में कोई मना किया शब्द नहीं (कोई वादा नहीं)", () => {
  expect(findForbidden(Object.values(RULE_ACTIONS).flat().join("\n"), FORBIDDEN_PHRASES)).toEqual([]);
});

test("actionsFor: निशानों के क्रम में, दोहराव नहीं, ज़्यादा से ज़्यादा 4", () => {
  const anydesk = actionsFor(checkMessage("एनडेस्क ऐप डालो, कोई जोखिम नहीं, पैसे भेजो").hits);
  expect(anydesk[0]).toContain("ऐप");
  expect(new Set(anydesk).size).toBe(anydesk.length);
  expect(anydesk.length).toBeLessThanOrEqual(4);
  expect(actionsFor(checkMessage("मेरे खाते से पैसे कट गए मैंने कुछ नहीं किया").hits)[0]).toContain("1930");
  expect(actionsFor([])).toEqual([]);
});
