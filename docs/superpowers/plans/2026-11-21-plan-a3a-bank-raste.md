# Plan A3a: बैंकों के आधिकारिक रास्ते (TR-9) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** पीड़ित को उसके बैंक तक पहुँचने का **सही** रास्ता बताना, बिना किसी ग़लत नंबर के ख़तरे के। हर बैंक का पन्ना बनेगा, और RBI के नियमों से पक्के सुरक्षा-सुझाव दिए जाएँगे (`.bank.in` वाला पता, card के पीछे लिखा नंबर, ऐप में "report fraud")। कोई भी नंबर या website का पता **दो जाँचों** के बाद ही दिखेगा: 🤖 Claude की (बैंक की `.bank.in` वाली साइट से) और 👤 मालिक की (फ़ोन पर ख़ुद खोलकर)।

**Architecture:** `modules/banks` में बैंकों की typed सूची रहेगी। हर नंबर या पते के साथ उसका स्रोत (URL), मूल लाइन और `verifiedBy` होगा। `isLive()` तभी true होगा जब `verifiedBy` में `"claude"` और `"owner"` दोनों हों। सुरक्षा-सुझाव `modules/banks/safety.ts` में रहेंगे, और हर सुझाव के साथ RBI का quote, जिसे test मूल फ़ाइल में खोजकर पक्का करेगा। पन्ने `/gyan/bank` और `/gyan/bank/[slug]` static बनेंगे। `/turant` के बैंक वाले कदमों से इन पन्नों का link होगा, और `/gyan/bank` offline भी खुलेगा।

**Tech Stack:** पहले जैसा।

**Spec:** `DISHA.md` नियम 9 · Design v2 भाग 8.3 (बैंक-नंबर की कड़ी जाँच) · भाग 2 खंड 6.11 और 12.4 (SOP) · मूल स्रोत: `docs/sources/rbi/2025-04-22-bank-in-domain.txt`, `2026-06-24-…txt` (76G, 76I)

## Global Constraints
- **बिना दो-जाँच के कोई नंबर, SMS नंबर या website का पता HTML में नहीं जाएगा।** इसे एक test पक्का करेगा, जो हर बैंक के बने हुए पन्ने में `tel:` और `https://…bank.in` खोजेगा।
- website का पता सिर्फ़ उसी host का माना जाएगा जो `.bank.in` पर ख़त्म हो, और यह भी test से पक्का होगा। RBI ने commercial और co-operative बैंकों को 31 अक्टूबर 2025 तक इसी पते पर जाने को कहा था।
- हर सुरक्षा-सुझाव का स्रोत होगा: RBI का paragraph और मूल फ़ाइल में जस का तस quote।
- "Google पर नंबर न खोजें" वाली चेतावनी हर बैंक-पन्ने पर रहेगी।
- copy-lint, 320px और JS बंद वाले पुराने नियम लागू।

## Review Focus
1. **किसी नंबर पर सिर्फ़ Claude की जाँच हो, मालिक की न हो:** HTML में `tel:` न आए → Task 1 और Task 3 के tests।
2. **किसी ने ग़लती से `.com` या मिलता-जुलता पता डाल दिया:** test fail हो → Task 1।
3. **ग़लत slug (`/gyan/bank/xyz`):** हिंदी 404 → Task 3 (`dynamicParams = false`) और e2e।
4. **offline में `/turant/upi` से "अपने बैंक का सही रास्ता" दबाया:** `/gyan/bank` खुले → Task 4 का e2e।
5. **320px पर बैंक का लंबा नाम:** बगल में scroll न हो → e2e।

## File Structure
```
docs/sources/rbi/2025-04-22-bank-in-domain.txt     (हो चुका)
docs/verify/BANKS.md                               दो-जाँच का तरीका (Claude + मालिक) और हर बैंक की स्थिति
modules/banks/{registry.ts, safety.ts, index.ts, registry.test.ts, safety.test.ts}
components/banks/{bank-tips.tsx, banks.test.tsx}
app/(site)/gyan/bank/page.tsx
app/(site)/gyan/bank/[slug]/page.tsx
modules/scams/turant.ts                            tell_bank और block_card पर अंदर का link /gyan/bank
modules/offline/service-worker.ts                  OFFLINE_URLS में /gyan/bank
scripts/e2e-site.mjs                               नई जाँचें
```

---

### Task 1: बैंकों की सूची और दो-जाँच वाला नियम
**Interfaces (Produces):**
```ts
export type Verified = { verifiedBy: string[]; verifiedOn: string | null };
export type BankChannel = Verified & { kind: "tel" | "sms" | "email"; value: string; labelHi: string; sourceUrl: string; sourceQuote: string };
export type BankEntry = { slug: string; nameHi: string; nameEn: string; officialSite: (Verified & { url: string }) | null; channels: BankChannel[] };
export const BANKS: readonly BankEntry[];
export function isLive(v: Verified): boolean;            // "claude" और "owner" दोनों
export function liveChannels(b: BankEntry): BankChannel[];
export function liveSite(b: BankEntry): string | null;
export function getBank(slug: string): BankEntry | undefined;
```
बैंक (इसी क्रम में, शुरुआत में सबका `officialSite: null`, `channels: []`): `sbi` भारतीय स्टेट बैंक (SBI) / State Bank of India · `hdfc` HDFC बैंक / HDFC Bank · `icici` ICICI बैंक / ICICI Bank · `pnb` पंजाब नेशनल बैंक (PNB) / Punjab National Bank · `bob` बैंक ऑफ़ बड़ौदा / Bank of Baroda · `canara` केनरा बैंक / Canara Bank · `union` यूनियन बैंक ऑफ़ इंडिया / Union Bank of India · `axis` Axis बैंक / Axis Bank · `kotak` कोटक महिंद्रा बैंक / Kotak Mahindra Bank · `boi` बैंक ऑफ़ इंडिया / Bank of India

- [ ] **Step 1: tests**
```ts
test("10 बैंक, slug अलग", () => { expect(BANKS).toHaveLength(10); expect(new Set(BANKS.map(b => b.slug)).size).toBe(10); });
test("isLive: दोनों जाँच ज़रूरी", () => {
  expect(isLive({ verifiedBy: ["claude"], verifiedOn: "2026-11-21" })).toBe(false);
  expect(isLive({ verifiedBy: ["claude", "owner"], verifiedOn: "2026-11-21" })).toBe(true);
});
test("हर website का पता https और .bank.in पर", () => {
  for (const b of BANKS) if (b.officialSite) { const u = new URL(b.officialSite.url); expect(u.protocol).toBe("https:"); expect(u.hostname.endsWith(".bank.in")).toBe(true); }
});
test("हर channel का स्रोत .bank.in वाली साइट और मूल लाइन", () => {
  for (const b of BANKS) for (const c of b.channels) { expect(new URL(c.sourceUrl).hostname.endsWith(".bank.in")).toBe(true); expect(c.sourceQuote.length).toBeGreaterThan(10); }
});
test("liveChannels सिर्फ़ दो-जाँच वाले", () => {
  const b: BankEntry = { slug: "t", nameHi: "t", nameEn: "t", officialSite: null, channels: [
    { kind: "tel", value: "1800", labelHi: "x", sourceUrl: "https://t.bank.in/x", sourceQuote: "xxxxxxxxxxxx", verifiedBy: ["claude"], verifiedOn: "2026-11-21" }] };
  expect(liveChannels(b)).toEqual([]);
});
```
- [ ] FAIL → लिखें → PASS → commit `TR-9: बैंकों की सूची और दो-जाँच वाला नियम`

### Task 2: सुरक्षा-सुझाव (RBI के स्रोत के साथ)
**Interfaces:** `BANK_TIPS: readonly { id: string; textHi: string; source: { file: string; paragraph: string; quote: string } | null }[]`

सुझाव (जस के तस):
| id | textHi | स्रोत |
|---|---|---|
| bank_in | बैंक की असली वेबसाइट का पता ".bank.in" पर ख़त्म होता है। RBI ने बैंकों को 31 अक्टूबर 2025 तक इसी पते पर आने को कहा था। ".com" या मिलता-जुलता कोई और पता हो, तो सावधान रहें। | bank-in circular para 3: `All banks are advised to commence the migration of their existing domains to the ‘.bank.in’ domain and complete the process at the earliest and in any case, not later than October 31, 2025.` |
| card_back | बैंक का नंबर अपने debit card के पीछे, passbook में, या बैंक के अपने ऐप में देखें। Google पर न खोजें, क्योंकि वहाँ नकली "customer care" नंबर बहुत हैं। | null |
| home_link | 1 जनवरी 2027 से हर बैंक की वेबसाइट और ऐप के पहले पन्ने पर ठगी report करने का सीधा link होना ज़रूरी है। | 76G(3): `provide a direct link on the home page of its website and mobile application, if available, for reporting fraudulent EBTs.` |
| channels_24x7 | बैंक को 24 घंटे ठगी report करने के रास्ते देने होते हैं: फ़ोन, SMS, email, toll-free नंबर, या अपनी शाखा। | 76G(1) quote: `provide customers with 24x7 access through channels such as phone banking, SMS, instant messaging, dedicated email address, IVR, a dedicated toll-free helpline, reporting to home branch, etc., for reporting fraudulent EBTs` |
| sms_reply | लेन-देन वाले SMS में ही एक नंबर होना चाहिए, जिस पर SMS भेजकर आप तुरंत आपत्ति दर्ज कर सकें। | 76G(2): `provide a number in the transaction alert SMS itself, to which the customer can immediately send an SMS to notify her / his objection, if any` |
| ack | शिकायत करते ही बैंक को शिकायत नंबर, तारीख़ और समय के साथ तुरंत पावती भेजनी होती है। उसे सँभालकर रखें। | 76I: `sends an immediate acknowledgement to the customer, along with the complaint number and the date and time of receipt of the complaint` |

- [ ] **tests:** 6 सुझाव · `card_back` का source null, बाकी के quote मूल फ़ाइल में जस के तस (spaces normalize करके) · FAIL → लिखें → PASS → commit `TR-9: बैंक से जुड़े सुरक्षा-सुझाव (RBI के quote के साथ)`

### Task 3: /gyan/bank पन्ने
- `BankTips()`: सारे सुझाव (`<ol>`), हर एक के नीचे स्रोत हो तो छोटी लाइन `RBI: <paragraph>`।
- `/gyan/bank`: h1 `अपने बैंक को ठगी कैसे बताएँ` → Notice warn `नंबर Google पर न खोजें। नकली "customer care" नंबर ठगी का बड़ा जाल हैं।` → `<BankTips />` → h2 `अपना बैंक चुनें` → 10 बैंकों के links (`/gyan/bank/<slug>`)।
- `/gyan/bank/[slug]`: `generateStaticParams`, `dynamicParams = false` · h1 `<nameHi>: ठगी कैसे बताएँ` · live channels हों तो ActionLinks (स्रोत और जाँच की तारीख़ के साथ), न हों तो Notice info `इस बैंक के फ़ोन नंबर अभी जाँच में हैं। तब तक: debit card के पीछे, passbook में, या बैंक के ऐप में लिखा नंबर ही लगाएँ।` · liveSite हो तो `बैंक की असली वेबसाइट: <host>` link · Notice warn (Google वाली) · `<BankTips />` · `/turant` का BigDoor।
- [ ] **tests:** `/gyan/bank` में 10 links और 6 सुझाव · हर बैंक का पन्ना render करें: कोई `tel:` नहीं और कोई `.bank.in` link नहीं (क्योंकि अभी कुछ live नहीं), और "अभी जाँच में हैं" दिखे · FAIL → लिखें → PASS · build में `/gyan/bank/[slug]` के 10 static पन्ने → commit `TR-9: /gyan/bank पन्ने`

### Task 4: /turant से link, offline, e2e
- `tell_bank` और `block_card` के actions में `{ kind: "link", href: "/gyan/bank", labelHi: "अपने बैंक का सही रास्ता देखें", external: false }` · `TURANT_CONTENT_VERSION` → `2026-11-21.2` · turant tests बदलें: "हर **बाहरी** link https://cybercrime.gov.in", और नया test "tell_bank में /gyan/bank"।
- `OFFLINE_URLS` में `/gyan/bank` (गिनती 12)।
- e2e-site में: `/gyan/bank` पर 10 बैंक और "bank.in" वाला सुझाव · `/gyan/bank/sbi` पर "अभी जाँच में हैं" और `tel:` गिनती 0 · `/gyan/bank/xyz` → 404 · 320px · offline: `/turant/upi` खोलें → SW तैयार → reload → offline → "अपने बैंक का सही रास्ता देखें" दबाएँ → "अपने बैंक को ठगी कैसे बताएँ" दिखे।
- [ ] सब ✓ → commit `TR-9: /turant से बैंक-पन्ने का link, offline, e2e`

### Task 5: दो-जाँच का तरीका (docs/verify/BANKS.md)
- 🤖 जाँच 1 (Claude): बैंक की `.bank.in` साइट का वह पन्ना खोलें जहाँ ठगी report करने का रास्ता है, मूल लाइन copy करें, और `registry.ts` में `verifiedBy: ["claude"]` के साथ डालें। अभी यह दिखेगा नहीं।
- 👤 जाँच 2 (मालिक): फ़ोन पर Chrome में `sourceUrl` खोलें → देखें कि पता `.bank.in` पर ख़त्म होता है और ताले (🔒) का निशान है → नंबर वही है जो सूची में लिखा है → chat में लिखें `<बैंक> ठीक है` → Claude `"owner"` जोड़ेगा → नंबर live।
- तालिका: हर बैंक की स्थिति (⏳ / 🤖 / ✅)।
- **ध्यान:** जाँच 1 के लिए बैंकों की `.bank.in` साइटें खोलनी पड़ेंगी। इसके लिए environment में उन hosts की अनुमति, और उन्हें download करने की मालिक की अनुमति चाहिए। यह TR-9 के बाद का काम है (TR-9b)।
- [ ] commit `TR-9: बैंकों की दो-जाँच का तरीका`
