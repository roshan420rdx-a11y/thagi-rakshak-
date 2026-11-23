// दोबारा मिलान: /nambar के हर नंबर का मूल उद्धरण उसकी सरकारी साइट पर अभी भी जस का तस है? (आम `npm test` में नहीं)
// चलाना: RECHECK=1 NODE_USE_ENV_PROXY=1 npx vitest run scripts/recheck/helplines.test.ts
import { expect, test } from "vitest";
import { HELPLINES } from "@/modules/site/helplines";

const ON = process.env.RECHECK === "1";
const NAMED: Record<string, string> = { amp: "&", nbsp: " ", rsquo: "’", quot: '"', times: "×" };
const text = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (e, n) => NAMED[n.toLowerCase()] ?? e);

// tag की जगह space डाली है, इसलिए विराम से पहले का space हटाना ("<strong>14416</strong>," → "14416,")
const norm = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/​/g, "")
    .replace(/\s+/g, " ")
    .replace(/ ([,.;:])/g, "$1")
    .trim()
    .toLowerCase();

const cases = HELPLINES.filter((h) => h.source).map((h) => ({ number: h.number, url: h.source!.url, quote: h.source!.quote }));

test.skipIf(!ON).each(cases)("$number: $url", async ({ url, quote }) => {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (thagi-rakshak recheck)" } });
  expect(res.status, url).toBe(200);
  expect(norm(text(await res.text())), `${url} पर उद्धरण नहीं`).toContain(norm(quote));
}, 60_000);
