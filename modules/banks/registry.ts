// बैंकों की सूची। कोई भी नंबर या website का पता तभी दिखता है, जब दो जाँच हो चुकी हों:
// "claude" (बैंक की अपनी .bank.in साइट से मूल लाइन के साथ) और "owner" (मालिक ने फ़ोन पर ख़ुद खोलकर मिलाया)।
// तरीका: docs/verify/BANKS.md

export type Verified = { verifiedBy: string[]; verifiedOn: string | null };

export type BankChannel = Verified & {
  kind: "tel" | "sms" | "email";
  value: string;
  labelHi: string;
  sourceUrl: string; // बैंक की .bank.in साइट का वह पन्ना जहाँ यह लिखा है
  sourceQuote: string; // उस पन्ने की मूल लाइन
};

export type BankEntry = {
  slug: string;
  nameHi: string;
  nameEn: string;
  officialSite: (Verified & { url: string }) | null;
  channels: BankChannel[];
};

const bank = (slug: string, nameHi: string, nameEn: string): BankEntry => ({ slug, nameHi, nameEn, officialSite: null, channels: [] });

export const BANKS: readonly BankEntry[] = [
  bank("sbi", "भारतीय स्टेट बैंक (SBI)", "State Bank of India"),
  bank("hdfc", "HDFC बैंक", "HDFC Bank"),
  bank("icici", "ICICI बैंक", "ICICI Bank"),
  bank("pnb", "पंजाब नेशनल बैंक (PNB)", "Punjab National Bank"),
  bank("bob", "बैंक ऑफ़ बड़ौदा", "Bank of Baroda"),
  bank("canara", "केनरा बैंक", "Canara Bank"),
  bank("union", "यूनियन बैंक ऑफ़ इंडिया", "Union Bank of India"),
  bank("axis", "Axis बैंक", "Axis Bank"),
  bank("kotak", "कोटक महिंद्रा बैंक", "Kotak Mahindra Bank"),
  bank("boi", "बैंक ऑफ़ इंडिया", "Bank of India"),
];

export function isLive(v: Verified): boolean {
  return v.verifiedBy.includes("claude") && v.verifiedBy.includes("owner");
}

export function liveChannels(b: BankEntry): BankChannel[] {
  return b.channels.filter(isLive);
}

export function liveSite(b: BankEntry): string | null {
  return b.officialSite && isLive(b.officialSite) ? b.officialSite.url : null;
}

export function getBank(slug: string): BankEntry | undefined {
  return BANKS.find((b) => b.slug === slug);
}
