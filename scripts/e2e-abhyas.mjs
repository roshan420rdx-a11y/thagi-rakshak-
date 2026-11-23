// "ठगी या असली?" अभ्यास (/abhyas) की असली browser में जाँच। चलाने से पहले: npm run build && npm start
import { BASE, PHONE, check, assert, withPage, watchRequests, installSpeechStub, finish } from "./e2e-lib.mjs";

const Q = "#abhyas-q";

async function open(page) {
  await page.goto(`${BASE}/abhyas`);
  await page.locator(Q).waitFor();
}

// सवाल i पर: even i → सही जवाब, odd i → ग़लत जवाब। लौटाता है: कितने सही
async function playRound(page) {
  let right = 0;
  for (let i = 0; i < 8; i++) {
    await page.getByText(`सवाल ${i + 1} / 8`).waitFor();
    const scam = (await page.locator(Q).getAttribute("data-scam")) === "true";
    const sayScam = i % 2 === 0 ? scam : !scam;
    await page.getByRole("button", { name: sayScam ? "ठगी है" : "असली लगता है" }).click();
    const title = await page.locator("#abhyas-feedback").innerText();
    const correct = sayScam === scam;
    if (correct) right++;
    assert(title.startsWith("सही!") === correct, `सवाल ${i + 1}: नतीजा "${title}"`);
    if (scam) assert((await page.locator("[data-sign]").count()) > 0, `सवाल ${i + 1}: ठगी के निशान नहीं`);
    assert(await page.locator("#abhyas-feedback").evaluate((el) => el === document.activeElement), `सवाल ${i + 1}: नतीजे पर focus नहीं`);
    await page.getByRole("button", { name: i < 7 ? "अगला सवाल →" : "नतीजा देखें →" }).click();
  }
  return right;
}

await check("पूरा round: हर जवाब पर नतीजा और निशान, आख़िर में सही गिनती और छूटे हुए; कोई request नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.waitForLoadState("networkidle");
    const requests = watchRequests(page);
    const right = await playRound(page);
    assert(right === 4, `सही ${right}`);
    await page.getByRole("heading", { name: "आपने 8 में से 4 पहचाने" }).waitFor();
    assert((await page.locator("[data-missed]").count()) === 4, "छूटे हुए 4 नहीं");
    await page.getByText("3 बातें हमेशा याद रखें").waitFor();
    assert(requests.length === 0, `requests: ${requests.slice(0, 3).join(", ")}`);
  }),
);

await check("'फिर से': नया round, सवाल 1 / 8; 'परिवार को भेजें' में सिर्फ़ नतीजा और पन्ने का पता", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await playRound(page);
    const share = await page.getByRole("link", { name: /परिवार को भेजें/ }).getAttribute("href");
    assert(share?.startsWith("https://wa.me/?text="), `share: ${share}`);
    const text = decodeURIComponent(share.slice("https://wa.me/?text=".length));
    assert(text.includes("8 में से 4") && text.includes("/abhyas"), `share text: ${text}`);
    await page.getByRole("button", { name: /फिर से अभ्यास करें/ }).click();
    await page.getByText("सवाल 1 / 8").waitFor();
  }),
);

await check("सुनें: पहले message, जवाब के बाद नतीजा और कारण (Hindi आवाज़ में)", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await installSpeechStub(context);
    await open(page);
    const msg = await page.locator(`${Q} blockquote`).innerText();
    await page.getByRole("button", { name: "सुनें" }).click();
    let spoken = await page.evaluate(() => window.__spoken);
    assert(spoken.length === 1 && spoken[0].text.includes(msg.slice(0, 20)), `message नहीं बोला: ${JSON.stringify(spoken).slice(0, 90)}`);
    await page.getByRole("button", { name: "ठगी है" }).click();
    // पहला बटन अब "रोकें" है (नकली आवाज़ कभी ख़त्म नहीं होती); नतीजे वाला अपना "सुनें"
    const fbListen = page.locator("#abhyas-fb-box + button", { hasText: "सुनें" });
    await fbListen.waitFor();
    await fbListen.click();
    spoken = await page.evaluate(() => window.__spoken);
    const fb = await page.locator("#abhyas-feedback").innerText();
    assert(spoken.length === 2 && spoken[1].text.includes(fb), `नतीजा नहीं बोला: ${JSON.stringify(spoken[1] ?? {}).slice(0, 90)}`);
  }),
);

await check("JS बंद: साफ़ संदेश और ज्ञानकोश का link", () =>
  withPage({ javaScriptEnabled: false, viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/abhyas`);
    const ns = await page.locator("noscript").first().textContent();
    assert(ns?.includes("JavaScript"), `noscript: ${ns}`);
    assert((await page.locator('main a[href="/gyan"]').count()) > 0, "ज्ञानकोश link नहीं");
  }),
);

await check("320px, सबसे बड़े अक्षर: सवाल और नतीजे पर बगल में scroll नहीं", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page, context) => {
    await context.addInitScript(() => localStorage.setItem("thagi-rakshak:akshar:v1", "3"));
    await open(page);
    let w = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(w <= 320, `सवाल: scrollWidth ${w}`);
    await page.getByRole("button", { name: "ठगी है" }).click();
    w = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(w <= 320, `नतीजा: scrollWidth ${w}`);
  }),
);

await check("offline: internet बंद होने पर भी अभ्यास खुले और चले", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await page.goto(`${BASE}/`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.goto(`${BASE}/abhyas`);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.reload();
    await page.locator(Q).waitFor();
    await page.getByRole("button", { name: "ठगी है" }).click();
    await page.locator("#abhyas-feedback").waitFor();
  }),
);

await check("होम, /pucho और /gyan से अभ्यास का link", () =>
  withPage({ viewport: PHONE }, async (page) => {
    for (const p of ["/", "/pucho", "/gyan"]) {
      await page.goto(`${BASE}${p}`);
      assert((await page.locator('main a[href="/abhyas"]').count()) > 0, `${p} पर /abhyas link नहीं`);
    }
  }),
);

await finish();
