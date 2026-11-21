# PROGRESS: ठगी रक्षक

**दिशा (कभी न भूलने वाली बातें): `DISHA.md`, हर session में सबसे पहले।** पूरी योजना `PROMPT.md` में है, और design `docs/superpowers/specs/` में। इस फ़ाइल में सिर्फ़ यह दर्ज होता है कि क्या बन चुका है और क्या बाकी है।

**नियम:** कोई चीज़ तभी ✅ होगी, जब वह सच में चलाकर जाँची जा चुकी हो (CI run id के साथ)। सिर्फ़ फ़ाइल लिखी हो, तो 🟡 रहेगा।

संकेत: ✅ पूरा और जाँचा हुआ · 🟡 लिखा गया, जाँच बाकी · ⏳ बाकी · ⛔ रुका हुआ · 👤 मालिक के हाथ का

_आख़िरी अपडेट: 2026-11-21 रात (TR-1 से TR-9 का code बना और इस मशीन पर पूरी जाँच पास; GitHub repo बनने के बाद CI बाकी)_

## नया session या नया chat शुरू करने का तरीका

नया chat खोलकर सबसे पहले यही लिखें:

> Repo roshan420rdx-a11y/thagi-rakshak hai. Pehle DISHA.md padho, phir PROGRESS.md ka "अगला कदम" se continue karo.

**मालिक के बारे में (हर chat में याद रखें):**
- सिर्फ़ Android फ़ोन से काम करते हैं, terminal के बिल्कुल beginner।
- हर कदम बटन-दर-बटन, आसान हिंदी में, छोटे जवाब।
- Developer Claude है। WhatsApp पर पीड़ितों को मालिक जवाब देंगे, पर उन्हें कानून या बैंकिंग की गहरी जानकारी नहीं है। इसलिए product जितना हो सके अपने आप काम करे, और मालिक के लिए "जवाब-किताब" बने।

**काम के नियम:**
1. एक हिस्सा (TR-x) बनाना।
2. GitHub पर push।
3. CI के सारे jobs के log पढ़ना।
4. गड़बड़ हो तो ठीक करना।
5. तभी यहाँ ✅ और run id लिखना।

## हिस्सों की स्थिति

| हिस्सा | काम | स्थिति |
|---|---|---|
| Design | Design Doc v2 + भाग 2 (ढाँचा, design, planning) + mockups | ✅ लिखा गया और मालिक ने मंज़ूर किया (2026-11-21) |
| Plan A1 | TR-1 से TR-4 की विस्तृत plan | ✅ लिखी गई: `docs/superpowers/plans/2026-11-21-plan-a1-neev-aur-turant.md` |
| TR-0 | GitHub पर नया repo `thagi-rakshak` | ⏳ 👤 |
| TR-1 | नींव: Next.js, CI, health, security headers | 🟡 स्थानीय जाँच पास (lint, typecheck, build, `/api/health` ok, headers) · GitHub CI बाकी |
| TR-2 | Design system | 🟡 स्थानीय जाँच पास (tokens light+dark, 12 contrast-जोड़े ≥4.5, components) · GitHub CI बाकी |
| TR-3 | भाषा ढाँचा, शब्दकोश, copy-lint | 🟡 स्थानीय जाँच पास (copy-lint ने नकली शब्द पकड़कर दिखाया) · GitHub CI बाकी |
| TR-4 | ठगी के प्रकार + /turant | 🟡 स्थानीय जाँच पास: 70 unit tests + 8 browser जाँचें (बिना JS, offline, 404, 320px, dark mode, headers) · GitHub CI बाकी |
| TR-5 | होम, navigation, /pucho (7 आम निशान), /bharosa | 🟡 स्थानीय जाँच पास: 89 unit tests + 9 site browser जाँचें (+ /turant की 8) · GitHub CI बाकी |
| TR-6 | नियम-तालिका v0 (RBI मूल text) | 🟡 RBI के मूल text से (`docs/sources/rbi/`), हर नियम पर quote-जाँच test · 👤 मालिक की दूसरी जाँच बाकी · MRM SOP (गृह मंत्रालय) का मूल text अभी नहीं मिला |
| TR-7 | rules-engine + fixtures | 🟡 स्थानीय जाँच पास (शुद्ध engine, 2027 के 3 नियम + 2027 से पहले का 1 + fail लेन-देन; RBI के अपने Illustration से मिलान) |
| TR-8 | /haq पन्ने | 🟡 स्थानीय जाँच पास: 176 unit tests + 23 browser जाँचें (बिना JS form submit समेत) · GitHub CI बाकी |
| TR-9 | बैंकों के आधिकारिक रास्ते (दो-जाँच) | 🟡 ढाँचा और पन्ने बने: 10 बैंक, RBI के quote वाले 6 सुरक्षा-सुझाव (`.bank.in`, card के पीछे का नंबर, ऐप में report link…), /turant से link, offline · **नंबर अभी किसी बैंक का live नहीं** (TR-9b: दो-जाँच बाकी, `docs/verify/BANKS.md`) · 198 unit + 28 browser जाँचें पास |
| TR-10 | ज्ञानकोश + 5 पन्ने | ⏳ |
| TR-11 | /legal (वकील की जाँच बाकी) | ⏳ |
| TR-12 | Render deploy + launch checklist | ⏳ |
| TR-13 | WhatsApp पहला जवाब + जवाब-किताब | ⏳ |
| TR-14 से TR-26 | चरण B और C (`PROMPT.md` Part 4) | ⏳ |

## ⛔ रुकावटें और सीमाएँ
- GitHub पर नया repo Claude नहीं बना सकता। मालिक बनाएँगे (TR-0)।
- **वकील अभी नहीं है।** जब तक वकील अर्ज़ियों के ढाँचे और legal पन्ने न जाँचे, कोई paid किट नहीं बिकेगी। launch मुफ़्त जानकारी वाला होगा।
- RBI के अंतिम निर्देशों में दो बातें अभी पक्की नहीं: (1) रिपोर्ट करने की समय-सीमा, (2) co-operative banks पर नियम लागू है या नहीं। ये TR-6 में मूल text से पक्की होंगी।

## TR-1 से TR-4 (विस्तार), 2026-11-21
- branch `tr-a1-neev-turant` (7 commits, plan A1 के 7 tasks)।
- इस मशीन पर: `npm test` → 70 tests पास · `npm run lint`, `typecheck`, `build` पास · `node scripts/e2e-turant.mjs` → 8/8 ✓।
- service worker की जाँच उल्टी तरफ़ से भी: service worker बंद करने पर offline reload fail होता है, चालू होने पर चलता है।
- design में दो सुधार हुए: (1) "/turant 100KB से छोटा" की जगह "HTML 60KB से कम + बिना JS के पूरा काम", (2) शब्दकोश में "Indemnity bond" के लिए "क्षतिपूर्ति का काग़ज़" ("गारंटी" शब्द मना है)।
- बाद के लिए छोटी बातें: (a) service worker का cache version build-id से जोड़ना (TR-12), (b) /turant के मुख्य पन्ने पर कदमों के शीर्षक h3 करना, (c) "offline में प्रकार पर tap" वाली जाँच को e2e में जोड़ना (एक बार हाथ से जाँचा, चलता है)।

## TR-5 (विस्तार), 2026-11-21
- branch `tr-a2a-home-bharosa` (`tr-a1-neev-turant` के ऊपर), plan `docs/superpowers/plans/2026-11-21-plan-a2a-home-bharosa.md`।
- होम: दो दरवाज़े (ठगी हो गई / ठगी के आम निशान) + प्रतिज्ञा + WhatsApp बटन (सिर्फ़ तब, जब `NEXT_PUBLIC_WHATSAPP_NUMBER` सही रूप में set हो)।
- फ़ोन पर नीचे का menu (होम, पूछो, भरोसा; "मेरा केस" TR-16 तक छिपा) · /turant पर कोई menu नहीं।
- final review में मिली कमी ठीक की: फ़ोन पर footer की आख़िरी लाइन (कानूनी सलाह वाली) नीचे के menu के पीछे छिप रही थी (पहले failing e2e, फिर fix)।
- **रुकावट:** RBI की वेबसाइट (rbi.org.in) environment में allow कर दी गई है, पर (a) web पढ़ने वाला सहायक उस तक नहीं पहुँचता, और (b) shell से download करने पर auto-mode की सुरक्षा जाँच ने रोक दिया। TR-6 के नियम मूल text के बिना "जाँच बाकी" के निशान के साथ बनेंगे, या मालिक की अनुमति के बाद पक्के होंगे।

## TR-6 से TR-8 (विस्तार), 2026-11-21
- branch `tr-a2b-niyam-haq` (`tr-a2a-home-bharosa` के ऊपर), plan `docs/superpowers/plans/2026-11-21-plan-a2b-niyam-haq.md`।
- **RBI के मूल text पढ़े गए** (मालिक की अनुमति से): 24 जून 2026 के नए निर्देश (सातों तरह के बैंकों में एक जैसे, co-operative banks समेत), 2025 के पुराने निर्देश (para 67-73), 2019 का TAT circular। अंश `docs/sources/rbi/` में।
- **design से 3 बड़े सुधार (मूल text के कारण):** (1) ₹25,000 का मुआवज़ा सिर्फ़ "ग्राहक की लापरवाही" वाले मामलों में है (76N); बैंक या बीच की कंपनी की गलती पर पूरा पैसा वापस (76L/76M)। (2) 1930/NCRP **और** बैंक, दोनों को 5 दिन में बताना ज़रूरी है। (3) co-operative banks भी शामिल हैं (पहले "साफ़ नहीं" लिखा था)।
- एक ही calculator `/haq/thagi`: ठगी की तारीख़ से पुराने या नए नियम अपने आप चुनता है। साथ में `/haq/failed-txn` (₹100 रोज़) और `/haq/frozen-money` (गाइड, मूल SOP से जाँच बाकी)।
- 👤 **मालिक की दूसरी जाँच:** `docs/sources/rbi/README.md` में दिए RBI links खोलकर मिलाएँ। मिल जाए तो नियमों पर `verifiedBy: "owner"` जुड़ेगा और "दूसरी जाँच बाकी" वाली लाइन हट जाएगी।

## TR-9 (विस्तार), 2026-11-21
- branch `tr-9-bank-raste` (`tr-a2b-niyam-haq` के ऊपर), plan `docs/superpowers/plans/2026-11-21-plan-a3a-bank-raste.md`।
- RBI का `.bank.in` वाला circular (22 अप्रैल 2025) मूल text से पक्का किया, और `docs/sources/rbi/` में सँभाला।
- **कोई नंबर तभी दिखेगा, जब दो जाँच हो चुकी हों** (`isLive` = claude + owner)। एक test हर बैंक-पन्ने के HTML में `tel:` और `.bank.in` links खोजता है, ताकि बिना दो-जाँच के कुछ न छपे।
- /turant के "बैंक को बताएँ" और "card block करें" वाले कदमों पर अब "अपने बैंक का सही रास्ता देखें" link है, और वह offline भी खुलता है।
- **TR-9b (बाकी):** बैंकों की `.bank.in` साइटों से असली नंबर लाना (जाँच 1), फिर मालिक की जाँच 2। इसके लिए environment में उन साइटों की अनुमति, और download करने की मालिक की अनुमति चाहिए।

## अगला कदम
1. 👤 **मालिक:** GitHub पर नया repo `thagi-rakshak` बनाएँ, फिर chat में लिखें: "repo बन गया"।
2. 🤖 **Claude:** repo जोड़कर `main` और चारों branches (`tr-a1-neev-turant`, `tr-a2a-home-bharosa`, `tr-a2b-niyam-haq`, `tr-9-bank-raste`) push करना → CI के दोनों jobs (checks, e2e) के log पढ़ना → हरे हों तो TR-1 से TR-4 पर ✅ और run id।
3. 🤖 TR-9b (बैंकों के नंबर, मालिक की अनुमति के बाद) · फिर TR-10 (ज्ञानकोश) और TR-11 (legal पन्ने)।
