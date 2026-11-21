# Plan A4a: launch की तैयारी, code वाला हिस्सा (TR-12) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** साइट को deploy के लिए तैयार करना, ताकि मालिक के Render खाता बनाते ही साइट live हो सके:
- Google के लिए sitemap और robots.txt
- app icon और "home screen पर जोड़ें" वाला manifest
- हर deploy पर पुराना offline cache अपने आप हटे
- `render.yaml`
- launch से पहले क्या बाकी है, यह बताने वाला script
- uptime जाँच
- मालिक के लिए बटन-दर-बटन deploy गाइड

**Architecture:** Next.js के built-in `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` और `app/icon.svg` इस्तेमाल होंगे। सारे public रास्ते एक ही जगह से आएँगे (`modules/site/routes.ts`, data से बनते हैं), ताकि sitemap कभी पीछे न रहे। service worker का version अब content version + git commit (`RENDER_GIT_COMMIT` / `GITHUB_SHA`) से बनेगा। launch-जाँच एक Node script होगा, जो env और data पढ़कर ✅/❌ की सूची छापेगा। यह CI में नहीं चलेगा, क्योंकि launch तक इसका fail होना ही सही है।

**Spec:** `DISHA.md` · भाग 2 खंड 13 (H4, H5), 15 (launch checklist) · plan A1 की deferred minor (SW cache)

## Global Constraints
- sitemap में सिर्फ़ public पन्ने होंगे (`/api`, `/sw.js` नहीं)। पूरे पते `NEXT_PUBLIC_SITE_URL` से बनेंगे।
- manifest: `name: "ठगी रक्षक"`, `short_name: "ठगी रक्षक"`, `start_url: "/"`, `display: "standalone"`, `lang: "hi"`, `theme_color: "#1D3A6B"`, `background_color: "#F7F6F3"`। icon SVG होगा (shield, brand रंग)।
- SW version: `turant-<TURANT_CONTENT_VERSION>-<commit के पहले 7 अक्षर या "local">`।
- `render.yaml`: region `singapore` (भारत का region नहीं है), plan `free`, `healthCheckPath: /api/health`। env में असली मान नहीं, सिर्फ़ `sync: false`।
- launch-जाँच कभी कोई secret नहीं छापेगा।

## Review Focus
1. **sitemap में कोई नया पन्ना छूट जाए** → test: sitemap के रास्ते = सारे static रास्ते (turant, gyan, bank, haq, legal)।
2. **`NEXT_PUBLIC_SITE_URL` के आख़िर में `/` हो** → दोहरा `//` न बने (unit)।
3. **नया deploy, पर फ़ोन में पुराना offline पन्ना** → नया version, और activate पर पुराने caches हटें (unit: version में commit)।
4. **launch-जाँच कोई secret छाप दे** → script सिर्फ़ "set है / नहीं है" बताता है (unit)।
5. **favicon न होने से हर पन्ने पर 404** → e2e: `/icon.svg` 200।

## File Structure
```
modules/site/routes.ts (+test)        publicRoutes(): string[]
app/sitemap.ts  app/robots.ts  app/manifest.ts  app/icon.svg
app/layout.tsx                        metadataBase
modules/offline/service-worker.ts     swVersion(env)
app/sw.js/route.ts
render.yaml
scripts/launch-check.mjs  + modules/site/launch.ts (+test)   जाँचों का शुद्ध हिस्सा
.github/workflows/uptime.yml
docs/DEPLOYMENT.md
scripts/e2e-site.mjs                  (sitemap, robots, manifest, icon)
```

### Task 1: public रास्ते, sitemap, robots
- `publicRoutes()`: `/`, `/turant`, हर `/turant/<slug>`, `/pucho`, `/haq`, `/haq/thagi`, `/haq/failed-txn`, `/haq/frozen-money`, `/gyan`, हर `/gyan/<slug>`, `/gyan/bank`, हर `/gyan/bank/<slug>`, `/bharosa`, `/legal`, `/legal/privacy`, `/legal/terms`, `/legal/shikayat`
- `sitemap()` → हर रास्ते का पूरा URL · `robots()` → सब allow, `sitemap: <site>/sitemap.xml`
- [ ] tests: गिनती = 1 + 1 + 10 + 1 + 4 + 1 + 5 + 1 + 10 + 1 + 4 = 39 · कोई दोहराव नहीं · `/api` नहीं · siteUrl के आख़िर में `/` हो तो भी `https://x.in/gyan` · robots में sitemap का पता
- [ ] FAIL → लिखें → PASS → commit

### Task 2: icon, manifest, metadataBase
- [ ] tests: `manifest()` के मान (ऊपर Global Constraints) · icon file मौजूद हो और उसमें `#1D3A6B` हो
- [ ] FAIL → लिखें → PASS → commit

### Task 3: SW version में commit
- `swVersion(env): string`
- [ ] tests: `RENDER_GIT_COMMIT="abcdef123456"` → `turant-2026-11-21.2-abcdef1` · सिर्फ़ `GITHUB_SHA` हो तो वही · कोई न हो तो `-local`
- [ ] FAIL → लिखें (route इसे इस्तेमाल करे) → PASS → commit

### Task 4: launch-जाँच
- `launchChecks(env, data): { id: string; ok: boolean; labelHi: string; fixHi: string }[]`। जाँचें:
  - `site_url`: https वाला `NEXT_PUBLIC_SITE_URL` set है
  - `org`: संस्था का नाम set है
  - `grievance`: शिकायत अधिकारी का नाम और email set हैं
  - `whatsapp`: WhatsApp नंबर set है (TR-13 के बाद ज़रूरी)
  - `legal_reviewed`: `LEGAL_VERSION` में "मसौदा" नहीं है
  - `banks_live`: कम से कम 5 बैंकों का कोई रास्ता दो-जाँच वाला है
  - `rules_owner`: RBI वाले सारे नियमों पर `owner` की जाँच है
  - `gyan_reviewed`: ज्ञानकोश के सारे पन्नों पर विशेषज्ञ की जाँच है
- `scripts/launch-check.mjs`: build के बाद ये जाँचें चलाकर ✅/❌ छापे। fail हो तो exit 1।
- [ ] tests: ख़ाली env → सब ❌, और output में कोई env का मान नहीं (secret न छपे) · सब set → env वाली जाँचें ✅
- [ ] FAIL → लिखें → PASS → commit

### Task 5: render.yaml, uptime, DEPLOYMENT.md, e2e
- `render.yaml` (Global Constraints के हिसाब से)
- `.github/workflows/uptime.yml`: हर 30 मिनट पर `vars.SITE_URL` हो तो `/api/health`, वरना कुछ न करे
- `docs/DEPLOYMENT.md`: मालिक के लिए Render पर बटन-दर-बटन (हिंदी), env की सूची, deploy के बाद क्या देखना है, और launch-जाँच
- e2e-site: `/sitemap.xml` (200, `/gyan/digital-arrest` शामिल) · `/robots.txt` (sitemap का पता) · `/manifest.webmanifest` (name) · `/icon.svg` 200
- [ ] e2e सब ✓ → commit
