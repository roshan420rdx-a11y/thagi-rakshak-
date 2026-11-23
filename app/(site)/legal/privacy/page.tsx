import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";
import { DraftBanner } from "@/components/legal/draft-banner";
import { LegalSection } from "@/components/legal/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";

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
      <Breadcrumb items={[{ href: "/legal", labelHi: "नियम और नीतियाँ" }, { labelHi: "निजता" }]} />
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">निजता (privacy): आपकी जानकारी का क्या होता है</h1>
      <DraftBanner />

      <LegalSection title="संक्षेप में">
        <p className="font-semibold">
          साइट के ज़रिए आपकी कोई पहचान वाली जानकारी (नाम, फ़ोन नंबर, खाता नंबर) हमारे पास नहीं आती, और हम कुछ नहीं रखते। जो आप
          “मेरा केस” या “अर्ज़ियाँ” में लिखते हैं, वह सिर्फ़ आपके फ़ोन में रहता है। WhatsApp पर बात करें, तो नीचे “WhatsApp पर बात”
          देखें।
        </p>
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
        <p>
          ऐप home screen पर जोड़ा हो और आप WhatsApp या SMS से Share करके message भेजें, तब भी वह फ़ोन के अंदर ही रहता है:
          फ़ोन में ठगी रक्षक का offline वाला हिस्सा (service worker) उसे लेकर “पहले पूछो” को देता है, और पन्ना उसे पढ़ते ही
          मिटा देता है। अगर कभी यह हिस्सा फ़ोन में न हो, तो message हमारे server तक पहुँच सकता है, पर server उसे पढ़े या रखे
          बिना आपको “पहले पूछो” पर भेज देता है; तब message वहाँ ख़ुद चिपकाना होगा।
        </p>
        <p>
          “बोलकर लिखें” दबाने पर आपकी आवाज़ से text आपका browser बनाता है (जैसे Chrome में Google की आवाज़ वाली सेवा)। वह
          आवाज़ उस सेवा तक जाती है, हमारे server पर नहीं; बना हुआ text आपके फ़ोन में ही जाँचा जाता है। यह नहीं चाहते, तो
          message लिखकर या चिपकाकर जाँचें।
        </p>
      </LegalSection>

      <LegalSection title='"ठगी या असली?" अभ्यास'>
        <p>
          अभ्यास में आपके जवाब सिर्फ़ उसी समय फ़ोन में गिने जाते हैं; न कहीं सेव होते हैं, न भेजे जाते हैं। “परिवार को भेजें” दबाने पर
          WhatsApp में सिर्फ़ आपकी गिनती (जैसे “8 में से 6”) और इस पन्ने का पता जाता है, वह भी तभी जब आप ख़ुद भेजें।
        </p>
      </LegalSection>

      <LegalSection title='"मेरा केस" में भरी जानकारी'>
        <p>
          “मेरा केस” में भरी तारीख़ें, रकम और शिकायत नंबर सिर्फ़ आपके फ़ोन के browser में (localStorage में) सेव होते हैं। वे
          हमारे server पर नहीं आते। “सार” copy करना, calendar की file बनाना और “अर्ज़ियाँ” वाले पत्र बनाना भी फ़ोन में ही होता है; पत्र के लिए लिखा नाम और पता कहीं सेव नहीं होता। “सब मिटाएँ” दबाने से, या browser में इस साइट का data मिटाने से, वे हट जाते हैं। फ़ोन साझा हो,
          तो काम के बाद मिटा दें।
        </p>
        <p>
          “आपका हक़” में “मेरा केस से भरें” दबाने पर वे तारीख़ें और रकम सिर्फ़ उसी पन्ने के डिब्बों में भरती हैं। फिर “हिसाब देखें”
          दबाएँ, तो वे बाकी जवाबों की तरह पन्ने के पते (URL) में जाती हैं (ऊपर “आपका हक़” वाला हिस्सा देखें)।
        </p>
      </LegalSection>

      <LegalSection title="WhatsApp पर बात">
        <p>
          होम के “WhatsApp पर बात करें” बटन से (जब यह चालू हो) बात करने पर, आपका WhatsApp नंबर और भेजे गए संदेश हमारे WhatsApp
          Business फ़ोन में आते हैं, और WhatsApp की अपनी नीति भी लागू होती है। हम इनका इस्तेमाल सिर्फ़ आपकी मदद के लिए करते हैं,
          किसी और को forward नहीं करते, और बात पूरी होने पर आए screenshots फ़ोन से हटा देते हैं। आप कहें, तो chat भी मिटा देंगे।
        </p>
        <p className="font-semibold">OTP, PIN, password या पूरा खाता नंबर कभी न भेजें, हमें भी नहीं।</p>
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
          इमरजेंसी पन्ने, बैंक वाला पन्ना, “पहले पूछो”, “ठगी या असली?” अभ्यास, “शिकायत का रास्ता”, “ज़रूरी नंबर”, “मेरा केस” और “अर्ज़ियाँ” internet बंद होने पर भी खुलें, इसलिए वे आपके फ़ोन में सेव होते हैं।
          उनमें आपकी कोई निजी जानकारी नहीं होती; “पहले पूछो” में चिपकाया message सेव नहीं होता। मिटाने हों, तो browser की settings में इस साइट का data मिटाएँ।
        </p>
      </LegalSection>

      <LegalSection title="cookie और tracking">
        <p>अभी कोई cookie, analytics या विज्ञापन वाला tracker नहीं। साइट किसी दूसरी कंपनी की script नहीं चलाती।</p>
      </LegalSection>

      <LegalSection title="बाहरी links">
        <p>
          हम RBI, cybercrime.gov.in, Sanchar Saathi (sancharsaathi.gov.in) और बैंकों की साइटों के links देते हैं। वहाँ जाने पर उनकी अपनी
          नीति लागू होती है।
        </p>
      </LegalSection>

      <LegalSection title="आगे क्या बदलेगा">
        <p>
          खाते वाला “मेरा केस” (जिसमें जानकारी हमारे server पर रखी जाए) या WhatsApp पर अपने-आप याद दिलाना शुरू होने से पहले यह
          पन्ना बदलेगा। उसमें बताया जाएगा कि कौन-सी जानकारी ली जाएगी, क्यों ली जाएगी और कब तक रखी जाएगी, और आपकी अलग से सहमति
          ली जाएगी।
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
        <p>
          साइट के server पर हमारे पास आपकी कोई जानकारी सँभली नहीं है। फ़ोन वाली जानकारी: “मेरा केस” में “सब मिटाएँ” दबाएँ, या browser
          में इस साइट का data मिटाएँ। WhatsApp पर हुई बात मिटवानी हो, तो वहीं लिख दें।
        </p>
      </LegalSection>
    </div>
  );
}
