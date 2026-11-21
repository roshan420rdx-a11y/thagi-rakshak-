# Plan A2b: नियम-तालिका, rules engine और /haq calculator (TR-6 से TR-8) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** पीड़ित अपनी ठगी की तारीख़, रकम और हालात भरे, और बिना login, बिना JavaScript उसे RBI के मूल नियमों के हिसाब से पता चले: (1) ज़ीरो ज़िम्मेदारी (पूरा पैसा वापस) का हक़ बनता है या नहीं, (2) ₹25,000 तक का मुआवज़ा बनता है या नहीं, (3) बैंक को कब तक जवाब देना है। हर नतीजे के साथ RBI का paragraph, और "पक्का", "संभावित" या "साफ़ नहीं" का निशान। साथ में fail हुए लेन-देन (ठगी नहीं) पर ₹100 रोज़ का calculator, और freeze हुए पैसे की गाइड।

**Architecture:** `modules/rules-engine` शुद्ध TypeScript रहेगा: न database, न network, न `Date.now()` (आज की तारीख़ input में आती है)। हर नियम एक typed object है, जिसमें id, version, किन तारीख़ों के लेन-देन पर लागू है, मूल स्रोत (URL, paragraph, जस का तस quote) और एक शुद्ध `evaluate` function होता है। तारीख़ें `"YYYY-MM-DD"` strings में रहेंगी, और गिनती UTC में होगी ताकि timezone से गड़बड़ न हो। `/haq` के पन्ने साधारण `<form method="get">` हैं, जिनका नतीजा server पर बनता है, इसलिए बिना JS के भी चलते हैं।

**Tech Stack:** plan A1/A2a वाला ही (Zod से form input की जाँच)

**Spec:** `DISHA.md` (नियम 4) · Design v2 भाग 6 F3 · भाग 2 खंड 6.9 · **मूल स्रोत: `docs/sources/rbi/`** (इस plan के सारे नियम और संख्याएँ वहीं से हैं)

## Global Constraints
- हर `RightResult` में `source.url`, `source.paragraph` और `source.quote` होंगे। quote स्रोत-फ़ाइल में जस का तस मिलना चाहिए। एक test हर नियम के quote को `docs/sources/rbi/*.txt` में खोजकर पक्का करेगा।
- हर नियम पर `verifiedBy: ["claude"]` होगा। 👤 मालिक की दूसरी जाँच के बाद `"owner"` जुड़ेगा। जब तक दूसरी जाँच न हो, UI में दिखेगा: `RBI के मूल text से मिलाया गया · दूसरी जाँच बाकी`।
- status का क्रम: `confirmed` (पक्का) > `likely` (संभावित) > `unclear` (साफ़ नहीं) > `not_eligible` (हक़ नहीं)। **"bona fide" होने का फ़ैसला बैंक करता है, इसलिए मुआवज़ा और ज़ीरो ज़िम्मेदारी कभी `confirmed` नहीं होंगे, ज़्यादा से ज़्यादा `likely`।** सिर्फ़ समय-सीमाएँ (deadlines) `confirmed` होंगी।
- रकम ₹ में, भारतीय ढंग से (`Intl.NumberFormat("en-IN")`), और पूरे रुपये में (`Math.round`)।
- हिंदी तारीख़: `12 जनवरी 2027` (महीनों के नाम: जनवरी, फ़रवरी, मार्च, अप्रैल, मई, जून, जुलाई, अगस्त, सितंबर, अक्टूबर, नवंबर, दिसंबर)।
- "आज" की तारीख़ Asia/Kolkata समय से (`Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" })`)।
- मना किए शब्दों का नियम (copy-lint) पहले जैसा। नतीजों में "मिलेगा" की जगह "बनता है / संभावित" लिखा जाएगा।

### मूल नियमों से तय संख्याएँ (जस की तस, स्रोत के साथ)
| बात | मान | स्रोत |
|---|---|---|
| नए नियम किन लेन-देन पर | 1 जनवरी 2027 या उसके बाद | 2026 directions, 3(2) |
| मुआवज़े की ठगी-अवधि | लागू होने से एक साल तक (`2027-01-01` से `2027-12-31` तक पक्का, `2028-01-01` को `unclear`) | 76U |
| मुआवज़ा किस हाल में | ग्राहक की लापरवाही वाले मामले (76N), व्यक्ति या sole proprietor, कुल नुकसान ≤ ₹50,000, ज़िंदगी में एक बार | 76T(1) |
| मुआवज़े का हिसाब | min(85% × (कुल नुकसान − वापस मिला), ₹25,000) | 76T(1) |
| रिपोर्ट की शर्त | NCRP/1930 **और** बैंक, दोनों को ठगी के 5 calendar days के अंदर | 76T(1)(b) |
| ज़ीरो ज़िम्मेदारी: बैंक की गलती | हमेशा, रिपोर्ट करें या न करें | 76L |
| ज़ीरो ज़िम्मेदारी: third-party की गलती | बैंक को 5 calendar days में बताया हो, वरना बैंक की नीति | 76M |
| बैंक का जवाब | शिकायत से 45 calendar days (विदेशी लेन-देन: 60) | 76Q |
| credit card की shadow reversal | सूचना से 5 calendar days | 76R |
| मुआवज़े का भुगतान | अर्ज़ी से 5 calendar days | 76T(5) |
| ठगी की परिभाषा | धोखे से लिए credentials से किया गया, या दबाव/धमकी (coercion or duress) में ग्राहक की मंज़ूरी से हुआ, या बिना मंज़ूरी का लेन-देन | 4(15A) |
| पुराने नियम (2027 से पहले): third-party | 3 कार्य-दिवस में ज़ीरो · 4 से 7 में सीमित (Table 1: BSBD ₹5,000 · बाकी बचत खाता, PPI, ₹5 लाख तक का credit card वगैरह ₹10,000 · बाकी ₹25,000) · 7 से ज़्यादा में बैंक की नीति | 2025 directions 67, 68, 70 |
| पुराने नियम: shadow credit / हल | 10 कार्य-दिवस में shadow credit · 90 दिन में हल | 72, 73 |
| fail हुआ लेन-देन (ठगी नहीं) | तालिका नीचे Task 4 में | 2019 TAT circular |

## Review Focus
1. **भविष्य की तारीख़ या ग़लत तारीख़ (`2027-02-30`)** डाली जाए: crash न हो, बल्कि "तारीख़ ठीक करें" का संदेश आए → Task 5 (Zod + `isValidIsoDate`) का test।
2. **"वापस मिला" की रकम कुल नुकसान से ज़्यादा हो:** मुआवज़ा 0 या ऋणात्मक न दिखे, `not_eligible` आए ("कोई नुकसान बाकी नहीं") → Task 2 का test।
3. **आज ठगी का 3रा दिन है और अभी बैंक को नहीं बताया:** `not_eligible` नहीं, बल्कि `likely` आए, साथ में deadline "X तारीख़ तक 1930 और बैंक दोनों को बताएँ" → Task 2 का test।
4. **ख़ुद पैसे भेजे (निवेश या task वाली ठगी, बिना दबाव के):** परिभाषा से साफ़ नहीं होता, इसलिए `unclear`, और कारण में यही लिखा हो → Task 2 का test।
5. **wallet (बैंक के बाहर वाला) से पैसे गए:** ये directions बैंकों पर हैं, इसलिए `unclear` → Task 2 का test।

---

## File Structure
```
docs/sources/rbi/*                          (हो चुका: मूल text)
modules/rules-engine/
  dates.ts  dates.test.ts                   isValidIsoDate, addDays, daysBetween, workingDaysBetween, formatHindiDate, todayInKolkata
  types.ts                                  FraudInput, RightResult, Rule, Source, Status, ...
  sources.ts                                स्रोतों के URL और नाम (एक जगह)
  rules/rbi-2027.ts                         3 नियम: zero-liability, small-value-compensation, bank-response-time
  rules/rbi-2025-old.ts                     2027 से पहले वाले नियम
  rules/tat-2019.ts                         fail लेन-देन की तालिका + evaluateFailedTxn
  evaluate.ts                               evaluateRights(input, today, rules?)
  index.ts
  rbi-2027.test.ts  rbi-2025-old.test.ts  tat-2019.test.ts  sources.test.ts  evaluate.test.ts
modules/haq/{form.ts, form.test.ts, index.ts}   searchParams → input (Zod), ग़लतियाँ हिंदी में
components/haq/{rights-result.tsx, source-line.tsx, haq.test.tsx}
app/(site)/haq/page.tsx                     /haq: तीनों का परिचय
app/(site)/haq/rbi-2027/page.tsx            GET form + नतीजा
app/(site)/haq/failed-txn/page.tsx          GET form + नतीजा
app/(site)/haq/frozen-money/page.tsx        गाइड (MRM)
scripts/e2e-haq.mjs
```

---

### Task 1 (TR-7): तारीख़ों के औज़ार
**Files:** `modules/rules-engine/dates.ts`, `dates.test.ts`
**Interfaces (Produces):** `isValidIsoDate(s: string): boolean` · `addDays(iso: string, n: number): string` · `daysBetween(from: string, to: string): number` (to − from, calendar days) · `workingDaysBetween(from: string, to: string): number` (from के अगले दिन से to तक, जिसमें रविवार और महीने के दूसरे/चौथे शनिवार न गिने जाएँ; सरकारी छुट्टियाँ हमें नहीं पता, इसलिए वे नहीं घटतीं) · `formatHindiDate(iso: string): string` · `todayInKolkata(now?: Date): string`

- [ ] **Step 1: tests लिखें**
```ts
test("isValidIsoDate", () => { expect(isValidIsoDate("2027-02-28")).toBe(true); expect(isValidIsoDate("2027-02-30")).toBe(false); expect(isValidIsoDate("27-2-1")).toBe(false); });
test("addDays महीना पार", () => expect(addDays("2027-01-30", 5)).toBe("2027-02-04"));
test("daysBetween", () => expect(daysBetween("2027-01-01", "2027-01-06")).toBe(5));
test("workingDays: रविवार और दूसरा शनिवार नहीं गिने", () =>
  // 2027-01-08 (शुक्र) → 2027-01-11 (सोम): 9 जनवरी दूसरा शनिवार, 10 रविवार → सिर्फ़ 11 = 1
  expect(workingDaysBetween("2027-01-08", "2027-01-11")).toBe(1));
test("workingDays: पहला शनिवार गिना जाता है", () =>
  // 2027-01-01 (शुक्र) → 2027-01-04 (सोम): 2 जनवरी पहला शनिवार (गिना), 3 रविवार → 2 और 4 = 2
  expect(workingDaysBetween("2027-01-01", "2027-01-04")).toBe(2));
test("हिंदी तारीख़", () => expect(formatHindiDate("2027-01-12")).toBe("12 जनवरी 2027"));
test("Kolkata की आज की तारीख़ (UTC 20:00 = अगले दिन IST)", () =>
  expect(todayInKolkata(new Date("2027-01-12T20:00:00Z"))).toBe("2027-01-13"));
```
- [ ] **Step 2:** `npx vitest run modules/rules-engine/dates.test.ts` → FAIL
- [ ] **Step 3:** लिखें (सारी गिनती `Date.UTC` से)
- [ ] **Step 4:** → PASS
- [ ] **Step 5:** commit `TR-7: तारीख़ों के औज़ार (UTC, कार्य-दिवस, हिंदी तारीख़)`

### Task 2 (TR-6 + TR-7): 2027 वाले नियम, types और स्रोत-जाँच
**Files:** `types.ts`, `sources.ts`, `rules/rbi-2027.ts`, `evaluate.ts`, `index.ts`, `rbi-2027.test.ts`, `sources.test.ts`, `evaluate.test.ts`

**Interfaces (Produces):**
```ts
export type Status = "confirmed" | "likely" | "unclear" | "not_eligible";
export type HowHappened = "credentials_taken" | "coerced" | "self_sent_deceived" | "unauthorised" | "unknown";
export type Fault = "bank" | "third_party" | "customer" | "unknown";
export type Instrument = "bank_account" | "credit_card" | "wallet";
export type AccountKind = "bsbd" | "savings" | "small_current_or_card" | "other_current_or_big_card" | "unknown";
export type FraudInput = {
  txnDate: string; grossLoss: number; recovered: number;
  customerType: "individual" | "sole_proprietor" | "other";
  howHappened: HowHappened; fault: Fault; instrument: Instrument; accountKind: AccountKind;
  reportedTo1930On: string | null; reportedToBankOn: string | null;
  priorCompensation: boolean; crossBorder: boolean;
};
export type Source = { file: string; url: string; paragraph: string; quote: string };
export type Deadline = { labelHi: string; date: string; status: "confirmed" | "likely" };
export type RightResult = { ruleId: string; ruleVersion: number; titleHi: string; status: Status; amount?: number; reasonsHi: string[]; deadlines: Deadline[]; source: Source; verifiedBy: string[] };
export type Rule = { id: string; version: number; titleHi: string; txnFrom: string | null; txnTo: string | null; source: Source; verifiedBy: string[]; evaluate(input: FraudInput, today: string): RightResult | null };
export function evaluateRights(input: FraudInput, today: string, rules?: readonly Rule[]): RightResult[];  // सिर्फ़ उन नियमों के नतीजे जिनकी txnFrom/txnTo में txnDate आती है, और जो null न लौटाएँ
export const RULES: readonly Rule[];
```

**नियम (rules/rbi-2027.ts):**
1. `rbi2027.zeroLiability` ("पूरा पैसा वापस (ज़ीरो ज़िम्मेदारी)", txnFrom `2027-01-01`, para 76L/76M):
   - fault `bank` → `likely`, कारण `बैंक की गलती हो तो, रिपोर्ट करें या न करें, ज़िम्मेदारी ज़ीरो है।`
   - fault `third_party` + बैंक को txn+5 के अंदर बताया → `likely`
   - fault `third_party` + बैंक को बाद में बताया → `unclear` ("बैंक की नीति के हिसाब से")
   - fault `third_party` + अभी नहीं बताया + आज ≤ txn+5 → `likely`, deadline `बैंक को इस तारीख़ तक बताएँ` = txn+5
   - fault `third_party` + अभी नहीं बताया + आज > txn+5 → `unclear`
   - fault `unknown` → `unclear`, कारण `गलती किसकी है, यह बैंक जाँच से तय करेगा, और साबित करने का बोझ बैंक पर है (76K)।`
   - fault `customer` → `null`
   - instrument `credit_card` और बैंक को बताया हो → deadline `credit card पर अस्थायी वापसी (shadow reversal)` = reportedToBankOn + 5, status `confirmed`
2. `rbi2027.smallValueCompensation` ("छोटी ठगी पर मुआवज़ा (ज़्यादा से ज़्यादा ₹25,000)", txnFrom `2027-01-01`, txnTo `2028-01-01`, para 76T(1)):
   - इसी क्रम में जाँचें, पहली लागू शर्त का नतीजा लौटाएँ:
     - fault `bank` या `third_party` → `null` (उनके लिए नियम 1 है)
     - txnDate `2028-01-01` → `unclear` (`"एक साल तक" का आख़िरी दिन साफ़ नहीं।`)
     - customerType `other` → `not_eligible` (`यह मुआवज़ा सिर्फ़ व्यक्ति या sole proprietor के लिए है।`)
     - instrument `wallet` → `unclear` (`ये नियम बैंकों पर हैं; wallet कंपनी बैंक न हो तो साफ़ नहीं।`)
     - grossLoss > 50000 → `not_eligible` (`कुल नुकसान ₹50,000 से ज़्यादा है।`)
     - priorCompensation → `not_eligible` (`यह मुआवज़ा ज़िंदगी में एक ही बार मिलता है।`)
     - net = grossLoss − recovered ≤ 0 → `not_eligible` (`कोई नुकसान बाकी नहीं।`)
     - अब रिपोर्ट की जाँच: 1930 और बैंक, दोनों की तारीख़ ≤ txn+5 हो → ठीक। कोई भी तारीख़ > txn+5 हो → `not_eligible` (`1930 और बैंक, दोनों को 5 दिन के अंदर बताना ज़रूरी है।`)। कोई अभी बाकी हो और आज ≤ txn+5 → ठीक, पर deadline `1930 और बैंक, दोनों को इस तारीख़ तक बताएँ` = txn+5 (`confirmed`)। कोई बाकी हो और आज > txn+5 → `not_eligible`।
     - howHappened `self_sent_deceived` → `unclear` (`RBI की परिभाषा में धोखे से लिए गए OTP/PIN और दबाव या धमकी में दी गई मंज़ूरी शामिल है; बिना दबाव के ख़ुद भेजे पैसे पर नियम साफ़ नहीं।`), amount फिर भी दिखाएँ।
     - बाकी सब → `likely`, amount = `Math.min(Math.round(net * 0.85), 25000)`, कारण `बैंक जाँच करेगा कि नुकसान सही (bona fide) है।` · deadline `बैंक की अर्ज़ी मिलने के 5 दिन में भुगतान` (date के बिना, सिर्फ़ जानकारी: इसे `reasonsHi` में डालें)
3. `rbi2027.bankResponseTime` ("बैंक को कब तक जवाब देना है", txnFrom `2027-01-01`, para 76Q): reportedToBankOn हो → `confirmed`, deadline `बैंक का जवाब` = reportedToBankOn + 45 (crossBorder हो तो 60), कारण `इसके बाद भी जवाब न आए या आप संतुष्ट न हों, तो RBI Ombudsman (cms.rbi.org.in) पर शिकायत कर सकते हैं।` · reportedToBankOn न हो → `null`।

- [ ] **Step 1: tests लिखें** (`rbi-2027.test.ts`; एक `base: FraudInput` helper के साथ: txnDate `2027-03-10`, grossLoss 40000, recovered 0, individual, `credentials_taken`, fault `customer`, `bank_account`, `savings`, दोनों रिपोर्ट `2027-03-10`, prior false, crossBorder false)
```ts
test("मूल Illustration 1: 40,000 में 15,000 वापस → 21,250", () => {
  const r = comp({ ...base, recovered: 15000 }); expect(r?.status).toBe("likely"); expect(r?.amount).toBe(21250); });
test("ऊपरी सीमा 25,000", () => expect(comp(base)?.amount).toBe(25000));
test("29,411 → 25,000 (85% = 24,999.35 → 24,999)", () => expect(comp({ ...base, grossLoss: 29411 })?.amount).toBe(24999));
test("50,001 → not_eligible", () => expect(comp({ ...base, grossLoss: 50001 })?.status).toBe("not_eligible"));
test("पहले ले चुके → not_eligible", () => expect(comp({ ...base, priorCompensation: true })?.status).toBe("not_eligible"));
test("वापस मिला ≥ नुकसान → not_eligible", () => expect(comp({ ...base, recovered: 40000 })?.status).toBe("not_eligible"));
test("बैंक को 6वें दिन बताया → not_eligible", () => expect(comp({ ...base, reportedToBankOn: "2027-03-16" })?.status).toBe("not_eligible"));
test("5वें दिन ठीक है", () => expect(comp({ ...base, reportedToBankOn: "2027-03-15" })?.status).toBe("likely"));
test("आज 3रा दिन, बैंक को अभी नहीं → likely + deadline", () => {
  const r = evalRule(compRule, { ...base, reportedToBankOn: null }, "2027-03-12");
  expect(r?.status).toBe("likely"); expect(r?.deadlines[0]).toEqual({ labelHi: "1930 और बैंक, दोनों को इस तारीख़ तक बताएँ", date: "2027-03-15", status: "confirmed" }); });
test("आज 7वाँ दिन, अभी नहीं बताया → not_eligible", () => expect(evalRule(compRule, { ...base, reportedTo1930On: null }, "2027-03-17")?.status).toBe("not_eligible"));
test("ख़ुद भेजे (बिना दबाव) → unclear", () => expect(comp({ ...base, howHappened: "self_sent_deceived" })?.status).toBe("unclear"));
test("wallet → unclear", () => expect(comp({ ...base, instrument: "wallet" })?.status).toBe("unclear"));
test("company → not_eligible", () => expect(comp({ ...base, customerType: "other" })?.status).toBe("not_eligible"));
test("2028-01-01 → unclear, 2028-01-02 → नियम लागू नहीं", () => {
  expect(comp({ ...base, txnDate: "2028-01-01", reportedTo1930On: "2028-01-01", reportedToBankOn: "2028-01-01" })?.status).toBe("unclear");
  expect(evaluateRights({ ...base, txnDate: "2028-01-02", reportedTo1930On: "2028-01-02", reportedToBankOn: "2028-01-02" }, "2028-01-03").find((r) => r.ruleId === "rbi2027.smallValueCompensation")).toBeUndefined(); });
test("बैंक की गलती → मुआवज़ा नहीं, पर ज़ीरो ज़िम्मेदारी likely", () => {
  const all = evaluateRights({ ...base, fault: "bank" }, "2027-03-10");
  expect(all.find((r) => r.ruleId === "rbi2027.smallValueCompensation")).toBeUndefined();
  expect(all.find((r) => r.ruleId === "rbi2027.zeroLiability")?.status).toBe("likely"); });
test("third-party, 6वें दिन बताया → zeroLiability unclear", () =>
  expect(evaluateRights({ ...base, fault: "third_party", reportedToBankOn: "2027-03-16" }, "2027-03-20").find((r) => r.ruleId === "rbi2027.zeroLiability")?.status).toBe("unclear"));
test("बैंक जवाब: 45 दिन, विदेशी 60", () => {
  const d = (cb: boolean) => evaluateRights({ ...base, crossBorder: cb }, "2027-03-10").find((r) => r.ruleId === "rbi2027.bankResponseTime")!.deadlines[0].date;
  expect(d(false)).toBe("2027-04-24"); expect(d(true)).toBe("2027-05-09"); });
test("credit card: shadow reversal 5 दिन", () =>
  expect(evaluateRights({ ...base, fault: "third_party", instrument: "credit_card" }, "2027-03-10").find((r) => r.ruleId === "rbi2027.zeroLiability")!.deadlines).toContainEqual({ labelHi: "credit card पर अस्थायी वापसी (shadow reversal)", date: "2027-03-15", status: "confirmed" }));
test("2026 का लेन-देन → 2027 वाला कोई नियम नहीं", () =>
  expect(evaluateRights({ ...base, txnDate: "2026-12-31", reportedTo1930On: "2026-12-31", reportedToBankOn: "2026-12-31" }, "2027-01-02").filter((r) => r.ruleId.startsWith("rbi2027"))).toEqual([]));
```
`sources.test.ts`:
```ts
test.each(RULES.map((r) => [r.id, r] as const))("%s: quote मूल फ़ाइल में जस का तस", (_id, rule) => {
  const text = readFileSync(path.resolve(__dirname, "../../", rule.source.file), "utf8");
  expect(text.replace(/\s+/g, " ")).toContain(rule.source.quote.replace(/\s+/g, " "));
  expect(rule.verifiedBy).toContain("claude");
});
```
- [ ] **Step 2:** → FAIL
- [ ] **Step 3:** लिखें। quotes के लिए: zeroLiability = 76M का पहला वाक्य; compensation = 76T(1) का पहला वाक्य ("A bona fide victim, … subject to the following:"); bankResponse = 76Q का दूसरा वाक्य ("However, this timeline shall not exceed 45 calendar days … cross-border fraudulent EBT(s).")।
- [ ] **Step 4:** → PASS
- [ ] **Step 5:** commit `TR-6/7: 2027 के RBI नियम (मूल text के quote के साथ) और evaluateRights`

### Task 3 (TR-6): 2027 से पहले वाले नियम
**Files:** `rules/rbi-2025-old.ts`, `rbi-2025-old.test.ts` · Modify: `evaluate.ts` (RULES में जोड़ें)

नियम `rbi2025.thirdPartyLiability` ("आपकी ज़िम्मेदारी कितनी (2027 से पहले के लेन-देन)", txnTo `2026-12-31`, paras 67(2), 68(2), 70):
- fault `bank` → `likely`, `ज़ीरो ज़िम्मेदारी (बैंक की गलती पर, रिपोर्ट करें या न करें)।`
- fault `customer` → `likely`, `OTP/PIN जैसी जानकारी देने पर, बैंक को बताने तक का नुकसान ग्राहक का माना जाता है; बताने के बाद का बैंक का।` (para 68(1)) **(कोई मुआवज़ा नहीं, 2027 वाला नियम इन पर लागू नहीं)**
- fault `unknown` → `unclear` (`गलती किसकी है, यह बैंक तय करेगा; साबित करने का बोझ बैंक पर है (para 75)।`)
- fault `third_party`: w = `workingDaysBetween(txnDate, reportedToBankOn ?? today)`। w ≤ 3 → `likely` ज़ीरो। 4 ≤ w ≤ 7 → `likely`, amount = `min(Table 1 की सीमा, grossLoss)`, कारण `ज़िम्मेदारी ज़्यादा से ज़्यादा ₹X` (accountKind: bsbd 5000 · savings/small_current_or_card 10000 · other_current_or_big_card 25000 · unknown → `unclear`)। w > 7 → `unclear` (`बैंक की नीति के हिसाब से`)। रिपोर्ट अभी बाकी हो और w ≤ 3 → deadline `ज़ीरो ज़िम्मेदारी के लिए बैंक को इस तारीख़ तक बताएँ` (txnDate से 3 कार्य-दिवस बाद की तारीख़, status `likely`, क्योंकि सरकारी छुट्टियाँ नहीं गिनीं)।
- बैंक को बताया हो → deadlines: `अस्थायी वापसी (shadow credit), 10 कार्य-दिवस में` (status `likely`) और `शिकायत का हल, ज़्यादा से ज़्यादा 90 दिन में` = reportedToBankOn + 90 (`confirmed`)।
- **ध्यान:** स्रोत में दिन "communication मिलने" से गिने जाते हैं। हम लेन-देन की तारीख़ को उसी दिन का alert मानते हैं, यह कारण में लिखें: `दिन उस दिन से गिने गए हैं जब बैंक का SMS या alert आया (लेन-देन का दिन माना गया)।`

- [ ] **Step 1: tests लिखें** (base: txnDate `2026-12-01` बुधवार, third_party, savings)
```ts
test("3 कार्य-दिवस में → likely ज़ीरो", () => expect(old({ ...base, reportedToBankOn: "2026-12-04" })?.status).toBe("likely"));
test("6 कार्य-दिवस → सीमा 10,000", () => { const r = old({ ...base, reportedToBankOn: "2026-12-08", grossLoss: 40000 }); expect(r?.amount).toBe(10000); });
test("सीमा नुकसान से ज़्यादा न हो", () => expect(old({ ...base, reportedToBankOn: "2026-12-08", grossLoss: 3000 })?.amount).toBe(3000));
test("BSBD सीमा 5,000", () => expect(old({ ...base, accountKind: "bsbd", reportedToBankOn: "2026-12-08", grossLoss: 40000 })?.amount).toBe(5000));
test("7 से ज़्यादा कार्य-दिवस → unclear", () => expect(old({ ...base, reportedToBankOn: "2026-12-15" })?.status).toBe("unclear"));
test("quote मूल फ़ाइल में", ...)  // sources.test.ts अपने आप सारे RULES जाँचता है
test("2027 के लेन-देन पर यह नियम नहीं", () => expect(evaluateRights({ ...base, txnDate: "2027-01-05", reportedToBankOn: "2027-01-05" }, "2027-01-06").some((r) => r.ruleId === "rbi2025.thirdPartyLiability")).toBe(false));
```
- [ ] **Step 2:** → FAIL · **Step 3:** लिखें · **Step 4:** → PASS (sources.test भी)
- [ ] **Step 5:** commit `TR-6/7: 2027 से पहले के लेन-देन वाले RBI नियम`

### Task 4 (TR-6/7): fail हुए लेन-देन (2019 TAT)
**Files:** `rules/tat-2019.ts`, `tat-2019.test.ts`
**Interfaces:** `type TatChannel = "atm" | "card_to_card" | "pos" | "ecommerce" | "imps" | "upi_transfer" | "upi_merchant" | "aeps_merchant" | "aeps_transfer" | "apbs" | "nach_credit" | "nach_revoked_mandate" | "ppi_onus"` · `TAT_ROWS: Record<TatChannel, { labelHi: string; days: 1 | 5; perDay: 100; row: string }>` · `evaluateFailedTxn(input: { channel: TatChannel; txnDate: string; resolvedOn: string | null }, today: string): { dueDate: string; daysLate: number; compensation: number; resolvedOn: string | null; source: Source }`

तालिका (मूल annex से): atm 5 (1a) · card_to_card 1 (2a) · pos 5 (2b) · ecommerce 5 (2c, 2b के साथ मिला हुआ खाना) · imps 1 (3a) · upi_transfer 1 (4a) · upi_merchant 5 (4b) · aeps_merchant 5 (5a) · aeps_transfer 5 (5b, 5a के साथ मिला हुआ) · apbs 1 (6a) · nach_credit 1 (7a) · nach_revoked_mandate 1 (7b, मुआवज़े वाला खाना 7a के साथ मिला हुआ माना गया) · ppi_onus 1 (8b)। सब पर ₹100 हर दिन। हिंदी labels: `ATM से पैसे नहीं निकले, खाते से कट गए` · `card से card में भेजे, पहुँचे नहीं` · `दुकान की मशीन (POS) पर card से कटे, पर्ची नहीं निकली` · `online ख़रीदारी में कटे, दुकान तक नहीं पहुँचे` · `IMPS से भेजे, पहुँचे नहीं` · `UPI से किसी को भेजे, पहुँचे नहीं` · `UPI से दुकान को भुगतान, कटे पर पहुँचे नहीं` · `आधार (AePS) से दुकान पर भुगतान, कटे पर पहुँचे नहीं` · `आधार (AePS) से भेजे, पहुँचे नहीं` · `सरकारी फ़ायदा (APBS) खाते में देर से आया` · `NACH से पैसा आने में देर` · `mandate रद्द करने के बाद भी पैसा कटा` · `wallet/prepaid card के अंदर का भुगतान अटका`

हिसाब: dueDate = txnDate + days · end = resolvedOn ?? today · daysLate = max(0, daysBetween(dueDate, end)) · compensation = daysLate × 100।
- [ ] **Step 1: tests**
```ts
test("UPI: T+1, 4 दिन बाद लौटा → 3 दिन देर → ₹300", () =>
  expect(evaluateFailedTxn({ channel: "upi_transfer", txnDate: "2027-01-10", resolvedOn: "2027-01-14" }, "2027-01-20")).toMatchObject({ dueDate: "2027-01-11", daysLate: 3, compensation: 300 }));
test("ATM: T+5 के अंदर → 0", () => expect(evaluateFailedTxn({ channel: "atm", txnDate: "2027-01-10", resolvedOn: "2027-01-15" }, "2027-01-20").compensation).toBe(0));
test("अभी नहीं लौटा → आज तक गिनें", () => expect(evaluateFailedTxn({ channel: "atm", txnDate: "2027-01-10", resolvedOn: null }, "2027-01-18").compensation).toBe(300));
test("13 channels, सब पर 100", () => { expect(Object.keys(TAT_ROWS)).toHaveLength(13); for (const r of Object.values(TAT_ROWS)) expect(r.perDay).toBe(100); });
```
quote (sources.test में जोड़ें): `Customers who do not get the benefit of redress of the failure as defined in the TAT, can register a complaint with the`
- [ ] **Step 2–4:** FAIL → लिखें → PASS · **Step 5:** commit `TR-6/7: fail लेन-देन का ₹100 रोज़ वाला हिसाब (2019 TAT)`

### Task 5 (TR-8): form का input (Zod) और नतीजों के components
**Files:** `modules/haq/form.ts`, `form.test.ts`, `index.ts` · `components/haq/rights-result.tsx`, `source-line.tsx`, `haq.test.tsx`
**Interfaces:** `parseFraudForm(params: Record<string, string | string[] | undefined>, today: string): { ok: true; input: FraudInput } | { ok: false; errorsHi: string[] } | { ok: "empty" }` · `parseFailedForm(params, today): { ok: true; input: {...} } | { ok: false; errorsHi: string[] } | { ok: "empty" }` · `RightsResultCard({ result }: { result: RightResult })` · `SourceLine({ source, verifiedBy }: { source: Source; verifiedBy: string[] })`

form fields (GET params): `txn` (date), `loss`, `back` (default 0), `who` (individual|sole_proprietor|other), `how` (HowHappened), `shared` (`yes` = OTP/PIN दिया या ऐप डाला → fault customer · `no` → fault unknown · `bank` → fault bank), `inst` (Instrument), `acct` (AccountKind, default unknown), `r1930` (date या ख़ाली), `rbank` (date या ख़ाली), `prior` (yes|no), `abroad` (on/ख़ाली)। ग़लतियाँ: `ठगी की तारीख़ सही नहीं है।` · `ठगी की तारीख़ आज के बाद की नहीं हो सकती।` · `कितने पैसे गए, सही रकम लिखें।` · `वापस मिली रकम सही लिखें।` · `रिपोर्ट की तारीख़ ठगी से पहले की नहीं हो सकती।` · कोई param न हो तो `{ ok: "empty" }` (सिर्फ़ form दिखेगा)।
`RightsResultCard`: status का हिंदी label और रंग: confirmed `पक्का` (safe) · likely `संभावित` (safe) · unclear `साफ़ नहीं` (warn) · not_eligible `हक़ नहीं बनता` (muted)। रकम (हो तो) बड़े अक्षरों में, कारण, deadlines (हिंदी तारीख़), और `SourceLine`: `RBI: <paragraph> · <a href=url>मूल text</a> · ` + verifiedBy में owner न हो तो `RBI के मूल text से मिलाया गया · दूसरी जाँच बाकी`।

- [ ] **Step 1: tests:** ख़ाली params → empty · `2027-02-30` → ग़लती · भविष्य की तारीख़ → ग़लती · `shared=yes` → fault customer · `loss=abc` → ग़लती · RightsResultCard likely पर "संभावित" और रकम "₹25,000" · SourceLine पर "दूसरी जाँच बाकी"
- [ ] **Step 2–4:** FAIL → लिखें → PASS · **Step 5:** commit `TR-8: /haq form की जाँच और नतीजों के components`

### Task 6 (TR-8): /haq के पन्ने
**Files:** `app/(site)/haq/page.tsx`, `haq/rbi-2027/page.tsx`, `haq/failed-txn/page.tsx`, `haq/frozen-money/page.tsx` · Modify: होम (`/haq` का छोटा link: `अपना हक़ जानें: RBI के नियमों से हिसाब →`)

- `/haq`: h1 `आपका हक़` + 3 cards (`ठगी में पैसा गया: पूरा पैसा वापस या ₹25,000 तक मुआवज़ा?` → rbi-2027 · `लेन-देन fail हुआ, पैसा अटका: ₹100 रोज़` → failed-txn · `ठग के खाते में पैसा रुका (freeze): वापस कैसे माँगें` → frozen-money)
- `/haq/rbi-2027`: `searchParams` (Promise, Next 15) → `parseFraudForm`। ऊपर form हो (सारे fields हिंदी labels के साथ: radio/select/date/number, हर एक 48px), "हिसाब देखें" बटन (submit)। नतीजा हो तो form के नीचे `evaluateRights` के cards, फिर Notice info `यह हिसाब RBI के नियमों पर है, कानूनी सलाह नहीं। आख़िरी फ़ैसला बैंक की जाँच से होगा।`, और `/turant` का link `अभी तक 1930 और बैंक को नहीं बताया? पहले यह करें →`। ग़लती हो तो `Notice danger` में ग़लतियों की सूची। form के fields में पहले भरे मान बने रहें (defaultValue/defaultChecked)।
- `/haq/failed-txn`: form (channel select में TAT_ROWS के labels, txn date, resolved date ख़ाली हो सकती है) → नतीजा: `बैंक को <dueDate> तक पैसा लौटाना था` · `<daysLate> दिन देर → ₹<compensation> मुआवज़ा बनता है` (0 हो तो `अभी तय समय पूरा नहीं हुआ, या समय पर लौटा।`) · `यह मुआवज़ा बैंक को बिना माँगे, अपने आप देना होता है। न मिले, तो पहले बैंक से, फिर RBI Ombudsman (cms.rbi.org.in) पर शिकायत करें।` (स्रोत: circular para 5 और 6) + SourceLine।
- `/haq/frozen-money`: गाइड (स्थिर)। Notice warn: `यह गाइड समाचारों और सरकारी घोषणाओं पर आधारित है; मूल SOP (गृह मंत्रालय) से जाँच अभी बाकी है।` · कदम: (1) NCRP पर शिकायत का 14 अंकों वाला नंबर सँभालें, (2) जब पुलिस या बैंक बताए कि ठग के खाते में पैसा रोका (freeze) गया है, तब ही वापसी की अर्ज़ी बनती है, (3) छोटी रकम (समाचारों के अनुसार ₹50,000 तक) के लिए गृह मंत्रालय के Money Restoration Module पर online अर्ज़ी, NCRP नंबर और OTP से, (4) बड़ी रकम के लिए FIR और कोर्ट (मजिस्ट्रेट) से आदेश लेना होता है, इसके लिए वकील की मदद लें, (5) कोई "पैसा वापस दिलाने" के बदले पहले पैसे माँगे, तो वह ठग है।
- [ ] **Step 1: tests** (`components/haq/haq-pages.test.tsx`): rbi-2027 page को `searchParams: Promise.resolve({})` के साथ render करें → form है, नतीजा नहीं · valid params के साथ → "संभावित" और "₹25,000" · failed-txn page पर upi params → "₹300" · frozen-money पर "जाँच अभी बाकी"
- [ ] **Step 2–4:** FAIL → लिखें → PASS, `npm run build` (पन्ने dynamic `ƒ` होंगे, क्योंकि searchParams पढ़ते हैं) · **Step 5:** commit `TR-8: /haq पन्ने (बिना JS वाले form)`

### Task 7 (TR-8): e2e
**Files:** `scripts/e2e-haq.mjs` · Modify: CI
जाँचें:
1. JS बंद: `/haq/rbi-2027` पर form भरकर submit (txn आज से 2 दिन पहले, loss 40000, shared yes, दोनों रिपोर्ट आज) → "संभावित", "₹25,000" और "मूल text" link दिखें।
2. ग़लत तारीख़ (`?txn=2027-02-30&loss=100`) → "ठगी की तारीख़ सही नहीं है।"
3. `/haq/failed-txn?ch=upi_transfer&txn=<आज−5>&res=` → `₹400` (T+1 के बाद 4 दिन)
4. 320px पर तीनों पन्नों पर बगल में scroll नहीं।
5. होम पर `/haq` का link।
- [ ] e2e चलाएँ → सब ✓ · CI में जोड़ें · commit `TR-8: /haq की e2e जाँच`
