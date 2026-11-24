# Plan A2g: photo या screenshot से जाँच (TR-36)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans

**Goal:** बहुत-सी ठगी photo/screenshot में आती है, और बहुत लोग (ख़ासकर बुज़ुर्ग) text copy नहीं कर पाते। "पहले पूछो" में photo चुनते ही
फ़ोन ख़ुद अक्षर पढ़े (OCR, हिंदी + English) और तुरंत जाँच हो। **photo कभी फ़ोन से बाहर नहीं जाती।**

## तरीका
- tesseract.js 7 (browser में WebAssembly)। उसकी files हमारी अपनी साइट से (`/ocr/…`), किसी CDN से नहीं: build से पहले
  `scripts/copy-ocr-assets.mjs` node_modules से `public/ocr/` में (git में नहीं)।
- भाषा: `hin+eng` (4.0.0_best_int, gzip: करीब 1.4 + 3 MB)। सिर्फ़ बटन दबाने पर download, फिर browser में cache।
- CSP: worker अपनी साइट से (blob नहीं), WebAssembly के लिए `script-src 'wasm-unsafe-eval'` (eval नहीं)।
- पढ़ा हुआ text डिब्बे में दिखता है (ठीक किया जा सके), और जाँच अपने-आप।
- Share: WhatsApp की photo पर Share → "ठगी रक्षक" (manifest `files`), service worker photo को फ़ोन के डिब्बे में रखे, पन्ना पढ़कर मिटाए।

## जाँच
- unit: OCR text की सफ़ाई, CSP, manifest, worker का photo वाला रास्ता, copy script की सूची।
- e2e: असली photo (Playwright से बनी PNG) → पढ़ा text डिब्बे में → पक्के निशान; कोई बाहरी request नहीं; Share से photo।
