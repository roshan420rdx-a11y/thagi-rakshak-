// होम, menu, /pucho, /bharosa की असली browser में जाँच। चलाने से पहले: npm run build && npm start
import { BASE, PHONE, browser, check, assert, withPage, finish } from "./e2e-lib.mjs";

const MENU = 'nav[aria-label="मुख्य menu"]';

await check("होम: दोनों दरवाज़े और फ़ोन पर नीचे का menu", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/`);
    await page.getByText("मेरे साथ ठगी हो गई").waitFor();
    await page.getByText("यह call या message ठगी है?").waitFor();
    assert(await page.locator(MENU).isVisible(), "नीचे का menu नहीं दिखा");
  }),
);

await check("होम: पहली screen पर ही '1930 मिलाएँ' (बिना scroll के, नीचे के menu के ऊपर)", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/`);
    const call = page.locator('main a[href="tel:1930"]');
    await call.waitFor();
    const box = await call.boundingBox();
    const menu = await page.locator(MENU).boundingBox();
    assert(box && menu && box.y + box.height <= menu.y, `1930 पहली screen पर नहीं (y=${box && Math.round(box.y)})`);
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

await check("/pucho: 8 निशान", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/pucho`);
    assert((await page.locator("main ol[data-signs] > li").count()) === 8, "8 li नहीं");
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

await check("/shikayat-rasta: पाँच पड़ाव क्रम से, RBI का मूल text link", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/shikayat-rasta`);
    const titles = await page.locator("#shikayat-steps h2").allInnerTexts();
    assert(titles.length === 5, `${titles.length} पड़ाव`);
    assert(titles[0].includes("1930") && titles[4].includes("RBI Ombudsman"), `क्रम: ${titles.join(" | ")}`);
    assert((await page.locator('a[href^="https://www.rbi.org.in/commonman/"]').count()) > 0, "RBI मूल text link नहीं");
  }),
);

await check("बैंक का नमूना email: खोलें, 'Copy करें' दबाएँ, clipboard में वही text", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
    await page.goto(`${BASE}/shikayat-rasta`);
    await page.getByText("नमूना email (हिंदी)").click();
    await page.getByRole("button", { name: "Copy करें" }).first().click();
    await page.getByRole("button", { name: "Copy हो गया ✓" }).waitFor();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    assert(clip.includes("लेन-देन नंबर (UTR)") && clip.includes("[UTR नंबर]"), `clipboard: ${clip.slice(0, 60)}`);
  }),
);

await check("offline: /turant/upi के 'लिखित शिकायत' कदम से 'शिकायत का पूरा रास्ता' खुले", async () => {
  await withPage({ viewport: PHONE }, async (page, context) => {
    await page.goto(`${BASE}/turant/upi`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.getByRole("link", { name: "शिकायत का पूरा रास्ता देखें" }).click();
    await page.getByRole("heading", { name: "ठगी की शिकायत: पूरा रास्ता" }).waitFor();
  });
});

await check("अ+: अक्षर बड़े हों, पसंद reload और दूसरे पन्ने पर भी रहे, तीसरी बार के बाद वापस सामान्य", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/`);
    const btn = page.getByRole("button", { name: /अ\+/ });
    await btn.click();
    assert((await page.evaluate(() => document.documentElement.dataset.akshar)) === "2", "स्तर 2 नहीं लगा");
    await page.goto(`${BASE}/turant/upi`);
    // पन्ना दिखने से पहले वाली script: JS के बाकी हिस्से से पहले ही लगे
    assert((await page.evaluate(() => document.documentElement.dataset.akshar)) === "2", "दूसरे पन्ने पर स्तर नहीं रहा");
    await page.getByRole("button", { name: /अ\+/ }).click();
    await page.getByRole("button", { name: /अ\+/ }).click();
    assert((await page.evaluate(() => document.documentElement.dataset.akshar)) === undefined, "वापस सामान्य नहीं हुआ");
    assert((await page.evaluate(() => localStorage.getItem("thagi-rakshak:akshar:v1"))) === null, "storage नहीं हटी");
  }),
);

await check("सबसे बड़े अक्षर (स्तर 3) पर 320px: sitemap के सारे पन्नों पर बगल में scroll नहीं", async () => {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  await withPage({ viewport: { width: 320, height: 640 } }, async (page, context) => {
    await context.addInitScript(() => localStorage.setItem("thagi-rakshak:akshar:v1", "3"));
    for (const path of paths) {
      await page.goto(`${BASE}${path}`);
      const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      assert(sw <= cw, `${path}: ${sw} > ${cw}`);
    }
  });
});

await check("होम: 'और मदद' के 8 tiles और 'साइट अपने लोगों को भेजें' (बिना नंबर वाला WhatsApp link)", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/`);
    await page.getByRole("heading", { name: "और मदद" }).waitFor();
    for (const h of ["/case", "/arzi", "/shikayat-rasta", "/haq", "/gyan/bank", "/gyan", "/abhyas", "/poster"]) assert((await page.locator(`main a[href="${h}"]`).count()) > 0, `${h} tile नहीं`);
    const share = await page.getByRole("link", { name: /यह साइट अपने लोगों को भेजें/ }).getAttribute("href");
    assert(share?.startsWith("https://wa.me/?text="), `share: ${share}`);
  }),
);

await check("install: Chrome के हिसाब से कोई installability error नहीं; मौका मिलने पर बटन, दबाने पर install पूछे", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await page.goto(`${BASE}/`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const cdp = await context.newCDPSession(page);
    const { installabilityErrors } = await cdp.send("Page.getInstallabilityErrors");
    assert(installabilityErrors.length === 0, JSON.stringify(installabilityErrors));
    await page.evaluate(() => {
      const e = new Event("beforeinstallprompt", { cancelable: true });
      e.prompt = () => {
        window.__prompted = true;
        return Promise.resolve();
      };
      window.dispatchEvent(e);
    });
    await page.getByRole("button", { name: /home screen पर जोड़ें/ }).click();
    assert(await page.evaluate(() => window.__prompted === true), "install नहीं पूछा");
  }),
);

await check("sitemap, robots, manifest, icon", async () => {
  const sm = await fetch(`${BASE}/sitemap.xml`);
  const smText = await sm.text();
  assert(sm.status === 200 && smText.includes("/gyan/digital-arrest") && smText.includes("/legal/privacy"), "sitemap अधूरा");
  const rb = await (await fetch(`${BASE}/robots.txt`)).text();
  assert(/Sitemap: .*\/sitemap\.xml/.test(rb), "robots में sitemap नहीं");
  const mf = await (await fetch(`${BASE}/manifest.webmanifest`)).json();
  assert(mf.name === "ठगी रक्षक" && mf.lang === "hi", "manifest ग़लत");
  const ic = await fetch(`${BASE}/icon.svg`);
  assert(ic.status === 200, `icon status ${ic.status}`);
});

await finish();
