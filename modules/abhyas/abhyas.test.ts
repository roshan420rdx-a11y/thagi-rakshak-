import { expect, test } from "vitest";
import { ABHYAS_ITEMS, ROUND_REAL, ROUND_SIZE, judge, pickRound, scoreMessage } from "@/modules/abhyas";
import { checkMessage } from "@/modules/checker";
import { getGyanPage } from "@/modules/gyan";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";

const scams = ABHYAS_ITEMS.filter((i) => i.scam);
const reals = ABHYAS_ITEMS.filter((i) => !i.scam);

// छोटा seed वाला random (test में पक्का क्रम)
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

test("कम से कम 14 ठगी और 8 असली message, id अलग-अलग", () => {
  expect(scams.length).toBeGreaterThanOrEqual(14);
  expect(reals.length).toBeGreaterThanOrEqual(8);
  expect(new Set(ABHYAS_ITEMS.map((i) => i.id)).size).toBe(ABHYAS_ITEMS.length);
});

test.each(scams.map((i) => [i.id, i] as const))("ठगी वाला '%s': 'पहले पूछो' भी निशान दिखाए (सिखाई बात उलटी नहीं)", (_id, i) => {
  expect(checkMessage(i.text).level).not.toBe("no_signals");
});

// कारण भी सही हो: पक्के (danger) निशान उसी ठगी के हों जिसका पन्ना है (वरना ग़लत पन्ने पर भेजेंगे)
test.each(scams.filter((i) => i.gyan).map((i) => [i.id, i] as const))("ठगी वाला '%s': पक्के निशान उसी ठगी के", (_id, i) => {
  const hits = checkMessage(i.text).hits.filter((h) => h.level === "danger" && h.id !== "many_signals");
  for (const h of hits) expect(h.gyan, `${i.id}: ${h.id}`).toBe(i.gyan);
  expect(checkMessage(i.text).hits.some((h) => h.gyan === i.gyan), i.id).toBe(true);
});

test.each(reals.map((i) => [i.id, i] as const))("असली वाला '%s': 'पहले पूछो' कोई निशान न दिखाए", (_id, i) => {
  expect(checkMessage(i.text).hits).toEqual([]);
});

test("हर ज्ञानकोश link असली पन्ना; कोई मना किया शब्द नहीं; 'सुरक्षित' का दावा नहीं", () => {
  for (const i of ABHYAS_ITEMS) {
    if (i.gyan) expect(getGyanPage(i.gyan), i.id).toBeDefined();
    const copy = `${i.channelHi} ${i.text} ${i.whyHi}`;
    expect(findForbidden(copy, FORBIDDEN_PHRASES), i.id).toEqual([]);
    expect(i.whyHi, i.id).not.toContain("सुरक्षित");
  }
});

test("एक round: 8 सवाल, 5 ठगी + 3 असली, कोई दोहराव नहीं", () => {
  for (let seed = 1; seed <= 30; seed++) {
    const r = pickRound(ABHYAS_ITEMS, seeded(seed));
    expect(r).toHaveLength(ROUND_SIZE);
    expect(r.filter((i) => !i.scam)).toHaveLength(ROUND_REAL);
    expect(new Set(r.map((i) => i.id)).size).toBe(ROUND_SIZE);
  }
});

test("round का क्रम मिला हुआ: असली वाले हर बार एक ही जगह नहीं, और हर बार वही सवाल नहीं", () => {
  const realSpots = new Set<string>();
  const sets = new Set<string>();
  for (let seed = 1; seed <= 30; seed++) {
    const r = pickRound(ABHYAS_ITEMS, seeded(seed));
    realSpots.add(r.map((i) => (i.scam ? "x" : "o")).join(""));
    sets.add(r.map((i) => i.id).sort().join(","));
  }
  expect(realSpots.size).toBeGreaterThan(5);
  expect(sets.size).toBeGreaterThan(5);
});

test("जवाब: ठगी को ठगी कहा → सही, निशान 'पहले पूछो' वाले; असली को ठगी कहा → ग़लत पर शाबाशी", () => {
  const s = scams[0];
  const ok = judge(s, true);
  expect(ok.correct).toBe(true);
  expect(ok.titleHi).toBe("सही! यह ठगी है।");
  expect(ok.signsHi.length).toBeGreaterThan(0);
  expect(ok.signsHi).toEqual(checkMessage(s.text).hits.map((h) => h.labelHi));
  const miss = judge(s, false);
  expect(miss.correct).toBe(false);
  expect(miss.titleHi).toBe("यह ठगी है।");

  const r = reals[0];
  expect(judge(r, false)).toMatchObject({ correct: true, titleHi: "सही! इसमें ठगी का कोई निशान नहीं।", signsHi: [] });
  const cautious = judge(r, true);
  expect(cautious.correct).toBe(false);
  expect(cautious.titleHi).toContain("शक करना अच्छी आदत है");
});

test("नतीजे का संदेश: पूरे, ज़्यादातर, और कम सही पर अलग; कोई मना किया शब्द नहीं", () => {
  const all = scoreMessage(8, 8);
  const most = scoreMessage(6, 8);
  const few = scoreMessage(3, 8);
  expect(new Set([all, most, few]).size).toBe(3);
  for (const m of [all, most, few]) expect(findForbidden(m, FORBIDDEN_PHRASES)).toEqual([]);
});
