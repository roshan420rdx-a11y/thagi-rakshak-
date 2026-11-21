// /turant की असली browser में जाँच (Playwright)। चलाने से पहले app चालू हो: npm run build && npm start
// हर जाँच "✓ नाम" छापती है; पहली गड़बड़ी पर "✗ नाम: कारण" छापकर exit 1।
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
let failed = false;

async function check(name, fn) {
  if (failed) return;
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    failed = true;
    console.log(`✗ ${name}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function withPage(options, fn) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  try {
    return await fn(page, context);
  } finally {
    await context.close();
  }
}

await check("upi: कदम, tel:1930, HTML 60KB से छोटा", () =>
  withPage({}, async (page) => {
    const res = await page.goto(`${BASE}/turant/upi`);
    assert(res && res.ok(), `status ${res?.status()}`);
    const body = await res.body();
    assert(body.length < 60_000, `HTML ${body.length} bytes`);
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

await browser.close();
process.exit(failed ? 1 : 0);
