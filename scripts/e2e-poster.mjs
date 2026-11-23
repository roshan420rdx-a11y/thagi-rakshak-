// पोस्टर (/poster) की असली browser में जाँच। चलाने से पहले: npm run build && npm start
import { BASE, PHONE, check, assert, withPage, pdfPageCount, finish } from "./e2e-lib.mjs";

await check("पोस्टर: 8 बातें, 1930, साइट का पता; Print बटन print खोले", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/poster`);
    assert((await page.locator("[data-poster-rule]").count()) === 8, "8 बातें नहीं");
    await page.locator("[data-print-area]").getByText("1930", { exact: false }).first().waitFor();
    // साइट का पता (BASE वाला host; live साइट पर भी यही जाँच चले)
    assert((await page.locator("[data-print-area]").innerText()).includes(new URL(BASE).host), "साइट का पता नहीं");
    await page.evaluate(() => {
      window.__printed = 0;
      window.print = () => (window.__printed += 1);
    });
    await page.getByRole("button", { name: "Print / PDF बनाएँ" }).click();
    assert((await page.evaluate(() => window.__printed)) === 1, "print नहीं चला");
  }),
);

await check("print में सिर्फ़ पोस्टर (menu, बटन, footer नहीं), और PDF ठीक 1 पन्ना (A4), 15% बड़ा छापने पर भी", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/poster`);
    await page.emulateMedia({ media: "print" });
    assert(await page.locator("[data-print-area]").isVisible(), "print में पोस्टर नहीं");
    // पोस्टर के अंदर भी header/footer हैं, इसलिए साइट वाले ठीक-ठीक: पहला header, आख़िरी footer, menu, print बटन
    const outside = {
      menu: page.locator('nav[aria-label="मुख्य menu"]'),
      siteHeader: page.locator("header").first(),
      siteFooter: page.locator("footer").last(),
      printButton: page.getByRole("button", { name: "Print / PDF बनाएँ" }),
      shareLink: page.getByRole("link", { name: /WhatsApp पर भेजें/ }),
    };
    for (const [name, loc] of Object.entries(outside)) assert(!(await loc.isVisible()), `print में ${name} दिखा`);
    await page.emulateMedia({ media: "screen" });
    const pages = await pdfPageCount(page);
    assert(pages === 1, `PDF में ${pages} पन्ने`);
    // जगह बची रहे: GitHub की machine पर दूसरे font से 2 पन्ने बन गए थे (2026-11-23)
    const bigger = await pdfPageCount(page, 1.15);
    assert(bigger === 1, `15% बड़ा छापने पर PDF में ${bigger} पन्ने (पोस्टर में जगह कम)`);
  }),
);

await check("सबसे बड़े अक्षर पर भी PDF 1 पन्ना; 320px पर बगल में scroll नहीं", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page, context) => {
    await context.addInitScript(() => localStorage.setItem("thagi-rakshak:akshar:v1", "3"));
    await page.goto(`${BASE}/poster`);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(w <= 320, `scrollWidth ${w}`);
    const pages = await pdfPageCount(page);
    assert(pages === 1, `बड़े अक्षर पर PDF में ${pages} पन्ने`);
  }),
);

await check("JS बंद: पोस्टर दिखे (browser के menu से छप सके)", () =>
  withPage({ javaScriptEnabled: false, viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/poster`);
    assert((await page.locator("[data-poster-rule]").count()) === 8, "JS बंद पर पोस्टर नहीं");
  }),
);

await finish();
