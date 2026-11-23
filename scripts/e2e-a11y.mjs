// सुलभता (accessibility) की जाँच axe से: बुज़ुर्ग, कम देखने वाले और screen-reader वाले लोग भी साइट चला सकें।
// "serious" और "critical" वाली हर कमी पर fail। चलाने से पहले: npm run build && npm start
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PHONE = { width: 360, height: 740 };
const browser = await chromium.launch();
let failed = false;

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const PAGES = [
  "/",
  "/turant",
  "/turant/upi",
  "/turant/sextortion",
  "/pucho",
  "/abhyas",
  "/poster",
  "/bharosa",
  "/haq",
  "/haq/thagi",
  `/haq/thagi?txn=${today}&loss=40000&shared=yes&r1930=${today}&rbank=${today}`,
  "/haq/failed-txn",
  "/haq/frozen-money",
  "/shikayat-rasta",
  "/case",
  "/arzi",
  "/gyan",
  "/gyan/digital-arrest",
  "/gyan/bank",
  "/gyan/bank/hdfc",
  "/legal/privacy",
  "/legal/shikayat",
  "/nambar",
];

async function audit(page, label) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  if (bad.length) {
    failed = true;
    for (const v of bad) console.log(`✗ ${label}: [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) → ${v.nodes[0]?.target.join(" ")}`);
  } else console.log(`✓ ${label}`);
}

for (const scheme of ["light", "dark"]) {
  const context = await browser.newContext({ viewport: PHONE, colorScheme: scheme });
  const page = await context.newPage();
  for (const path of PAGES) {
    await page.goto(`${BASE}${path}`);
    await audit(page, `${scheme} ${path}`);
  }
  // "पहले पूछो" का नतीजा भी (danger, link समेत)
  await page.goto(`${BASE}/pucho`);
  await page.getByLabel("संदिग्ध message यहाँ चिपकाएँ").fill("मैंने ₹5,000 की request भेजी है, PIN डालकर accept करें। http://sbi-yono-kyc.xyz");
  await page.getByRole("button", { name: "जाँचें", exact: true }).click();
  await page.getByRole("region", { name: "जाँच का नतीजा" }).waitFor();
  await audit(page, `${scheme} /pucho (नतीजा)`);
  // अभ्यास: नतीजे वाली हालत भी (हरा/पीला डिब्बा, निशान)
  await page.goto(`${BASE}/abhyas`);
  await page.getByRole("button", { name: "ठगी है" }).click();
  await page.locator("#abhyas-feedback").waitFor();
  await audit(page, `${scheme} /abhyas (नतीजा)`);
  // ज्ञानकोश की खोज: नतीजे वाली हालत
  await page.goto(`${BASE}/gyan`);
  await page.getByLabel("ज्ञानकोश में खोजें").fill("OTP");
  await page.getByText(/पन्ने मिले/).waitFor();
  await audit(page, `${scheme} /gyan (खोज)`);
  await context.close();

  // desktop: ऊपर की menu पट्टी, चौड़ा होम, footer के तीन हिस्से
  const desk = await browser.newContext({ viewport: { width: 1366, height: 768 }, colorScheme: scheme });
  const dpage = await desk.newPage();
  for (const path of ["/", "/gyan/sim-swap", "/nambar", "/turant/upi"]) {
    await dpage.goto(`${BASE}${path}`);
    await audit(dpage, `${scheme} desktop ${path}`);
  }
  await desk.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
