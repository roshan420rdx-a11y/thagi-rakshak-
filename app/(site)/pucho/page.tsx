import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";
import { CheckerBox } from "@/components/pucho/checker-box";
import { InstallButton } from "@/components/site/install-button";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert } from "@/components/ui/icons";
import { Notice } from "@/components/ui/notice";
import { absoluteUrl, getSiteConfig, SCAM_SIGNS } from "@/modules/site";

export const metadata: Metadata = pageMeta({
  title: "यह message ठगी है? पहले पूछो",
  description:
    "संदिग्ध SMS या WhatsApp message चिपकाएँ, screenshot दें, या call की बात लिखें या बोलें, और ठगी के निशान देखें। सब आपके फ़ोन में ही जाँचा जाता है।",
  path: "/pucho",
});

// "पहले पूछो" (TR-23a): नियमों वाली जाँच फ़ोन के अंदर (CheckerBox, JS से)। बिना JS के भी 8 आम निशान दिखते हैं।
// photo/screenshot से जाँच भी फ़ोन के अंदर (TR-36)।
export default function PuchoPage() {
  const pageUrl = absoluteUrl("/pucho", getSiteConfig().siteUrl);
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">यह message ठगी है? पहले पूछो</h1>
      <p>SMS या WhatsApp का message चिपकाएँ या उसका screenshot दें, या call पर जो कहा गया वह अपने शब्दों में लिखें या बोलें। हिंदी, Hinglish या English, किसी में भी।</p>
      <CheckerBox pageUrl={pageUrl} />
      {/* plan A2f, TR-36b: ऐप जुड़ा हो तो WhatsApp/SMS से message या photo Share करके सीधे जाँच (browser मौका दे, तभी दिखता है) */}
      <InstallButton label="ऐप जोड़ें: फिर WhatsApp या SMS से message या photo सीधे Share करके जाँचें" />
      <h2 className="text-[20px] font-bold leading-snug">ठगी के {SCAM_SIGNS.length} आम निशान</h2>
      <p>इनमें से एक भी दिखे, तो रुकें। पैसे न भेजें, कोई ऐप न डालें।</p>
      <ol data-signs className="space-y-3">
        {SCAM_SIGNS.map((s, i) => (
          <li key={s.titleHi} className="rounded-xl border border-line bg-paper p-3">
            <h3 className="text-[17px] font-bold leading-snug">
              {i + 1}. {s.titleHi}
            </h3>
            <p className="mt-1">{s.bodyHi}</p>
          </li>
        ))}
      </ol>
      <Notice tone="info">
        यह जाँच आम निशान देखती है, पक्का फ़ैसला नहीं करती। photo या screenshot से जाँच में कुछ अक्षर ग़लत पढ़े जाएँ, तो डिब्बे में ठीक
        करके फिर &quot;जाँचें&quot; दबाएँ।
      </Notice>
      <BigDoor
        href="/turant"
        title="पैसे जा चुके हैं?"
        subtitle="अभी क्या करें, देखें"
        tone="danger"
        icon={<IconAlert className="h-8 w-8" />}
      />
      <Link href="/abhyas" className="flex min-h-12 items-center font-semibold text-brand">
        ख़ुद को परखें: ठगी या असली? (अभ्यास, 2 मिनट) →
      </Link>
      <Link href="/gyan" className="flex min-h-12 items-center font-semibold text-brand">
        ठगी के प्रकार विस्तार से: ज्ञानकोश →
      </Link>
    </div>
  );
}
