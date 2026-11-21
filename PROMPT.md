ठगी रक्षक: MASTER ENGINEERING BLUEPRINT (VERSION 1.0)

Project Type: डिजिटल ठगी के पीड़ितों का साथी + ठगी से बचाव (WhatsApp + वेबसाइट)
Primary Goal: ठगी के बाद पीड़ित को पहले 60 मिनट से लेकर बैंक, पुलिस, RBI और कोर्ट तक हर कदम पर साथ देना, और रोज़ आने वाली ठगी की कोशिशें पहचानने में मदद करना।

Development Philosophy: Victim First • Trust by Design • Rules in Code, not in AI • Small Parts, Each Verified • Free Where It Matters • Evidence-Based Engineering

**सबसे पहले `DISHA.md` पढ़ें** (दिशा, कभी न टूटने वाले नियम, अब तक के फ़ैसले)। पूरा design इन दो दस्तावेज़ों में है, और यह फ़ाइल उन्हीं पर टिकी है:
- `docs/superpowers/specs/2026-11-21-thagi-rakshak-design.md` (Design Doc v2: **क्या और क्यों**)
- `docs/superpowers/specs/2026-11-21-thagi-rakshak-structure-design.md` (भाग 2: **कैसा दिखेगा, कैसे बनेगा, कब**)

कोई टकराव हो, तो ऊपर वाले दोनों दस्तावेज़ सही माने जाएँगे। उन्हें बदलना हो, तो पहले उन्हें बदला जाए, फिर code।

---

PART 1: मालिक और काम करने का तरीका

1.1 मालिक के बारे में (हर session में याद रखें)
- मालिक सिर्फ़ Android फ़ोन से काम करते हैं, और terminal या code के बिल्कुल beginner हैं।
- हर कदम **बटन-दर-बटन, आसान हिंदी** में बताना है, और जवाब छोटे रखने हैं।
- Developer: **Claude**। मालिक ने कहा है: "जितना हो सके तुम ही इस app में solve कर देना।"
- WhatsApp पर पीड़ितों को जवाब **मालिक** देंगे, पर उन्हें कानून या बैंकिंग की गहरी जानकारी नहीं है। इसलिए:
  - (a) product जितना हो सके **अपने आप** मदद करे,
  - (b) मालिक के लिए copy-paste करने लायक **"जवाब-किताब"** बने (TR-13),
  - (c) जो बात जवाब-किताब में न हो, उस पर मालिक कोई अंदाज़ा न लगाएँ। वे नया chat खोलकर Claude से पूछें।

1.2 जो काम सिर्फ़ मालिक के हाथ में हैं (Claude नहीं कर सकता)
- GitHub पर नया repo बनाना (Claude के पास इसकी अनुमति नहीं है)
- Render, Supabase, Meta (WhatsApp Business), Razorpay, domain के खाते बनाना, और उनके बटन दबाना
- GitHub के workflows चलाना, जहाँ ज़रूरत हो
- **वकील** ढूँढना और उनसे अर्ज़ियों के ढाँचे और legal पन्ने जँचवाना

1.3 काम के नियम (marketplace जैसे ही)
1. पूरा काम छोटे हिस्सों (TR-1, TR-2, …) में बँटा है। **एक बार में एक हिस्सा।**
2. हर हिस्से की विस्तृत plan `docs/superpowers/plans/` में होगी। plan पहले लिखी जाएगी, फिर code।
3. TDD: पहले failing test, फिर code, फिर test पास।
4. हर हिस्सा बनने के बाद: GitHub पर push → CI के सारे jobs के log पढ़ना → गड़बड़ हो तो ठीक करना → तभी `PROGRESS.md` में ✅ और CI run id लिखना।
5. **सिर्फ़ फ़ाइल लिखने से ✅ नहीं लगता।** चलाकर जाँचा न हो, तो 🟡।
6. हर session की शुरुआत: `PROGRESS.md` का "अगला कदम" पढ़ना।

1.4 कभी न टूटने वाले नियम (design से)
- हक़, पात्रता और deadline **सिर्फ़ rules engine (code)** तय करेगा, AI कभी नहीं।
- कानूनी हवाले **सिर्फ़ template** से आएँगे, AI कभी कोई धारा नहीं लिखेगा।
- AI ख़तरे का स्तर **सिर्फ़ बढ़ा** सकता है, घटा नहीं सकता।
- "100% सुरक्षित", "गारंटी", "पक्का पैसा वापस" जैसे शब्द कहीं नहीं होंगे (copy-lint test इन्हें पकड़ेगा)।
- हम कभी OTP, PIN, password नहीं माँगेंगे, न screen-share करवाएँगे, न पहले call करेंगे।
- वेबसाइट सरकारी जैसी नहीं दिखेगी: न तिरंगा, न अशोक चिह्न।
- /turant (इमरजेंसी) बिना login, बिना JavaScript और offline भी काम करेगा।
- बैंक का कोई नंबर बिना दो-जाँच (SOP 12.4) के live नहीं होगा।
- **जब तक वकील अर्ज़ियों के ढाँचे मंज़ूर न करें, कोई paid किट नहीं बिकेगी।** launch पूरी तरह मुफ़्त जानकारी के साथ होगा।

---

PART 2: तकनीक (Technology Stack)

- Next.js 15.5 (App Router) · React 19.1 · TypeScript 5.9 (strict) · Tailwind CSS 4 · Zod 3.25
- Vitest 3 (unit) · Playwright (e2e, `scripts/e2e-*.mjs`, marketplace जैसा)
- Node 22 (`.nvmrc`)
- आगे के हिस्सों में: Supabase (Mumbai region) · Render (web + cron) · Meta WhatsApp Cloud API · Razorpay · Claude API (सिर्फ़ `modules/ai` से) · Google Web Risk API
- font: system font stack (`"Noto Sans Devanagari", "Nirmala UI", system-ui, sans-serif`)। कोई web font download नहीं होगा।

---

PART 3: Code का ढाँचा

भाग 2 के खंड 11 जैसा:
- `app/` में सिर्फ़ पन्ने और API।
- असली logic `modules/<नाम>/` में, और हर module का बाहरी रास्ता `index.ts` से।
- `modules/rules-engine` पूरी तरह शुद्ध रहेगा: कोई DB, network या `Date.now()` नहीं।
- tests फ़ाइल के बगल में (`*.test.ts` / `*.test.tsx`), और e2e `scripts/e2e-*.mjs` में।

---

PART 4: पूरा Roadmap (छोटे हिस्से)

संकेत: 👤 = मालिक के हाथ का काम · 🤖 = Claude का काम · ⚖️ = वकील की ज़रूरत

### चरण A: नींव और इमरजेंसी साइट (लक्ष्य: 24 दिसंबर 2026 को मुफ़्त launch)

| हिस्सा | काम | कौन | plan |
|---|---|---|---|
| TR-0 | GitHub पर नया repo `thagi-rakshak` बनाना · नाम पर हाँ | 👤 | — |
| TR-1 | नींव: Next.js, CI, `/api/health`, security headers | 🤖 | plan A1 |
| TR-2 | Design system: रंग-tokens, contrast-जाँच, मूल components | 🤖 | plan A1 |
| TR-3 | भाषा ढाँचा, शब्दकोश, copy-lint | 🤖 | plan A1 |
| TR-4 | ठगी के प्रकार + `/turant` (बिना JS, offline) | 🤖 | plan A1 |
| TR-5 | होम (दो दरवाज़े), navigation, `/pucho` (ठगी के आम निशान, checker आने तक), `/bharosa` | 🤖 | plan A2a |
| TR-6 | RBI के 24 जून 2026 वाले निर्देश + MRM SOP पढ़कर नियम-तालिका v0 (मूल text की लाइनों के साथ) | 🤖 (+👤 दूसरी जाँच) | plan A2b |
| TR-7 | rules-engine (शुद्ध) + fixtures | 🤖 | plan A2b |
| TR-8 | `/haq` पन्ने: rbi-2027, frozen-money, failed-txn | 🤖 | plan A2b |
| TR-9 | 10 बड़े बैंकों के आधिकारिक ठगी-रिपोर्ट रास्ते + `/gyan/bank` पन्ने | 🤖 जाँच 1 + 👤 जाँच 2 | plan A3 |
| TR-10 | ज्ञानकोश का ढाँचा + 5 सबसे ज़रूरी पन्ने | 🤖 | plan A3 |
| TR-11 | `/legal`: privacy, terms, शिकायत अधिकारी (draft) | 🤖 + ⚖️ | plan A3 |
| TR-12 | Render पर deploy, uptime जाँच, launch checklist | 🤖 + 👤 (खाता) | plan A4 |
| TR-13 | WhatsApp: पहला automated जवाब (WhatsApp Business ऐप का Greeting message) + मालिक के लिए "जवाब-किताब" (`docs/JAWAB_KITAB.md`) | 🤖 + 👤 (फ़ोन पर setting) | — |

### चरण B: केस और साथ चलना (जनवरी से फ़रवरी 2027)

| हिस्सा | काम | कौन |
|---|---|---|
| TR-14 | Supabase: schema, RLS, field encryption, HMAC | 🤖 + 👤 (project) |
| TR-15 | उल्टा-OTP login (WhatsApp से) | 🤖 |
| TR-16 | incidents state machine + `/case/new` wizard | 🤖 |
| TR-17 | `/case/[id]` tracker | 🤖 |
| TR-18 | याद दिलाना: cron + WhatsApp templates | 🤖 + 👤 (Meta की मंज़ूरी) |
| TR-19 | अर्ज़ियाँ: templates + हिंदी PDF (मुफ़्त वाली पहले, paid वाली ⚖️ के बाद) | 🤖 + ⚖️ |
| TR-20 | भुगतान (Razorpay) + "पैसे नहीं? मुफ़्त" | 🤖 + 👤 (KYC) |
| TR-21 | screenshot से AI extraction (user की पुष्टि के साथ) | 🤖 |
| TR-22 | Ombudsman की अर्ज़ी + किट Plus | 🤖 + ⚖️ |

### चरण C: पहले पूछो (मार्च 2027)

| हिस्सा | काम |
|---|---|
| TR-23 | checker: तय नियम (patterns) + बाहरी संकेत (Web Risk, RDAP) |
| TR-24 | checker: AI + combine (AI सिर्फ़ ख़तरा बढ़ाए) + सुनहरा test-set |
| TR-25 | `/pucho` UI + share + "परिवार को भेजें" |
| TR-26 | चरण B और C की समीक्षा (Design v2 भाग 12 वाले रुकने के संकेत) |

### चरण D: अप्रैल 2027 के बाद
परिवार रक्षक · मददगार portal · वकील panel · U9 (जिनका खाता freeze हुआ) · और भाषाएँ · ठगी का मौसम · B2B। हर एक की plan उस समय लिखी जाएगी।

---

PART 5: "पूरा हुआ" की परिभाषा

भाग 2 का खंड 15 लागू होगा। हर हिस्से के लिए कम से कम ये शर्तें:
- unit tests + (जहाँ पन्ना है) e2e पास
- CI हरा
- copy-lint और contrast-जाँच पास
- 360px वाले फ़ोन पर बगल में scroll नहीं (horizontal scroll नहीं)
- `PROGRESS.md` में CI run id दर्ज
