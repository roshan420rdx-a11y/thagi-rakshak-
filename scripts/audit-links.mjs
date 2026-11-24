// "0 से दोबारा जाँच" का link-जाँचक: चालू app के सारे पन्ने (sitemap से) खोलकर
//  1. हर अंदर का link (और #टुकड़ा) सच में मौजूद है या नहीं,
//  2. हर बाहर का link किस host पर जाता है (सिर्फ़ जाने-पहचाने सरकारी/बैंक के host), और कहाँ-कहाँ है,
//  3. हर tel: नंबर (सिर्फ़ तय सूची के), mailto:, wa.me,
//  4. हर पन्ने का HTML आकार, और बाहर से कुछ भी लोड होता है या नहीं (src/href में बाहरी host)।
// चलाने से पहले: npm run build && npm start   (BASE_URL बदला जा सकता है)। गड़बड़ मिलने पर बाहर निकलने का कोड 1।
// --live देने पर बाहर के link खोलकर भी देखता है (सिर्फ़ जिन host तक पहुँच हो; नतीजा सूचना है, फ़ेल नहीं)।

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const LIVE = process.argv.includes("--live");

// बाहर के host जो हमारे पन्नों पर link बनकर आ सकते हैं (किसी और का host आए तो गड़बड़)
const ALLOWED_HOST = [
  /(^|\.)rbi\.org\.in$/, // RBI (cms.rbi.org.in समेत)
  /(^|\.)cybercrime\.gov\.in$/,
  /(^|\.)bank\.in$/, // बैंकों की असली साइट (RBI/2025-26/28)
  /(^|\.)gov\.in$/, // सरकारी
  /^wa\.me$/, // WhatsApp
  /^github\.com$/,
];
// सिर्फ़ ये फ़ोन नंबर हमारे पन्नों पर tel: बनकर आ सकते हैं (आपात और सरकारी); बैंक के नंबर अलग (बैंक-पन्नों पर, दो-जाँच के बाद)
// 14448 = RBI का toll-free (RBI के अपने FAQ में: docs/sources/rbi/2026-07-01-rbios-2026-faq.txt)
const KNOWN_TEL = new Set(["1930", "112", "14416", "14448", "1800-891-4416"]);

const problems = [];
const notes = [];
const fail = (msg) => problems.push(msg);

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (paths.length === 0) fail("sitemap में कोई पन्ना नहीं");

const pages = new Map(); // path -> { html, bytes, ids:Set }
for (const path of paths) {
  const res = await fetch(`${BASE}${path}`);
  const html = await res.text();
  if (res.status !== 200) fail(`${path}: स्थिति ${res.status}`);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  pages.set(path, { html, bytes: Buffer.byteLength(html), ids, status: res.status });
}

const external = new Map(); // url -> Set(paths)
const tel = new Map();
const internalChecked = new Map(); // path -> status
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

for (const [path, page] of pages) {
  const refs = [...page.html.matchAll(/\s(href|src|action)="([^"]*)"/g)].map((m) => ({ attr: m[1], ref: decode(m[2]) }));
  for (const { attr, ref } of refs) {
    if (ref === "" || ref.startsWith("data:") || ref.startsWith("blob:") || ref.startsWith("javascript:")) {
      if (ref.startsWith("javascript:")) fail(`${path}: javascript: link`);
      continue;
    }
    if (ref.startsWith("tel:")) {
      const num = ref.slice(4);
      (tel.get(num) ?? tel.set(num, new Set()).get(num)).add(path);
      continue;
    }
    if (ref.startsWith("mailto:")) continue;
    if (/^https?:\/\//.test(ref) || ref.startsWith("//")) {
      const url = new URL(ref.startsWith("//") ? `https:${ref}` : ref);
      // अपना ही host (canonical आदि) अंदर का माना जाएगा
      if (url.host === new URL(BASE).host) {
        continue;
      }
      (external.get(url.href) ?? external.set(url.href, new Set()).get(url.href)).add(path);
      continue;
    }
    // अंदर का: /रास्ता, /रास्ता#टुकड़ा, #टुकड़ा, ?query
    const target = new URL(ref, `${BASE}${path}`);
    if (target.origin !== new URL(BASE).origin) continue;
    const targetPath = target.pathname;
    // _next की फ़ाइलें और icon जैसी चीज़ें अलग से देखी जाती हैं
    if (!internalChecked.has(targetPath)) {
      const res = await fetch(`${BASE}${targetPath}`, { method: "GET", redirect: "manual" });
      internalChecked.set(targetPath, res.status);
      if (res.status >= 400) fail(`${path}: अंदर का link ${targetPath} → ${res.status}`);
      else if (res.status >= 300) notes.push(`${path}: ${targetPath} → redirect ${res.status}`);
    }
    // form का action: उसका #टुकड़ा तभी बनता है जब नतीजा दिख रहा हो (बिना JS में भेजने के बाद), इसलिए यहाँ id ढूँढना ग़लत
    if (attr !== "action" && target.hash && target.hash.length > 1) {
      const dest = pages.get(targetPath);
      const id = decodeURIComponent(target.hash.slice(1));
      if (dest && !dest.ids.has(id)) fail(`${path}: ${targetPath}#${id}: उस पन्ने पर ऐसा id नहीं`);
    }
  }
}

for (const [url, where] of external) {
  const host = new URL(url).hostname;
  if (!ALLOWED_HOST.some((re) => re.test(host))) fail(`बाहरी host ${host} (${url}) जाने-पहचाने host में नहीं; ${[...where].slice(0, 3).join(", ")}`);
}
for (const [num, where] of tel) {
  const clean = num.replace(/^\+91/, "").replace(/[\s()]/g, "");
  if (!KNOWN_TEL.has(clean)) notes.push(`tel:${num} (तय सूची में नहीं; बैंक का नंबर हो तो दो-जाँच देखें): ${[...where].slice(0, 3).join(", ")}`);
}

const sizes = [...pages].map(([p, v]) => ({ path: p, kb: v.bytes / 1024 })).sort((a, b) => b.kb - a.kb);
const turantMax = sizes.filter((s) => s.path === "/turant" || s.path.startsWith("/turant/")).sort((a, b) => b.kb - a.kb)[0];
if (turantMax && turantMax.kb > 60) fail(`/turant का HTML ${turantMax.kb.toFixed(1)} KB (> 60 KB की शर्त): ${turantMax.path}`);

console.log(`पन्ने: ${pages.size} · अंदर के अलग-अलग link-रास्ते: ${internalChecked.size} · बाहर के link: ${external.size} · tel: ${tel.size}`);
console.log(`सबसे बड़े 5 पन्ने: ${sizes.slice(0, 5).map((s) => `${s.path} ${s.kb.toFixed(1)}KB`).join(" · ")}`);
console.log("\nबाहर के link (host: कितने अलग link):");
const byHost = new Map();
for (const url of external.keys()) byHost.set(new URL(url).hostname, (byHost.get(new URL(url).hostname) ?? 0) + 1);
for (const [host, n] of [...byHost].sort()) console.log(`  ${host}: ${n}`);
console.log("\ntel: नंबर:", [...tel.keys()].sort().join(", ") || "(कोई नहीं)");

if (LIVE) {
  console.log("\n--live: बाहर के link खोलकर (सूचना)");
  for (const url of external.keys()) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "Mozilla/5.0" } });
      console.log(`  ${res.status} ${url}`);
    } catch (e) {
      console.log(`  ?   ${url} (${e instanceof Error ? e.name : "error"})`);
    }
  }
}

if (notes.length) console.log("\nनोट:\n  " + notes.join("\n  "));
if (problems.length) {
  console.log("\nगड़बड़ियाँ:\n  ✗ " + problems.join("\n  ✗ "));
  process.exit(1);
}
console.log("\nसब अंदर के link और बाहर के host ठीक");
