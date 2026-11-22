import { expect, test } from "vitest";
import { CASE_KEY, caseDeadlines, emptyCase, nextStage, parseCase, serializeCase } from "@/modules/case";

const TODAY = "2026-11-22";

test("ख़ाली केस: पाँचों पड़ाव ख़ाली, अगला पड़ाव 1930", () => {
  const c = emptyCase();
  expect(Object.keys(c.stages)).toEqual(["call_1930", "ncrp", "bank", "police", "ombudsman"]);
  expect(nextStage(c)).toBe("call_1930");
});

test("सेव और वापस पढ़ना (एक ही key)", () => {
  const c = emptyCase();
  c.txnDate = "2026-11-20";
  c.amount = 4999.5;
  c.stages.call_1930 = { on: "2026-11-20", number: "ABC123" };
  const back = parseCase(serializeCase(c), TODAY);
  expect(back).toEqual(c);
  expect(CASE_KEY).toBe("thagi-rakshak:mera-case:v1");
});

test("ख़राब या ग़लत data पर ख़ाली केस (ऐप टूटे नहीं)", () => {
  expect(parseCase(null, TODAY)).toEqual(emptyCase());
  expect(parseCase("{not json", TODAY)).toEqual(emptyCase());
  expect(parseCase(JSON.stringify({ v: 99 }), TODAY)).toEqual(emptyCase());
});

test("भविष्य की तारीख़, ग़लत रकम और बहुत लंबा नंबर नहीं माने जाते", () => {
  const raw = JSON.stringify({
    v: 1,
    txnDate: "2027-12-31",
    amount: -5,
    recovered: null,
    stages: { call_1930: { on: "2026-02-30", number: "x".repeat(200) } },
  });
  const c = parseCase(raw, TODAY);
  expect(c.txnDate).toBeNull();
  expect(c.amount).toBeNull();
  expect(c.stages.call_1930.on).toBeNull();
  expect(c.stages.call_1930.number.length).toBeLessThanOrEqual(40);
});

test("अगला पड़ाव: जो पहला पूरा नहीं (तारीख़ नहीं); सब हो गए तो null", () => {
  const c = emptyCase();
  c.stages.call_1930.on = "2026-11-20";
  c.stages.ncrp.on = "2026-11-20";
  expect(nextStage(c)).toBe("bank");
  for (const k of Object.keys(c.stages) as (keyof typeof c.stages)[]) c.stages[k].on = "2026-11-21";
  expect(nextStage(c)).toBeNull();
});

test("आगे की तारीख़ें rules engine से: बैंक की तारीख़ हो तो Ombudsman की खिड़की, तारीख़ के क्रम में", () => {
  const c = emptyCase();
  c.txnDate = "2026-11-20";
  c.amount = 40000;
  c.stages.call_1930.on = "2026-11-20";
  c.stages.bank.on = "2026-11-21";
  const d = caseDeadlines(c, TODAY);
  expect(d.length).toBeGreaterThan(0);
  expect(d.some((x) => x.labelHi.includes("RBI Ombudsman"))).toBe(true);
  expect([...d].map((x) => x.date)).toEqual([...d].map((x) => x.date).sort());
});

test("ठगी की तारीख़ या रकम न हो तो कोई हिसाब नहीं (अंदाज़ा नहीं)", () => {
  expect(caseDeadlines(emptyCase(), TODAY)).toEqual([]);
});
