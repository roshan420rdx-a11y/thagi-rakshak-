// हर public पन्ने को असली browser में खोलकर देखना कि console में कोई छुपी गलती नहीं:
// JS error, hydration की गड़बड़, CSP से रुका कुछ, या कोई file जो 404/500 दे। चलाने से पहले: npm run build && npm start
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ORIGIN = new URL(BASE).origin;
const browser = await chromium.launch();
let failed = false;

// sitemap से सारे रास्ते (नया पन्ना जुड़े तो अपने आप जाँचा जाए)
const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (paths.length < 40) {
  console.log(`✗ sitemap में सिर्फ़ ${paths.length} रास्ते`);
  process.exit(1);
}

for (const [label, options] of [
  ["फ़ोन", { viewport: { width: 360, height: 740 } }],
  ["फ़ोन, dark", { viewport: { width: 360, height: 740 }, colorScheme: "dark" }],
  ["फ़ोन, सबसे बड़े अक्षर", { viewport: { width: 360, height: 740 }, akshar: "3" }],
]) {
  const { akshar, ...ctxOptions } = options;
  const context = await browser.newContext(ctxOptions);
  if (akshar) await context.addInitScript((a) => localStorage.setItem("thagi-rakshak:akshar:v1", a), akshar);
  const page = await context.newPage();
  let problems = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") problems.push(`console.${m.type()}: ${m.text().slice(0, 160)}`);
  });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message.slice(0, 160)}`));
  page.on("response", (r) => {
    const u = new URL(r.url());
    if (u.origin === ORIGIN && r.status() >= 400 && !u.pathname.startsWith("/xyz")) problems.push(`${r.status()} ${u.pathname}`);
  });
  for (const path of paths) {
    problems = [];
    await page.goto(`${BASE}${path}`);
    await page.waitForLoadState("networkidle");
    if (problems.length) {
      failed = true;
      console.log(`✗ ${label} ${path}: ${[...new Set(problems)].join(" | ")}`);
    }
  }
  if (!failed) console.log(`✓ ${label}: ${paths.length} पन्ने, console साफ़`);
  await context.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
