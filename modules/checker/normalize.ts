// message और नियम, दोनों को एक जैसा बनाना: NFC, नुक़्ता हटाना (ग़/ग, फ़/फ), ँ को ं, छुपे अक्षर हटाना, देवनागरी अंक को 0-9।
// ध्यान दें: pattern पर lowercase नहीं (वरना \S, \D जैसे regex बिगड़ जाएँ); उसके लिए "i" flag है।

const NUKTA = /़/g;
const CHANDRABINDU = /ँ/g;
const INVISIBLE = /[​-‍⁠﻿­]/g;
const DEVANAGARI_DIGIT = /[०-९]/g;

export function normalizePattern(src: string): string {
  return src.normalize("NFC").replace(NUKTA, "").replace(CHANDRABINDU, "ं");
}

export function normalizeText(text: string): string {
  return normalizePattern(text)
    .replace(INVISIBLE, "")
    .replace(DEVANAGARI_DIGIT, (d) => String(d.charCodeAt(0) - 0x0966))
    .replace(/\s+/g, " ")
    .toLowerCase();
}
