# Plan A3c: legal पन्ने (TR-11) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/legal` पर तीन पन्ने बनाना: निजता (privacy notice), सेवा की शर्तें, और शिकायत अधिकारी। आसान हिंदी में, और सिर्फ़ वही लिखना जो साइट आज सच में करती है। privacy वाले दावे ("कोई cookie नहीं, कोई बाहरी tracker नहीं, कोई निजी जानकारी सँभालकर नहीं रखते") browser जाँच से साबित होंगे। हर पन्ने पर लिखा होगा कि यह मसौदा है और वकील की जाँच बाकी है।

**Architecture:** संस्था और शिकायत अधिकारी की जानकारी env से आएगी (`getSiteConfig` बढ़ेगा)। ख़ाली हो तो पन्ने पर "अभी नियुक्त नहीं"। मालिक की निजी जानकारी code में नहीं लिखी जाएगी। पन्ने static होंगे, `app/(site)/legal/*`, और footer में उनके links।

**Spec:** `DISHA.md` नियम 3, 11 · Design v2 भाग 15 (DPDP, IT Rules) · भाग 2 खंड 6.18

## Global Constraints
- **कोई कानूनी धारा या समय-सीमा बिना स्रोत के नहीं।** DPDP Act या IT Rules का मूल text अभी पढ़ा नहीं गया है (उनकी साइटें इस environment से नहीं खुलतीं), इसलिए अधिकार आम भाषा में लिखे जाएँगे, धाराओं के नंबर के बिना, और साथ में `[वकील की जाँच बाकी]`।
- हर legal पन्ने के ऊपर Notice warn: `यह मसौदा है: वकील की जाँच अभी बाकी है। संस्करण: <LEGAL_VERSION>`। `LEGAL_VERSION = "मसौदा 2026-11-21"`।
- env (सब वैकल्पिक): `NEXT_PUBLIC_ORG_NAME`, `NEXT_PUBLIC_GRIEVANCE_NAME`, `NEXT_PUBLIC_GRIEVANCE_EMAIL` (Zod email; ग़लत हो तो null)।
- शिकायत वाले पन्ने पर सबसे ऊपर: `ठगी की शिकायत यहाँ नहीं होती। ठगी हुई है तो तुरंत 1930 पर call करें, या cybercrime.gov.in पर शिकायत करें।` (और `/turant` का link)।
- मना किए शब्द (copy-lint) लागू हैं, ख़ासकर "गारंटी"। उसकी जगह "हम नतीजे का वादा नहीं करते"।
- privacy पन्ने में लिखे तीन दावे e2e से पक्के होंगे: (1) किसी पन्ने पर `Set-Cookie` नहीं · (2) हर request अपनी ही साइट पर जाती है, कोई बाहरी script या tracker नहीं · (3) `/haq/thagi` का हिसाब किसी दूसरी जगह नहीं भेजा जाता (वही दो जाँचें उस पन्ने पर भी)।

## Review Focus
1. **शिकायत अधिकारी का email ग़लत रूप में set हो** → null, और "अभी नियुक्त नहीं" (unit)।
2. **कोई पीड़ित ठगी की शिकायत "शिकायत अधिकारी" को भेजने लगे** → पन्ने पर सबसे ऊपर 1930 वाली चेतावनी (unit + e2e)।
3. **भविष्य में कोई analytics या cookie जोड़ दे और privacy notice पुराना रह जाए** → e2e fail होगा (no Set-Cookie, same-origin requests)।
4. **320px पर लंबे email या पते से बगल में scroll** → e2e।
5. **footer से legal पन्ने न मिलें** → unit (footer links)।

## File Structure
```
modules/site/config.ts (+test)              orgName, grievanceName, grievanceEmail
modules/site/legal.ts                       LEGAL_VERSION
components/ui/site-footer.tsx (+test)       legal links
components/legal/draft-banner.tsx
app/(site)/legal/page.tsx                   तीनों का परिचय
app/(site)/legal/privacy/page.tsx
app/(site)/legal/terms/page.tsx
app/(site)/legal/shikayat/page.tsx
components/legal/legal.test.tsx
scripts/e2e-legal.mjs + CI
.env.example
```

### Task 1: settings और footer
- [ ] tests: `getSiteConfig` में तीनों नए खाने (सही email माना जाए, ग़लत email null हो, ख़ाली हो तो null) · footer में `/legal/privacy`, `/legal/terms`, `/legal/shikayat` के links
- [ ] FAIL → लिखें → PASS → commit

### Task 2: तीनों पन्ने
**निजता (`/legal/privacy`)**, h2 वाले हिस्से:
1. `संक्षेप में`: अभी हम आपका नाम, फ़ोन नंबर, खाता नंबर या कोई पहचान वाली जानकारी नहीं माँगते और नहीं रखते।
2. `"आपका हक़" वाले हिसाब में भरी जानकारी`: तारीख़ें, रकम, हाँ या नहीं वाले जवाब। सिर्फ़ उसी समय हिसाब के लिए, किसी database में नहीं। पर ये पन्ने के पते (URL) में होती हैं, इसलिए browser की history और hosting के तकनीकी logs में कुछ समय रह सकती हैं। साझा फ़ोन हो तो history मिटा दें।
3. `तकनीकी जानकारी`: वेबसाइट चलाने और सुरक्षा के लिए hosting server अपने आप IP पता, browser का प्रकार और खोला गया पन्ना देखता है। इससे हम किसी की पहचान नहीं करते।
4. `फ़ोन में सेव पन्ने (offline)`: इमरजेंसी पन्ने और बैंक वाला पन्ना फ़ोन में सेव होते हैं, उनमें आपकी कोई निजी जानकारी नहीं होती। मिटाने हों तो browser की settings में इस साइट का data मिटाएँ।
5. `cookie और tracking`: अभी कोई cookie, analytics या विज्ञापन वाला tracker नहीं।
6. `बाहरी links`: RBI, cybercrime.gov.in, बैंकों की साइटें। वहाँ उनकी अपनी नीति लागू होती है।
7. `आगे क्या बदलेगा`: WhatsApp पर मदद या "मेरा केस" शुरू होने से पहले यह notice बदलेगा, बताया जाएगा कि क्या जानकारी ली जाएगी और क्यों, और आपकी अलग सहमति ली जाएगी।
8. `आपके अधिकार`: भारत के डेटा संरक्षण कानून (Digital Personal Data Protection Act, 2023) के तहत: अपनी जानकारी के बारे में पूछना, सुधार या मिटाने को कहना, शिकायत करना, और अपनी जगह किसी को नामित करना। पहले हमारे शिकायत अधिकारी से, फिर Data Protection Board of India से। `[वकील की जाँच बाकी]`
9. `आपकी जानकारी मिटाना`: अभी हमारे पास आपकी कोई जानकारी सँभली नहीं है, इसलिए मिटाने को कुछ नहीं। अपने फ़ोन से मिटाने का तरीका ऊपर (4) में।

**शर्तें (`/legal/terms`):** (1) यह जानकारी देने वाली मुफ़्त सेवा है, कानूनी सलाह नहीं। (2) हम सरकार, पुलिस या बैंक नहीं हैं। (3) नियम RBI जैसे मूल स्रोतों से, तारीख़ और link के साथ लिखे जाते हैं, फिर भी ग़लती हो सकती है, और नियम बदल सकते हैं; आख़िरी फ़ैसला बैंक, पुलिस या अदालत का होता है। (4) हम किसी नतीजे का वादा नहीं करते (पैसा वापस आएगा या नहीं)। (5) बाहरी साइटों के लिए हम ज़िम्मेदार नहीं। (6) साइट का ग़लत इस्तेमाल न करें, जैसे किसी और को धोखा देने के लिए। (7) शर्तें बदलें तो तारीख़ के साथ यहीं बताया जाएगा। (8) भारत का कानून लागू `[वकील की जाँच बाकी]`।

**शिकायत अधिकारी (`/legal/shikayat`):** सबसे ऊपर Notice danger (1930 वाली) + `/turant` link · फिर "हमारी सेवा के बारे में शिकायत (जैसे कोई ग़लत जानकारी, या आपकी जानकारी से जुड़ा सवाल)" · शिकायत अधिकारी: नाम और email (env से), न हो तो `अभी नियुक्त नहीं; launch से पहले यहाँ नाम और email जुड़ेंगे।` · `जवाब का समय: [वकील की जाँच के बाद तय होगा]`
- [ ] tests (render): तीनों पर draft banner · privacy में "cookie" वाला हिस्सा और "database में नहीं" · शिकायत पर 1930 वाली चेतावनी पहले, `/turant` link · env न हो तो "अभी नियुक्त नहीं" और कोई `mailto:` नहीं · env हो तो `mailto:<email>` · `/legal` पर तीनों links
- [ ] FAIL → लिखें → PASS → build → commit

### Task 3: e2e (privacy के दावों का सबूत)
`scripts/e2e-legal.mjs`: तीनों पन्ने 200 + draft banner · `/`, `/turant/upi`, `/haq/thagi?…`, `/gyan/digital-arrest`, `/legal/privacy` पर कोई `set-cookie` header नहीं, `document.cookie` ख़ाली, और हर request `BASE` के origin पर · 320px पर `/legal/*` · footer में links · CI में जोड़ें → commit
