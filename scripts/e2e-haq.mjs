// /haq (हक़ का हिसाब) की असली browser में जाँच। चलाने से पहले: npm run build && npm start
// "आज" असली तारीख़ है (Asia/Kolkata), इसलिए तारीख़ें आज से पीछे गिनकर बनती हैं।
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
    return await fn(page);
  } finally {
    await context.close();
  }
}

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const minusDays = (n) => {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

await check("JS बंद: form भरकर हिसाब (संभावित + मूल text का link)", () =>
  withPage({ javaScriptEnabled: false, viewport: { width: 360, height: 740 } }, async (page) => {
    await page.goto(`${BASE}/haq/thagi`);
    await page.fill("#txn", minusDays(2));
    await page.fill("#loss", "40000");
    await page.check('input[name="shared"][value="yes"]');
    await page.selectOption("#how", "credentials_taken");
    await page.fill("#r1930", today);
    await page.fill("#rbank", today);
    await Promise.all([page.waitForURL(/\/haq\/thagi\?/), page.click('button[type="submit"]')]);
    await page.getByText("आपका हिसाब").waitFor();
    assert(page.url().endsWith("#nateeja"), `URL में #nateeja नहीं: ${page.url()}`);
    const box = await page.getByRole("heading", { name: "आपका हिसाब" }).boundingBox();
    assert(box && box.y >= 0 && box.y < 740, `JS बंद पर नतीजा screen पर नहीं (y=${box && Math.round(box.y)})`);
    assert((await page.getByText("संभावित", { exact: true }).count()) > 0, "'संभावित' नहीं मिला");
    assert((await page.locator('a[href^="https://www.rbi.org.in/"]').count()) > 0, "मूल text link नहीं");
  }),
);

await check("रकम comma, ₹ और पैसे के साथ (₹4,999.50): browser न रोके, हिसाब आए", () =>
  withPage({ viewport: { width: 360, height: 740 } }, async (page) => {
    await page.goto(`${BASE}/haq/thagi`);
    await page.fill("#txn", minusDays(2));
    await page.fill("#loss", "₹4,999.50");
    await page.fill("#back", "1,000");
    await page.check('input[name="shared"][value="yes"]');
    await page.selectOption("#how", "credentials_taken");
    await page.fill("#r1930", today);
    await page.fill("#rbank", today);
    await Promise.all([page.waitForURL(/\/haq\/thagi\?/), page.click('button[type="submit"]')]);
    await page.getByText("आपका हिसाब").waitFor();
    assert((await page.getByText("कितने पैसे गए, सही रकम लिखें।").count()) === 0, "सही रकम पर ग़लती दिखी");
  }),
);

await check("'हिसाब देखें' के बाद फ़ोन पर नतीजा सीधे सामने (लंबे form के नीचे छिपा न रहे)", () =>
  withPage({ viewport: { width: 360, height: 740 } }, async (page) => {
    await page.goto(`${BASE}/haq/thagi`);
    await page.fill("#txn", minusDays(2));
    await page.fill("#loss", "40000");
    await page.check('input[name="shared"][value="yes"]');
    await Promise.all([page.waitForURL(/\/haq\/thagi\?/), page.click('button[type="submit"]')]);
    const h = page.getByRole("heading", { name: "आपका हिसाब" });
    await h.waitFor();
    await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 5000 }).catch(() => {});
    const box = await h.boundingBox();
    assert(box && box.y >= 0 && box.y < 740, `नतीजा screen पर नहीं (y=${box && Math.round(box.y)})`);
  }),
);

await check("fail लेन-देन: 'हिसाब देखें' के बाद नतीजा सीधे सामने", () =>
  withPage({ viewport: { width: 360, height: 740 } }, async (page) => {
    await page.goto(`${BASE}/haq/failed-txn`);
    await page.selectOption("#ch", { index: 1 });
    await page.fill("#txn", minusDays(5));
    await Promise.all([page.waitForURL(/\/haq\/failed-txn\?/), page.click('button[type="submit"]')]);
    const h = page.getByRole("heading", { name: "आपका हिसाब" });
    await h.waitFor();
    await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 5000 }).catch(() => {});
    const box = await h.boundingBox();
    assert(box && box.y >= 0 && box.y < 740, `नतीजा screen पर नहीं (y=${box && Math.round(box.y)})`);
  }),
);

await check("ग़लत रकम ('बहुत सारे') पर हिंदी ग़लती", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/haq/thagi?txn=${minusDays(2)}&loss=${encodeURIComponent("बहुत सारे")}`);
    await page.getByText("कितने पैसे गए, सही रकम लिखें।").waitFor();
  }),
);

await check("ग़लत तारीख़ पर हिंदी ग़लती", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/haq/thagi?txn=2027-02-30&loss=100`);
    await page.getByText("ठगी की तारीख़ सही नहीं है।").waitFor();
    assert((await page.getByText("आपका हिसाब").count()) === 0, "ग़लती पर भी हिसाब दिखा");
  }),
);

await check("fail लेन-देन: UPI, 5 दिन पहले, अभी नहीं लौटा → ₹400", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/haq/failed-txn?ch=upi_transfer&txn=${minusDays(5)}&res=`);
    await page.getByText("₹400").waitFor();
  }),
);

await check("320px: बगल में scroll नहीं (/haq, /haq/thagi, /haq/failed-txn, /haq/frozen-money)", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page) => {
    for (const path of ["/haq", `/haq/thagi?txn=${minusDays(2)}&loss=40000&shared=yes&r1930=${today}&rbank=${today}`, "/haq/failed-txn", "/haq/frozen-money"]) {
      await page.goto(`${BASE}${path}`);
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(w <= 320, `${path}: scrollWidth ${w}`);
    }
  }),
);

await check("होम पर /haq का link", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/`);
    assert((await page.locator('main a[href="/haq"]').count()) > 0, "/haq link नहीं");
  }),
);

await browser.close();
process.exit(failed ? 1 : 0);
