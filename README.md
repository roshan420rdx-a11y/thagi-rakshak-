# ठगी रक्षक

डिजिटल ठगी के पीड़ितों का साथी: पहले 60 मिनट से लेकर पैसा वापस पाने तक हर कदम पर मदद, और ठगी की कोशिशें पहचानने में मदद।

- पूरी योजना: `PROMPT.md`
- काम की स्थिति: `PROGRESS.md`
- Design: `docs/superpowers/specs/`
- हर हिस्से की plan: `docs/superpowers/plans/`
- मालिक के काम (एक सूची): `docs/MALIK_KE_KAAM.md`

## साइट में क्या है
| पन्ना | काम |
|-------|-----|
| `/turant` | ठगी हो गई: पहले 60 मिनट के कदम (11 प्रकार, "फ़ोन चोरी" समेत), हर कदम पर "हो गया ✓", internet के बिना भी |
| `/pucho` | "पहले पूछो": message या call की बात चिपकाकर ठगी के निशान (फ़ोन के अंदर, कहीं भेजा नहीं जाता); "copy किया message चिपकाएँ और जाँचें" एक tap में; "बोलकर लिखें" (mic); "photo या screenshot से जाँचें" (अक्षर फ़ोन में ही पढ़े जाते हैं, tesseract.js अपनी साइट के `/ocr` से); ऐप जोड़ा हो तो WhatsApp/SMS से Share → "ठगी रक्षक" |
| `/abhyas` | "ठगी या असली?" अभ्यास: हर round में 8 message पहचानें (कुल 39 में से, call वाले भी) |
| `/case` | "मेरा केस": ठगी की तारीख़ और समय, शिकायतों की तारीख़ें, नंबर, आगे की तारीख़ें (सिर्फ़ इसी फ़ोन में) |
| `/arzi` | बैंक, पुलिस और RBI Ombudsman के मुफ़्त पत्र (print/PDF); ठगी की तारीख़ और लगभग समय ("आज", "कल", "अभी"), रकम और पहले की शिकायत वहीं भरें |
| `/shikayat-rasta` | शिकायत का पूरा रास्ता: 1930 → cybercrime.gov.in → बैंक → पुलिस → RBI Ombudsman, और चक्षु |
| `/haq` | RBI के नियमों से हक़ का हिसाब (ज़ीरो ज़िम्मेदारी, मुआवज़ा, fail लेन-देन, freeze) |
| `/gyan` | ज्ञानकोश: 16 तरह की ठगी (खोज के साथ; हर पन्ने के आख़िर में "इसी तरह की और ठगी"), और बैंक वाले पन्ने |
| `/poster` | छापने वाला एक पन्ने का पोस्टर |
| `/nambar` | ज़रूरी नंबर (1930, 112, 181, 14448, 1947, 14416) और सरकारी साइटें, एक tap में; एक पन्ने की पर्ची छापें |
| `/khoj` | पूरी साइट में खोज ("1930", "SBI", "loan", "अर्ज़ी"), फ़ोन में ही; बिना JS के सब कुछ एक जगह |
| `/bharosa`, `/legal/*` | भरोसा, निजता, शर्तें, शिकायत अधिकारी |

## तकनीक
Next.js (App Router) · TypeScript · Tailwind CSS · Zod · Vitest · Playwright

## चलाने के कमांड
```bash
npm install
npm run dev        # डेवलपमेंट
npm test           # unit tests
npm run build      # production build
npm start          # build के बाद चलाना
npm run lint
npm run typecheck
```
जाँच के लिए app चलाकर `/api/health` खोलें। जवाब में `"status": "ok"` आना चाहिए।

असली browser वाली जाँचें (पहले `npm run build && npm start`):
```bash
for s in turant site haq gyan legal pucho case abhyas poster a11y console seo; do node scripts/e2e-$s.mjs || break; done
```

## सुरक्षा का नियम
असली secrets (`.env` वाली keys) कभी GitHub पर नहीं डालने। `.gitignore` इन्हें रोकता है।
