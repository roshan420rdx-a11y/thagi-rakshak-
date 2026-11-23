import { normalizeText } from "./normalize";

// message में आए पते (domain)। सिर्फ़ फ़ोन पर नतीजे में दिखाने के लिए; share में कभी नहीं।
const TLD = "com|in|net|org|xyz|top|info|ly|me|link|site|online|live|club|vip|shop|cc|co|io|app|biz";
const DOMAIN = new RegExp(`(?<![a-z0-9@._-])(?:https?://)?(?:www\\.)?((?:[a-z0-9-]+\\.)+(?:${TLD}))(?![a-z0-9-])`, "g");

export const MAX_DOMAINS = 5;

export function extractDomains(text: string): string[] {
  const found = new Set<string>();
  for (const m of normalizeText(text).matchAll(DOMAIN)) {
    found.add(m[1]);
    if (found.size >= MAX_DOMAINS) break;
  }
  return [...found];
}

// RBI/2025-26/28: ".bank.in" सिर्फ़ बैंकों के लिए (IDRBT अकेला registrar)। बैंक के नाम वाला कोई और पता = शक
const BANK_WORD = /sbi|hdfc|icici|pnb|kotak|canara|baroda|yono|unionbank|bank|(?:^|[.-])(?:axis|bob)(?:[.-]|$)/;

export function isBankLookalike(domain: string): boolean {
  return !domain.endsWith(".bank.in") && BANK_WORD.test(domain);
}

// सरकारी विभागों की साइटें आम तौर पर .gov.in या .nic.in पर। सरकारी काम (चालान, आयकर, आधार, PF…) वाले message में दूसरा पता = शक
export function isGovDomain(domain: string): boolean {
  return domain.endsWith(".gov.in") || domain.endsWith(".nic.in");
}
