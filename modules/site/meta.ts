import type { Metadata } from "next";
import type { TurantSlug } from "@/modules/scams";

// हर पन्ने का title, description, canonical और Open Graph (WhatsApp में link भेजने पर दिखने वाला preview) एक ही जगह से।
// description 160 अक्षर तक (Google इससे ज़्यादा काट देता है); e2e-seo हर पन्ने पर यह जाँचता है।
export const SITE_NAME = "ठगी रक्षक";

export function pageMeta({ title, description, path, fullTitle }: { title?: string; description: string; path: string; fullTitle?: string }): Metadata {
  const t = fullTitle ?? `${title} — ${SITE_NAME}`;
  return {
    title: t,
    description,
    alternates: { canonical: path },
    openGraph: { title: t, description, url: path, siteName: SITE_NAME, locale: "hi_IN", type: "website" },
  };
}

// /turant के पन्ने: खोजने वाला घबराया हुआ है, इसलिए description में सीधे पहला कदम
export const TURANT_DESCRIPTIONS: Record<TurantSlug, string> = {
  upi: "UPI से ठगी में पैसे गए? पहले 30 मिनट में 1930 पर call करें, फिर बैंक को बताएँ। कदम-दर-कदम मुफ़्त मदद, बिना login, internet के बिना भी।",
  card: "Card से अनजान लेन-देन हुआ? card तुरंत block करें, 1930 पर call करें और बैंक को लिखित शिकायत भेजें। कदम-दर-कदम मुफ़्त मदद।",
  netbanking: "Net banking से पैसे गए? 1930 पर call, बैंक को आज ही सूचना, और लिखित शिकायत। कौन-से सबूत सँभालें, सब कदम-दर-कदम, मुफ़्त।",
  wallet: "Wallet ऐप से पैसे गए? 1930 पर call करें, फिर ऐप और बैंक को बताएँ। कौन-से सबूत सँभालें, सब कदम-दर-कदम, मुफ़्त।",
  "digital-arrest": "पुलिस, CBI या कोर्ट बनकर video call पर 'digital arrest' का डर दिखाया? यह ठगी है। call काटें, पैसे न भेजें। पैसे गए हों तो अभी क्या करें।",
  sextortion: "Video call की recording से ब्लैकमेल हो रहा है? पैसे न दें, यह आपकी गलती नहीं है। शिकायत कैसे करें, और किससे बात करें (Tele-MANAS 14416)।",
  "loan-app": "Loan ऐप वाले धमका रहे हैं या photo भेजने का डर दिखा रहे हैं? पैसे न भेजें, सबूत रखें और शिकायत करें। अभी क्या करें, कदम-दर-कदम।",
  "investment-task": "Task या निवेश वाली कमाई में पैसे फँस गए? 'withdraw fee' या 'tax' के नाम पर और पैसे न भेजें। 1930 पर call और बाकी कदम, मुफ़्त।",
  "customer-care-fake": "नकली customer care ने ऐप डलवाया या पैसे कटवाए? ऐप हटाएँ, UPI PIN बदलें, 1930 पर call करें। कदम-दर-कदम मुफ़्त मदद।",
  "pata-nahi": "पता नहीं कैसे, बस खाते से पैसे कट गए? पहले 30 मिनट में 1930 पर call करें, फिर बैंक को बताएँ। कदम-दर-कदम मुफ़्त मदद।",
};
