import type { TurantSlug } from "./turant";

// /turant पर "यह कब हुआ?" (spec भाग 2, खंड 6.2)। सिर्फ़ आम जल्दबाज़ी वाली सलाह: हक़, पात्रता या deadline का हिसाब
// यहाँ नहीं (वह सिर्फ़ rules engine, /haq/thagi पर)। कोई वादा नहीं: "उम्मीद", "हो सकती है"।
export type KabId = "hour" | "today" | "days" | "older";

export const KAB_OPTIONS: readonly { id: KabId; labelHi: string }[] = [
  { id: "hour", labelHi: "1 घंटे से कम" },
  { id: "today", labelHi: "आज ही" },
  { id: "days", labelHi: "1 से 5 दिन पहले" },
  { id: "older", labelHi: "5 दिन से ज़्यादा पहले" },
];

export const KAB_ADVICE: Record<KabId, { tone: "danger" | "warn" | "info"; textHi: string }> = {
  hour: {
    tone: "danger",
    textHi: "अभी पहला घंटा चल रहा है। सबसे पहले 1930 पर call करें: इतनी जल्दी शिकायत पर ठग के खाते में पैसा रुकने की उम्मीद सबसे ज़्यादा होती है।",
  },
  today: {
    tone: "warn",
    textHi: "आज ही, अभी: 1930 पर call करें और बैंक को बताएँ। हर घंटा कीमती है।",
  },
  days: {
    tone: "warn",
    textHi: "अब भी देर नहीं हुई। 1930 और बैंक, दोनों को आज ही बताएँ: RBI के नियमों में जितनी जल्दी बताएँगे, आपकी ज़िम्मेदारी उतनी कम हो सकती है।",
  },
  older: {
    tone: "info",
    textHi: "देर हो गई है, फिर भी शिकायत ज़रूर करें: 1930 या cybercrime.gov.in पर, और बैंक को लिखित में। शिकायत का नंबर सँभालकर रखें।",
  },
};

// धमकी वाले प्रकारों (sextortion, loan-app) पर नहीं: वहाँ पहला कदम "पैसे न भेजें" है, समय नहीं
const ASK_WHEN = new Set<TurantSlug>(["upi", "card", "netbanking", "wallet", "digital-arrest", "investment-task", "customer-care-fake", "pata-nahi"]);

export function asksWhen(slug: TurantSlug): boolean {
  return ASK_WHEN.has(slug);
}
