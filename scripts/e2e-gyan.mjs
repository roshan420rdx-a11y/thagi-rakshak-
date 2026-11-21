// ज्ञानकोश (/gyan) की असली browser में जाँच। चलाने से पहले: npm run build && npm start
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PAGES = [
  ["digital-arrest", "digital-arrest"],
  ["customer-care-fake", "customer-care-fake"],
  ["upi-pin-qr", "upi"],
  ["task-investment", "investment-task"],
  ["apk-file", "customer-care-fake"],
];
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
    return await fn(page);
  } finally {
    await context.close();
  }
}

await check("/gyan: पाँचों पन्नों के links", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/gyan`);
    for (const [slug] of PAGES) assert((await page.locator(`main a[href="/gyan/${slug}"]`).count()) === 1, `${slug} link नहीं`);
  }),
);

await check("हर पन्ना: h1, 'हो गया है?' का सही /turant link, 5 निशान", () =>
  withPage({}, async (page) => {
    for (const [slug, turant] of PAGES) {
      await page.goto(`${BASE}/gyan/${slug}`);
      assert((await page.locator("main h1").count()) === 1, `${slug}: h1 नहीं`);
      assert((await page.locator(`main a[href="/turant/${turant}"]`).count()) > 0, `${slug}: /turant/${turant} link नहीं`);
      assert((await page.locator("[data-sign]").count()) === 5, `${slug}: 5 निशान नहीं`);
    }
  }),
);

await check("JS बंद: FAQ का सवाल दबाने पर जवाब दिखे", () =>
  withPage({ javaScriptEnabled: false }, async (page) => {
    await page.goto(`${BASE}/gyan/digital-arrest`);
    const first = page.locator("details").first();
    await first.locator("summary").click();
    assert(await first.evaluate((d) => d.open), "details नहीं खुला");
    assert(await first.locator("p").first().isVisible(), "जवाब नहीं दिखा");
  }),
);

await check("320px: ज्ञानकोश के 6 पन्नों पर बगल में scroll नहीं", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page) => {
    for (const path of ["/gyan", ...PAGES.map(([s]) => `/gyan/${s}`)]) {
      await page.goto(`${BASE}${path}`);
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(w <= 320, `${path}: scrollWidth ${w}`);
    }
  }),
);

await check("/gyan/xyz → 404, और /gyan/bank अब भी चलता है", () =>
  withPage({}, async (page) => {
    const bad = await page.goto(`${BASE}/gyan/xyz`);
    assert(bad?.status() === 404, `xyz status ${bad?.status()}`);
    const bank = await page.goto(`${BASE}/gyan/bank`);
    assert(bank?.status() === 200, `bank status ${bank?.status()}`);
  }),
);

await check("/turant/digital-arrest और /pucho से ज्ञानकोश के links", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/turant/digital-arrest`);
    assert((await page.locator('a[href="/gyan/digital-arrest"]').count()) > 0, "/turant से link नहीं");
    await page.goto(`${BASE}/pucho`);
    assert((await page.locator('main a[href="/gyan"]').count()) > 0, "/pucho से link नहीं");
  }),
);

await browser.close();
process.exit(failed ? 1 : 0);
