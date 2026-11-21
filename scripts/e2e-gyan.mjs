// ज्ञानकोश (/gyan) की असली browser में जाँच। चलाने से पहले: npm run build && npm start
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PAGES = [
  ["digital-arrest", "digital-arrest"],
  ["customer-care-fake", "customer-care-fake"],
  ["upi-pin-qr", "upi"],
  ["task-investment", "investment-task"],
  ["apk-file", "customer-care-fake"],
  ["bijli-bill", "customer-care-fake"],
  ["lottery-inaam", "upi"],
  ["sextortion", "sextortion"],
  ["loan-app", "loan-app"],
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

await check("/gyan: सारे 9 पन्नों के links", () =>
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

await check("320px: ज्ञानकोश के 10 पन्नों पर बगल में scroll नहीं", () =>
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

await check("/turant/sextortion और /turant/loan-app से नए पन्नों के links", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/turant/sextortion`);
    assert((await page.locator('a[href="/gyan/sextortion"]').count()) > 0, "sextortion link नहीं");
    await page.goto(`${BASE}/turant/loan-app`);
    assert((await page.locator('a[href="/gyan/loan-app"]').count()) > 0, "loan-app link नहीं");
  }),
);

await check("/pucho: बिजली वाले message के नतीजे से /gyan/bijli-bill", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/pucho`);
    await page.getByLabel("संदिग्ध message यहाँ चिपकाएँ").fill("आज रात 9:30 बजे आपकी बिजली काट दी जाएगी, तुरंत 98XXXXXX21 पर संपर्क करें");
    await page.getByRole("button", { name: "जाँचें" }).click();
    await page.locator('section[aria-label="जाँच का नतीजा"] a[href="/gyan/bijli-bill"]').waitFor();
  }),
);

await check("सुनें: सार, निशान और नियम हिंदी आवाज़ में (FAQ नहीं)", async () => {
  const context = await browser.newContext();
  // आवाज़ वाला हिस्सा नकली: जो बोला जाता, उसे पकड़ लें
  await context.addInitScript(() => {
    window.__spoken = [];
    // नकली utterance: असली वाला नकली voice object नहीं लेता
    window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: (u) => window.__spoken.push({ text: u.text, lang: u.lang, voice: u.voice?.name }),
        cancel: () => {},
        getVoices: () => [{ lang: "en-IN", name: "English", localService: true }, { lang: "hi-IN", name: "Hindi", localService: true }],
        addEventListener: () => {},
        removeEventListener: () => {},
      },
    });
  });
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/gyan/digital-arrest`);
    await page.getByRole("button", { name: "सुनें" }).click();
    const spoken = await page.evaluate(() => window.__spoken);
    assert(spoken.length === 1 && spoken[0].lang === "hi-IN" && spoken[0].voice === "Hindi", `spoken: ${JSON.stringify(spoken).slice(0, 80)}`);
    for (const part of ["30 सेकंड में", "पहचान के 5 निशान", "बचने के 3 नियम"]) assert(spoken[0].text.includes(part), `${part} नहीं बोला`);
    assert(!spoken[0].text.includes("अक्सर पूछे सवाल"), "FAQ भी बोला");
  } finally {
    await context.close();
  }
});

await check("सुनें: Hindi आवाज़ न हो तो बटन नहीं; आवाज़ देर से आए तो बटन आ जाए", async () => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const listeners = [];
    window.__voices = [{ lang: "en-US", name: "English", localService: true }];
    window.__fireVoices = () => listeners.forEach((f) => f());
    // नकली utterance: असली वाला नकली voice object नहीं लेता
    window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: () => {},
        cancel: () => {},
        getVoices: () => window.__voices,
        addEventListener: (_e, f) => listeners.push(f),
        removeEventListener: () => {},
      },
    });
  });
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/gyan/digital-arrest`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.waitForTimeout(300);
    assert((await page.getByRole("button", { name: "सुनें" }).count()) === 0, "Hindi आवाज़ के बिना बटन दिखा");
    await page.evaluate(() => {
      window.__voices.push({ lang: "hi-IN", name: "Hindi", localService: true });
      window.__fireVoices();
    });
    await page.getByRole("button", { name: "सुनें" }).waitFor();
  } finally {
    await context.close();
  }
});

await check("फ़ोन पर नियमों के नंबर ('1.') एक ही लाइन में, टूटें नहीं", () =>
  withPage({ viewport: { width: 360, height: 740 } }, async (page) => {
    await page.goto(`${BASE}/gyan/digital-arrest`);
    // नंबर वाले text की लाइनें गिनें (ऊँचाई नहीं, क्योंकि flex उसे पंक्ति जितना खींच देता है)
    for (const li of await page.locator("[data-rule]").all()) {
      const lines = await li.locator("span").first().evaluate((sp) => {
        const r = document.createRange();
        r.selectNodeContents(sp);
        return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size;
      });
      assert(lines === 1, `नंबर ${lines} लाइनों में टूटा`);
    }
  }),
);

await browser.close();
process.exit(failed ? 1 : 0);
