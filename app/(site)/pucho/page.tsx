import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";
import { CheckerBox } from "@/components/pucho/checker-box";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert } from "@/components/ui/icons";
import { Notice } from "@/components/ui/notice";
import { absoluteUrl, getSiteConfig, SCAM_SIGNS } from "@/modules/site";

export const metadata: Metadata = pageMeta({
  title: "यह message ठगी है? पहले पूछो",
  description:
    "संदिग्ध SMS या WhatsApp message चिपकाएँ और ठगी के निशान देखें। जाँच आपके फ़ोन में ही होती है। साथ में ठगी के 7 आम निशान।",
  path: "/pucho",
});

// "पहले पूछो" (TR-23a): नियमों वाली जाँच फ़ोन के अंदर (CheckerBox, JS से)। बिना JS के भी 7 आम निशान दिखते हैं।
// screenshot और AI वाली जाँच TR-24 में।
export default function PuchoPage() {
  const pageUrl = absoluteUrl("/pucho", getSiteConfig().siteUrl);
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">यह message ठगी है? पहले पूछो</h1>
      <CheckerBox pageUrl={pageUrl} />
      <h2 className="text-[20px] font-bold leading-snug">ठगी के 7 आम निशान</h2>
      <p>इनमें से एक भी दिखे, तो रुकें। पैसे न भेजें, कोई ऐप न डालें।</p>
      <ol className="space-y-3">
        {SCAM_SIGNS.map((s, i) => (
          <li key={s.titleHi} className="rounded-xl border border-line bg-paper p-3">
            <h3 className="text-[17px] font-bold leading-snug">
              {i + 1}. {s.titleHi}
            </h3>
            <p className="mt-1">{s.bodyHi}</p>
          </li>
        ))}
      </ol>
      <Notice tone="info">अभी सिर्फ़ लिखा हुआ message जाँचा जाता है। screenshot भेजकर पूछने वाली सुविधा बाद में आएगी।</Notice>
      <BigDoor
        href="/turant"
        title="पैसे जा चुके हैं?"
        subtitle="अभी क्या करें, देखें"
        tone="danger"
        icon={<IconAlert className="h-8 w-8" />}
      />
      <Link href="/gyan" className="flex min-h-12 items-center font-semibold text-brand">
        ठगी के प्रकार विस्तार से: ज्ञानकोश →
      </Link>
    </div>
  );
}
