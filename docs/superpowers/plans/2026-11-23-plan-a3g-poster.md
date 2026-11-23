# Plan A3g: ठगी से बचाव का पोस्टर (`/poster`)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans

**Goal:** एक A4 पन्ने का पोस्टर जिसे मालिक या कोई भी छापकर दुकान, बैंक शाखा, CSC, पंचायत भवन, स्कूल में लगा सके: 8 पक्की बातें, ठगी हो जाए तो 1930 / cybercrime.gov.in, और साइट का पता। फ़ोन से "Print / PDF" (PDF WhatsApp पर भी भेजी जा सकती है)।

## Global Constraints
- एक ही A4 पन्ना (e2e में असली PDF बनाकर पन्ने गिनना)। print में सिर्फ़ पोस्टर (menu, बटन नहीं)।
- **QR code नहीं:** हम सिखाते हैं "QR scan न करें" (पैसे के लिए); पोस्टर पर "यह scan करें" उलटा संदेश देगा। पता बड़े अक्षरों में।
- सरकारी होने का दिखावा नहीं: नीचे "ठगी रक्षक (सरकारी संस्था नहीं)"।
- बातें वही जो साइट पर हैं (8 आम निशानों से मेल), कोई मना किया शब्द नहीं (test)।
- print का CSS आम हो: `data-print-area` वाला हिस्सा ही छपे (अर्ज़ी और पोस्टर दोनों)।

### Task 1 (TDD): `modules/site/poster.ts` (8 बातें, 1930 वाला डिब्बा का text) + unit tests
### Task 2: `/poster` पन्ना, print CSS (A4), होम का 8वाँ tile, sitemap
### Task 3: e2e (print में सिर्फ़ पोस्टर, PDF ठीक 1 पन्ना, 320px, print बटन), सारी suites, PROGRESS, push
