import type { Metadata } from "next";
import Link from "next/link";
import { AbhyasQuiz } from "@/components/abhyas/abhyas-quiz";
import { absoluteUrl, getSiteConfig } from "@/modules/site";
import { pageMeta } from "@/modules/site/meta";

export const metadata: Metadata = pageMeta({
  title: "ठगी पहचानने का अभ्यास: ठगी या असली?",
  description:
    "असली जैसे 8 SMS, WhatsApp और call वाले message: हर एक पर बताइए ठगी है या असली, और तुरंत जानिए क्यों। 2 मिनट, मुफ़्त, कुछ सेव नहीं होता।",
  path: "/abhyas",
});

// "ठगी या असली?" अभ्यास (plan A3f): ठगी से पहले बचाव। सब फ़ोन में; यह पन्ना ख़ुद कुछ नहीं जानता।
export default function AbhyasPage() {
  const pageUrl = absoluteUrl("/abhyas", getSiteConfig().siteUrl);
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">ठगी पहचानने का अभ्यास</h1>
      <p>8 message आएँगे: SMS, WhatsApp, या call पर कही बात। हर एक पर बताइए, ठगी है या असली। जवाब देते ही पता चलेगा क्यों। 2 मिनट लगेंगे, कुछ सेव नहीं होता।</p>
      <noscript>
        <p className="rounded-xl border-2 border-warn bg-warn-bg p-3 font-semibold text-warn">
          यह अभ्यास JavaScript से चलता है। तब तक ज्ञानकोश में ठगी के असली जैसे उदाहरण और उनके निशान देखें।
        </p>
      </noscript>
      <AbhyasQuiz pageUrl={pageUrl} />
      <Link href="/gyan" className="flex min-h-12 items-center font-semibold text-brand">
        ज्ञानकोश: ठगी कैसे होती है, कैसे बचें →
      </Link>
    </div>
  );
}
