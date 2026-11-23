// /turant की असली browser में जाँच (Playwright)। चलाने से पहले app चालू हो: npm run build && npm start
// हर जाँच "✓ नाम" छापती है; पहली गड़बड़ी पर "✗ नाम: कारण" छापकर exit 1।
import { BASE, browser, check, assert, withPage, installSpeechStub, finish } from "./e2e-lib.mjs";

// नाप वही जो तार पर जाता है (gzip): CSS अब HTML के अंदर है (next.config: inlineCss), अलग file का दूसरा round-trip नहीं
await check("upi: कदम, tel:1930, पन्ना (CSS समेत) तार पर 25KB से छोटा", () =>
  withPage({}, async (page) => {
    const res = await page.goto(`${BASE}/turant/upi`);
    assert(res && res.ok(), `status ${res?.status()}`);
    const { responseBodySize } = await res.request().sizes();
    assert(responseBodySize > 0 && responseBodySize < 25_000, `तार पर ${responseBodySize} bytes`);
    assert((await page.locator('link[rel="stylesheet"]').count()) === 0, "CSS अलग file में (दूसरा round-trip)");
    await page.getByText("1930 पर call करें").first().waitFor();
    assert((await page.locator('a[href="tel:1930"]').count()) > 0, "tel:1930 link नहीं मिला");
  }),
);

await check("JS बंद: digital-arrest का banner और tel:1930", () =>
  withPage({ javaScriptEnabled: false }, async (page) => {
    await page.goto(`${BASE}/turant/digital-arrest`);
    await page.getByText("video call पर गिरफ़्तार नहीं करती").waitFor();
    assert((await page.locator('a[href="tel:1930"]').count()) > 0, "tel:1930 link नहीं मिला");
  }),
);

await check("sextortion: Tele-MANAS हाँ, file input नहीं", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/turant/sextortion`);
    assert((await page.locator('a[href="tel:14416"]').count()) > 0, "tel:14416 नहीं मिला");
    assert((await page.locator('input[type="file"]').count()) === 0, "file input मिला");
  }),
);

await check("ग़लत slug: हिंदी 404, /turant का link", () =>
  withPage({}, async (page) => {
    const res = await page.goto(`${BASE}/turant/abc`);
    assert(res?.status() === 404, `status ${res?.status()}`);
    await page.getByText("यह पन्ना नहीं मिला।").waitFor();
    assert((await page.locator('a[href="/turant"]').count()) > 0, "/turant link नहीं मिला");
  }),
);

await check("320px: बगल में scroll नहीं", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page) => {
    for (const path of ["/turant", "/turant/customer-care-fake"]) {
      await page.goto(`${BASE}${path}`);
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(w <= 320, `${path}: scrollWidth ${w}`);
    }
  }),
);

await check("offline: दोबारा खुले और पट्टी दिखे", () =>
  withPage({}, async (page, context) => {
    await page.goto(`${BASE}/turant/upi`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload(); // अब service worker के नियंत्रण में; CSS भी cache में चली जाए
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.reload();
    await page.getByText("1930 पर call करें").first().waitFor();
    await page.getByText("आप offline हैं। यह पन्ना फिर भी काम करेगा।").waitFor();
  }),
);

await check("offline: /turant से प्रकार पर tap करने पर उसका पन्ना खुले", () =>
  withPage({}, async (page, context) => {
    await page.goto(`${BASE}/turant`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.getByRole("link", { name: "Card से पैसे कटे" }).click();
    await page.getByRole("heading", { name: /Card तुरंत block करें/ }).waitFor();
    assert(page.url().endsWith("/turant/card"), `URL: ${page.url()}`);
  }),
);

await check("मुख्य /turant: 'पता नहीं?' h2 के नीचे कदम h3", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/turant`);
    assert((await page.locator("#turant-steps h2").count()) === 0, "कदमों में h2 मिला");
    assert((await page.locator("#turant-steps h3").count()) >= 4, "कदम h3 नहीं");
  }),
);

await check("धीमा internet (Slow 3G, 2 सेकंड की देरी): '1930 पर call करें' 3.5 सेकंड के अंदर दिखे", async () => {
  // गाँव के धीमे network पर भी पहला कदम एक round-trip में: पन्ना server पर बनकर आता है (JS का इंतज़ार नहीं),
  // और CSS उसी HTML में (अलग CSS file के लिए दूसरी 2 सेकंड की देरी नहीं; पहले 4.4 सेकंड, अब लगभग 2.3)
  const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
  const page = await context.newPage();
  try {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 2000, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8 });
    const t0 = Date.now();
    await page.goto(`${BASE}/turant/upi`, { waitUntil: "commit", timeout: 60000 });
    await page.getByText("1930 पर call करें").first().waitFor({ timeout: 60000 });
    const ms = Date.now() - t0;
    assert(ms < 3500, `${ms}ms लगे`);
  } finally {
    await context.close();
  }
});

await check("'यह कब हुआ?': '1 घंटे से कम' पर पहले घंटे वाली सलाह और हक़ का link; 1930 पहली screen में", () =>
  withPage({ viewport: { width: 360, height: 740 } }, async (page) => {
    await page.goto(`${BASE}/turant/upi`);
    await page.getByRole("heading", { name: "यह कब हुआ?" }).waitFor();
    const call = await page.locator('a[href="tel:1930"]').first().boundingBox();
    assert(call && call.y + call.height <= 740, `1930 का बटन पहली screen से नीचे (${call && Math.round(call.y + call.height)}px)`);
    await page.getByRole("button", { name: "1 घंटे से कम" }).click();
    await page.getByText("अभी पहला घंटा चल रहा है", { exact: false }).waitFor();
    // सलाह के साथ 1930 का बटन भी, और वह पहली screen में
    const callInAdvice = await page.locator('[aria-labelledby="kab-title"] a[href="tel:1930"]').boundingBox();
    assert(callInAdvice && callInAdvice.y + callInAdvice.height <= 740, "सलाह वाला 1930 बटन पहली screen में नहीं");
    assert((await page.getByRole("button", { name: "1 घंटे से कम" }).getAttribute("aria-pressed")) === "true", "aria-pressed नहीं");
    assert((await page.locator('a[href="/haq/thagi"]').count()) === 1, "हक़ का link नहीं");
    await page.getByRole("button", { name: "5 दिन से ज़्यादा पहले" }).click();
    await page.getByText("देर हो गई है, फिर भी शिकायत ज़रूर करें", { exact: false }).waitFor();
  }),
);

await check("'यह कब हुआ?' sextortion/loan-app पर नहीं, और JS बंद पर नहीं", async () => {
  await withPage({}, async (page) => {
    for (const slug of ["sextortion", "loan-app"]) {
      await page.goto(`${BASE}/turant/${slug}`);
      await page.waitForLoadState("networkidle");
      assert((await page.getByText("यह कब हुआ?").count()) === 0, `${slug} पर सवाल दिखा`);
    }
  });
  await withPage({ javaScriptEnabled: false }, async (page) => {
    await page.goto(`${BASE}/turant/upi`);
    assert((await page.getByText("यह कब हुआ?").count()) === 0, "JS बंद पर सवाल दिखा");
    assert((await page.locator('a[href="tel:1930"]').count()) > 0, "JS बंद पर 1930 नहीं");
  });
});

await check("मुख्य /turant: प्रकार चुनने से पहले ही '1930 मिलाएँ' पहली screen में", () =>
  withPage({ viewport: { width: 360, height: 740 } }, async (page) => {
    await page.goto(`${BASE}/turant`);
    const call = await page.locator('a[href="tel:1930"]').first().boundingBox();
    assert(call && call.y + call.height <= 740, `1930 पहली screen से नीचे (${call && Math.round(call.y + call.height)}px)`);
  }),
);

await check("digital-arrest: 'call काटिए' वाली चेतावनी 'यह कब हुआ?' से ऊपर", () =>
  withPage({ viewport: { width: 360, height: 740 } }, async (page) => {
    await page.goto(`${BASE}/turant/digital-arrest`);
    const kab = await page.getByRole("heading", { name: "यह कब हुआ?" }).boundingBox();
    const banner = await page.locator("#turant-banner").boundingBox();
    assert(kab && banner && banner.y < kab.y, `चेतावनी ${banner && Math.round(banner.y)} / कब ${kab && Math.round(kab.y)}`);
  }),
);

await check("सुनें (/turant): चेतावनी और कदम बोले, 'यह कब हुआ?' नहीं", () =>
  withPage({}, async (page, context) => {
    await installSpeechStub(context);
    await page.goto(`${BASE}/turant/digital-arrest`);
    await page.getByRole("heading", { name: "यह कब हुआ?" }).waitFor();
    await page.getByRole("button", { name: "सुनें" }).click();
    const spoken = (await page.evaluate(() => window.__spoken)).map((s) => s.text).join(" ");
    assert(spoken.includes("call काटिए") && spoken.includes("1930 पर call करें"), `spoken: ${spoken.slice(0, 80)}`);
    assert(!spoken.includes("यह कब हुआ"), "'कब हुआ?' भी बोला");
  }),
);

await check("/sw.js में offline की तैयारी वाला code (build ने नाम नहीं बदला)", async () => {
  const res = await fetch(`${BASE}/sw.js`);
  const js = await res.text();
  assert(js.includes("function extractNextAssets(html)"), "extractNextAssets नहीं मिला");
  assert(js.includes("/gyan/bank"), "/gyan/bank offline सूची में नहीं");
});

await check("security headers", () =>
  withPage({}, async (page) => {
    const res = await page.goto(`${BASE}/`);
    const h = res?.headers() ?? {};
    assert(h["content-security-policy"], "CSP नहीं");
    assert(h["x-frame-options"] === "DENY", `x-frame-options ${h["x-frame-options"]}`);
  }),
);

await check("dark mode: background dark surface", () =>
  withPage({ colorScheme: "dark" }, async (page) => {
    await page.goto(`${BASE}/turant/upi`);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert(bg === "rgb(18, 21, 27)", `background ${bg}`);
  }),
);

await check("हो गया ✓: दबाने पर कदम हरा और गिनती बढ़े; reload और offline पर भी याद; 'सब फिर से' से साफ़; 'सुनें' बटन नहीं पढ़ता", () =>
  withPage({ viewport: { width: 360, height: 740 } }, async (page, context) => {
    await installSpeechStub(context);
    await page.goto(`${BASE}/turant/upi`);
    const total = await page.locator("#turant-steps ol > li").count();
    const first = page.getByRole("button", { name: "कदम 1 हो गया" });
    await first.click();
    assert((await first.getAttribute("aria-pressed")) === "true", "दबाने पर 'हो गया' नहीं");
    await page.getByText(`${total} में से 1 कदम हो गए`).waitFor();
    // 1930 वाला कदम हो गया: शिकायत नंबर "मेरा केस" में लिखने का रास्ता उसी जगह
    assert((await page.locator('#turant-steps ol > li').first().locator('a[href="/case"]').count()) === 1, "'मेरा केस' में लिखने का link नहीं");
    const green = await page.locator("#turant-steps ol > li").first().evaluate((li) => getComputedStyle(li.firstElementChild).backgroundColor);
    assert(green === "rgb(6, 118, 71)", `हो गए कदम का नंबर हरा नहीं: ${green}`);
    await page.getByRole("button", { name: "सुनें" }).click();
    const spoken = (await page.evaluate(() => window.__spoken)).map((x) => x.text).join(" ");
    assert(spoken.includes("1930 पर call करें") && !spoken.includes("हो गया") && !spoken.includes("कदम हो गए"), `सुनें: ${spoken.slice(0, 80)}`);
    // offline (service worker) के बाद भी याद
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.reload();
    await page.getByText(`${total} में से 1 कदम हो गए`).waitFor();
    assert((await page.getByRole("button", { name: "कदम 1 हो गया" }).getAttribute("aria-pressed")) === "true", "offline reload पर याद नहीं");
    await context.setOffline(false);
    await page.getByRole("button", { name: "सब फिर से" }).click();
    await page.getByText(`${total} में से 0 कदम हो गए`).waitFor();
    assert((await page.evaluate(() => localStorage.getItem("thagi-rakshak:turant-done:v1"))) === null, "साफ़ करने पर भी storage में बचा");
  }),
);

await check("हो गया: JS बंद पर कोई बटन नहीं, कदम पहले जैसे", () =>
  withPage({ javaScriptEnabled: false }, async (page) => {
    await page.goto(`${BASE}/turant/upi`);
    assert((await page.locator("[data-step-done]").count()) === 0, "JS बंद पर 'हो गया' बटन");
    assert((await page.locator("#turant-steps ol > li").count()) > 0, "कदम नहीं");
  }),
);

await finish();
