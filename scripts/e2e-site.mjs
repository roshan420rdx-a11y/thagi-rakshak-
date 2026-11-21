// होम, menu, /pucho, /bharosa की असली browser में जाँच। चलाने से पहले: npm run build && npm start
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PHONE = { width: 360, height: 740 };
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

const MENU = 'nav[aria-label="मुख्य menu"]';

await check("होम: दोनों दरवाज़े और फ़ोन पर नीचे का menu", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/`);
    await page.getByText("मेरे साथ ठगी हो गई").waitFor();
    await page.getByText("यह call या message ठगी है?").waitFor();
    assert(await page.locator(MENU).isVisible(), "नीचे का menu नहीं दिखा");
  }),
);

await check("/turant पर नीचे का menu नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/turant/upi`);
    assert((await page.locator(MENU).count()) === 0, "/turant पर menu मिला");
  }),
);

await check("JS बंद: होम पर /turant का दरवाज़ा", () =>
  withPage({ javaScriptEnabled: false, viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/`);
    assert((await page.locator('main a[href="/turant"]').count()) > 0, "/turant link नहीं");
  }),
);

await check("/pucho: 7 निशान", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/pucho`);
    assert((await page.locator("main ol > li").count()) === 7, "7 li नहीं");
    await page.getByText("OTP, PIN या password माँगना").waitFor();
  }),
);

await check("/bharosa: 'वह ठग है' और कभी-नहीं सूची", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/bharosa`);
    await page.getByText("वह ठग है।", { exact: false }).waitFor();
    await page.getByText("हम ये काम कभी नहीं करेंगे").waitFor();
  }),
);

await check("320px: बगल में scroll नहीं (/, /pucho, /bharosa)", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page) => {
    for (const path of ["/", "/pucho", "/bharosa"]) {
      await page.goto(`${BASE}${path}`);
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(w <= 320, `${path}: scrollWidth ${w}`);
    }
  }),
);

await check("ग़लत पता: हिंदी 404", () =>
  withPage({}, async (page) => {
    const res = await page.goto(`${BASE}/xyz`);
    assert(res?.status() === 404, `status ${res?.status()}`);
    await page.getByText("यह पन्ना नहीं मिला।").waitFor();
  }),
);

await check("menu: /bharosa पर 'भरोसा' tab चालू", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/bharosa`);
    const current = page.locator(`${MENU} a[aria-current="page"]`);
    await current.waitFor();
    assert((await current.textContent())?.includes("भरोसा"), `चालू tab: ${await current.textContent()}`);
  }),
);

await check("फ़ोन: footer की आख़िरी लाइन नीचे के menu के पीछे न छिपे", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/bharosa`);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const line = await page.getByText("यहाँ दी गई जानकारी कानूनी सलाह नहीं है।").boundingBox();
    const nav = await page.locator(MENU).boundingBox();
    assert(line && nav, "line या menu नहीं मिला");
    assert(line.y + line.height <= nav.y, `line नीचे ${Math.round(line.y + line.height)} > menu ऊपर ${Math.round(nav.y)}`);
  }),
);

await check("होम: प्रतिज्ञा एक ही बार (दोहराव नहीं)", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/`);
    const n = await page.getByText("हम कभी OTP, PIN, password नहीं माँगते", { exact: false }).count();
    assert(n === 1, `प्रतिज्ञा ${n} बार`);
  }),
);

await check("/gyan/bank: 10 बैंक और .bank.in वाला सुझाव", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/gyan/bank`);
    assert((await page.locator('main a[href^="/gyan/bank/"]').count()) === 10, "10 बैंक links नहीं");
    await page.getByText('".bank.in" पर ख़त्म होता है', { exact: false }).waitFor();
  }),
);

await check("/gyan/bank/sbi: अभी जाँच में, कोई tel: नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/gyan/bank/sbi`);
    await page.getByText("अभी जाँच में हैं", { exact: false }).waitFor();
    assert((await page.locator('a[href^="tel:"]').count()) === 0, "बिना दो-जाँच tel: link मिला");
  }),
);

await check("/gyan/bank/xyz → 404", () =>
  withPage({}, async (page) => {
    const res = await page.goto(`${BASE}/gyan/bank/xyz`);
    assert(res?.status() === 404, `status ${res?.status()}`);
  }),
);

await check("320px: बैंक पन्नों पर बगल में scroll नहीं", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page) => {
    for (const path of ["/gyan/bank", "/gyan/bank/union", "/gyan/bank/kotak"]) {
      await page.goto(`${BASE}${path}`);
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(w <= 320, `${path}: scrollWidth ${w}`);
    }
  }),
);

await check("offline: /turant/upi से 'अपने बैंक का सही रास्ता देखें' → /gyan/bank खुले", async () => {
  const context = await browser.newContext({ viewport: PHONE });
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/turant/upi`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.getByRole("link", { name: "अपने बैंक का सही रास्ता देखें" }).click();
    await page.getByText("अपने बैंक को ठगी कैसे बताएँ").first().waitFor();
  } finally {
    await context.close();
  }
});

await browser.close();
process.exit(failed ? 1 : 0);
