# Plan A1: नींव और इमरजेंसी पन्ने (TR-1 से TR-4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** एक चलता हुआ Next.js project, जिसमें CI, security headers, design system और भाषा का ढाँचा हो, और सबसे ज़रूरी चीज़: `/turant` के 10 इमरजेंसी पन्ने, जो बिना login, बिना JavaScript और offline भी काम करें।

**Architecture:** Next.js App Router, जिसमें पन्ने `app/` में और logic `modules/` में रहेगा। `/turant` का सारा content एक typed data file (`modules/scams/turant.ts`) से आएगा और build पर static बनेगा। offline के लिए एक छोटा service worker होगा, जो उसी data से अपनी URL-सूची बनाएगा। रंग-tokens TypeScript और CSS दोनों में रहेंगे, और एक test दोनों को आपस में मिलाकर रखेगा।

**Tech Stack:** Next.js 15.5.x · React 19.1.x · TypeScript 5.9 · Tailwind CSS 4 · Zod 3.25 · Vitest 3.2 · Playwright 1.63 · Node 22

**Spec:**
- `docs/superpowers/specs/2026-11-21-thagi-rakshak-design.md` (v2)
- `docs/superpowers/specs/2026-11-21-thagi-rakshak-structure-design.md` (भाग 2: खंड 1, 3, 4, 5, 6.2, 7, 11, 15)

## Global Constraints

- Node 22 (`.nvmrc` = `22`), `"engines": {"node": ">=20.9.0"}`।
- Versions इस तरह pin होंगे: `next` `15.5.29`, `react`/`react-dom` `19.1.10`, `zod` `3.25.76`, `typescript` `5.9.3`, `tailwindcss` और `@tailwindcss/postcss` `4.3.5`, `vitest` `3.2.7`, `eslint-config-next` `15.5.29`, `playwright` `1.63.0`। `package-lock.json` commit होगा।
- `app/` में सिर्फ़ पन्ने और route handlers। logic `modules/<नाम>/` में, और बाहर से import सिर्फ़ `modules/<नाम>/index.ts` से।
- `<html lang="hi">`। सारा user-facing text हिंदी में। English के लिए translate का ढाँचा तैयार रहेगा, पर English पन्ने इस plan में नहीं।
- font: `font-family: "Noto Sans Devanagari", "Nirmala UI", "Mangal", system-ui, sans-serif;`। कोई web font download नहीं।
- शरीर का text 18px, line-height 1.6। छूने वाली हर चीज़ कम से कम 48px ऊँची।
- रंग-token के light मान spec के भाग 2, खंड 3.1 से जस के तस: brand `#1D3A6B`, brand-bg `#EEF2F8`, danger `#B42318`, danger-bg `#FEF3F2`, warn `#B54708`, warn-bg `#FFFAEB`, safe `#067647`, safe-bg `#ECFDF3`, ink `#101828`, muted `#475467`, line `#E4E7EC`, paper `#FFFFFF`, surface `#F7F6F3`। इनके अलावा on-danger `#FFFFFF` और on-safe `#FFFFFF`।
- सभी text वाले रंग-जोड़े में contrast ≥ 4.5:1 (light और dark दोनों में)।
- मना किए शब्द (copy-lint): `100% सुरक्षित`, `100% safe`, `गारंटी`, `guarantee`, `पक्का पैसा वापस`, `ज़रूर मिलेगा`, `पैसा वापस दिलाएँगे`, `भारत सरकार`, `Government of India`।
- प्रतिज्ञा की लाइन (TrustBar), जस की तस: `हम कभी OTP, PIN, password नहीं माँगते, न screen-share करवाते हैं, न पहले call करते हैं।`
- Footer की लाइनें, जस की तस: `यह सरकारी वेबसाइट नहीं है। हम आपको सरकारी और बैंक के सही रास्तों तक पहुँचाने में मदद करते हैं।` और `यहाँ दी गई जानकारी कानूनी सलाह नहीं है।`
- `/turant` पर bottom navigation नहीं होगा। header में सिर्फ़ "← वापस" और "🔊 सुनें"।
- `/turant/*` का HTML दस्तावेज़ 60KB से छोटा हो, बिना JavaScript के पूरा content और `tel:1930` link दिखे, और 320px चौड़ाई पर बगल में scroll न हो।
- **spec से एक सुधार:** spec में लिखा "100KB से छोटा पन्ना" App Router के runtime JS के साथ मुमकिन नहीं। उसकी जगह यही शर्तें मानी जाएँगी: HTML 60KB से कम, और बिना JS के पूरा काम करे। design doc बाद में इसी हिसाब से सुधारा जाएगा।

## Review Focus

1. **सस्ते फ़ोन पर JavaScript बंद या धीमा हो:** `/turant/<slug>` पर सारे कदम, चेतावनी और `tel:1930` link फिर भी दिखें → Task 7 का e2e (JS बंद)।
2. **एक बार खोलने के बाद internet चला जाए:** `/turant/upi` दोबारा खुले, और "आप offline हैं" वाली पट्टी दिखे → Task 7 का e2e (offline)।
3. **ग़लत URL जैसे `/turant/abc`:** crash न हो, बल्कि हिंदी 404 पन्ना आए जिसमें `/turant` का link हो → Task 6 (`dynamicParams = false` + `app/not-found.tsx`) और Task 7 का e2e।
4. **320px की पतली स्क्रीन, लंबे हिंदी या अंग्रेज़ी शब्द (जैसे "cybercrime.gov.in"):** बगल में scroll न हो → Task 3 (`overflow-wrap: anywhere` body पर) और Task 7 का e2e (scrollWidth ≤ 320)।
5. **फ़ोन dark mode में हो:** हर text पढ़ने लायक रहे → Task 2 का contrast test (dark के सभी जोड़े)।

---

## File Structure

```
thagi-rakshak/
├── package.json  package-lock.json  .nvmrc  .gitignore  .env.example
├── tsconfig.json  next.config.ts  postcss.config.mjs  eslint.config.mjs  vitest.config.ts
├── .github/workflows/ci.yml                 jobs: checks, e2e
├── app/
│   ├── layout.tsx                           html lang=hi, footer, SwRegister
│   ├── globals.css                          tokens (light + dark), base styles
│   ├── page.tsx                             अस्थायी होम (TR-5 में बदलेगा)
│   ├── not-found.tsx                        हिंदी 404
│   ├── api/health/route.ts
│   ├── sw.js/route.ts                       service worker (static)
│   └── turant/
│       ├── layout.tsx                       सिर्फ़ "← वापस" + ListenButton + OfflineBanner
│       ├── page.tsx                         प्रकार चुनें + "पता नहीं" वाले कदम
│       └── [slug]/page.tsx                  generateStaticParams, dynamicParams=false
├── components/
│   ├── ui/big-door.tsx  step-card.tsx  action-link.tsx  notice.tsx  trust-bar.tsx  site-footer.tsx
│   ├── ui/listen-button.tsx                 'use client'
│   ├── offline/offline-banner.tsx           'use client'
│   ├── offline/sw-register.tsx              'use client'
│   └── turant/turant-steps.tsx              एक TurantPage को StepCards में दिखाना
├── modules/
│   ├── security/{index.ts, headers.ts, headers.test.ts}
│   ├── design/{index.ts, tokens.ts, contrast.ts, contrast.test.ts, tokens-sync.test.ts}
│   ├── i18n/{index.ts, locale.ts, translate.ts, en.ts, glossary.json, forbidden.ts, copy-lint.ts, copy-lint.test.ts, copy-lint-allow.json, repo-copy.test.ts}
│   ├── scams/{index.ts, turant.ts, turant.test.ts}
│   └── offline/{index.ts, service-worker.ts, service-worker.test.ts}
└── scripts/e2e-turant.mjs
```

---

### Task 1 (TR-1): Project की नींव, health, security headers और CI

**Files:**
- Create: `package.json`, `.nvmrc`, `.gitignore`, `.env.example`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`
- Create: `app/layout.tsx` (सादा), `app/globals.css` (सिर्फ़ `@import "tailwindcss";`), `app/page.tsx` (सादा "ठगी रक्षक")
- Create: `app/api/health/route.ts`, `app/api/health/route.test.ts`
- Create: `modules/security/headers.ts`, `modules/security/index.ts`, `modules/security/headers.test.ts`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `type HeaderKV = { key: string; value: string }` · `buildCsp(opts: { production: boolean }): string` · `buildSecurityHeaders(opts: { production: boolean }): HeaderKV[]` (`modules/security`) · `GET /api/health` → `200 {"status":"ok","service":"thagi-rakshak"}`

- [ ] **Step 1: config फ़ाइलें बनाएँ।** `tsconfig.json`, `eslint.config.mjs` और `postcss.config.mjs` marketplace repo जैसे ही रखें (paths `@/*` → `./*`, strict true)। `vitest.config.ts` में alias `@`, `environment: "node"`, `include: ["**/*.test.ts", "**/*.test.tsx"]`, `exclude: ["node_modules/**", ".next/**"]` और `esbuild: { jsx: "automatic" }`। scripts: `dev`, `build`, `start`, `lint` (`eslint .`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`)। `.gitignore` में `.env*` (`.env.example` छोड़कर), `.next/`, `node_modules/`।

- [ ] **Step 2: failing tests लिखें**

`modules/security/headers.test.ts`:
```ts
test("CSP बाहर की script, frame और plugin रोकता है", () => {
  const csp = buildCsp({ production: true });
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("worker-src 'self'");
  expect(csp).not.toContain("unsafe-eval");
});
test("development में hot-reload के लिए eval की छूट", () => {
  expect(buildCsp({ production: false })).toContain("'unsafe-eval'");
});
test("HSTS सिर्फ़ production में", () => {
  const has = (p: boolean) => buildSecurityHeaders({ production: p }).some(h => h.key === "Strict-Transport-Security");
  expect(has(true)).toBe(true);
  expect(has(false)).toBe(false);
});
test("camera, microphone, location, payment बंद", () => {
  const pp = buildSecurityHeaders({ production: true }).find(h => h.key === "Permissions-Policy")!.value;
  for (const f of ["camera=()", "microphone=()", "geolocation=()", "payment=()"]) expect(pp).toContain(f);
});
```
`app/api/health/route.test.ts`:
```ts
test("health ok देता है", async () => {
  const res = await GET();
  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ status: "ok", service: "thagi-rakshak" });
});
```

- [ ] **Step 3: tests चलाएँ और fail होते देखें।** `npm test`। Expected: FAIL (module नहीं मिला)।

- [ ] **Step 4: code लिखें।** `modules/security/headers.ts` में `buildCsp` और `buildSecurityHeaders` बनाएँ। ढाँचा marketplace के `lib/security/headers.ts` जैसा हो, पर Supabase के बिना, `worker-src 'self'` जोड़कर, और `microphone=()`। headers की सूची: CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-site`, `X-Permitted-Cross-Domain-Policies: none`, और production में `Strict-Transport-Security: max-age=31536000; includeSubDomains`। `next.config.ts` में `reactStrictMode: true`, `poweredByHeader: false`, और हर path पर ये headers। `app/api/health/route.ts` में `GET()` बनाएँ, जो `Response.json({ status: "ok", service: "thagi-rakshak", time: new Date().toISOString() })` लौटाए, और `export const dynamic = "force-dynamic"` रखें।

- [ ] **Step 5: CI बनाएँ।** `.github/workflows/ci.yml`: trigger `push` (main) + `pull_request` + `workflow_dispatch` · `permissions: contents: read` · concurrency `ci-${{ github.ref }}` के साथ cancel-in-progress। job `checks` (ubuntu-latest, node 22) के कदम: `npm ci` → `npm run lint` → `npm test` → `npm audit --omit=dev --audit-level=critical` → `npm run build` → `npm run typecheck` → smoke test (marketplace जैसा: `npm start` पीछे चलाकर 30 बार `curl -fsS http://localhost:3000/api/health`)।

- [ ] **Step 6: स्थानीय जाँच।** इसे चलाएँ: `npm install && npm test && npm run lint && npm run typecheck && npm run build`। Expected: सब PASS। फिर `npm start` चलाकर `curl -s localhost:3000/api/health` करें, जवाब में `"status":"ok"` आना चाहिए। साथ में `curl -sI localhost:3000/` में `content-security-policy` header दिखना चाहिए।

- [ ] **Step 7: Commit**
```bash
git add -A && git commit -m "TR-1: नींव — Next.js, health, security headers, CI"
```

---

### Task 2 (TR-2): रंग-tokens और contrast की जाँच

**Files:**
- Create: `modules/design/tokens.ts`, `modules/design/contrast.ts`, `modules/design/index.ts`
- Create: `modules/design/contrast.test.ts`, `modules/design/tokens-sync.test.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `type TokenName = "brand" | "brand-bg" | "danger" | "danger-bg" | "on-danger" | "warn" | "warn-bg" | "safe" | "safe-bg" | "on-safe" | "ink" | "muted" | "line" | "paper" | "surface"` · `TOKENS: Record<"light" | "dark", Record<TokenName, string>>` (हर मान `#RRGGBB`) · `CONTRAST_PAIRS: ReadonlyArray<{ fg: TokenName; bg: TokenName; min: number }>` · `contrastRatio(fg: string, bg: string): number`
- CSS में हर token `--<TokenName>` के नाम से। Tailwind classes `bg-danger`, `text-ink` वगैरह `@theme inline` से।

- [ ] **Step 1: failing tests लिखें**

`contrast.test.ts`:
```ts
test("काला-सफ़ेद = 21", () => expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1));
test("#777777 सफ़ेद पर ≈ 4.48", () => expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.48, 2));
test("क्रम से फ़र्क नहीं", () => expect(contrastRatio("#FFFFFF", "#B42318")).toBeCloseTo(contrastRatio("#B42318", "#FFFFFF"), 5));
test.each(["light", "dark"] as const)("%s: हर जोड़ा अपनी न्यूनतम सीमा पार करे", (mode) => {
  for (const p of CONTRAST_PAIRS) {
    expect.soft(contrastRatio(TOKENS[mode][p.fg], TOKENS[mode][p.bg]), `${mode} ${p.fg}/${p.bg}`).toBeGreaterThanOrEqual(p.min);
  }
});
test("light मान spec से जस के तस", () => {
  expect(TOKENS.light).toMatchObject({ brand: "#1D3A6B", danger: "#B42318", warn: "#B54708", safe: "#067647", ink: "#101828", muted: "#475467", surface: "#F7F6F3", paper: "#FFFFFF" });
});
```
`CONTRAST_PAIRS` में ये जोड़े होंगे, सब `min: 4.5`: ink/paper, ink/surface, muted/paper, muted/surface, brand/paper, brand/brand-bg, danger/paper, danger/danger-bg, on-danger/danger, warn/warn-bg, safe/safe-bg, on-safe/safe।

`tokens-sync.test.ts`: `app/globals.css` पढ़ें। पहले `:root { … }` block के `--name: #hex;` light मान हों, और `@media (prefers-color-scheme: dark) { :root { … } }` के अंदर dark मान। हर `TokenName` के दोनों मान `TOKENS` से बराबर होने चाहिए (hex की तुलना बिना case के)।

- [ ] **Step 2: चलाएँ, fail होते देखें।** `npx vitest run modules/design`। Expected: FAIL।

- [ ] **Step 3: code लिखें।** `contrastRatio` WCAG 2.x का relative luminance formula होगा (sRGB channel ≤ 0.03928 हो तो /12.92, वरना ((c+0.055)/1.055)^2.4)। `TOKENS.light` में Global Constraints वाले मान। dark के लिए शुरुआती मान ये हैं: surface `#12151B`, paper `#1A1F27`, ink `#F2F4F7`, muted `#A6B0BF`, line `#2E3542`, brand `#9DB8EC`, brand-bg `#1C2840`, danger `#F97066`, danger-bg `#3A1714`, on-danger `#1A0B09`, warn `#FDB022`, warn-bg `#3A2A0C`, safe `#47CD89`, safe-bg `#0F2E1F`, on-safe `#06210F`। कोई dark जोड़ा fail हो, तो **सिर्फ़ उसका dark मान** बदलें, light मान कभी नहीं।

- [ ] **Step 4: `app/globals.css` लिखें।** `@import "tailwindcss";` → `:root` में light tokens → `@media (prefers-color-scheme: dark) { :root { …dark… } }` → `@theme inline { --color-<name>: var(--<name>); … }` → `html { font-size: 18px; }` → body: `background: var(--surface); color: var(--ink); line-height: 1.6; font-family: (Global Constraints वाली stack); overflow-wrap: anywhere;` → `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }` → `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`।

- [ ] **Step 5: चलाएँ, pass होते देखें।** `npx vitest run modules/design`। Expected: PASS।

- [ ] **Step 6: Commit**
```bash
git add -A && git commit -m "TR-2: रंग-tokens (light+dark) और contrast की जाँच"
```

---

### Task 3 (TR-2): मूल components और footer

**Files:**
- Create: `components/ui/big-door.tsx`, `step-card.tsx`, `action-link.tsx`, `notice.tsx`, `trust-bar.tsx`, `site-footer.tsx`, `listen-button.tsx`
- Create: `components/offline/offline-banner.tsx`, `components/offline/sw-register.tsx`
- Create: `components/ui/ui.test.tsx`
- Modify: `app/layout.tsx` (footer + SwRegister + metadata)

**Interfaces:**
- Consumes: Task 5 का `TurantAction` type (`ActionLink` के लिए)। अगर Task 5 अभी नहीं बना, तो उसी Interfaces block वाला type इसी task में बनाकर `modules/scams/turant.ts` में रखें।
- Produces:
  - `BigDoor(props: { href: string; title: string; subtitle: string; tone: "danger" | "safe"; icon?: ReactNode })`: एक `<a>`, जिसकी ऊँचाई कम से कम 88px
  - `StepCard(props: { n: number; title: string; urgency?: string; status?: "todo" | "done"; children: ReactNode })`: `<li data-status>` (default `"todo"`)
  - `ActionLink(props: { action: TurantAction; primary?: boolean })`: tel हो तो `href="tel:<number>"`, बाहर का link हो तो `target="_blank" rel="noopener noreferrer"`, और ऊँचाई कम से कम 48px
  - `Notice(props: { tone: "danger" | "warn" | "info"; children: ReactNode })`: `role="note"`, साथ में icon और शब्द (सिर्फ़ रंग से मतलब नहीं)
  - `TrustBar()`: प्रतिज्ञा की लाइन, जस की तस
  - `SiteFooter()`: TrustBar + footer की दोनों लाइनें
  - `ListenButton(props: { targetId: string })`: client component, mount होने से पहले और `speechSynthesis` न हो तो कुछ नहीं दिखाता, आवाज़ `lang="hi-IN"`
  - `OfflineBanner()`: client component, `navigator.onLine === false` होने पर `role="status"` में `आप offline हैं। यह पन्ना फिर भी काम करेगा।`
  - `SwRegister()`: client component, सिर्फ़ production में `navigator.serviceWorker.register("/sw.js")`

- [ ] **Step 1: failing tests लिखें** (`components/ui/ui.test.tsx`, `renderToStaticMarkup` से)
```tsx
test("BigDoor link, शीर्षक और उप-शीर्षक", () => {
  const html = renderToStaticMarkup(<BigDoor href="/turant" title="मेरे साथ ठगी हो गई" subtitle="अभी मदद पाएँ" tone="danger" />);
  expect(html).toContain('href="/turant"');
  expect(html).toContain("मेरे साथ ठगी हो गई");
  expect(html).toContain("अभी मदद पाएँ");
});
test("ActionLink tel", () => {
  expect(renderToStaticMarkup(<ActionLink action={{ kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" }} />)).toContain('href="tel:1930"');
});
test("ActionLink बाहरी link नए tab में, सुरक्षित rel", () => {
  const html = renderToStaticMarkup(<ActionLink action={{ kind: "link", href: "https://cybercrime.gov.in", labelHi: "x", external: true }} />);
  expect(html).toContain('target="_blank"');
  expect(html).toContain('rel="noopener noreferrer"');
});
test("StepCard नंबर, शीर्षक, urgency, status", () => {
  const html = renderToStaticMarkup(<StepCard n={1} title="1930 पर call करें" urgency="पहले 30 मिनट सबसे कीमती"><p>x</p></StepCard>);
  expect(html).toMatch(/data-status="todo"/);
  expect(html).toContain("पहले 30 मिनट सबसे कीमती");
});
test("SiteFooter में प्रतिज्ञा और 'सरकारी वेबसाइट नहीं'", () => {
  const html = renderToStaticMarkup(<SiteFooter />);
  expect(html).toContain("हम कभी OTP, PIN, password नहीं माँगते, न screen-share करवाते हैं, न पहले call करते हैं।");
  expect(html).toContain("यह सरकारी वेबसाइट नहीं है।");
  expect(html).toContain("यहाँ दी गई जानकारी कानूनी सलाह नहीं है।");
});
test("ListenButton server पर कुछ नहीं दिखाता (बिना JS के बेकार बटन नहीं)", () => {
  expect(renderToStaticMarkup(<ListenButton targetId="x" />)).toBe("");
});
```

- [ ] **Step 2: चलाएँ, fail होते देखें।** `npx vitest run components`। Expected: FAIL।

- [ ] **Step 3: components लिखें** (ऊपर वाले Interfaces के हिसाब से)। Tailwind classes सिर्फ़ tokens वाले रंगों से बनें (`bg-danger text-on-danger`, `bg-paper border-line` वगैरह)। icons inline SVG हों, emoji नहीं। `aria-hidden="true"` icons पर, और मतलब हमेशा text से।

- [ ] **Step 4: `app/layout.tsx` में ये जोड़ें:** `<html lang="hi">`, `metadata` (title `ठगी रक्षक`, description `डिजिटल ठगी के बाद क्या करें: पहले 60 मिनट से पैसा वापस पाने तक हर कदम पर मदद। मुफ़्त।`), `viewport` (`themeColor: "#1D3A6B"`), `<SiteFooter />` और `<SwRegister />`।

- [ ] **Step 5: चलाएँ, pass होते देखें।** `npm test && npm run lint && npm run typecheck`। Expected: PASS।

- [ ] **Step 6: Commit**
```bash
git add -A && git commit -m "TR-2: मूल components, footer और प्रतिज्ञा"
```

---

### Task 4 (TR-3): भाषा का ढाँचा, शब्दकोश और copy-lint

**Files:**
- Create: `modules/i18n/locale.ts`, `translate.ts`, `en.ts`, `glossary.json`, `forbidden.ts`, `copy-lint.ts`, `copy-lint-allow.json`, `index.ts`
- Create: `modules/i18n/copy-lint.test.ts`, `modules/i18n/repo-copy.test.ts`, `modules/i18n/translate.test.ts`

**Interfaces:**
- Produces:
  - `type Locale = "hi" | "en"` · `parseLocale(v: string | null | undefined): Locale` (default `"hi"`)
  - `translate(locale: Locale, text: string, vars?: Record<string, string | number>): string`: हिंदी वाक्य ही key है, और अनुवाद न मिले तो हिंदी लौटेगी (marketplace जैसा)
  - `GLOSSARY: ReadonlyArray<{ term: string; hi: string }>`
  - `FORBIDDEN_PHRASES: readonly string[]` (Global Constraints की सूची)
  - `findForbidden(text: string, phrases: readonly string[]): { phrase: string; index: number }[]`: बिना case के, और NFC normalize करके

- [ ] **Step 1: failing tests लिखें**
```ts
// copy-lint.test.ts
test("मना किया शब्द पकड़ा जाता है", () => {
  expect(findForbidden("हम 100% सुरक्षित रखते हैं", FORBIDDEN_PHRASES)).toEqual([{ phrase: "100% सुरक्षित", index: 3 }]);
});
test("अंग्रेज़ी में case से फ़र्क नहीं", () => {
  expect(findForbidden("Money GUARANTEE", FORBIDDEN_PHRASES).map(f => f.phrase)).toEqual(["guarantee"]);
});
test("साफ़ text पर कुछ नहीं", () => expect(findForbidden("1930 पर call करें", FORBIDDEN_PHRASES)).toEqual([]));
// translate.test.ts
test("अनुवाद न हो तो हिंदी", () => expect(translate("en", "नया वाक्य")).toBe("नया वाक्य"));
test("vars भरते हैं", () => expect(translate("hi", "{n} दिन बाकी", { n: 4 })).toBe("4 दिन बाकी"));
test("glossary में UTR का तय शब्द", () => {
  expect(GLOSSARY.find(g => g.term === "UTR")?.hi).toBe("लेन-देन नंबर (UTR)");
});
```
`repo-copy.test.ts`: `app/`, `components/` और `modules/` की हर `.ts`, `.tsx`, `.json`, `.mdx` फ़ाइल पढ़े। `*.test.*`, `modules/i18n/forbidden.ts` और `modules/i18n/copy-lint-allow.json` को छोड़ दे। फिर हर फ़ाइल पर `findForbidden` चलाए। जो match `copy-lint-allow.json` में `{ file, phrase }` के रूप में दर्ज न हो, उस पर test fail हो, और message में फ़ाइल और शब्द लिखे हों।

- [ ] **Step 2: चलाएँ, fail होते देखें।** `npx vitest run modules/i18n`। Expected: FAIL।

- [ ] **Step 3: code लिखें।** `glossary.json` में spec के भाग 2, खंड 4.2 की सारी 10 लाइनें, उसी क्रम में `{ term, hi }` के रूप में (जैसे `{ "term": "UTR", "hi": "लेन-देन नंबर (UTR)" }`)। `en.ts` में अभी `export const EN: Record<string, string> = {}`। `copy-lint-allow.json` में `[]`।

- [ ] **Step 4: चलाएँ, pass होते देखें।** `npm test`। Expected: PASS। repo-copy test भी पास हो, क्योंकि अभी तक कोई मना किया शब्द नहीं लिखा गया।

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "TR-3: भाषा ढाँचा, शब्दकोश और copy-lint"
```

---

### Task 5 (TR-4): /turant का content (typed data)

**Files:**
- Create: `modules/scams/turant.ts`, `modules/scams/index.ts`, `modules/scams/turant.test.ts`

**Interfaces:**
- Produces:
```ts
export const TURANT_CONTENT_VERSION: string;            // "2026-11-21.1" — copy बदले तो बढ़ाएँ
export const TURANT_SLUGS: readonly ["upi","card","netbanking","wallet","digital-arrest","sextortion","loan-app","investment-task","customer-care-fake","pata-nahi"];
export type TurantSlug = (typeof TURANT_SLUGS)[number];
export type TurantAction =
  | { kind: "tel"; number: string; labelHi: string }
  | { kind: "link"; href: string; labelHi: string; external: boolean };
export type TurantStep = { id: StepId; titleHi: string; urgencyHi?: string; bodyHi: string; warningHi?: string; actions: TurantAction[] };
export type TurantPage = { slug: TurantSlug; titleHi: string; banner?: { tone: "danger" | "warn"; textHi: string }; steps: TurantStep[]; showTeleManas: boolean; uploadAllowed: false };
export function getTurantPage(slug: TurantSlug): TurantPage;
export function isTurantSlug(v: string): v is TurantSlug;
export const TELE_MANAS: TurantAction;                  // { kind:"tel", number:"14416", labelHi:"Tele-MANAS: 14416 (मुफ़्त)" }
```
`StepId` = `"call_1930" | "tell_bank" | "block_card" | "written_complaint" | "keep_evidence" | "remove_app" | "stop_paying" | "dont_pay_threat" | "warn_contacts" | "report_women_child"`

**कदमों का text (जस का तस; इसे spec ने तय किया है, इसलिए यहाँ पूरा लिखा है):**

| id | titleHi | urgencyHi | bodyHi | warningHi | actions |
|---|---|---|---|---|---|
| call_1930 | 1930 पर call करें | पहले 30 मिनट सबसे कीमती | लाइन न लगे तो रुकें नहीं, नीचे वाले link से online शिकायत करें। | — | tel 1930 "1930 मिलाएँ" · link https://cybercrime.gov.in "cybercrime.gov.in पर शिकायत" (external) |
| tell_bank | बैंक को आज ही बताएँ | — | बैंक के ऐप में "Report fraud" या "Block" वाला विकल्प खोलें, या बैंक की अपनी वेबसाइट पर दिया नंबर लगाएँ। | नंबर Google पर न खोजें। नकली "customer care" नंबर ठगी का बड़ा जाल हैं। | — |
| block_card | Card तुरंत block करें | — | बैंक के ऐप में card को block करें, फिर बैंक को बताएँ। | नंबर Google पर न खोजें। नकली "customer care" नंबर ठगी का बड़ा जाल हैं। | — |
| written_complaint | बैंक को लिखित शिकायत भेजें (मुफ़्त) | — | बैंक को email में लिखें: क्या हुआ, कब हुआ, कितने पैसे गए, और लेन-देन नंबर (UTR)। जवाब में मिली पावती सँभालकर रखें। | — | — |
| keep_evidence | ये सँभालकर रखें | — | लेन-देन नंबर (UTR) · ठग का नंबर या UPI ID · SMS, chat और call के screenshot · पैसे कटने का SMS | — | — |
| remove_app | डलवाया गया ऐप हटाएँ | — | AnyDesk, TeamViewer या जो भी ऐप उन्होंने डलवाया, उसे हटाएँ। फ़ोन का internet कुछ देर बंद रखें। फिर UPI PIN और banking password बदलें। | — | — |
| stop_paying | और पैसे न भेजें | — | "withdraw fee", "tax" या "account unlock" के नाम पर माँगे गए पैसे भी ठगी हैं। | — | — |
| dont_pay_threat | पैसे न भेजें, धमकी से न डरें | — | धमकी देने वालों को पैसे देने से माँगें और बढ़ती हैं। बातचीत के screenshot सँभालकर रखें। | — | — |
| warn_contacts | अपने लोगों को पहले से बता दें | — | परिवार और दोस्तों को बता दें कि आपके नाम से आए अजीब संदेश या तस्वीरें नकली हो सकती हैं। | — | — |
| report_women_child | cybercrime.gov.in पर शिकायत करें | — | वहाँ "महिला/बच्चों से जुड़े अपराध" वाला हिस्सा चुनें। कोई भी तस्वीर किसी को न भेजें, हमें भी नहीं। | — | link https://cybercrime.gov.in "cybercrime.gov.in खोलें" (external) · tel 1930 "1930 मिलाएँ" |

**पन्ने (slug → titleHi · banner · steps का क्रम · showTeleManas):**

| slug | titleHi | banner | steps | Tele-MANAS |
|---|---|---|---|---|
| upi | UPI से पैसे गए | — | call_1930, tell_bank, written_complaint, keep_evidence | ✗ |
| card | Card से पैसे कटे | — | block_card, call_1930, written_complaint, keep_evidence | ✗ |
| netbanking | Net banking से पैसे गए | — | call_1930, tell_bank, written_complaint, keep_evidence | ✗ |
| wallet | Wallet ऐप से पैसे गए | — | call_1930, tell_bank, written_complaint, keep_evidence | ✗ |
| digital-arrest | Digital arrest (पुलिस या CBI का डर) | danger: "कोई पुलिस, CBI या कोर्ट video call पर गिरफ़्तार नहीं करती। call काटिए। पैसे न भेजें।" | call_1930, tell_bank, written_complaint, keep_evidence | ✗ |
| sextortion | Video call से ब्लैकमेल | warn: "पैसे न दें। आप अकेले नहीं हैं, और यह आपकी गलती नहीं है।" | dont_pay_threat, report_women_child, warn_contacts | ✓ |
| loan-app | Loan ऐप से धमकी | — | dont_pay_threat, warn_contacts, call_1930, keep_evidence | ✗ |
| investment-task | निवेश या task वाली कमाई में पैसे गए | — | stop_paying, call_1930, tell_bank, written_complaint, keep_evidence | ✗ |
| customer-care-fake | नकली customer care या ऐप डलवाया | — | remove_app, call_1930, tell_bank, written_complaint, keep_evidence | ✗ |
| pata-nahi | पता नहीं, बस पैसे कट गए | — | call_1930, tell_bank, written_complaint, keep_evidence | ✗ |

- [ ] **Step 1: failing tests लिखें**
```ts
test("10 slug, सब अलग", () => { expect(TURANT_SLUGS).toHaveLength(10); expect(new Set(TURANT_SLUGS).size).toBe(10); });
test.each(TURANT_SLUGS)("%s: शीर्षक और कम से कम 3 कदम", (s) => {
  const p = getTurantPage(s);
  expect(p.titleHi.length).toBeGreaterThan(3);
  expect(p.steps.length).toBeGreaterThanOrEqual(3);
  expect(p.uploadAllowed).toBe(false);
});
test.each(TURANT_SLUGS)("%s: 1930 कहीं न कहीं है", (s) => {
  const acts = getTurantPage(s).steps.flatMap(st => st.actions);
  expect(acts.some(a => a.kind === "tel" && a.number === "1930")).toBe(true);
});
test("digital-arrest पर danger banner", () => expect(getTurantPage("digital-arrest").banner).toEqual({ tone: "danger", textHi: "कोई पुलिस, CBI या कोर्ट video call पर गिरफ़्तार नहीं करती। call काटिए। पैसे न भेजें।" }));
test("sextortion: Tele-MANAS हाँ, upload नहीं, पहला कदम पैसे न देना", () => {
  const p = getTurantPage("sextortion");
  expect(p.showTeleManas).toBe(true);
  expect(p.steps[0].id).toBe("dont_pay_threat");
  expect(TELE_MANAS).toEqual({ kind: "tel", number: "14416", labelHi: "Tele-MANAS: 14416 (मुफ़्त)" });
});
test("card पर पहला कदम card block", () => expect(getTurantPage("card").steps[0].id).toBe("block_card"));
test("हर बाहरी link https और सिर्फ़ जाने-माने सरकारी domain", () => {
  const links = TURANT_SLUGS.flatMap(s => getTurantPage(s).steps.flatMap(st => st.actions)).filter(a => a.kind === "link");
  for (const l of links) expect(l.href).toBe("https://cybercrime.gov.in");
});
test("isTurantSlug", () => { expect(isTurantSlug("upi")).toBe(true); expect(isTurantSlug("abc")).toBe(false); });
test("content version का रूप", () => expect(TURANT_CONTENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}\.\d+$/));
```

- [ ] **Step 2: चलाएँ, fail होते देखें।** `npx vitest run modules/scams`। Expected: FAIL।

- [ ] **Step 3: code लिखें।** कदमों का एक `Record<StepId, TurantStep>` बनाएँ, और पन्नों का एक `Record<TurantSlug, …>`, जो steps को id से जोड़े (ऊपर की तालिकाओं से जस का तस)। `getTurantPage` हर बार नया object लौटाए, ताकि कोई ग़लती से साझा data न बदल दे।

- [ ] **Step 4: चलाएँ, pass होते देखें।** `npm test` (इसमें copy-lint भी चलेगा)। Expected: PASS।

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "TR-4: /turant का content — 10 प्रकार, कदम, चेतावनियाँ"
```

---

### Task 6 (TR-4): /turant के पन्ने, अस्थायी होम और 404

**Files:**
- Create: `components/turant/turant-steps.tsx`
- Create: `app/turant/layout.tsx`, `app/turant/page.tsx`, `app/turant/[slug]/page.tsx`
- Create: `app/not-found.tsx`
- Modify: `app/page.tsx` (अस्थायी होम)
- Create: `components/turant/turant-steps.test.tsx`

**Interfaces:**
- Consumes: `getTurantPage`, `TURANT_SLUGS`, `isTurantSlug`, `TELE_MANAS` (Task 5) · `StepCard`, `ActionLink`, `Notice`, `BigDoor`, `TrustBar`, `ListenButton`, `OfflineBanner` (Task 3)
- Produces: `TurantSteps(props: { page: TurantPage })`: एक `<ol id="turant-steps">`, जिसमें banner (अगर हो), StepCards, और showTeleManas होने पर Tele-MANAS वाला Notice

- [ ] **Step 1: failing test लिखें** (`turant-steps.test.tsx`)
```tsx
test("upi: क्रम से 4 कदम, tel:1930, Google वाली चेतावनी", () => {
  const html = renderToStaticMarkup(<TurantSteps page={getTurantPage("upi")} />);
  expect(html).toContain('id="turant-steps"');
  expect(html.indexOf("1930 पर call करें")).toBeLessThan(html.indexOf("बैंक को आज ही बताएँ"));
  expect(html).toContain('href="tel:1930"');
  expect(html).toContain("नंबर Google पर न खोजें।");
});
test("sextortion: Tele-MANAS और कोई file input नहीं", () => {
  const html = renderToStaticMarkup(<TurantSteps page={getTurantPage("sextortion")} />);
  expect(html).toContain('href="tel:14416"');
  expect(html).not.toContain('type="file"');
});
```

- [ ] **Step 2: चलाएँ, fail होते देखें।** `npx vitest run components/turant`। Expected: FAIL।

- [ ] **Step 3: पन्ने बनाएँ।**
  - `app/turant/layout.tsx`: ऊपर पट्टी में बाईं ओर `<a href="/">← वापस</a>` और दाईं ओर `<ListenButton targetId="turant-steps" />`, उसके नीचे `<OfflineBanner />`, फिर children। कोई bottom nav नहीं।
  - `app/turant/page.tsx`: शीर्षक `घबराइए नहीं। क्या हुआ?`, उसके नीचे 9 प्रकारों के links (`pata-nahi` को छोड़कर, बड़े tiles, हर एक कम से कम 48px), फिर उप-शीर्षक `पता नहीं? ये काम अभी करें`, और उसके नीचे `<TurantSteps page={getTurantPage("pata-nahi")} />`।
  - `app/turant/[slug]/page.tsx`: `generateStaticParams` → सारे `TURANT_SLUGS` · `export const dynamicParams = false` · `params` को `Promise<{ slug: string }>` की तरह await करें (Next 15) · `isTurantSlug` false हो तो `notFound()` · metadata title `<titleHi> — ठगी रक्षक` · शीर्षक `ये काम अभी करें`, उसके नीचे उप-शीर्षक `<titleHi> · जितनी जल्दी, पैसा रुकने का उतना ज़्यादा मौका`, फिर `<TurantSteps>`, और सबसे नीचे `<a href="/turant">दूसरा प्रकार चुनें</a>`।
  - `app/not-found.tsx`: `यह पन्ना नहीं मिला।` + `ठगी हो गई है? इमरजेंसी मदद यहाँ है:` + `/turant` का BigDoor (danger) + होम का link।
  - `app/page.tsx` (अस्थायी, TR-5 में बदलेगा): BigDoor (danger) `/turant`, शीर्षक `मेरे साथ ठगी हो गई`, उप-शीर्षक `अभी मदद पाएँ · मुफ़्त · बिना login`, और उसके नीचे `<TrustBar />`।

- [ ] **Step 4: चलाएँ, pass होते देखें।** `npm test && npm run build`। Expected: PASS, और build log में `/turant/[slug]` के 10 पन्ने static (●) दिखें।

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "TR-4: /turant पन्ने (static), अस्थायी होम, हिंदी 404"
```

---

### Task 7 (TR-4): Offline (service worker) और e2e जाँच

**Files:**
- Create: `modules/offline/service-worker.ts`, `modules/offline/index.ts`, `modules/offline/service-worker.test.ts`
- Create: `app/sw.js/route.ts`
- Create: `scripts/e2e-turant.mjs`
- Modify: `.github/workflows/ci.yml` (नया job `e2e`)

**Interfaces:**
- Consumes: `TURANT_SLUGS`, `TURANT_CONTENT_VERSION` (Task 5) · `SwRegister`, `OfflineBanner` (Task 3)
- Produces: `OFFLINE_URLS: readonly string[]` (`"/turant"` + हर `"/turant/<slug>"`) · `buildServiceWorker(opts: { version: string; urls: readonly string[] }): string` · `GET /sw.js` → `application/javascript; charset=utf-8`, `Cache-Control: no-cache`

- [ ] **Step 1: failing test लिखें** (`service-worker.test.ts`)
```ts
test("OFFLINE_URLS: /turant और 10 पन्ने", () => {
  expect(OFFLINE_URLS).toContain("/turant");
  expect(OFFLINE_URLS).toContain("/turant/digital-arrest");
  expect(OFFLINE_URLS).toHaveLength(11);
});
test("worker में version और हर URL", () => {
  const js = buildServiceWorker({ version: "turant-2026-11-21.1", urls: OFFLINE_URLS });
  expect(js).toContain('"turant-2026-11-21.1"');
  for (const u of OFFLINE_URLS) expect(js).toContain(JSON.stringify(u));
});
test("worker JS के रूप में parse होता है", () => {
  expect(() => new Function(buildServiceWorker({ version: "v", urls: ["/turant"] }))).not.toThrow();
});
```

- [ ] **Step 2: चलाएँ, fail होते देखें।** `npx vitest run modules/offline`। Expected: FAIL।

- [ ] **Step 3: `buildServiceWorker` लिखें।** यह एक string लौटाए, जिसमें worker का पूरा code हो:
  - `install`: `caches.open(VERSION).addAll(URLS)`, फिर `self.skipWaiting()`।
  - `activate`: VERSION के अलावा बाकी caches मिटाना, फिर `clients.claim()`।
  - `fetch` (सिर्फ़ same-origin GET):
    - navigation request हो और path `/turant` से शुरू हो → पहले network, जवाब cache में रखना। network fail हो तो cache से।
    - path `/_next/static/` से शुरू हो → पहले cache, न मिले तो network से लाकर cache में रखना।
    - बाकी सब → बिना छुए network।
  - URL और version `JSON.stringify` से डाले जाएँ।
- `app/sw.js/route.ts`: `export const dynamic = "force-static"` रखें, और `GET` `buildServiceWorker({ version: \`turant-${TURANT_CONTENT_VERSION}\`, urls: OFFLINE_URLS })` लौटाए, ऊपर लिखे headers के साथ।

- [ ] **Step 4: चलाएँ, pass होते देखें।** `npm test`। Expected: PASS।

- [ ] **Step 5: e2e script लिखें** (`scripts/e2e-turant.mjs`)। Playwright chromium, `BASE_URL` (default `http://localhost:3000`)। हर जाँच `✓ <नाम>` छापे, और पहली गड़बड़ी पर `✗ <नाम>: <कारण>` छापकर `process.exit(1)`। जाँचें:
  1. `/turant/upi`: "1930 पर call करें" दिखे, `a[href="tel:1930"]` हो, और HTML दस्तावेज़ का body 60,000 bytes से छोटा हो।
  2. **JS बंद** (`javaScriptEnabled: false`): `/turant/digital-arrest` पर banner का text और `tel:1930` दिखे।
  3. `/turant/sextortion`: `tel:14416` हो, और `input[type=file]` की गिनती 0 हो।
  4. `/turant/abc`: status 404, "यह पन्ना नहीं मिला।" दिखे, और `a[href="/turant"]` हो।
  5. viewport 320×640 पर `/turant` और `/turant/customer-care-fake` में `document.documentElement.scrollWidth <= 320`।
  6. **offline:** `/turant/upi` खोलें → `navigator.serviceWorker.ready` का इंतज़ार → एक बार reload (online) → `context.setOffline(true)` → reload → "1930 पर call करें" दिखे, और "आप offline हैं।" वाली पट्टी दिखे।
  7. headers: `/` के जवाब में `content-security-policy` और `x-frame-options: DENY`।
  8. **dark mode** (`colorScheme: "dark"`): `/turant/upi` पर body का background-color `rgb(18, 21, 27)` हो (dark surface)।

- [ ] **Step 6: स्थानीय जाँच।** `npm run build && (npm start &) && sleep 5 && node scripts/e2e-turant.mjs`। Expected: 8 `✓`, exit 0।

- [ ] **Step 7: CI में e2e job जोड़ें।** job `e2e` (`needs: checks`, ubuntu-latest, node 22) के कदम: `npm ci` → `npx playwright install --with-deps chromium` → `npm run build` → `npm start` पीछे चलाना → health का इंतज़ार (30×2s) → `node scripts/e2e-turant.mjs` → fail हो तो `next.log` छापना।

- [ ] **Step 8: Commit**
```bash
git add -A && git commit -m "TR-4: offline service worker और /turant की e2e जाँच"
```

---

## आख़िरी कदम (plan पूरा होने पर)
- [ ] GitHub पर push → CI के दोनों jobs (`checks`, `e2e`) के log पढ़ें → हरे हों, तो `PROGRESS.md` में TR-1 से TR-4 पर ✅ और run id लिखें।
- [ ] design doc के भाग 2 (खंड 6.2 और 9.7) में "100KB" वाली लाइन बदलें: "HTML 60KB से कम + बिना JS के पूरा काम" (Global Constraints का सुधार)।
- [ ] अगली plan (A2: TR-5 से TR-8) लिखें।
