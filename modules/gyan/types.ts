import type { TurantSlug } from "@/modules/scams";

// ज्ञानकोश के पन्ने का ढाँचा (spec भाग 2, खंड 10)। गिनती वाले नियम (3 लाइन का सार, 5 निशान, 3 नियम…) tests पक्का करते हैं।
export type GyanSlug =
  | "digital-arrest"
  | "customer-care-fake"
  | "upi-pin-qr"
  | "task-investment"
  | "apk-file"
  | "bijli-bill"
  | "lottery-inaam"
  | "sextortion"
  | "loan-app"
  | "kyc-link"
  | "apna-bankar"
  | "galti-se-paise"
  | "aeps-angootha"
  | "sim-swap"
  | "naukri-fee";

export type RbiRef = { file: string; paragraph: string; quote: string };

export type GyanFaq = {
  qHi: string;
  aHi: string;
  link?: { href: "/haq/thagi" | "/gyan/bank" | "/haq/frozen-money" | "/turant"; labelHi: string };
  source?: RbiRef;
};

export type GyanPage = {
  slug: GyanSlug;
  navTitleHi: string;
  titleHi: string;
  descriptionHi: string; // search के लिए, ≤ 160 अक्षर
  summaryHi: [string, string, string]; // 30 सेकंड में
  howHi: string[]; // ठगी कैसे होती है, कदम-दर-कदम
  signsHi: string[]; // पहचान के 5 निशान
  examplesHi: string[]; // ठग के message (बिना असली नंबर या नाम)
  rulesHi: string[]; // बचने के 3 नियम
  faq: GyanFaq[];
  turantSlug: TurantSlug; // "हो गया है?" का पन्ना
  author: string;
  reviewer: { nameHi: string; roleHi: string } | null; // विशेषज्ञ (वकील/बैंक अधिकारी); न हो तो null, गढ़कर नहीं
  lastCheckedOn: string;
};
