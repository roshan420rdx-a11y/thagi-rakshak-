// message और नियम, दोनों को एक जैसा बनाना: NFC, नुक़्ता हटाना (ग़/ग, फ़/फ), ँ को ं, छुपे अक्षर हटाना, देवनागरी अंक को 0-9।
// ध्यान दें: pattern पर lowercase नहीं (वरना \S, \D जैसे regex बिगड़ जाएँ); उसके लिए "i" flag है।
//
// ठगों की चालें (जाँच के बाद जोड़ा गया, `normalize.test.ts`): message का रूप बदलकर नियम से बचना।
//   • पूरी-चौड़ाई या गणित वाले अक्षर ("ＯＴＰ", "𝐎𝐓𝐏") → NFKC से सादे अक्षर
//   • हू-ब-हू दिखने वाले रूसी/यूनानी अक्षर ("sbі-kyc.com" में रूसी і) → सादे लैटिन अक्षर
//   • अक्षर अलग-अलग ("O T P", "O.T.P", "o-t-p") और अंक वाला रूप ("0TP", "P1N")
// इनमें से सिर्फ़ चुनिंदा शब्दों (OTP, UPI, PIN, KYC...) पर, ताकि आम text न बदले।

const NUKTA = /़/g;
const CHANDRABINDU = /ँ/g;
const INVISIBLE = /[​-‍⁠﻿­]/g;
const DEVANAGARI_DIGIT = /[०-९]/g;

export function normalizePattern(src: string): string {
  return src.normalize("NFC").replace(NUKTA, "").replace(CHANDRABINDU, "ं");
}

// NFKC के बाद भी बचे, लैटिन जैसे दिखने वाले रूसी/यूनानी अक्षर (सिर्फ़ वे जो आँख से अलग नहीं दिखते)
const HOMOGLYPHS: Record<string, string> = {
  а: "a", е: "e", о: "o", р: "p", с: "c", х: "x", у: "y", і: "i", ј: "j", ѕ: "s", һ: "h", ԁ: "d", ԛ: "q", ԝ: "w", к: "k", м: "m", н: "h", т: "t", в: "b",
  А: "a", Е: "e", О: "o", Р: "p", С: "c", Х: "x", І: "i", Ј: "j", Ѕ: "s", К: "k", М: "m", Н: "h", Т: "t", В: "b",
  ο: "o", Ο: "o", ρ: "p", Ρ: "p", ν: "v", ι: "i", Ι: "i", α: "a", Α: "a", τ: "t", Τ: "t", κ: "k", Κ: "k", Β: "b", Ε: "e", Η: "h", Μ: "m", Ν: "n", Χ: "x", Υ: "y", Ζ: "z",
  ɑ: "a", ɡ: "g",
};
const HOMOGLYPH_RE = new RegExp(`[${Object.keys(HOMOGLYPHS).join("")}]`, "g");

// जिन शब्दों को अलग-अलग अक्षरों या अंकों से छुपाया जाता है
const KEYWORDS = new Set(["otp", "upi", "pin", "mpin", "kyc", "qr", "apk", "cvv", "pan", "sim", "emi", "atm"]);
const SPREAD_LETTERS = /(?<![a-z0-9])[a-z](?:[\s.\-_]+[a-z]){1,3}(?![a-z0-9])/g;
const LEET_TOKEN = /(?<![a-z0-9])[a-z0-9]{2,4}(?![a-z0-9])/g;
const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t" };

function foldKeywordDisguises(text: string): string {
  return text
    .replace(SPREAD_LETTERS, (m) => {
      const joined = m.replace(/[\s.\-_]/g, "");
      return KEYWORDS.has(joined) ? joined : m;
    })
    .replace(LEET_TOKEN, (m) => {
      if (!/\d/.test(m) || !/[a-z]/.test(m)) return m; // सिर्फ़ अक्षर+अंक का मेल ("0tp"); सिर्फ़ अंक या सिर्फ़ अक्षर नहीं
      const mapped = m.replace(/\d/g, (d) => LEET[d] ?? d);
      return KEYWORDS.has(mapped) ? mapped : m;
    });
}

export function normalizeText(text: string): string {
  const folded = normalizePattern(text.normalize("NFKC"))
    .replace(INVISIBLE, "")
    .replace(HOMOGLYPH_RE, (c) => HOMOGLYPHS[c] ?? c)
    .replace(DEVANAGARI_DIGIT, (d) => String(d.charCodeAt(0) - 0x0966))
    .replace(/\s+/g, " ")
    .toLowerCase();
  return foldKeywordDisguises(folded);
}
