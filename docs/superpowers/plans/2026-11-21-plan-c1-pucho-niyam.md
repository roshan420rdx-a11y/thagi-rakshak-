# Plan C1: "पहले पूछो", नियमों वाली जाँच (TR-23 का पहला हिस्सा) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/pucho` पर एक box, जिसमें user किसी संदिग्ध SMS या WhatsApp message का text चिपकाए, और उसी पल जवाब पाए: 🔴 "ठगी के पक्के निशान", 🟠 "शक है", या "आम निशान नहीं मिले, फिर भी सावधान रहें"। साथ में कारण और अगला कदम। **जाँच फ़ोन के अंदर ही होगी, और message कहीं नहीं भेजा जाएगा।**

**Architecture:** `modules/checker` शुद्ध TypeScript होगा: तय नियम (regex/keywords, हिंदी + अंग्रेज़ी + Hinglish), NFC और छोटे अक्षरों में बदलकर। यही code browser में चलेगा (client component), इसलिए कोई server, AI या बाहरी सेवा नहीं लगेगी। AI और link-जाँच (Web Risk) TR-24 में आएँगे, और तब भी नियम यही रहेंगे (AI सिर्फ़ ख़तरा बढ़ा सकता है)।

**[Ruling: चरण B (Supabase) मालिक के खाते के इंतज़ार में है, इसलिए चरण C का बिना-खाते वाला हिस्सा पहले। North Star #2 (ठगी से पहले रोकना) से सीधा जुड़ा।]**

**Spec:** `DISHA.md` नियम 6, 7 · Design v2 F6 · भाग 2 खंड 6.3, 6.4, 7 (taxonomy)

## Global Constraints
- नतीजे के तीन स्तर: `danger` (कोई भी पक्का निशान) · `warn` (शक वाले निशान) · `no_signals`। **कभी "सुरक्षित" नहीं।** `no_signals` का text: `ठगी के आम निशान नहीं मिले। फिर भी: OTP/PIN किसी को न बताएँ, अनजान link न खोलें, और शक हो तो पैसे न भेजें।`
- बैंक के असली OTP वाले SMS ("OTP … किसी को न बताएँ / do not share") पर "OTP माँगना" वाला निशान **नहीं** लगना चाहिए (नकार की पहचान)।
- सुनहरा test-set: कम से कम 20 ठगी वाले message (हर एक `danger` या `warn`, और ज़्यादातर `danger`) और कम से कम 8 आम message (हर एक `no_signals`)। **ठगी छूट जाना (false negative) सबसे बड़ी गलती है।**
- user का message न किसी server पर जाएगा, न URL में आएगा, न सेव होगा (e2e: जाँच के समय कोई network request नहीं)।
- निजता पन्ने में यह बात जुड़ेगी, और उसकी e2e जाँच भी।
- बिना JS: box नहीं दिखेगा (7 आम निशान वाली सूची पहले जैसी रहेगी)।

## File Structure
```
modules/checker/{patterns.ts, check.ts, index.ts, check.test.ts, golden.test.ts}
components/pucho/{checker-box.tsx ('use client'), verdict-card.tsx, pucho.test.tsx}
app/(site)/pucho/page.tsx            box जोड़ना
app/(site)/legal/privacy/page.tsx    "पहले पूछो" वाला हिस्सा
scripts/e2e-pucho.mjs + CI
```

### Task 1: नियम और `checkMessage`
**Interfaces:** `type Level = "danger" | "warn" | "no_signals"` · `type Hit = { id: string; level: "danger" | "warn"; labelHi: string; explainHi: string; gyan?: GyanSlug; turant?: TurantSlug }` · `checkMessage(text: string): { level: Level; hits: Hit[] }` (hits में दोहराव नहीं, danger वाले पहले)
नियम (id → स्तर): `otp_request` danger · `receive_pin_qr` danger · `upi_request_pin` danger · `digital_arrest` danger · `apk_file` danger · `remote_app` danger · `electricity_cut` danger · `lottery_fee` danger · `blackmail` danger · `loan_threat` danger · `kyc_block` warn · `task_job` warn · `investment` warn · `wrong_transfer` warn · `customer_care` warn · `urgency` warn · `link` warn
- [ ] tests: हर नियम का कम से कम एक पकड़ने वाला और एक न-पकड़ने वाला उदाहरण · OTP का नकार · स्तर का हिसाब (कोई danger → danger, सिर्फ़ warn → warn, कुछ नहीं → no_signals) · ख़ाली text → no_signals · बहुत लंबा text (20,000 अक्षर) 50ms में
- [ ] FAIL → लिखें → PASS → commit

### Task 2: सुनहरा test-set
- `golden.test.ts`: ≥ 20 ठगी वाले message (ज्ञानकोश के उदाहरणों समेत, हिंदी, अंग्रेज़ी, Hinglish), और ≥ 8 आम message (बैंक का असली OTP SMS, रिश्तेदार का message, दुकान का bill वगैरह)।
- [ ] सारे पास (नियम सुधारने पड़ें तो Task 1 के tests भी पास रहें) → commit

### Task 3: `/pucho` पर box
- `CheckerBox` (client): mount से पहले कुछ नहीं · textarea (label `संदिग्ध message यहाँ चिपकाएँ`) · बटन `जाँचें` · नीचे `आपका message कहीं नहीं भेजा जाता, आपके फ़ोन में ही जाँचा जाता है।` · नतीजा `VerdictCard`: स्तर का label (🔴 `ठगी के पक्के निशान` / 🟠 `शक है` / `आम निशान नहीं मिले`), हर निशान का `labelHi` और `explainHi`, अगर `gyan` हो तो ज्ञानकोश का link, danger हो तो `/turant/<turant ?? "pata-nahi">` का बटन `पैसे जा चुके हैं? अभी क्या करें`, और `परिवार को भेजें` (WhatsApp share, जिसमें **सिर्फ़ नतीजा और कारण हों, user का message नहीं**)।
- [ ] tests: VerdictCard के तीनों स्तर · share link में मूल message का कोई हिस्सा नहीं
- [ ] FAIL → लिखें → PASS → commit

### Task 4: निजता पन्ना और e2e
- privacy में नया हिस्सा `"पहले पूछो" में चिपकाया message`
- e2e-pucho: message चिपकाकर जाँचें → 🔴 और कारण · जाँच के समय कोई network request नहीं · बैंक OTP SMS → "आम निशान नहीं मिले" · JS बंद पर 7 निशान अब भी · 320px
- [ ] CI में जोड़ें → commit
