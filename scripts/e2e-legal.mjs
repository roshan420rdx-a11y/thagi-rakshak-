// legal पन्नों की जाँच, और निजता (privacy) पन्ने में लिखे दावों का सबूत:
// (1) किसी पन्ने पर cookie नहीं लगती, (2) हर request अपनी ही साइट पर जाती है (कोई बाहरी script/tracker नहीं)।
// साइट में ऐसा कुछ जुड़े जो ये तोड़े, तो पहले /legal/privacy बदलें, फिर यह जाँच।
import { BASE, today, check, assert, withPage, finish } from "./e2e-lib.mjs";

const ORIGIN = new URL(BASE).origin;

await check("तीनों legal पन्ने खुलें, मसौदे वाली चेतावनी के साथ", () =>
  withPage({}, async (page) => {
    for (const path of ["/legal", "/legal/privacy", "/legal/terms", "/legal/shikayat"]) {
      const res = await page.goto(`${BASE}${path}`);
      assert(res?.status() === 200, `${path}: status ${res?.status()}`);
      await page.getByText("यह मसौदा है: वकील की जाँच अभी बाकी है।", { exact: false }).first().waitFor();
    }
  }),
);

await check("शिकायत पन्ने पर 1930 वाली चेतावनी", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/legal/shikayat`);
    await page.getByText("ठगी की शिकायत यहाँ नहीं होती।", { exact: false }).waitFor();
    assert((await page.locator('main a[href="/turant"]').count()) > 0, "/turant link नहीं");
  }),
);

await check("निजता का सबूत: कोई cookie नहीं, हर request अपनी ही साइट पर", () =>
  withPage({}, async (page, context) => {
    const outside = [];
    const cookieHeaders = [];
    page.on("request", (r) => {
      const u = r.url();
      if (!u.startsWith("data:") && !u.startsWith("blob:") && new URL(u).origin !== ORIGIN) outside.push(u);
    });
    page.on("response", async (r) => {
      const h = await r.allHeaders();
      if (h["set-cookie"]) cookieHeaders.push(r.url());
    });
    const paths = [
      "/",
      "/turant/upi",
      `/haq/thagi?txn=${today}&loss=40000&shared=yes&r1930=${today}&rbank=${today}`,
      "/haq/failed-txn",
      "/gyan/digital-arrest",
      "/gyan/bank/hdfc",
      "/pucho",
      "/shikayat-rasta",
      "/case",
      "/arzi",
      "/legal/privacy",
    ];
    for (const path of paths) {
      await page.goto(`${BASE}${path}`);
      await page.waitForLoadState("networkidle");
    }
    assert(outside.length === 0, `बाहरी requests: ${outside.slice(0, 3).join(", ")}`);
    assert(cookieHeaders.length === 0, `set-cookie: ${cookieHeaders.slice(0, 3).join(", ")}`);
    assert((await context.cookies()).length === 0, "browser में cookie मिली");
    assert((await page.evaluate(() => document.cookie)) === "", "document.cookie ख़ाली नहीं");
  }),
);

await check('निजता पन्ने में "पहले पूछो" वाला हिस्सा', () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/legal/privacy`);
    await page.getByRole("heading", { name: '"पहले पूछो" में चिपकाया message' }).waitFor();
    await page.getByText("आपके फ़ोन के browser में ही जाँचा जाता है", { exact: false }).waitFor();
    await page.getByRole("heading", { name: '"सुनें" बटन' }).waitFor();
    await page.getByRole("heading", { name: '"मेरा केस" में भरी जानकारी' }).waitFor();
    await page.getByRole("heading", { name: "WhatsApp पर बात" }).waitFor();
    await page.getByText("“मेरा केस” और “अर्ज़ियाँ” internet बंद होने पर भी खुलें", { exact: false }).waitFor();
  }),
);

await check("320px: legal पन्नों पर बगल में scroll नहीं", () =>
  withPage({ viewport: { width: 320, height: 640 } }, async (page) => {
    for (const path of ["/legal", "/legal/privacy", "/legal/terms", "/legal/shikayat"]) {
      await page.goto(`${BASE}${path}`);
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(w <= 320, `${path}: scrollWidth ${w}`);
    }
  }),
);

await check("footer से legal पन्ने", () =>
  withPage({}, async (page) => {
    await page.goto(`${BASE}/`);
    for (const href of ["/legal/privacy", "/legal/terms", "/legal/shikayat"])
      assert((await page.locator(`footer a[href="${href}"]`).count()) === 1, `footer में ${href} नहीं`);
  }),
);

await finish();
