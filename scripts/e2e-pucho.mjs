// "पहले पूछो" की असली browser में जाँच। चलाने से पहले: npm run build && npm start
// सबसे ज़रूरी दावा (निजता पन्ने में लिखा): जाँच के समय message कहीं नहीं जाता (कोई network request नहीं), न URL में, न storage में।
import { execSync } from "node:child_process";
import { BASE, PHONE, browser, check, assert, withPage, watchRequests, installSpeechStub, finish } from "./e2e-lib.mjs";

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
  await page.getByRole("button", { name: "जाँचें", exact: true }).click();
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

await check("सुनें: नतीजा और कारण बोले, message का पता नहीं", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await installSpeechStub(context);
    await openBox(page);
    await checkText(page, "Your account will be blocked today, update KYC: http://sbi-yono-kyc.xyz/login");
    await page.getByRole("region", { name: "जाँच का नतीजा" }).getByRole("button", { name: "सुनें" }).click();
    const spoken = (await page.evaluate(() => window.__spoken)).map((s) => s.text).join(" ");
    // link से KYC update = सीधा पक्का निशान (2026-11-23 से; पहले तीन शक मिलकर), साथ में KYC का डर
    assert(spoken.includes("ठगी के पक्के निशान") && spoken.includes("link खोलकर") && spoken.includes("KYC या खाता बंद होने का डर"), `spoken: ${spoken.slice(0, 80)}`);
    assert(!spoken.includes("sbi-yono"), "message का पता आवाज़ में गया");
  }),
);

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

await check("'message copy करना नहीं आता?' खोलने पर copy-paste के कदम और call वालों के लिए बात", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await page.getByText("message copy करना नहीं आता, या call आई थी?").click();
    await page.getByText("उँगली 1-2 सेकंड दबाकर रखें", { exact: false }).waitFor();
    await page.getByText("call आई थी? तो जो कहा गया", { exact: false }).waitFor();
  }),
);

await check("JS बंद: box नहीं, 8 आम निशान अब भी", () =>
  withPage({ javaScriptEnabled: false, viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/pucho`);
    assert((await page.locator("textarea").count()) === 0, "बिना JS के textarea दिखा");
    assert((await page.locator("main ol[data-signs] > li").count()) === 8, "8 निशान नहीं");
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

await check("चिपकाएँ: copy किया message एक tap में डिब्बे में और तुरंत जाँच, कोई request नहीं", () =>
  withPage({ viewport: PHONE, permissions: ["clipboard-read", "clipboard-write"] }, async (page) => {
    await openBox(page);
    await page.waitForLoadState("networkidle");
    await page.evaluate((t) => navigator.clipboard.writeText(t), SCAM);
    const requests = watchRequests(page, [TOKEN]);
    await page.getByRole("button", { name: "copy किया message चिपकाएँ और जाँचें" }).click();
    await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor();
    assert((await page.getByLabel(BOX).inputValue()) === SCAM, "डिब्बे में message नहीं आया");
    await page.waitForTimeout(500);
    assert(requests.length === 0, `requests: ${requests.slice(0, 3).join(", ")}`);
  }),
);

await check("चिपकाएँ: clipboard ख़ाली हो तो हाथ से copy-paste करने की बात, कोई नतीजा नहीं", () =>
  withPage({ viewport: PHONE, permissions: ["clipboard-read", "clipboard-write"] }, async (page) => {
    await openBox(page);
    await page.evaluate(() => navigator.clipboard.writeText(""));
    await page.getByRole("button", { name: "copy किया message चिपकाएँ और जाँचें" }).click();
    await page.getByText("अभी कोई copy किया हुआ message नहीं मिला", { exact: false }).waitFor();
    assert((await page.getByRole("region", { name: "जाँच का नतीजा" }).count()) === 0, "ख़ाली clipboard पर नतीजा दिखा");
    await page.getByLabel(BOX).fill("नमस्ते");
    assert((await page.getByText("अभी कोई copy किया हुआ message नहीं मिला", { exact: false }).count()) === 0, "लिखने पर भी पुरानी बात बची रही");
  }),
);

// Share → "ठगी रक्षक": Android का share POST की तरह आता है। यहाँ वही form POST बनाकर भेजते हैं।
async function shareLikeAndroid(page, msg) {
  await page.evaluate((m) => {
    const f = document.createElement("form");
    f.method = "post";
    f.action = "/pucho/share";
    f.enctype = "multipart/form-data";
    const t = document.createElement("textarea");
    t.name = "text";
    t.value = m;
    f.append(t);
    document.body.append(f);
    f.submit();
  }, msg);
}

await check("Share से सीधे जाँच: message फ़ोन के अंदर ही (service worker), सीधे नतीजा; न network पर, न URL में, न बाद में बचा", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const shareResponses = [];
    page.on("response", (r) => {
      if (r.url().endsWith("/pucho/share")) shareResponses.push(r);
    });
    await shareLikeAndroid(page, SCAM);
    await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor();
    assert((await page.getByLabel(BOX).inputValue()) === SCAM, "डिब्बे में share किया message नहीं");
    assert(new URL(page.url()).search === "" && !page.url().includes(TOKEN), `URL: ${page.url()}`);
    assert(shareResponses.length > 0 && shareResponses.every((r) => r.fromServiceWorker()), "share वाला POST network (server) तक गया");
    const left = await page.evaluate(async () => !!(await (await caches.open("thagi-rakshak-share-v1")).match("/__share-inbox")));
    assert(!left, "message फ़ोन के डिब्बे में बचा रहा");
  }),
);

await check("Share: service worker न हो तो server message पढ़े बिना /pucho पर भेजे, और वहाँ हाथ से चिपकाने की बात", () =>
  withPage({ viewport: PHONE, serviceWorkers: "block" }, async (page) => {
    await openBox(page);
    await shareLikeAndroid(page, SCAM);
    await page.getByText("share किया message यहाँ नहीं पहुँचा", { exact: false }).waitFor();
    assert(new URL(page.url()).search === "", `URL: ${page.url()}`);
    assert((await page.getByLabel(BOX).inputValue()) === "", "डिब्बे में कुछ आ गया");
  }),
);

await check("पहले पूछो: install का मौका मिले तो 'ऐप जोड़ें, फिर Share करके जाँचें' बटन, दबाने पर install पूछे", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await openBox(page);
    await page.evaluate(() => {
      const e = new Event("beforeinstallprompt", { cancelable: true });
      e.prompt = () => {
        window.__prompted = true;
        return Promise.resolve();
      };
      window.dispatchEvent(e);
    });
    await page.getByRole("button", { name: /सीधे Share करके जाँचें/ }).click();
    assert(await page.evaluate(() => window.__prompted === true), "install नहीं पूछा");
  }),
);

// बोलकर लिखें: browser की आवाज़ से text वाली सुविधा (SpeechRecognition) का नकली रूप; वह जो "सुनता" है, window.__heard
async function installMicStub(context, heard) {
  await context.addInitScript((h) => {
    window.__micStarted = 0;
    class FakeRec {
      start() {
        window.__micStarted += 1;
        window.__micLang = this.lang;
        setTimeout(() => {
          this.onresult?.({ results: [[{ transcript: h }]], resultIndex: 0 });
          this.onend?.();
        }, 50);
      }
      stop() {
        this.onend?.();
      }
      abort() {}
    }
    // नए Chromium में बिना prefix वाला SpeechRecognition भी है; दोनों नकली
    window.SpeechRecognition = FakeRec;
    window.webkitSpeechRecognition = FakeRec;
  }, heard);
}

await check("बोलकर लिखें: mic बटन से बोली बात डिब्बे में (हिंदी), और तुरंत जाँच; आवाज़ वाली बात साफ़ लिखी", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    const said = "एनडेस्क ऐप से कोई व्यक्ति मेरे से पैसे मांग रहा है, ये बोल रहा है कोई जोखिम नहीं है";
    await installMicStub(context, said);
    await openBox(page);
    await page.getByText("आवाज़ से text आपका browser बनाता है", { exact: false }).waitFor();
    await page.getByRole("button", { name: "बोलकर लिखें" }).click();
    await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor();
    assert((await page.getByLabel(BOX).inputValue()) === said, "बोली बात डिब्बे में नहीं");
    assert((await page.evaluate(() => window.__micLang)) === "hi-IN", "भाषा हिंदी नहीं");
    // असली फ़ोन पर mic तभी चलेगा जब साइट का Permissions-Policy उसे रोके नहीं (2026-11-23 तक "microphone=()" रोक रहा था)
    const micAllowed = await page.evaluate(() => (document.permissionsPolicy ?? document.featurePolicy)?.allowsFeature("microphone"));
    assert(micAllowed === true, `Permissions-Policy mic रोक रहा है: ${micAllowed}`);
    await page.getByText("AnyDesk या TeamViewer जैसा ऐप डलवाना").waitFor();
  }),
);

await check("बोलकर लिखें: browser में यह सुविधा न हो तो mic बटन नहीं (बाकी सब वैसा ही)", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await context.addInitScript(() => {
      delete window.webkitSpeechRecognition;
      delete window.SpeechRecognition;
    });
    await openBox(page);
    assert((await page.getByRole("button", { name: "बोलकर लिखें" }).count()) === 0, "बिना सुविधा के भी mic बटन");
  }),
);

// photo से जाँच (TR-36): असली PNG (browser से बनी), फ़ोन के अंदर OCR। photo कहीं नहीं जानी चाहिए।
async function photoOf(html) {
  const maker = await (await browser.newContext({ viewport: { width: 720, height: 260 } })).newPage();
  await maker.setContent(`<body style="margin:24px;font-family:'Noto Sans Devanagari',sans-serif;font-size:28px;background:#fff;color:#111">${html}</body>`);
  const png = await maker.screenshot();
  await maker.context().close();
  return png;
}

async function checkPhotoFlow(page, html, mustRead) {
  const png = await photoOf(html);
  await openBox(page);
  const outside = [];
  page.on("request", (r) => {
    if (new URL(r.url()).origin !== new URL(BASE).origin || r.method() !== "GET") outside.push(`${r.method()} ${r.url()}`);
  });
  await page.locator('input[type="file"][accept="image/*"]').setInputFiles({ name: "scam.png", mimeType: "image/png", buffer: png });
  await page.getByRole("heading", { name: "ठगी के पक्के निशान" }).waitFor({ timeout: 120000 });
  const read = await page.getByLabel(BOX).inputValue();
  for (const w of mustRead) assert(read.includes(w), `पढ़ा text में "${w}" नहीं: ${read}`);
  assert(outside.length === 0, `बाहर/POST request: ${outside.slice(0, 3).join(", ")}`);
}

await check("photo से जाँच (English screenshot): फ़ोन में ही पढ़ा, डिब्बे में, पक्के निशान; सिर्फ़ अपनी साइट से files, कोई POST नहीं", () =>
  withPage({ viewport: PHONE }, (page) =>
    checkPhotoFlow(page, "Dear Customer, your KYC is pending.<br>Your account will be blocked today.<br>Share the OTP sent to your mobile.", ["OTP", "blocked"]),
  ),
);

// हिंदी photo के लिए machine पर हिंदी font चाहिए (वरना photo में डिब्बे बनते हैं, गलती OCR की नहीं)
const hindiFont = (() => {
  try {
    return execSync('fc-list "Noto Sans Devanagari" family', { encoding: "utf8" }).trim().length > 0;
  } catch {
    return false;
  }
})();
if (hindiFont) {
  await check("photo से जाँच (हिंदी screenshot): अक्षर ठीक पढ़े और पक्के निशान", () =>
    withPage({ viewport: PHONE }, (page) =>
      checkPhotoFlow(page, "प्रिय ग्राहक, आपका KYC अधूरा है।<br>आज रात आपका खाता बंद हो जाएगा।<br>अपने मोबाइल पर आया OTP बताइए।", ["OTP", "खाता"]),
    ),
  );
} else console.log("- हिंदी photo वाली जाँच छोड़ी: इस machine पर हिंदी font नहीं");

await check("photo से जाँच: बिना अक्षर वाली photo पर साफ़ बात (ख़ुद लिखें या बोलें), कोई नतीजा नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    const png = await photoOf("&nbsp;");
    await openBox(page);
    await page.locator('input[type="file"][accept="image/*"]').setInputFiles({ name: "blank.png", mimeType: "image/png", buffer: png });
    await page.getByText("photo में पढ़ने लायक अक्षर नहीं मिले", { exact: false }).waitFor({ timeout: 120000 });
    assert((await page.getByRole("region", { name: "जाँच का नतीजा" }).count()) === 0, "ख़ाली photo पर नतीजा");
  }),
);

await finish();
