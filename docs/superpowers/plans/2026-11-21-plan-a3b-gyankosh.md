# Plan A3b: ठगी का ज्ञानकोश (TR-10) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/gyan` पर ठगी के 5 सबसे आम प्रकारों के पन्ने: digital arrest, नकली customer care, UPI PIN/QR, task/निवेश, APK फ़ाइल। हर पन्ना एक तय ढाँचे में होगा (spec भाग 2, खंड 10), और उस पर एक बड़ा बटन होगा "हो गया है?", जो सीधे सही `/turant` पन्ने पर ले जाए। ये पन्ने Google से पीड़ितों को लाएँगे, और रोज़ के लोगों को ठगी पहचानना सिखाएँगे।

**Architecture:** content typed TypeScript objects में रहेगा (`content/gyan/hi/<slug>.ts`), MDX में नहीं **[Ruling: types से ढाँचा पक्का होता है (5 निशान, 3 नियम, 3 लाइन का सार), test आसान हैं, और नई dependency नहीं चाहिए; बाद में कोई non-developer लिखे, तब MDX सोचेंगे]**। `modules/gyan` में page type, registry और जाँच होगी। पन्ने `/gyan` और `/gyan/[slug]` static बनेंगे। `/pucho` और `/turant/[slug]` से इन पन्नों का link होगा।

**Tech Stack:** पहले जैसा।

**Spec:** `DISHA.md` (नियम 4, 7) · भाग 2 खंड 6.10, 7 (taxonomy), 10 (ज्ञानकोश का ढाँचा) · Design v2 भाग 11 (YMYL: लेखक, जाँचने वाला, तारीख़, स्रोत)

## Global Constraints
- हर पन्ने का ढाँचा: `titleHi`, `navTitleHi`, `descriptionHi` (≤ 160 अक्षर) · `summaryHi` ठीक 3 लाइन · `howHi` ≥ 4 कदम · `signsHi` ठीक 5 · `examplesHi` ≥ 2 (ठग के message, नंबर या नाम के बिना) · `rulesHi` ठीक 3 · `faq` ≥ 2 · `turantSlug` (कोई असली `TurantSlug`) · `author` · `reviewer` · `lastCheckedOn`।
- **कुछ भी गढ़कर नहीं लिखना:** कोई आँकड़ा, कानूनी धारा या सरकारी बयान बिना स्रोत के नहीं। अभी कोई विशेषज्ञ (वकील या बैंक अधिकारी) नहीं जाँचता, इसलिए `reviewer: null`, और पन्ने पर साफ़ लिखा होगा: `विशेषज्ञ (वकील या बैंक अधिकारी) की जाँच: अभी बाकी`।
- RBI के नियम वाली हर बात के साथ स्रोत (`docs/sources/rbi`) होगा, और उसका quote test से पक्का होगा।
- FAQ के अंदर के links सिर्फ़ इन रास्तों पर: `/haq/thagi`, `/gyan/bank`, `/haq/frozen-money`, `/turant`।
- copy-lint अब `content/` को भी जाँचेगा।
- भाषा पाँचवीं कक्षा जैसी आसान, क्रिया पहले, और कभी दोष देने वाली नहीं।

## Review Focus
1. **किसी पन्ने का "हो गया है?" बटन ग़लत `/turant` पन्ने पर जाए** → Task 1 का test (`isTurantSlug`) और e2e।
2. **content में कोई मना किया शब्द, जैसे निवेश वाली ठगी में "guaranteed return"** → copy-lint (`content/` जोड़कर)।
3. **320px पर लंबे उदाहरण या फ़ाइल-नाम (`Wedding_Invitation.apk`) से बगल में scroll** → e2e।
4. **JS बंद:** FAQ (`<details>`) फिर भी खुले और पढ़ा जा सके → e2e।
5. **ग़लत slug** → 404 (e2e)।

## File Structure
```
modules/gyan/{types.ts, registry.ts, index.ts, gyan.test.ts}
content/gyan/hi/{digital-arrest.ts, customer-care-fake.ts, upi-pin-qr.ts, task-investment.ts, apk-file.ts}
components/gyan/{gyan-article.tsx, gyan.test.tsx}
app/(site)/gyan/page.tsx                 ज्ञानकोश की सूची + काम के रास्ते
app/(site)/gyan/[slug]/page.tsx          static (5)
app/(site)/pucho/page.tsx                (link जोड़ना)
app/turant/[slug]/page.tsx               (उस प्रकार का ज्ञानकोश पन्ना हो तो link)
modules/i18n/repo-copy.test.ts           (DIRS में content)
scripts/e2e-gyan.mjs + CI
```

### Task 1: ढाँचा (types, registry, जाँच)
**Interfaces:**
```ts
export type GyanSlug = "digital-arrest" | "customer-care-fake" | "upi-pin-qr" | "task-investment" | "apk-file";
export type RbiRef = { file: string; paragraph: string; quote: string };
export type GyanFaq = { qHi: string; aHi: string; link?: { href: "/haq/thagi" | "/gyan/bank" | "/haq/frozen-money" | "/turant"; labelHi: string }; source?: RbiRef };
export type GyanPage = { slug: GyanSlug; navTitleHi: string; titleHi: string; descriptionHi: string; summaryHi: [string, string, string];
  howHi: string[]; signsHi: string[]; examplesHi: string[]; rulesHi: string[]; faq: GyanFaq[]; turantSlug: TurantSlug;
  author: string; reviewer: { nameHi: string; roleHi: string } | null; lastCheckedOn: string };
export const GYAN_PAGES: readonly GyanPage[];   // ऊपर वाले क्रम में
export function getGyanPage(slug: string): GyanPage | undefined;
export function gyanForTurant(t: TurantSlug): GyanPage[];
```
- [ ] tests: 5 पन्ने, क्रम · हर पन्ने के गिनती वाले नियम (3/≥4/5/≥2/3/≥2) · descriptionHi ≤ 160 · `isTurantSlug(turantSlug)` · `isValidIsoDate(lastCheckedOn)` · हर source का quote मूल फ़ाइल में · हर link की href तय सूची में · `gyanForTurant("customer-care-fake")` → customer-care-fake और apk-file · `getGyanPage("xyz")` undefined
- [ ] FAIL → content और registry लिखें (Task 2 का content यहीं जुड़ेगा) → PASS → commit

### Task 2: पाँच पन्नों का content
हर पन्ने के ज़रूरी तथ्य:
- **digital-arrest** → turant `digital-arrest` · FAQ में RBI 4(15A) ("approval under coercion or duress") और `/haq/thagi` का link
- **customer-care-fake** → turant `customer-care-fake` · FAQ: असली नंबर कहाँ मिलेगा (`/gyan/bank`, `.bank.in` वाला RBI circular), और "ऐप डाल दिया तो क्या करें"
- **upi-pin-qr** → turant `upi` · "पैसा पाने के लिए PIN या QR कभी नहीं" · FAQ: 5 दिन वाला नियम (76T(1)(b) quote) और "गलती से पैसे भेजे, लौटा दो" वाली चाल
- **task-investment** → turant `investment-task` · FAQ: अपनी मर्ज़ी से भेजे पैसे पर RBI का नियम साफ़ नहीं (4(15A)), और "और भेजो तो सब निकल जाएगा" वाली चाल
- **apk-file** → turant `customer-care-fake` · FAQ: install कर लिया तो क्या करें, और जान-पहचान वाले के नंबर से आई फ़ाइल
- [ ] copy-lint में `content` जोड़ें → `npm test` PASS → commit `TR-10: ज्ञानकोश के 5 पन्नों का content`

### Task 3: पन्ने
- `GyanArticle({ page })`, ऊपर से नीचे: h1 · `30 सेकंड में` (3 लाइन) · BigDoor danger `हो गया है?` / `अभी क्या करें, देखें` → `/turant/<turantSlug>` · h2 `यह ठगी कैसे होती है` (ol) · h2 `पहचान के 5 निशान` (ul) · h2 `ऐसे message आते हैं` (हर उदाहरण पर label `ठग का message (उदाहरण)`) · h2 `बचने के 3 नियम` (ol) · h2 `अक्सर पूछे सवाल` (`<details>`/`<summary>`, link और `RBI: <paragraph>` के साथ) · h2 `आपका हक़` + link `/haq/thagi` · आख़िर में meta लाइन: `लिखा: <author> · विशेषज्ञ (वकील या बैंक अधिकारी) की जाँच: अभी बाकी · आख़िरी बार जाँचा: <हिंदी तारीख़>`
- `/gyan`: h1 `ठगी का ज्ञानकोश` · पाँचों पन्नों के cards (navTitleHi + summaryHi[0]) · h2 `काम के रास्ते`: `/turant`, `/haq/thagi`, `/haq/frozen-money`, `/gyan/bank`, `/pucho`
- `/gyan/[slug]`: `generateStaticParams`, `dynamicParams = false`, metadata (title + description)
- `/pucho` के आख़िर में link `ठगी के प्रकार विस्तार से: ज्ञानकोश →` (`/gyan`)
- `/turant/[slug]` के आख़िर में: `gyanForTurant(slug)` के हर पन्ने का link `यह ठगी कैसे होती है, विस्तार से: <navTitleHi> →`
- [ ] tests (render): हर पन्ने पर 5 `data-sign`, सही `/turant/<slug>` link, "अभी बाकी" वाली meta लाइन · `/gyan` पर 5 links · `/pucho` पर `/gyan` link
- [ ] FAIL → लिखें → PASS → build में `/gyan/[slug]` के 5 static पन्ने → commit

### Task 4: e2e
`scripts/e2e-gyan.mjs`: `/gyan` पर 5 links · हर पन्ना: h1, "हो गया है?" का सही href, 5 निशान · JS बंद पर FAQ का `<summary>` दबाने से जवाब दिखे · 320px पर सारे 6 पन्नों पर बगल में scroll नहीं · `/gyan/xyz` 404 · `/turant/digital-arrest` पर ज्ञानकोश का link · CI में जोड़ें → commit
