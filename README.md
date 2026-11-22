# ठगी रक्षक

डिजिटल ठगी के पीड़ितों का साथी: पहले 60 मिनट से लेकर पैसा वापस पाने तक हर कदम पर मदद, और ठगी की कोशिशें पहचानने में मदद।

- पूरी योजना: `PROMPT.md`
- काम की स्थिति: `PROGRESS.md`
- Design: `docs/superpowers/specs/`
- हर हिस्से की plan: `docs/superpowers/plans/`
- मालिक के काम (एक सूची): `docs/MALIK_KE_KAAM.md`

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

## सुरक्षा का नियम
असली secrets (`.env` वाली keys) कभी GitHub पर नहीं डालने। `.gitignore` इन्हें रोकता है।
