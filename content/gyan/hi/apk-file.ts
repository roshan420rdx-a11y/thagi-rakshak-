import type { GyanPage } from "@/modules/gyan/types";

export const apkFile: GyanPage = {
  slug: "apk-file",
  navTitleHi: "APK फ़ाइल वाली ठगी",
  titleHi: "APK फ़ाइल वाली ठगी: शादी का कार्ड, चालान या बैंक KYC",
  descriptionHi: "WhatsApp पर शादी का कार्ड, चालान या KYC बताकर भेजी गई APK फ़ाइल से फ़ोन पर कब्ज़ा। पहचान के निशान, और install कर ली हो तो अभी क्या करें।",
  summaryHi: [
    'WhatsApp पर कोई फ़ाइल आती है: "शादी का कार्ड", "चालान", "बिजली बिल" या "बैंक KYC update"।',
    "वह फ़ाइल असल में एक ऐप (.apk) होती है।",
    "उसे install करते ही ठग आपके SMS, OTP और बैंक ऐप तक पहुँच सकते हैं।",
  ],
  howHi: [
    "किसी जान-पहचान वाले के नंबर से (जिसका फ़ोन पहले से ठगों के कब्ज़े में होता है), या अनजान नंबर से एक फ़ाइल आती है।",
    "फ़ाइल का नाम कुछ ऐसा होता है: Wedding_Card.apk, Challan.apk या KYC_Update.apk।",
    'खोलने पर फ़ोन "unknown apps install" की अनुमति माँगता है, और फिर ऐप SMS पढ़ने की अनुमति माँगता है।',
    "install होते ही ऐप आपके OTP वाले SMS ठगों तक भेजने लगता है, और कई बार आपके नंबर से दूसरों को भी यही फ़ाइल भेज देता है।",
    "फिर OTP से आपके खाते या card से पैसे निकाले जाते हैं।",
  ],
  signsHi: [
    "WhatsApp या SMS पर .apk वाली फ़ाइल",
    "शादी का कार्ड, चालान या KYC का बहाना",
    'फ़ाइल खोलने पर "install" की अनुमति माँगना',
    'ऐप का SMS पढ़ने या "accessibility" की अनुमति माँगना',
    "बिना कुछ किए OTP वाले SMS आना",
  ],
  examplesHi: [
    '"हमारी बेटी की शादी में ज़रूर आइए, कार्ड भेज रहे हैं: Wedding_Invitation.apk"',
    '"आपका चालान बाकी है, details के लिए यह फ़ाइल खोलें: Challan_Details.apk"',
  ],
  rulesHi: [
    "WhatsApp या SMS पर आई कोई भी .apk फ़ाइल कभी न खोलें, चाहे भेजने वाला जान-पहचान का हो।",
    "ऐप सिर्फ़ Play Store या App Store से डालें।",
    'फ़ोन की settings में "unknown apps install" की अनुमति बंद रखें।',
  ],
  faq: [
    {
      qHi: "फ़ाइल install कर ली है। अब क्या करूँ?",
      aHi: "फ़ोन का internet तुरंत बंद करें और वह ऐप हटाएँ। बैंक को बताएँ और 1930 पर शिकायत करें। फ़ोन किसी भरोसेमंद जानकार से जँचवाएँ, फिर UPI PIN और banking password बदलें।",
      link: { href: "/turant", labelHi: "पहले 60 मिनट के कदम देखें →" },
    },
    {
      qHi: "फ़ाइल जान-पहचान वाले के नंबर से आई थी, तब भी?",
      aHi: "हाँ। ठग अक्सर किसी एक के फ़ोन पर कब्ज़ा करके उसके सारे contacts को यही फ़ाइल भेजते हैं। भेजने वाले को फ़ोन करके बता दें।",
    },
  ],
  turantSlug: "customer-care-fake",
  author: "ठगी रक्षक टीम",
  reviewer: null,
  lastCheckedOn: "2026-11-21",
};
