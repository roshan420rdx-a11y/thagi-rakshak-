# बैंकों के नंबर और website: दो-जाँच

> **नियम (DISHA 9):** कोई भी नंबर या website का पता तभी दिखेगा, जब दो अलग जाँच हो चुकी हों।
> एक भी ग़लत नंबर पीड़ित को सीधे ठग तक पहुँचा सकता है, इसलिए इस नियम में कोई छूट नहीं।

## जाँच 1: 🤖 Claude
1. बैंक की **अपनी** website खोलना। उसका पता `.bank.in` पर ख़त्म होना चाहिए (RBI circular RBI/2025-26/28)। Google या किसी और साइट से कोई नंबर नहीं लेना।
2. उस पन्ने पर पहुँचना जहाँ ठगी report करने का रास्ता लिखा है (RBI 76G(3): यह link होम पेज पर होना ज़रूरी है)।
3. `modules/banks/registry.ts` में भरना: `value` (नंबर), `labelHi`, `sourceUrl` (उस पन्ने का पूरा पता), `sourceQuote` (पन्ने की मूल लाइन, जिसमें नंबर लिखा है), `verifiedBy: ["claude"]`, `verifiedOn` (तारीख़)।
4. **अभी यह नंबर साइट पर नहीं दिखेगा।**

## जाँच 2: 👤 मालिक (फ़ोन पर, 2 मिनट प्रति बैंक)
1. Claude chat में बैंक का `sourceUrl` भेजेगा।
2. Chrome में वह link खोलें।
3. ऊपर पता देखें: वह `.bank.in` पर ख़त्म होता हो, और ताले (🔒) का निशान हो।
4. पन्ने पर वही नंबर लिखा हो, जो Claude ने बताया।
5. chat में लिखें: **"SBI ठीक है"** (या जिस बैंक की जाँच की)।
6. Claude `verifiedBy` में `"owner"` जोड़ेगा, और नंबर साइट पर दिखने लगेगा।

## हर 3 महीने में
बैंक नंबर बदल सकते हैं। हर 3 महीने में (और कोई user "यह नंबर ग़लत लगा" बताए तो उसी दिन) दोनों जाँच दोबारा होंगी।

## स्थिति
संकेत: ⏳ बाकी · 🤖 Claude ने जाँचा (अभी छिपा) · ✅ दोनों जाँच, साइट पर दिख रहा

| बैंक | website (.bank.in) | ठगी का रास्ता (जाँच 1 में मिला) | मालिक यह link खोलें (जाँच 2) |
|---|---|---|---|
| SBI | 🤖 sbi.bank.in | होम पेज पर "Unauthorized Digital Transaction Reporting" link (अलग फ़ोन नंबर नहीं मिला) | https://sbi.bank.in/ |
| HDFC बैंक | 🤖 www.hdfc.bank.in | 📞 1800 258 6161 | https://www.hdfc.bank.in/upi/report-frauds |
| ICICI बैंक | 🤖 www.icici.bank.in | 📞 1800 1080 | https://www.icici.bank.in/personal-banking/help/online-safe-banking |
| PNB | 🤖 www.pnb.bank.in | होम पेज पर "नेट बैंकिंग ब्लॉक करें" link | https://www.pnb.bank.in/ |
| बैंक ऑफ़ बड़ौदा | 🤖 bankofbaroda.bank.in | 📞 1800 5700 / 1800 5000 | https://bankofbaroda.bank.in/customer-support |
| केनरा बैंक | 🤖 www.canarabank.bank.in | होम पेज पर "REPORT UNAUTHORISED/FRAUDULENT.." link | https://www.canarabank.bank.in/ |
| यूनियन बैंक ऑफ़ इंडिया | 🤖 www.unionbankofindia.bank.in | 📞 1800 2222 44 / 1800 2222 43 | https://www.unionbankofindia.bank.in/en/common/cyber-security |
| Axis बैंक | 🤖 www.axis.bank.in | होम पेज पर "Report A Fraud" link | https://www.axis.bank.in/ |
| कोटक महिंद्रा बैंक | 🤖 www.kotak.bank.in | होम पेज पर "Report a fraud" link | https://www.kotak.bank.in/ |
| बैंक ऑफ़ इंडिया | ⏳ (साइट bot-जाँच के कारण नहीं खुली) | ⏳ | — |

जाँच 1: Claude, 2026-11-21। मूल लाइनें `docs/sources/banks/<बैंक>.txt` में। अभी इनमें से कुछ भी साइट पर नहीं दिखता।

**जाँच 1 के लिए:** मालिक की अनुमति (2026-11-21) से 10 बैंकों के `.bank.in` hosts environment में जोड़े गए।

## दोबारा मिलान: 🤖 Claude, 2026-11-23 (मालिक की अनुमति से)
हर बैंक की अपनी `.bank.in` साइट उसी दिन फिर खोली गई, और `registry.ts` की हर मूल लाइन (नंबर या link का नाम) पन्ने पर जस की तस मिली:
**9 बैंक, 20 जाँच ✓** (हर website का पता `.bank.in` पर, हर नंबर/link पन्ने पर)। उलटी जाँच भी की: एक अंक बदला नंबर पन्ने पर **नहीं** मिलता।
- Bank of India: साइट अब भी bot-जाँच (Cloudflare, "Just a moment", 403) देती है; उसे चकमा देना ठीक नहीं, इसलिए ⏳।
- यह मशीन वाली दूसरी बार की जाँच है, इंसान वाली जाँच 2 नहीं: नंबर साइट पर तभी दिखेंगे जब ऊपर वाली "जाँच 2" (👤) हो।
- हर 3 महीने यही जाँच: `RECHECK=1 NODE_USE_ENV_PROXY=1 npx vitest run scripts/recheck/banks.test.ts`
