// दोबारा मिलान (हर 3 महीने, docs/verify/BANKS.md): हर बैंक की अपनी .bank.in साइट अभी खोलकर देखना कि
// registry.ts में लिखी मूल लाइन (नंबर या link का नाम) वहाँ अब भी जस की तस है। आम `npm test` में नहीं चलता (network)।
// चलाना: RECHECK=1 NODE_USE_ENV_PROXY=1 npx vitest run scripts/recheck/banks.test.ts
import { expect, test } from "vitest";
import { BANKS } from "@/modules/banks";

const ON = process.env.RECHECK === "1";

const ENTITIES: Record<string, string> = { "&amp;": "&", "&nbsp;": " ", "&rsquo;": "’", "&lsquo;": "‘", "&#39;": "'", "&quot;": '"', "&#8217;": "’", "&ndash;": "–" };
const text = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e.toLowerCase()] ?? " ")
    .replace(/\s+/g, " ");
const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

// link वाले channel की मूल लाइन `link: "नाम"`; पन्ने पर वह नाम चाहिए
const needle = (quote: string) => norm(quote.match(/^link: "(.*)"$/)?.[1] ?? quote);

async function page(url: string): Promise<{ status: number; finalHost: string; body: string }> {
  const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (thagi-rakshak recheck)", "Accept-Language": "en-IN,hi;q=0.8" } });
  return { status: res.status, finalHost: new URL(res.url).host, body: norm(text(await res.text())) };
}

const cases = BANKS.flatMap((b) => [
  ...(b.officialSite ? [{ bank: b.slug, kind: "site", url: b.officialSite.url, find: null as string | null }] : []),
  ...b.channels.map((c) => ({ bank: b.slug, kind: c.kind, url: c.sourceUrl, find: needle(c.sourceQuote) })),
]);

test.skipIf(!ON).each(cases)("$bank $kind: $url", async ({ url, find }) => {
  const p = await page(url);
  expect(p.status, url).toBe(200);
  expect(p.finalHost.endsWith(".bank.in"), `${url} → ${p.finalHost}`).toBe(true);
  if (find) expect(p.body, `${url} पर "${find}" नहीं`).toContain(find);
}, 60_000);
