import { EN } from "./en";
import type { Locale } from "./locale";

export type Vars = Record<string, string | number>;

// हिंदी वाक्य ही "कुंजी" है। English चुनी हो और अनुवाद मिले तो वह, वरना हिंदी जस की तस (अधूरे अनुवाद से साइट नहीं टूटती)।
// बदलते हिस्से {नाम} से: translate("hi", "{n} दिन बाकी", { n: 4 })
export function translate(locale: Locale, text: string, vars?: Vars): string {
  const base = locale === "en" ? (EN[text] ?? text) : text;
  if (!vars) return base;
  return base.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));
}
