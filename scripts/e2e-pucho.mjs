// "पहले पूछो" की असली browser में जाँच। चलाने से पहले: npm run build && npm start
// सबसे ज़रूरी दावा (निजता पन्ने में लिखा): जाँच के समय message कहीं नहीं जाता (कोई network request नहीं), न URL में, न storage में।
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
    return await fn(page, context);
  } finally {
    await context.close();
  }
}

const BOX = "संदिग्ध message यहाँ चिपकाएँ";
const TOKEN = "Zebra7781";
const SCAM = `${TOKEN}: मैंने आपको ₹5,000 की request भेजी है, बस PIN डालकर accept कर लीजिए`;
const BANK_OTP = "123456 is your OTP for login. Do not share it with anyone. -SBI";

async function openBox(page) {
  await page.goto(`${BASE}/pucho`);
  await page.getByLabel(BOX).waitFor();
}

async function checkText(page, text) {
  await page.getByLabel(BOX).fill(text);
  await page.getByRole("button", { name: "जाँचें" }).click();
}

await check("ठगी वाला message: 🔴 पक्के निशान, कारण, और /turant/upi", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await checkText(page, SCAM);
    await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor();
    await page.getByText("पैसे पाने के लिए PIN डालने को कहना").waitFor();
    assert((await page.locator('a[href="/turant/upi"]').count()) === 1, "/turant/upi का बटन नहीं");
  }),
);

await check("जाँच के समय कोई network request नहीं, message न URL में न storage में", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await page.waitForLoadState("networkidle");
    const requests = [];
    page.on("request", (r) => requests.push(r.url()));
    await checkText(page, SCAM);
    await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor();
    await page.waitForTimeout(800);
    assert(requests.length === 0, `requests: ${requests.slice(0, 3).join(", ")}`);
    assert(!page.url().includes(TOKEN) && !page.url().includes("?"), `URL: ${page.url()}`);
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }) + document.cookie);
    assert(!stored.includes(TOKEN), "message storage में मिला");
  }),
);

await check("परिवार को भेजें: WhatsApp link में सिर्फ़ नतीजा, message नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await checkText(page, SCAM);
    const href = await page.getByRole("link", { name: /परिवार को भेजें/ }).getAttribute("href");
    assert(href?.startsWith("https://wa.me/?text="), `href: ${href}`);
    const shared = decodeURIComponent(href.split("text=")[1]);
    assert(!shared.includes(TOKEN) && !shared.includes("5,000"), "share में message का हिस्सा");
    assert(shared.includes("ठगी के पक्के निशान"), "share में नतीजा नहीं");
  }),
);

await check("बैंक का असली OTP SMS: 'आम निशान नहीं मिले', 'सुरक्षित' कहीं नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await checkText(page, BANK_OTP);
    await page.getByRole("heading", { name: "आम निशान नहीं मिले" }).waitFor();
    const result = await page.getByRole("region", { name: "जाँच का नतीजा" }).innerText();
    assert(!result.includes("सुरक्षित"), "नतीजे में 'सुरक्षित'");
    assert((await page.getByRole("link", { name: /परिवार को भेजें/ }).count()) === 0, "no_signals पर share बटन");
  }),
);

await check("message बदलते ही पुराना नतीजा हटे, और 'मिटाएँ' से box ख़ाली", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await checkText(page, SCAM);
    await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor();
    await page.getByLabel(BOX).fill("कल शाम मिलते हैं");
    assert((await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).count()) === 0, "पुराना नतीजा रह गया");
    await page.getByRole("button", { name: "मिटाएँ" }).click();
    assert((await page.getByLabel(BOX).inputValue()) === "", "box ख़ाली नहीं हुआ");
  }),
);

await check("link वाला message: असली पता और .bank.in चेतावनी दिखे, share में पता नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await checkText(page, "Your account will be blocked today, update KYC: http://sbi-yono-kyc.xyz/login");
    await page.getByRole("heading", { name: "message में मिले पते" }).waitFor();
    await page.getByText("sbi-yono-kyc.xyz", { exact: false }).first().waitFor();
    await page.getByText("बैंक के नाम वाला पता, पर .bank.in नहीं").waitFor();
    // ".bank.in" बीच से न टूटे (पहले "पर ." और "bank.in" अलग लाइनों में थे)
    const lines = await page.getByText("बैंक का नाम है, पर पता .bank.in पर नहीं").evaluate((el) => {
      const text = el.firstChild;
      const i = text.textContent.indexOf(".bank.in");
      const r = document.createRange();
      r.setStart(text, i);
      r.setEnd(text, i + ".bank.in".length);
      return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size;
    });
    assert(lines === 1, `.bank.in ${lines} लाइनों में टूटा`);
    const href = await page.getByRole("link", { name: /परिवार को भेजें/ }).getAttribute("href");
    assert(!decodeURIComponent(href).includes("sbi-yono"), "share में पता गया");
  }),
);

await check("सुनें: नतीजा और कारण बोले, message का पता नहीं", async () => {
  const context = await browser.newContext({ viewport: PHONE });
  await context.addInitScript(() => {
    window.__spoken = [];
    // नकली utterance: असली वाला नकली voice object नहीं लेता
    window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: (u) => window.__spoken.push(u.text),
        cancel: () => {},
        getVoices: () => [{ lang: "hi-IN", name: "Hindi", localService: true }],
        addEventListener: () => {},
        removeEventListener: () => {},
      },
    });
  });
  const page = await context.newPage();
  try {
    await openBox(page);
    await checkText(page, "Your account will be blocked today, update KYC: http://sbi-yono-kyc.xyz/login");
    await page.getByRole("region", { name: "जाँच का नतीजा" }).getByRole("button", { name: "सुनें" }).click();
    const spoken = (await page.evaluate(() => window.__spoken)).join(" ");
    // KYC + .bank.in नहीं + link = 3 शक वाले निशान → "पक्के निशान"
    assert(spoken.includes("ठगी के पक्के निशान") && spoken.includes("कई शक वाले निशान एक साथ") && spoken.includes("KYC या खाता बंद होने का डर"), `spoken: ${spoken.slice(0, 80)}`);
    assert(!spoken.includes("sbi-yono"), "message का पता आवाज़ में गया");
  } finally {
    await context.close();
  }
});

await check("offline: internet बंद होने पर भी 'पहले पूछो' खुले और जाँच करे", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await page.goto(`${BASE}/`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.goto(`${BASE}/pucho`);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.reload();
    await checkText(page, SCAM);
    await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor();
  }),
);

await check("JS बंद: box नहीं, 7 आम निशान अब भी", () =>
  withPage({ javaScriptEnabled: false, viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/pucho`);
    assert((await page.locator("textarea").count()) === 0, "बिना JS के textarea दिखा");
    assert((await page.locator("main ol > li").count()) === 7, "7 निशान नहीं");
  }),
);

await check("320px: नतीजे के साथ भी बगल में scroll नहीं", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page) => {
    await openBox(page);
    await checkText(page, `${SCAM} http://bit.ly/abc123 तुरंत AnyDesk डालें`);
    await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor();
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(w <= 320, `scrollWidth ${w}`);
  }),
);

await browser.close();
process.exit(failed ? 1 : 0);
