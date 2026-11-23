// दोबारा मिलान: "आपका हक़", "शिकायत का रास्ता" और ज्ञानकोश में इस्तेमाल हर RBI quote, RBI की अपनी साइट पर अभी भी जस का तस है?
// URL हर मूल फ़ाइल की पहली लाइन ("स्रोत: …") से। आम `npm test` में नहीं चलता (network)।
// चलाना: RECHECK=1 NODE_USE_ENV_PROXY=1 npx vitest run scripts/recheck/rbi.test.ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { RBI_BANK_IN, RBI_COERCION, RBI_FIVE_DAYS } from "@/modules/gyan/refs";
import { RULES } from "@/modules/rules-engine/evaluate";
import { TAT_SOURCE } from "@/modules/rules-engine/rules/tat-2019";
import { RBIOS_90_DAYS, RBIOS_COMPENSATION, RBIOS_FIRST_BANK, RBIOS_FREE } from "@/modules/shikayat";

const ON = process.env.RECHECK === "1";
const ROOT = path.resolve(__dirname, "../..");

const NAMED: Record<string, string> = { amp: "&", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", quot: '"', ndash: "–", mdash: "—", rupee: "₹" };
const decode = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (e, n) => NAMED[n.toLowerCase()] ?? e);
const text = (html: string) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
// quotes के तरह-तरह के निशान ('/’, "/“) और spaces एक जैसे
const norm = (s: string) => s.replace(/[‘’`´]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();

const urlOf = (file: string) => {
  const first = readFileSync(path.join(ROOT, file), "utf8").split("\n")[0];
  const m = first.match(/https:\/\/www\.rbi\.org\.in\/\S+/);
  if (!m) throw new Error(`${file}: पहली लाइन में URL नहीं`);
  return m[0];
};

const quotes = [
  ...RULES.map((r) => ({ id: r.id, file: r.source.file, quote: r.source.quote })),
  { id: "tat-2019", file: TAT_SOURCE.file, quote: TAT_SOURCE.quote },
  ...Object.entries({ RBIOS_FIRST_BANK, RBIOS_90_DAYS, RBIOS_COMPENSATION, RBIOS_FREE }).map(([id, s]) => ({ id, file: s.file, quote: s.quote })),
  ...Object.entries({ RBI_COERCION, RBI_FIVE_DAYS, RBI_BANK_IN }).map(([id, s]) => ({ id, file: s.file, quote: s.quote })),
];

const pages = new Map<string, Promise<string>>();
const page = (url: string) => {
  if (!pages.has(url))
    pages.set(
      url,
      fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (thagi-rakshak recheck)" } }).then(async (r) => {
        if (r.status !== 200) throw new Error(`${url}: ${r.status}`);
        return norm(text(await r.text()));
      }),
    );
  return pages.get(url)!;
};

test.skipIf(!ON).each(quotes)("$id", async ({ file, quote }) => {
  const url = urlOf(file);
  expect(await page(url), `${url} पर quote नहीं`).toContain(norm(quote));
}, 120_000);
