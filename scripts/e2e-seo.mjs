// Google और WhatsApp preview के लिए हर public पन्ने की जाँच: अलग title, अलग description (≤160 अक्षर),
// सही canonical (पते का साफ़ रूप, बिना ?…), Open Graph (WhatsApp में link भेजने पर दिखने वाला), html lang="hi"।
// चलाने से पहले: npm run build && npm start
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
let failed = false;
const fail = (msg) => {
  failed = true;
  console.log(`✗ ${msg}`);
};

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const siteUrl = new URL(locs[0]).origin; // build के समय का NEXT_PUBLIC_SITE_URL
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&");
const attr = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};

async function meta(path) {
  const html = await (await fetch(`${BASE}${path}`)).text();
  return {
    lang: attr(html, /<html lang="([^"]*)"/),
    title: attr(html, /<title>([^<]*)<\/title>/),
    description: attr(html, /<meta name="description" content="([^"]*)"/),
    canonical: attr(html, /<link rel="canonical" href="([^"]*)"/),
    ogTitle: attr(html, /<meta property="og:title" content="([^"]*)"/),
    ogDescription: attr(html, /<meta property="og:description" content="([^"]*)"/),
    ogLocale: attr(html, /<meta property="og:locale" content="([^"]*)"/),
    ogUrl: attr(html, /<meta property="og:url" content="([^"]*)"/),
  };
}

const titles = new Map();
const descriptions = new Map();
for (const loc of locs) {
  const path = new URL(loc).pathname;
  const m = await meta(path);
  if (m.lang !== "hi") fail(`${path}: html lang "${m.lang}"`);
  if (!m.title) fail(`${path}: title नहीं`);
  if (!m.description) fail(`${path}: description नहीं`);
  else if ([...m.description].length > 160) fail(`${path}: description ${[...m.description].length} अक्षर (160 से ज़्यादा)`);
  if (m.canonical !== `${siteUrl}${path === "/" ? "" : path}` && m.canonical !== `${siteUrl}${path}`) fail(`${path}: canonical "${m.canonical}"`);
  if (m.ogTitle !== m.title) fail(`${path}: og:title "${m.ogTitle}" ≠ title`);
  if (m.ogDescription !== m.description) fail(`${path}: og:description ≠ description`);
  if (m.ogLocale !== "hi_IN") fail(`${path}: og:locale "${m.ogLocale}"`);
  if (!m.ogUrl) fail(`${path}: og:url नहीं`);
  titles.set(m.title, [...(titles.get(m.title) ?? []), path]);
  descriptions.set(m.description, [...(descriptions.get(m.description) ?? []), path]);
}
for (const [t, ps] of titles) if (ps.length > 1) fail(`एक ही title "${t}": ${ps.join(", ")}`);
for (const [, ps] of descriptions) if (ps.length > 1) fail(`एक ही description ${ps.length} पन्नों पर: ${ps.slice(0, 4).join(", ")}…`);

// हिसाब वाले पते (?txn=…) का canonical साफ़ /haq/thagi, ताकि हर हिसाब Google में अलग पन्ना न बने
const q = await meta("/haq/thagi?txn=2026-11-01&loss=5000");
if (q.canonical !== `${siteUrl}/haq/thagi`) fail(`/haq/thagi?… canonical "${q.canonical}"`);

if (!failed) console.log(`✓ ${locs.length} पन्ने: अलग title और description, सही canonical, Open Graph, lang=hi`);
process.exit(failed ? 1 : 0);
