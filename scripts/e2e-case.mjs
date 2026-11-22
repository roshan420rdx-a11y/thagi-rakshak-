// "मेरा केस" (फ़ोन वाला) की असली browser में जाँच: सेव होकर reload पर बचे, भरते समय कोई network request नहीं,
// "सब मिटाएँ" से सच में मिटे, JS बंद पर साफ़ संदेश। चलाने से पहले: npm run build && npm start
import { BASE, PHONE, today, check, assert, withPage, finish } from "./e2e-lib.mjs";

const KEY = "thagi-rakshak:mera-case:v1";
const minusDays = (n) => {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

async function open(page) {
  await page.goto(`${BASE}/case`);
  await page.getByRole("heading", { name: "मेरी शिकायतें" }).waitFor();
}

await check("भरी जानकारी फ़ोन में सेव, reload पर वापस; अगला कदम आगे बढ़े", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.getByLabel("ठगी किस तारीख़ को हुई?").fill(minusDays(2));
    await page.getByLabel("कुल कितने पैसे गए? (₹)").fill("40,000");
    const s1930 = page.locator('[data-stage="call_1930"]');
    await s1930.getByLabel("कब की?").fill(minusDays(2));
    await s1930.getByLabel("शिकायत नंबर (हो तो)").fill("NCRP-ABC-123");
    await page.getByText("फ़ोन में सेव हो गया").waitFor();
    await page.reload();
    await page.getByRole("heading", { name: "मेरी शिकायतें" }).waitFor();
    assert((await page.getByLabel("कुल कितने पैसे गए? (₹)").inputValue()) === "40000", "रकम नहीं बची");
    assert((await s1930.getByLabel("शिकायत नंबर (हो तो)").inputValue()) === "NCRP-ABC-123", "नंबर नहीं बचा");
    await s1930.getByText("✓ हो गया").waitFor();
    await page.getByRole("heading", { name: /अगला कदम: cybercrime\.gov\.in/ }).waitFor();
  }),
);

await check("भरते समय कोई network request नहीं (सब फ़ोन में ही)", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.waitForLoadState("networkidle");
    const requests = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.getByLabel("ठगी किस तारीख़ को हुई?").fill(minusDays(3));
    await page.locator('[data-stage="bank"]').getByLabel("शिकायत नंबर (हो तो)").fill("BANK-778");
    await page.waitForTimeout(800);
    assert(requests.length === 0, `requests: ${requests.slice(0, 3).join(", ")}`);
  }),
);

await check("बैंक की तारीख़ भरने पर आगे की तारीख़ों में RBI Ombudsman", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.getByLabel("ठगी किस तारीख़ को हुई?").fill(minusDays(3));
    await page.getByLabel("कुल कितने पैसे गए? (₹)").fill("5000");
    await page.locator('[data-stage="bank"]').getByLabel("कब की?").fill(minusDays(2));
    await page.getByText("RBI Ombudsman की आख़िरी तारीख़", { exact: false }).waitFor();
  }),
);

await check("'सब मिटाएँ' → 'हाँ, सब मिटाएँ': डिब्बे ख़ाली और फ़ोन से key हटी", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.getByLabel("कुल कितने पैसे गए? (₹)").fill("1234");
    await page.getByText("फ़ोन में सेव हो गया").waitFor();
    await page.getByRole("button", { name: "सब मिटाएँ", exact: true }).click();
    await page.getByRole("button", { name: "हाँ, सब मिटाएँ" }).click();
    await page.getByText("सब मिटा दिया गया").waitFor();
    assert((await page.getByLabel("कुल कितने पैसे गए? (₹)").inputValue()) === "", "रकम नहीं मिटी");
    assert((await page.evaluate((k) => localStorage.getItem(k), KEY)) === null, "फ़ोन में data बचा");
  }),
);

await check("JS बंद: साफ़ संदेश और शिकायत के रास्ते का link", () =>
  withPage({ javaScriptEnabled: false, viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/case`);
    // Playwright का "JS बंद" <noscript> को screen पर नहीं दिखाता (असली browser दिखाता है), इसलिए HTML में देखें
    const noscript = await page.locator("noscript").evaluateAll((els) => els.map((e) => e.textContent ?? "").join(" "));
    assert(noscript.includes("यह सुविधा JavaScript से चलती है"), "noscript संदेश नहीं");
    assert((await page.locator('main a[href="/shikayat-rasta"]').count()) > 0, "रास्ते का link नहीं");
  }),
);

await check("320px: बगल में scroll नहीं", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page) => {
    await open(page);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(w <= 320, `scrollWidth ${w}`);
  }),
);

await finish();
