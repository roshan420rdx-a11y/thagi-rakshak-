// ज्ञानकोश में खोज (plan A2e)। index छोटा रखा है (नाम, सार, निशान, नियम), क्योंकि वह browser में जाता है।
// नुक़्ता/चंद्रबिंदु का फ़र्क़ नहीं (normalizeText), शब्द के आख़िरी मात्रा का फ़र्क़ नहीं (अंगूठा/अंगूठे),
// और आम हिंदी-अंग्रेज़ी जोड़े (लोन/loan) एक जैसे।
import { normalizeText } from "@/modules/checker/normalize";
import type { GyanPage, GyanSlug } from "./types";

export type SearchEntry = { slug: GyanSlug; titleHi: string; summaryHi: string; hay: string };

export function buildSearchIndex(pages: readonly GyanPage[]): SearchEntry[] {
  return pages.map((p) => ({
    slug: p.slug,
    titleHi: p.navTitleHi,
    summaryHi: p.summaryHi[0],
    hay: normalizeText([p.navTitleHi, p.titleHi, ...p.summaryHi, ...p.signsHi, ...p.rulesHi].join(" ")),
  }));
}

// हिंदी ↔ अंग्रेज़ी (normalize किए हुए रूप में)
const ALIASES: readonly (readonly string[])[] = [
  ["लोन", "loan", "ऋण", "क़र्ज़"],
  ["ओटीपी", "otp"],
  ["यूपीआई", "upi"],
  ["सिम", "sim"],
  ["केवाईसी", "kyc"],
  ["एपीके", "apk"],
  ["क्यूआर", "qr"],
  ["पिन", "pin"],
  ["वीडियो", "video"],
  ["लॉटरी", "lottery"],
  ["नौकरी", "job"],
  ["आधार", "aadhaar"],
  ["बैंक", "bank"],
  ["कार्ड", "card"],
  ["लिंक", "link"],
  ["पुलिस", "police"],
  ["डिजिटल", "digital"],
  ["अरेस्ट", "arrest", "गिरफ़्तार"],
  ["अर्ज़ी", "arzi", "letter", "पत्र"],
  ["शिकायत", "complaint", "shikayat"],
  ["नंबर", "number"],
  ["हेल्पलाइन", "helpline"],
  ["फ़ोन", "phone", "mobile", "मोबाइल"],
  ["चोरी", "chori", "stolen", "theft"],
].map((group) => group.map((w) => normalizeText(w)));

const MATRA_END = /[ािीुूेैोौंः]+$/u;

function variants(word: string): string[] {
  const out = new Set([word]);
  const stem = word.replace(MATRA_END, "");
  if (stem.length >= 2 && stem !== word) out.add(stem);
  for (const g of ALIASES) if (g.includes(word) || g.includes(stem)) for (const a of g) out.add(a);
  return [...out];
}

// खोज के शब्द (normalize करके); पूरी साइट वाली खोज (modules/site/search.ts) भी यही इस्तेमाल करती है
export function queryWords(query: string): string[] {
  return normalizeText(query).split(/[\s,.!?।]+/u).filter(Boolean);
}

// शब्द (या उसका रूप/जोड़ीदार) इस text में है?
export function wordMatches(word: string, hay: string): boolean {
  return variants(word).some((v) => hay.includes(v));
}

export function filterIndex(index: readonly SearchEntry[], query: string): SearchEntry[] {
  const words = queryWords(query);
  if (!words.length) return [...index];
  return index.filter((e) => words.every((w) => wordMatches(w, e.hay)));
}
