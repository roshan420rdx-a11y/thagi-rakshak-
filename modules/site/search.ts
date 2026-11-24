// पूरी साइट में खोज (plan A2f): "1930", "SBI", "OTP", "loan", "अर्ज़ी" लिखते ही सही पन्ना या सीधे call।
// खोज browser में ही होती है (कोई request नहीं)। index हल्का रखा है, क्योंकि वह होम और /khoj पर जाता है।
import { BANKS } from "@/modules/banks";
import { normalizeText } from "@/modules/checker/normalize";
import { GYAN_PAGES } from "@/modules/gyan";
import { queryWords, wordMatches } from "@/modules/gyan/search";
import { TURANT_SLUGS, getTurantPage } from "@/modules/scams";
import { HELPLINES } from "./helplines";

export type SiteHitKind = "tel" | "turant" | "tool" | "gyan" | "bank";
// title: नाम (normalize किया); hay: बाकी खोजने लायक text (नाम दोबारा नहीं, ताकि index हल्का रहे)
export type SiteEntry = { kind: SiteHitKind; href: string; titleHi: string; hintHi: string; title: string; hay: string };

// औज़ार: नाम, एक लाइन, और लोग जो शब्द लिखते हैं (हिंदी, अंग्रेज़ी, Hinglish)
const TOOLS: readonly { href: string; titleHi: string; hintHi: string; keys: string }[] = [
  { href: "/pucho", titleHi: "पहले पूछो: यह message या call ठगी है?", hintHi: "message चिपकाकर जाँचें", keys: "jaanch check message sms whatsapp call शक otp link qr pin" },
  { href: "/nambar", titleHi: "ज़रूरी नंबर", hintHi: "1930, 112, 181, 14448, 1947, 14416", keys: "helpline police number call" },
  { href: "/case", titleHi: "मेरा केस", hintHi: "शिकायतों का हिसाब, आगे की तारीख़ें", keys: "case complaint tareekh date reminder" },
  { href: "/arzi", titleHi: "अर्ज़ियाँ: बैंक, पुलिस, RBI के पत्र", hintHi: "हिंदी या English, print या PDF, मुफ़्त", keys: "arzi letter application bank police rbi ombudsman pdf print english patra shikayat patra" },
  { href: "/shikayat-rasta", titleHi: "शिकायत का पूरा रास्ता", hintHi: "1930 से RBI Ombudsman तक", keys: "complaint ncrp cybercrime ombudsman rbi police fir" },
  { href: "/haq/thagi", titleHi: "आपका हक़: ठगी में पैसा गया", hintHi: "पूरा पैसा वापस या मुआवज़ा? RBI के नियमों से हिसाब", keys: "haq refund wapas paisa muavza compensation rbi" },
  { href: "/haq/failed-txn", titleHi: "लेन-देन fail, पैसा अटका", hintHi: "देर पर ₹100 रोज़ का हिसाब", keys: "failed transaction atka refund" },
  { href: "/haq/frozen-money", titleHi: "ठग के खाते में पैसा रुका (freeze)", hintHi: "वापस कैसे माँगें", keys: "freeze hold wapas court" },
  { href: "/gyan/bank", titleHi: "अपने बैंक को ठगी कैसे बताएँ", hintHi: "बैंक का सही नंबर और साइट", keys: "bank customer care block card" },
  { href: "/abhyas", titleHi: "ठगी या असली? (अभ्यास)", hintHi: "message पहचानने का अभ्यास", keys: "quiz practice test abhyas" },
  { href: "/poster", titleHi: "पोस्टर छापें", hintHi: "दुकान, बैंक, पंचायत में लगाएँ", keys: "poster print" },
  { href: "/bharosa", titleHi: "भरोसा: हम कौन हैं", hintHi: "हम कभी OTP नहीं माँगते", keys: "trust about bharosa" },
  { href: "/legal/privacy", titleHi: "निजता (privacy)", hintHi: "आपकी जानकारी का क्या होता है", keys: "privacy data" },
];

function firstSentence(s: string, max = 90): string {
  const one = s.split(/(?<=[।.!?])\s/u)[0] ?? s;
  return one.length > max ? `${one.slice(0, max - 1)}…` : one;
}

function entry(kind: SiteHitKind, href: string, titleHi: string, hintHi: string, extra: string): SiteEntry {
  return { kind, href, titleHi, hintHi, title: normalizeText(titleHi), hay: normalizeText(`${hintHi} ${extra}`) };
}

export function buildSiteIndex(): SiteEntry[] {
  return [
    ...HELPLINES.map((h) => entry("tel", `tel:${h.number}`, `${h.number}: ${h.titleHi}`, firstSentence(h.whenHi), "")),
    ...TURANT_SLUGS.map((slug) => {
      const p = getTurantPage(slug);
      return entry("turant", `/turant/${slug}`, p.titleHi, "अभी क्या करें: कदम-दर-कदम", p.steps.map((s) => s.titleHi).join(" "));
    }),
    ...TOOLS.map((t) => entry("tool", t.href, t.titleHi, t.hintHi, t.keys)),
    ...GYAN_PAGES.map((p) => entry("gyan", `/gyan/${p.slug}`, p.navTitleHi, firstSentence(p.summaryHi[0]), p.titleHi)),
    ...BANKS.map((b) => entry("bank", `/gyan/bank/${b.slug}`, `${b.nameHi}: ठगी कैसे बताएँ`, b.nameEn, b.slug)),
  ];
}

// हर शब्द मिलना चाहिए; जिनके नाम में ज़्यादा शब्द हों वे ऊपर, बराबर हों तो index का क्रम (नंबर, कदम, औज़ार, ज्ञान, बैंक)
export function searchSite(index: readonly SiteEntry[], query: string, limit = 8): SiteEntry[] {
  const words = queryWords(query);
  if (!words.length) return [];
  return index
    .map((e, i) => ({ e, i, score: words.filter((w) => wordMatches(w, e.title)).length }))
    .filter(({ e }) => words.every((w) => wordMatches(w, e.title) || wordMatches(w, e.hay)))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map(({ e }) => e);
}
