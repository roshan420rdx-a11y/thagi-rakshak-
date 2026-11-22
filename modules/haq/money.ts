// लोग रकम कई तरह लिखते हैं: 40000, 40,000, 4,00,000, ₹4,999.50, Rs. 12000/-, 12000 रुपये, ४०,०००।
// सबको रुपयों (पैसे तक, ज़्यादा से ज़्यादा 2 दशमलव) में बदलना। कुछ और हो तो null: तब हिंदी में गलती दिखती है।
export const MAX_RUPEES = 1_000_000_000;

const PREFIX = /^(?:₹|rs\.?|inr)\s*/;
const SUFFIX = /\s*(?:\/-|रुपये|रुपए|रु\.?|rupees?|rs\.?)$/;
const SHAPE = /^\d+(?:,\d+)*(?:\.\d{1,2})?$/; // अंक, बीच में comma (भारतीय या अंग्रेज़ी ढंग), और 2 दशमलव तक

export function parseRupees(raw: string): number | null {
  const s = raw
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 0x0966))
    .replace(PREFIX, "")
    .replace(SUFFIX, "")
    .trim();
  if (!SHAPE.test(s)) return null;
  const value = Math.round(Number(s.replace(/,/g, "")) * 100) / 100;
  return Number.isFinite(value) && value >= 0 && value <= MAX_RUPEES ? value : null;
}
