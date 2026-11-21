// बैंकों की सूची। कोई भी नंबर या website का पता तभी दिखता है, जब दो जाँच हो चुकी हों:
// "claude" (बैंक की अपनी .bank.in साइट से मूल लाइन के साथ) और "owner" (मालिक ने फ़ोन पर ख़ुद खोलकर मिलाया)।
// तरीका: docs/verify/BANKS.md

export type Verified = { verifiedBy: string[]; verifiedOn: string | null };

export type BankChannel = Verified & {
  kind: "tel" | "sms" | "email" | "web"; // web = बैंक का .bank.in होम पेज, जहाँ "report fraud" वाला link है
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

const C1 = { verifiedBy: ["claude"], verifiedOn: "2026-11-21" }; // जाँच 1 (Claude); मालिक की जाँच के बाद "owner" जुड़ेगा

const site = (url: string) => ({ url, ...C1 });
const web = (url: string, linkText: string): BankChannel => ({
  kind: "web",
  value: url,
  labelHi: `बैंक की साइट के होम पेज पर "${linkText}" दबाएँ`,
  sourceUrl: url,
  sourceQuote: `link: "${linkText}"`,
  ...C1,
});
const tel = (value: string, labelHi: string, sourceUrl: string, sourceQuote: string): BankChannel => ({ kind: "tel", value, labelHi, sourceUrl, sourceQuote, ...C1 });

const HDFC_Q = "To report any unauthorised Credit Card, Debit Card, NetBanking, or UPI transactions, please call 1800 258 6161.";
const BOB_Q = "In case Fraud taken place, immediately block respective channel or Freeze the Account for Debit Transactions by calling Bank’s Toll-Free No. 1800 5700 / 1800 5000";
const UNION_Q = "To block your card or to report fraud/disputed transactions, call Bank’s All-India Toll Free number - 1800 2222 44 / 1800 2222 43.";
const ICICI_Q = "Report unauthorized transaction Toll Free No 1800 1080";

export const BANKS: readonly BankEntry[] = [
  {
    slug: "sbi",
    nameHi: "भारतीय स्टेट बैंक (SBI)",
    nameEn: "State Bank of India",
    officialSite: site("https://sbi.bank.in/"),
    channels: [web("https://sbi.bank.in/", "Unauthorized Digital Transaction Reporting")],
  },
  {
    slug: "hdfc",
    nameHi: "HDFC बैंक",
    nameEn: "HDFC Bank",
    officialSite: site("https://www.hdfc.bank.in/"),
    channels: [tel("18002586161", "card, NetBanking या UPI से बिना मंज़ूरी के लेन-देन की report", "https://www.hdfc.bank.in/upi/report-frauds", HDFC_Q)],
  },
  {
    slug: "icici",
    nameHi: "ICICI बैंक",
    nameEn: "ICICI Bank",
    officialSite: site("https://www.icici.bank.in/"),
    channels: [tel("18001080", "toll-free (बिना मंज़ूरी के लेन-देन की report वाले हिस्से में दिया)", "https://www.icici.bank.in/personal-banking/help/online-safe-banking", ICICI_Q)],
  },
  {
    slug: "pnb",
    nameHi: "पंजाब नेशनल बैंक (PNB)",
    nameEn: "Punjab National Bank",
    officialSite: site("https://www.pnb.bank.in/"),
    channels: [web("https://www.pnb.bank.in/", "नेट बैंकिंग ब्लॉक करें")],
  },
  {
    slug: "bob",
    nameHi: "बैंक ऑफ़ बड़ौदा",
    nameEn: "Bank of Baroda",
    officialSite: site("https://bankofbaroda.bank.in/"),
    channels: [
      tel("18005700", "ठगी होने पर खाता या channel block करने का toll-free", "https://bankofbaroda.bank.in/customer-support", BOB_Q),
      tel("18005000", "ठगी होने पर खाता या channel block करने का toll-free (दूसरा)", "https://bankofbaroda.bank.in/customer-support", BOB_Q),
    ],
  },
  {
    slug: "canara",
    nameHi: "केनरा बैंक",
    nameEn: "Canara Bank",
    officialSite: site("https://www.canarabank.bank.in/"),
    channels: [web("https://www.canarabank.bank.in/", "REPORT UNAUTHORISED/FRAUDULENT..")],
  },
  {
    slug: "union",
    nameHi: "यूनियन बैंक ऑफ़ इंडिया",
    nameEn: "Union Bank of India",
    officialSite: site("https://www.unionbankofindia.bank.in/"),
    channels: [
      tel("1800222244", "card block या ठगी/विवादित लेन-देन की report का toll-free", "https://www.unionbankofindia.bank.in/en/common/cyber-security", UNION_Q),
      tel("1800222243", "card block या ठगी/विवादित लेन-देन की report का toll-free (दूसरा)", "https://www.unionbankofindia.bank.in/en/common/cyber-security", UNION_Q),
    ],
  },
  {
    slug: "axis",
    nameHi: "Axis बैंक",
    nameEn: "Axis Bank",
    officialSite: site("https://www.axis.bank.in/"),
    channels: [web("https://www.axis.bank.in/", "Report A Fraud")],
  },
  {
    slug: "kotak",
    nameHi: "कोटक महिंद्रा बैंक",
    nameEn: "Kotak Mahindra Bank",
    officialSite: site("https://www.kotak.bank.in/"),
    channels: [web("https://www.kotak.bank.in/", "Report a fraud Raise a dispute or report suspicious transaction")],
  },
  // Bank of India: साइट bot-जाँच (Cloudflare) के कारण नहीं खुली (2026-11-21), इसलिए अभी कुछ नहीं
  { slug: "boi", nameHi: "बैंक ऑफ़ इंडिया", nameEn: "Bank of India", officialSite: null, channels: [] },
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
