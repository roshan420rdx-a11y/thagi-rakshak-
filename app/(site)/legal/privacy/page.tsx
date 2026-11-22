import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";
import { DraftBanner } from "@/components/legal/draft-banner";
import { LegalSection } from "@/components/legal/section";

export const metadata: Metadata = pageMeta({
  title: "निजता (privacy)",
  description:
    "ठगी रक्षक आपकी कौन-सी जानकारी लेता है और कौन-सी नहीं: कोई cookie या tracker नहीं, 'पहले पूछो' का message आपके फ़ोन में ही।",
  path: "/legal/privacy",
});

// इस पन्ने के दावे (कोई cookie नहीं, कोई बाहरी request नहीं) scripts/e2e-legal.mjs से जाँचे जाते हैं।
// साइट में कुछ भी नया जुड़े जो जानकारी ले, तो पहले यह पन्ना बदलें।
export default function PrivacyPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-[22px] font-bold leading-snug">निजता (privacy): आपकी जानकारी का क्या होता है</h1>
      <DraftBanner />

      <LegalSection title="संक्षेप में">
        <p className="font-semibold">अभी हम आपका नाम, फ़ोन नंबर, खाता नंबर या कोई पहचान वाली जानकारी नहीं माँगते और नहीं रखते।</p>
      </LegalSection>

      <LegalSection title='"आपका हक़" वाले हिसाब में भरी जानकारी'>
        <p>
          हिसाब के form में आप तारीख़ें, रकम और हाँ या नहीं वाले जवाब भरते हैं। ये सिर्फ़ उसी समय हिसाब लगाने के लिए इस्तेमाल
          होते हैं, और किसी database में नहीं रखे जाते।
        </p>
        <p>
          पर ये जवाब पन्ने के पते (URL) में होते हैं, इसलिए आपके browser की history में, और साइट चलाने वाले hosting के
          तकनीकी logs में कुछ समय तक रह सकते हैं। फ़ोन साझा हो, तो browser की history मिटा दें।
        </p>
      </LegalSection>

      <LegalSection title='"पहले पूछो" में चिपकाया message'>
        <p>
          “पहले पूछो” के box में चिपकाया message आपके फ़ोन के browser में ही जाँचा जाता है। वह न हमारे server पर आता है, न
          पन्ने के पते (URL) में जुड़ता है, और न कहीं सेव होता है। पन्ना बंद करते ही वह मिट जाता है।
        </p>
        <p>
          “परिवार को भेजें” दबाने पर WhatsApp में सिर्फ़ जाँच का नतीजा और उसके कारण जाते हैं, आपका message नहीं। वह भी तभी,
          जब आप ख़ुद भेजें।
        </p>
      </LegalSection>

      <LegalSection title='"सुनें" बटन'>
        <p>
          “सुनें” बटन आपके फ़ोन या browser की अपनी आवाज़ वाली सुविधा से पढ़कर सुनाता है। कुछ browser इसके लिए text अपनी कंपनी के
          server पर भेज सकते हैं। इसलिए “पहले पूछो” में सिर्फ़ जाँच का नतीजा और कारण सुनाए जाते हैं, आपका message या उसमें आए
          पते नहीं।
        </p>
      </LegalSection>

      <LegalSection title="तकनीकी जानकारी">
        <p>
          वेबसाइट चलाने और उसे सुरक्षित रखने के लिए hosting server अपने आप कुछ तकनीकी बातें देखता है, जैसे IP पता, browser का
          प्रकार और कौन-सा पन्ना खोला गया। इससे हम किसी की पहचान नहीं करते।
        </p>
      </LegalSection>

      <LegalSection title="फ़ोन में सेव पन्ने (offline)">
        <p>
          इमरजेंसी पन्ने, बैंक वाला पन्ना और “पहले पूछो” internet बंद होने पर भी खुलें, इसलिए वे आपके फ़ोन में सेव होते हैं।
          उनमें आपकी कोई निजी जानकारी नहीं होती; “पहले पूछो” में चिपकाया message सेव नहीं होता। मिटाने हों, तो browser की settings में इस साइट का data मिटाएँ।
        </p>
      </LegalSection>

      <LegalSection title="cookie और tracking">
        <p>अभी कोई cookie, analytics या विज्ञापन वाला tracker नहीं। साइट किसी दूसरी कंपनी की script नहीं चलाती।</p>
      </LegalSection>

      <LegalSection title="बाहरी links">
        <p>हम RBI, cybercrime.gov.in और बैंकों की साइटों के links देते हैं। वहाँ जाने पर उनकी अपनी नीति लागू होती है।</p>
      </LegalSection>

      <LegalSection title="आगे क्या बदलेगा">
        <p>
          WhatsApp पर मदद या &quot;मेरा केस&quot; जैसी सुविधाएँ शुरू होने से पहले यह पन्ना बदलेगा। उसमें बताया जाएगा कि कौन-सी
          जानकारी ली जाएगी, क्यों ली जाएगी और कब तक रखी जाएगी, और आपकी अलग से सहमति ली जाएगी।
        </p>
      </LegalSection>

      <LegalSection title="आपके अधिकार">
        <p>
          भारत के डेटा संरक्षण कानून (Digital Personal Data Protection Act, 2023) के तहत आप अपनी जानकारी के बारे में पूछ सकते हैं,
          उसे सुधारने या मिटाने को कह सकते हैं, शिकायत कर सकते हैं, और अपनी जगह किसी और को नामित कर सकते हैं। शिकायत पहले
          हमारे{" "}
          <Link href="/legal/shikayat" className="font-semibold text-brand">
            शिकायत अधिकारी
          </Link>{" "}
          से करें, फिर ज़रूरत हो तो Data Protection Board of India से।
        </p>
        <p className="text-[14px] text-muted">[इस हिस्से की वकील से जाँच बाकी है]</p>
      </LegalSection>

      <LegalSection title="आपकी जानकारी मिटाना">
        <p>अभी हमारे पास आपकी कोई जानकारी सँभली नहीं है, इसलिए मिटाने को कुछ नहीं है। अपने फ़ोन से मिटाने का तरीका ऊपर लिखा है।</p>
      </LegalSection>
    </div>
  );
}
