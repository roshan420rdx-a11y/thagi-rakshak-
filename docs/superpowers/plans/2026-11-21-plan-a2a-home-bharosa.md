# Plan A2a: होम, navigation, /pucho (आम निशान) और /bharosa (TR-5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** वेबसाइट का असली होम (दो बड़े दरवाज़े), header और फ़ोन वाला नीचे का menu, ठगी पहचानने के 7 आम निशान वाला `/pucho` (checker आने तक), और `/bharosa` (हम पर भरोसा क्यों करें)।

**Architecture:** `/turant` को अलग रखने के लिए app को दो route groups में बाँटा जाएगा: `(site)` में header और नीचे का menu होगा, जबकि `/turant` का अपना सादा layout पहले जैसा रहेगा। menu की चीज़ें (कौन-सा tab अभी चालू है) और site की settings (WhatsApp नंबर) `modules/site` के typed data से आएँगी। जो सुविधा अभी बनी नहीं, उसका tab या बटन नहीं दिखेगा, ताकि कोई बटन बेकार न दिखे।

**Tech Stack:** plan A1 वाला ही (Next.js 15.5, React 19.1, Tailwind 4, Zod 3.25, Vitest, Playwright)

**Spec:** `DISHA.md` · `docs/superpowers/specs/2026-11-21-thagi-rakshak-structure-design.md` (खंड 1, 5, 6.1, 6.3, 6.16) · Design v2 भाग 8.1

## Global Constraints
- plan A1 की सारी Global Constraints लागू (रंग-tokens, 18px, 48px, मना किए शब्द, प्रतिज्ञा और footer की लाइनें, system font)।
- `/turant/*` पर header या नीचे का menu **नहीं** होगा (spec 5.1)।
- जो सुविधा live नहीं है, उसका tab या बटन नहीं दिखेगा। "मेरा केस" वाला tab TR-16 तक छिपा रहेगा, और WhatsApp का बटन `NEXT_PUBLIC_WHATSAPP_NUMBER` set होने तक।
- `NEXT_PUBLIC_WHATSAPP_NUMBER` का रूप: `91` + 10 अंक (जैसे `919876543210`)। ग़लत हो, तो नंबर नहीं माना जाएगा (`null`)।
- हम अपने बारे में कुछ भी गढ़कर नहीं लिखेंगे (company का नाम, पता वगैरह)। ये TR-11 में मालिक से मिलकर आएँगे।
- `/bharosa` की "कभी नहीं" वाली सूची में "पक्का पैसा वापस" जैसा मना किया शब्द नहीं आएगा (copy-lint)। उसकी जगह यह लाइन होगी: "पैसा वापस आने का पक्का वादा करना"।

## Review Focus
1. **`/turant` पर गलती से नीचे का menu आ जाए:** e2e जाँचे कि `/turant/upi` पर `nav[aria-label="मुख्य menu"]` नहीं है → Task 1 + Task 4।
2. **WhatsApp नंबर ग़लत रूप में set हो (जैसे `+91 98765…`):** बटन ग़लत link न बनाए, यानी `null` → Task 1 का unit test।
3. **320px पर होम, `/pucho`, `/bharosa` में बगल में scroll** → Task 4 का e2e।
4. **JS बंद होने पर होम के दरवाज़े** → Task 4 का e2e।
5. **ग़लत पता (`/xyz`) अब भी हिंदी 404 दे,** और route groups से टूटे नहीं → Task 4 का e2e।

## File Structure
```
modules/site/{index.ts, config.ts, config.test.ts, nav.ts, nav.test.ts, signs.ts, signs.test.ts, fakes.ts}
components/site/{site-header.tsx, bottom-nav.tsx, nav-icon.tsx, site.test.tsx}
app/(site)/layout.tsx               header + main + bottom nav
app/(site)/page.tsx                 होम (app/page.tsx यहाँ आएगा)
app/(site)/pucho/page.tsx           7 आम निशान
app/(site)/bharosa/page.tsx
scripts/e2e-site.mjs
.github/workflows/ci.yml            (e2e job में e2e-site भी)
```

---

### Task 1: site की settings और menu का data

**Files:** `modules/site/config.ts`, `nav.ts`, `index.ts`, `config.test.ts`, `nav.test.ts`, `.env.example`

**Interfaces (Produces):**
- `getSiteConfig(env?: Record<string, string | undefined>): { whatsappNumber: string | null; siteUrl: string }`। default `process.env` पढ़ेगा, और `siteUrl` न हो तो `"http://localhost:3000"`।
- `whatsappLink(number: string, text?: string): string`, जैसे `https://wa.me/919876543210?text=<encodeURIComponent>`
- `type NavIcon = "home" | "search" | "case" | "shield"` · `type NavItem = { href: string; labelHi: string; icon: NavIcon; live: boolean }` · `NAV_ITEMS: readonly NavItem[]` · `liveNavItems(): NavItem[]`

`NAV_ITEMS` (जस का तस, इसी क्रम में): `{ "/", "होम", "home", true }` · `{ "/pucho", "पूछो", "search", true }` · `{ "/case", "मेरा केस", "case", false }` · `{ "/bharosa", "भरोसा", "shield", true }`

- [ ] **Step 1: tests लिखें**
```ts
test("सही नंबर माना जाता है", () => expect(getSiteConfig({ NEXT_PUBLIC_WHATSAPP_NUMBER: "919876543210" }).whatsappNumber).toBe("919876543210"));
test.each(["+91 98765 43210", "9876543210", "91987654321", "abc", ""])("ग़लत नंबर '%s' → null", (v) =>
  expect(getSiteConfig({ NEXT_PUBLIC_WHATSAPP_NUMBER: v }).whatsappNumber).toBeNull());
test("नंबर न हो तो null और localhost", () => expect(getSiteConfig({})).toEqual({ whatsappNumber: null, siteUrl: "http://localhost:3000" }));
test("whatsappLink text encode करता है", () =>
  expect(whatsappLink("919876543210", "नमस्ते ?")).toBe("https://wa.me/919876543210?text=" + encodeURIComponent("नमस्ते ?")));
test("menu: 4 चीज़ें, 'मेरा केस' अभी live नहीं", () => {
  expect(NAV_ITEMS.map((n) => n.href)).toEqual(["/", "/pucho", "/case", "/bharosa"]);
  expect(liveNavItems().map((n) => n.labelHi)).toEqual(["होम", "पूछो", "भरोसा"]);
});
```
- [ ] **Step 2:** `npx vitest run modules/site` → FAIL
- [ ] **Step 3:** code लिखें (Zod: `z.string().regex(/^91\d{10}$/)` से `safeParse`)। `.env.example` में `NEXT_PUBLIC_WHATSAPP_NUMBER=` की ख़ाली लाइन जोड़ें, साथ में टिप्पणी कि नंबर किस रूप में लिखना है।
- [ ] **Step 4:** `npx vitest run modules/site` → PASS
- [ ] **Step 5:** commit `TR-5: site settings और menu का data`

### Task 2: header, नीचे का menu और (site) layout

**Files:** `components/site/nav-icon.tsx`, `site-header.tsx`, `bottom-nav.tsx`, `site.test.tsx` · Move: `app/page.tsx` → `app/(site)/page.tsx` · Create: `app/(site)/layout.tsx`

**Interfaces:**
- Consumes: `liveNavItems`, `NavIcon` (Task 1)
- Produces: `SiteHeader()`: logo (shield icon + "ठगी रक्षक", link `/`), और desktop (`md:` से ऊपर) पर live menu links के साथ दाईं ओर हमेशा लाल बटन "ठगी हो गई" (`/turant`) · `BottomNav({ current }: { current: string })`: `<nav aria-label="मुख्य menu">`, सिर्फ़ फ़ोन पर (`md:hidden`), नीचे चिपका हुआ (fixed), हर tab कम से कम 48px, और चालू tab पर `aria-current="page"` · `NavIconSvg({ icon }: { icon: NavIcon })`

`BottomNav` को चालू पन्ने का पता चाहिए, पर server layout को pathname नहीं मिलता। इसलिए `BottomNav` एक client component होगा, जो `usePathname()` से `current` लेकर `BottomNavView` को देगा। `BottomNavView({ current })` शुद्ध render करने वाला component है, जिसे test किया जाएगा।

- [ ] **Step 1: tests लिखें** (`renderToStaticMarkup`)
```tsx
test("BottomNavView: 3 live tabs, मेरा केस नहीं, चालू पर aria-current", () => {
  const html = renderToStaticMarkup(<BottomNavView current="/bharosa" />);
  expect(html).toContain('aria-label="मुख्य menu"');
  expect(html).toContain('href="/pucho"');
  expect(html).not.toContain('href="/case"');
  expect(html).toMatch(/href="\/bharosa"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/bharosa"/);
});
test("SiteHeader: होम link और 'ठगी हो गई' बटन", () => {
  const html = renderToStaticMarkup(<SiteHeader />);
  expect(html).toContain('href="/"');
  expect(html).toContain('href="/turant"');
  expect(html).toContain("ठगी हो गई");
});
```
- [ ] **Step 2:** `npx vitest run components/site` → FAIL
- [ ] **Step 3:** components बनाएँ · `app/(site)/layout.tsx` = `<SiteHeader /> <main className="mx-auto max-w-[680px] px-4 py-4 pb-24">{children}</main> <BottomNav />` (`pb-24` इसलिए, ताकि नीचे का menu content को न ढके) · `git mv app/page.tsx "app/(site)/page.tsx"` (उसका `<main>` हटाकर सिर्फ़ अंदर का हिस्सा रखें, क्योंकि `<main>` अब layout में है)
- [ ] **Step 4:** `npm test && npm run lint && npm run typecheck && npm run build` → PASS
- [ ] **Step 5:** commit `TR-5: header, नीचे का menu, (site) layout`

### Task 3: होम, /pucho (7 आम निशान) और /bharosa

**Files:** `modules/site/signs.ts` (+test), `modules/site/fakes.ts` · Modify: `app/(site)/page.tsx` · Create: `app/(site)/pucho/page.tsx`, `app/(site)/bharosa/page.tsx` · Modify: `components/site/site.test.tsx`

**Interfaces (Produces):** `SCAM_SIGNS: readonly { titleHi: string; bodyHi: string }[]` (7) · `NEVER_LIST: readonly string[]` (7) · `FAKE_CHANNELS: readonly { kind: "page" | "number" | "app"; where: string; reportedAt: string }[]` (अभी `[]`) · `HomePage`, `PuchoPage`, `BharosaPage` (default exports)

**text (जस का तस):**

`SCAM_SIGNS`:
| titleHi | bodyHi |
|---|---|
| जल्दबाज़ी: "आज ही", "अभी नहीं तो खाता बंद" | ठग सोचने का समय नहीं देते। रुकें और किसी अपने से बात करें। |
| OTP, PIN या password माँगना | बैंक, पुलिस या कोई कंपनी यह कभी नहीं माँगती। |
| पैसे पाने के लिए PIN डालना या QR scan करना | पैसा पाने के लिए कभी PIN या QR की ज़रूरत नहीं होती। |
| कोई ऐप या APK फ़ाइल डलवाना | AnyDesk जैसे ऐप या अनजान APK से वे आपका फ़ोन चला सकते हैं। |
| पुलिस, CBI या कोर्ट की धमकी, वह भी video call पर | असली पुलिस video call पर गिरफ़्तार नहीं करती। call काटें। |
| बहुत ज़्यादा कमाई का वादा | "घर बैठे like करो, रोज़ हज़ारों कमाओ" या "पैसे दुगने" ठगी का चारा है। |
| Google या social media पर मिला "customer care" नंबर | नंबर सिर्फ़ कंपनी के अपने ऐप या वेबसाइट से लें। |

`NEVER_LIST`: `OTP, PIN, password या CVV माँगना` · `AnyDesk, screen-share या कोई APK डलवाना` · `आपसे किसी को पैसे भिजवाना` · `पैसा वापस आने का पक्का वादा करना` · `पहले ख़ुद आपको call करना` · `आपका data बेचना` · `सरकारी दफ़्तर होने का दिखावा करना`

**होम** (ऊपर से नीचे): h1 (सिर्फ़ screen-reader के लिए, `sr-only`) `ठगी रक्षक: डिजिटल ठगी में मदद` → BigDoor danger `/turant` "मेरे साथ ठगी हो गई" / "अभी मदद पाएँ · मुफ़्त · बिना login" → BigDoor safe `/pucho` "यह call या message ठगी है?" / "ठगी के 7 आम निशान · मुफ़्त" → TrustBar → (नंबर set हो तो) हरा WhatsApp बटन "WhatsApp पर बात करें" (`whatsappLink(n, "नमस्ते, मुझे ठगी से जुड़ी मदद चाहिए")`, नए tab में, `rel="noopener noreferrer"`)।

**/pucho:** h1 `ठगी के 7 आम निशान` → उप-text `इनमें से एक भी दिखे, तो रुकें। पैसे न भेजें, कोई ऐप न डालें।` → `<ol>` में 7 निशान (हर एक card में) → Notice info `screenshot भेजकर पूछने वाली सुविधा जल्द आ रही है।` → BigDoor danger `/turant` "पैसे जा चुके हैं?" / "अभी क्या करें, देखें"।

**/bharosa:** h1 `हम पर भरोसा क्यों करें` → h2 `हम ये काम कभी नहीं करेंगे` + `NEVER_LIST` (हर लाइन पर ✕ वाला icon, aria-hidden) → h2 `कोई "ठगी रक्षक" बनकर call करे तो?` + p `वह ठग है। हम कभी पहले call नहीं करते। call काटें और 1930 पर बताएँ।` → h2 `हमारे असली रास्ते` + वेबसाइट (`siteUrl` का host) + WhatsApp (नंबर हो तो `+91 XXXXX XXXXX` के रूप में, वरना `जल्द शुरू होगा`) + p `इनके अलावा हमारे नाम से कोई भी नंबर, पेज या ऐप नकली है।` → h2 `हम कौन हैं` + p `ठगी रक्षक एक स्वतंत्र सेवा है। हम सरकार, पुलिस या किसी बैंक का हिस्सा नहीं हैं। हम आपको सही सरकारी और बैंक के रास्तों तक पहुँचाने में मदद करते हैं।` → h2 `हम पैसे कैसे कमाएँगे?` + p `अभी सब कुछ मुफ़्त है। आगे अर्ज़ियों की किट के पैसे लग सकते हैं, पर ज़रूरी मदद (पहले 60 मिनट, बैंक को शिकायत, हक़ का हिसाब) हमेशा मुफ़्त रहेगी। जिनके पास पैसे न हों, उनके लिए किट भी मुफ़्त होगी।` → h2 `हमारे नाम से नकली पेज` + (`FAKE_CHANNELS` ख़ाली हो तो) `अभी तक कोई नकली पेज नहीं मिला। मिलने पर यहीं बताएँगे।`

- [ ] **Step 1: tests लिखें**
```ts
test("7 निशान, OTP वाला दूसरे नंबर पर", () => { expect(SCAM_SIGNS).toHaveLength(7); expect(SCAM_SIGNS[1].titleHi).toBe("OTP, PIN या password माँगना"); });
test("कभी-नहीं सूची: 7, पहले call वाली शामिल", () => { expect(NEVER_LIST).toHaveLength(7); expect(NEVER_LIST).toContain("पहले ख़ुद आपको call करना"); });
```
```tsx
test("होम: दोनों दरवाज़े, नंबर न हो तो WhatsApp नहीं", () => {
  const html = renderToStaticMarkup(<HomePage />);
  expect(html).toContain('href="/turant"'); expect(html).toContain('href="/pucho"'); expect(html).not.toContain("wa.me");
});
test("/bharosa: 'वह ठग है' और नकली पेजों का ख़ाली हाल", () => {
  const html = renderToStaticMarkup(<BharosaPage />);
  expect(html).toContain("वह ठग है।"); expect(html).toContain("अभी तक कोई नकली पेज नहीं मिला।");
});
test("/pucho: 7 निशान और /turant का दरवाज़ा", () => {
  const html = renderToStaticMarkup(<PuchoPage />);
  expect((html.match(/<li/g) ?? []).length).toBe(7); expect(html).toContain('href="/turant"');
});
```
- [ ] **Step 2:** `npx vitest run modules/site components/site` → FAIL
- [ ] **Step 3:** data और पन्ने बनाएँ। हर पन्ने के `metadata.title` में `<शीर्षक> — ठगी रक्षक`।
- [ ] **Step 4:** `npm test && npm run lint && npm run typecheck && npm run build` → PASS (copy-lint भी)
- [ ] **Step 5:** commit `TR-5: होम, /pucho (7 आम निशान), /bharosa`

### Task 4: e2e जाँच (site)

**Files:** `scripts/e2e-site.mjs` · Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: `scripts/e2e-site.mjs` लिखें** (ढाँचा `e2e-turant.mjs` जैसा)। जाँचें:
  1. `/`: दोनों दरवाज़े, और `nav[aria-label="मुख्य menu"]` (360px पर) दिखे।
  2. `/turant/upi` (360px): `nav[aria-label="मुख्य menu"]` की गिनती 0।
  3. JS बंद: `/` पर `a[href="/turant"]` दिखे।
  4. `/pucho`: 7 `li` और "OTP, PIN या password माँगना"।
  5. `/bharosa`: "वह ठग है।" और "हम ये काम कभी नहीं करेंगे"।
  6. 320px पर `/`, `/pucho`, `/bharosa`: scrollWidth ≤ 320।
  7. `/xyz`: 404 और "यह पन्ना नहीं मिला।"
  8. menu: 360px पर `/bharosa` खोलने पर "भरोसा" tab पर `aria-current="page"` (JS चालू)।
- [ ] **Step 2:** `npm run build`, फिर app चालू करके `node scripts/e2e-site.mjs && node scripts/e2e-turant.mjs` → सब ✓
- [ ] **Step 3:** CI के e2e job में `node scripts/e2e-turant.mjs` के बाद `node scripts/e2e-site.mjs` जोड़ें।
- [ ] **Step 4:** commit `TR-5: site की e2e जाँच`
