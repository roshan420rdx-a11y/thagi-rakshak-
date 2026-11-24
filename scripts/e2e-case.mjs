// "मेरा केस" (फ़ोन वाला) की असली browser में जाँच: सेव होकर reload पर बचे, भरते समय कोई network request नहीं,
// "सब मिटाएँ" से सच में मिटे, JS बंद पर साफ़ संदेश। चलाने से पहले: npm run build && npm start
import { BASE, PHONE, today, check, assert, withPage, watchRequests, pdfPageCount, finish } from "./e2e-lib.mjs";

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
    const requests = watchRequests(page, ["BANK-778", minusDays(3)]);
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
    await page.locator('section[aria-labelledby="case-dates"]').getByText("RBI Ombudsman की आख़िरी तारीख़", { exact: false }).waitFor();
  }),
);

await check("सार copy हो, और तारीख़ों की calendar file (.ics) फ़ोन में ही बने", () =>
  withPage({ viewport: PHONE, acceptDownloads: true }, async (page, context) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
    await open(page);
    await page.getByLabel("ठगी किस तारीख़ को हुई?").fill(minusDays(3));
    await page.getByLabel("कुल कितने पैसे गए? (₹)").fill("5000");
    await page.locator('[data-stage="bank"]').getByLabel("कब की?").fill(minusDays(2));
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "फ़ोन के calendar में जोड़ें" }).click()]);
    assert(download.suggestedFilename().endsWith(".ics"), `file: ${download.suggestedFilename()}`);
    const { readFile } = await import("node:fs/promises");
    const ics = await readFile(await download.path(), "utf8");
    assert(ics.startsWith("BEGIN:VCALENDAR") && ics.includes("RBI Ombudsman"), "ics ग़लत");
    await page.getByText("मेरे केस का सार (copy करें)").click();
    await page.getByRole("button", { name: "Copy करें" }).click();
    await page.getByRole("button", { name: "Copy हो गया ✓" }).waitFor();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    assert(clip.startsWith("मेरे केस का सार") && clip.includes("₹5,000"), `clipboard: ${clip.slice(0, 50)}`);
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

await check("अर्ज़ी: 'मेरा केस' की तारीख़/रकम पत्र में, पुलिस वाले पत्र में ठग की जानकारी, print बटन, कोई request नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.getByLabel("ठगी किस तारीख़ को हुई?").fill(minusDays(2));
    await page.getByLabel("कुल कितने पैसे गए? (₹)").fill("12,500");
    await page.getByText("फ़ोन में सेव हो गया").waitFor();
    await page.goto(`${BASE}/arzi`);
    await page.getByRole("heading", { name: "पत्र", exact: true }).waitFor();
    await page.waitForLoadState("networkidle");
    const requests = watchRequests(page, ["राम कुमार", "abc@ybl", "12500", "12,500"]);
    const letter = page.locator("#arzi-print");
    assert((await letter.innerText()).includes("₹12,500"), "रकम पत्र में नहीं");
    await page.getByLabel("आपका नाम").fill("राम कुमार");
    assert((await letter.innerText()).includes("राम कुमार"), "नाम पत्र में नहीं");
    await page.getByText("थाने या cyber cell को शिकायत पत्र").click();
    await page.getByLabel("ठग का नंबर, UPI ID या link").fill("abc@ybl");
    assert((await letter.innerText()).includes("abc@ybl"), "ठग की जानकारी नहीं");
    await page.getByLabel("थाने या cyber cell का नाम और ज़िला").fill("थाना कोतवाली, ज़िला बाराबंकी");
    assert((await letter.innerText()).includes("थाना कोतवाली, ज़िला बाराबंकी"), "थाने का नाम पत्र में नहीं");
    await page.evaluate(() => {
      window.__printed = 0;
      window.print = () => (window.__printed += 1);
    });
    await page.getByRole("button", { name: "Print / PDF बनाएँ" }).click();
    assert((await page.evaluate(() => window.__printed)) === 1, "print नहीं चला");
    assert(requests.length === 0, `requests: ${requests.slice(0, 3).join(", ")}`);
    await page.emulateMedia({ media: "print" });
    assert(await letter.isVisible(), "print में पत्र नहीं");
    const navHidden = await page.locator('nav[aria-label="मुख्य menu"]').evaluate((n) => getComputedStyle(n).display === "none" || getComputedStyle(n).visibility === "hidden");
    assert(navHidden, "print में menu दिखा");
    await page.emulateMedia({ media: "screen" });
    const pages = await pdfPageCount(page);
    assert(pages === 1, `पत्र की PDF में ${pages} पन्ने (ख़ाली पन्ने नहीं होने चाहिए)`);
  }),
);

await check("होम: फ़ोन में केस हो तो 'आपका केस' और अगला कदम; न हो तो कुछ नहीं", async () => {
  await withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/`);
    await page.getByRole("heading", { name: "और मदद" }).waitFor();
    assert((await page.getByText("आपका केस (इस फ़ोन में)").count()) === 0, "बिना केस के card दिखा");
  });
  await withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.getByLabel("ठगी किस तारीख़ को हुई?").fill(minusDays(1));
    await page.locator('[data-stage="call_1930"]').getByLabel("कब की?").fill(minusDays(1));
    await page.getByText("फ़ोन में सेव हो गया").waitFor();
    await page.goto(`${BASE}/`);
    await page.getByText("आपका केस (इस फ़ोन में)").waitFor();
    await page.getByText(/अगला कदम: cybercrime\.gov\.in/).waitFor();
  });
});

await check("'आज' बटन: ठगी और 1930 की तारीख़ एक tap में आज की, सेव भी", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.getByRole("button", { name: "ठगी की तारीख़: आज", exact: false }).click();
    assert((await page.getByLabel("ठगी किस तारीख़ को हुई?").inputValue()) === today, "ठगी की तारीख़ आज नहीं हुई");
    const s1930 = page.locator('[data-stage="call_1930"]');
    await s1930.getByRole("button", { name: /आज/ }).click();
    assert((await s1930.getByLabel("कब की?").inputValue()) === today, "1930 की तारीख़ आज नहीं हुई");
    await s1930.getByText("✓ हो गया").waitFor();
    await page.reload();
    await page.getByRole("heading", { name: "मेरी शिकायतें" }).waitFor();
    assert((await s1930.getByLabel("कब की?").inputValue()) === today, "reload पर 1930 की तारीख़ नहीं बची");
  }),
);

const nowKolkata = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());

await check("समय: 'अभी' से ठगी का समय (और ख़ाली तारीख़ आज की), 'कल' बटन, reload पर बचे, सार में \"लगभग शाम 4:30 बजे (16:30)\"", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    const time = page.getByLabel("लगभग किस समय? (याद हो तो)");
    const before = nowKolkata();
    await page.getByRole("button", { name: "ठगी का समय: अभी" }).click();
    const after = nowKolkata();
    const got = await time.inputValue();
    assert(got === before || got === after, `अभी का समय नहीं: ${got} (${before}-${after})`);
    assert((await page.getByLabel("ठगी किस तारीख़ को हुई?").inputValue()) === today, "'अभी' पर ख़ाली तारीख़ आज की नहीं हुई");
    await page.getByRole("button", { name: "ठगी की तारीख़: कल" }).click();
    assert((await page.getByLabel("ठगी किस तारीख़ को हुई?").inputValue()) === minusDays(1), "'कल' बटन से कल की तारीख़ नहीं");
    await time.fill("16:30");
    await page.getByText("फ़ोन में सेव हो गया").waitFor();
    await page.reload();
    await page.getByRole("heading", { name: "मेरी शिकायतें" }).waitFor();
    assert((await time.inputValue()) === "16:30", "reload पर समय नहीं बचा");
    assert((await page.getByLabel("ठगी किस तारीख़ को हुई?").inputValue()) === minusDays(1), "reload पर तारीख़ नहीं बची");
    await page.getByText("मेरे केस का सार (copy करें)").click();
    const summary = await page.locator("details").innerText();
    assert(summary.includes("लगभग शाम 4:30 बजे (16:30)"), `सार में समय नहीं: ${summary.slice(0, 200)}`);
  }),
);

await check("अर्ज़ी अपने-आप में पूरी: वहीं तारीख़ ('कल'), समय, रकम, 1930 की शिकायत → पत्र में; 'मेरा केस' में भी बचे; कोई request नहीं", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/arzi`);
    await page.getByRole("heading", { name: "पत्र", exact: true }).waitFor();
    await page.waitForLoadState("networkidle");
    const requests = watchRequests(page, ["21:15", "31611230012345", "8000", "8,000"]);
    const letter = page.locator("#arzi-print");
    assert((await letter.innerText()).includes("[लगभग समय]"), "बिना समय के [लगभग समय] वाली जगह नहीं");
    await page.getByRole("button", { name: "ठगी की तारीख़: कल" }).click();
    await page.getByLabel("लगभग किस समय? (याद हो तो)").fill("21:15");
    await page.getByLabel("कुल कितने पैसे गए? (₹)").fill("8,000");
    const s1930 = page.locator('[data-stage="call_1930"]');
    await s1930.getByRole("button", { name: /आज/ }).click();
    await s1930.getByLabel("शिकायत नंबर (हो तो)").fill("31611230012345");
    const t = await letter.innerText();
    for (const must of ["को लगभग रात 9:15 बजे (21:15)", "₹8,000", "31611230012345"]) assert(t.includes(must), `पत्र में "${must}" नहीं`);
    assert(!t.includes("[लगभग समय]") && !t.includes("[तारीख़]") && !t.includes("[रकम]"), "भरने के बाद भी ख़ाली जगह");
    await page.getByText("में भी सेव हो गया (सिर्फ़ इसी फ़ोन में)", { exact: false }).waitFor();
    assert(requests.length === 0, `requests: ${requests.slice(0, 3).join(", ")}`);
    await open(page);
    assert((await page.getByLabel("ठगी किस तारीख़ को हुई?").inputValue()) === minusDays(1), "मेरा केस में तारीख़ नहीं");
    assert((await page.getByLabel("लगभग किस समय? (याद हो तो)").inputValue()) === "21:15", "मेरा केस में समय नहीं");
    assert((await page.getByLabel("कुल कितने पैसे गए? (₹)").inputValue()) === "8000", "मेरा केस में रकम नहीं");
    assert((await page.locator('[data-stage="call_1930"]').getByLabel("शिकायत नंबर (हो तो)").inputValue()) === "31611230012345", "मेरा केस में 1930 नंबर नहीं");
  }),
);

await check("अर्ज़ी: Ombudsman वाले पत्र में बैंक की शिकायत वहीं भरें; 320px पर तारीख़ और बटन एक-दूसरे पर नहीं चढ़ते", () =>
  withPage({ viewport: { width: 320, height: 720 } }, async (page) => {
    await page.goto(`${BASE}/arzi`);
    await page.getByRole("heading", { name: "पत्र", exact: true }).waitFor();
    await page.getByText("RBI Ombudsman के लिए शिकायत का text").click();
    const bank = page.locator('[data-stage="bank"]');
    await bank.getByRole("button", { name: /आज/ }).click();
    await bank.getByLabel("शिकायत नंबर (हो तो)").fill("BNK-42");
    assert((await page.locator("#arzi-print").innerText()).includes("शिकायत नंबर: BNK-42"), "Ombudsman text में बैंक का नंबर नहीं");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert(!overflow, "320px पर पन्ना दाएँ खिसकता है");
    const boxes = await page.locator('[data-stage="bank"] input[type="date"], [data-stage="bank"] button').evaluateAll((els) =>
      els.map((e) => e.getBoundingClientRect()).map((r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom })),
    );
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        const hit = a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1;
        assert(!hit, `तारीख़ और बटन एक-दूसरे पर: ${JSON.stringify([a, b])}`);
      }
  }),
);

await check("अर्ज़ी: 'लिखने में मदद' से नमूना डिब्बे और पत्र में, 'पैसे कैसे गए?' भी; अपना लिखा कभी नहीं मिटता", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/arzi`);
    await page.getByRole("heading", { name: "पत्र", exact: true }).waitFor();
    const pick = page.getByLabel("लिखने में मदद: ठगी कैसे हुई?");
    const what = page.getByLabel("क्या हुआ, अपने शब्दों में");
    await pick.selectOption({ label: "बैंक वाला बनकर call, OTP ले लिया" });
    assert((await what.inputValue()).includes("ख़ुद को बैंक का कर्मचारी बताया"), "नमूना डिब्बे में नहीं");
    assert((await page.locator("#arzi-print").innerText()).includes("ख़ुद को बैंक का कर्मचारी बताया"), "नमूना पत्र में नहीं");
    assert(await page.getByLabel("ठगों ने धोखे से भिजवाए", { exact: false }).isChecked(), "'पैसे कैसे गए?' नहीं चुना");
    assert((await pick.inputValue()) === "", "चुनने के बाद picker ख़ाली नहीं हुआ (दोबारा चुनना मुश्किल)");
    // बिना बदले नमूने की जगह नया नमूना; अपना लिखा हो तो वह बचे और नमूना नीचे
    await pick.selectOption({ label: "AnyDesk जैसा ऐप डलवाया" });
    const swapped = await what.inputValue();
    assert(swapped.includes("AnyDesk") && !swapped.includes("OTP बता दिया"), "बिना बदला नमूना नहीं बदला");
    await what.fill("कल शाम मुझे एक call आया।");
    await pick.selectOption({ label: "link पर जानकारी भरवाई" });
    const mine = await what.inputValue();
    assert(mine.startsWith("कल शाम मुझे एक call आया।") && mine.includes("link"), `अपना लिखा मिटा: ${mine}`);
  }),
);

await check("अर्ज़ी: 'पत्र copy करें' से पूरा पत्र फ़ोन के clipboard में (email/WhatsApp के लिए), कोई request नहीं", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
    await page.goto(`${BASE}/arzi`);
    await page.getByRole("heading", { name: "पत्र", exact: true }).waitFor();
    await page.waitForLoadState("networkidle");
    const requests = watchRequests(page, ["सीता देवी"]);
    await page.getByLabel("आपका नाम").fill("सीता देवी");
    await page.getByRole("button", { name: "पत्र copy करें" }).click();
    await page.getByText("पत्र copy हो गया", { exact: false }).waitFor();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    assert(clip.startsWith("प्रति,") && clip.includes("सीता देवी") && clip.includes("शाखा प्रबंधक"), `clipboard: ${clip.slice(0, 120)}`);
    assert(requests.length === 0, `requests: ${requests.slice(0, 3).join(", ")}`);
  }),
);

await check("अर्ज़ी English में: भाषा चुनते ही पूरा पत्र English (lang=en), English नमूना, copy भी English; हिंदी पर वापस", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
    await page.goto(`${BASE}/arzi`);
    await page.getByRole("heading", { name: "पत्र", exact: true }).waitFor();
    const letter = page.locator("#arzi-print");
    await page.getByRole("radio", { name: "English", exact: false }).check();
    await page.getByLabel("लिखने में मदद: ठगी कैसे हुई?").selectOption({ label: "AnyDesk जैसा ऐप डलवाया" });
    await page.getByLabel("आपका नाम").fill("Ram Kumar");
    const t = await letter.innerText();
    for (const must of ["The Branch Manager", "Dear Sir/Madam", "AnyDesk", "Ram Kumar", "Yours faithfully"]) assert(t.includes(must), `English पत्र में "${must}" नहीं`);
    assert(!/[\u0900-\u097F]/.test(t), `English पत्र में हिंदी अक्षर: ${t.match(/.{0,20}[\u0900-\u097F].{0,20}/)?.[0]}`);
    assert((await letter.getAttribute("lang")) === "en", "पत्र पर lang=en नहीं");
    await page.getByRole("button", { name: "पत्र copy करें" }).click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    assert(clip.startsWith("To,") && clip.includes("Ram Kumar"), `copy English नहीं: ${clip.slice(0, 80)}`);
    await page.getByRole("radio", { name: "हिंदी" }).check();
    assert((await letter.innerText()).includes("शाखा प्रबंधक"), "हिंदी पर वापस नहीं आया");
  }),
);

await check("आगे की तारीख़ (जैसे ग़लत साल) न ली जाए: साफ़ बात, न सेव, न पत्र में", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    const d = page.getByLabel("ठगी किस तारीख़ को हुई?");
    await d.fill("2099-01-05");
    await page.getByText("आगे की तारीख़ नहीं हो सकती", { exact: false }).waitFor();
    assert((await d.inputValue()) === "", `आगे की तारीख़ खाने में रह गई: ${await d.inputValue()}`);
    const saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "{}").txnDate ?? null, KEY);
    assert(saved === null, `आगे की तारीख़ सेव हुई: ${saved}`);
    await d.fill(minusDays(1));
    assert((await page.getByText("आगे की तारीख़ नहीं हो सकती", { exact: false }).count()) === 0, "सही तारीख़ पर भी ग़लती वाली बात");
    await page.goto(`${BASE}/arzi`);
    await page.getByRole("heading", { name: "पत्र", exact: true }).waitFor();
    await page.getByLabel("ठगी किस तारीख़ को हुई?").fill("2099-01-05");
    assert(!(await page.locator("#arzi-print").innerText()).includes("2099"), "आगे की तारीख़ पत्र में");
  }),
);

await check("आपका हक़: फ़ोन में केस हो तो 'मेरा केस से भरें' → तारीख़ें और रकम भरें, हिसाब अपने-आप नहीं, कोई request नहीं", async () => {
  await withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/haq/thagi`);
    await page.getByRole("heading", { name: "ठगी में पैसा गया: आपका हक़" }).waitFor();
    await page.waitForLoadState("networkidle");
    assert((await page.getByRole("button", { name: /मेरा केस.*से भरें/ }).count()) === 0, "बिना केस के भरने का बटन दिखा");
  });
  await withPage({ viewport: PHONE }, async (page) => {
    await open(page);
    await page.getByLabel("ठगी किस तारीख़ को हुई?").fill(minusDays(4));
    await page.getByLabel("कुल कितने पैसे गए? (₹)").fill("4,999.50");
    await page.locator('[data-stage="ncrp"]').getByLabel("कब की?").fill(minusDays(3));
    await page.locator('[data-stage="bank"]').getByLabel("कब की?").fill(minusDays(2));
    await page.getByText("फ़ोन में सेव हो गया").waitFor();
    await page.goto(`${BASE}/haq/thagi`);
    await page.waitForLoadState("networkidle");
    const requests = watchRequests(page, ["4999", minusDays(4), minusDays(3), minusDays(2)]);
    await page.getByRole("button", { name: /मेरा केस.*से भरें/ }).click();
    assert((await page.inputValue("#txn")) === minusDays(4), "ठगी की तारीख़ नहीं भरी");
    assert((await page.inputValue("#loss")) === "4999.5", `रकम: ${await page.inputValue("#loss")}`);
    assert((await page.inputValue("#r1930")) === minusDays(3), "1930/NCRP की तारीख़ नहीं भरी");
    assert((await page.inputValue("#rbank")) === minusDays(2), "बैंक की तारीख़ नहीं भरी");
    assert((await page.getByRole("heading", { name: "आपका हिसाब" }).count()) === 0, "बिना 'हिसाब देखें' के नतीजा आ गया");
    assert(await page.locator("#how").evaluate((el) => el === document.activeElement), "अगले सवाल पर focus नहीं");
    assert(requests.length === 0, `requests: ${requests.slice(0, 3).join(", ")}`);
  });
});

await check("अर्ज़ी: 'पैसे कैसे गए?' चुनने पर पत्र की लाइन बदले; न चुनें तो [ ] वाली ख़ाली जगह", () =>
  withPage({ viewport: PHONE }, async (page) => {
    await page.goto(`${BASE}/arzi`);
    await page.getByRole("heading", { name: "पत्र", exact: true }).waitFor();
    const letter = page.locator("#arzi-print");
    assert((await letter.innerText()).includes("एक चुनें"), "बिना चुने [ ] वाली जगह नहीं");
    await page.getByText("मैंने न कोई लेन-देन किया", { exact: false }).click();
    const t = await letter.innerText();
    assert(t.includes("न मैंने किया, न उसकी अनुमति दी") && !t.includes("एक चुनें"), "चुनने पर पत्र नहीं बदला");
  }),
);

await check("offline: internet बंद होने पर भी 'मेरा केस' खुले और भरी जानकारी दिखे", () =>
  withPage({ viewport: PHONE }, async (page, context) => {
    await open(page);
    await page.getByLabel("कुल कितने पैसे गए? (₹)").fill("7,777");
    await page.getByText("फ़ोन में सेव हो गया").waitFor();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.reload();
    await page.getByRole("heading", { name: "मेरी शिकायतें" }).waitFor();
    assert((await page.getByLabel("कुल कितने पैसे गए? (₹)").inputValue()) === "7777", "offline में जानकारी नहीं दिखी");
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
