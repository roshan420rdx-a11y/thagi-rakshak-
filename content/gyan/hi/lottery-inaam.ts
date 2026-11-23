import type { GyanPage } from "@/modules/gyan/types";

export const lotteryInaam: GyanPage = {
  slug: "lottery-inaam",
  navTitleHi: "लॉटरी, इनाम और 'पहले fee' वाली ठगी",
  titleHi: 'लॉटरी और इनाम वाली ठगी: "आपने 25 लाख जीते हैं"',
  descriptionHi: "KBC, lucky draw या इनाम के नाम पर पहले fee, tax या GST माँगने वाली ठगी। पहचान के निशान, और पैसे गए हों तो क्या करें।",
  summaryHi: [
    'message या call आता है: "आपके नंबर ने KBC या lucky draw में 25 लाख जीते हैं"।',
    'इनाम पाने के लिए पहले "processing fee", "tax" या "GST" भरने को कहा जाता है।',
    "एक बार भरने पर नई-नई fee माँगी जाती है, और इनाम कभी नहीं आता।",
  ],
  howHi: [
    "WhatsApp पर किसी मशहूर शो, कंपनी या बड़े इंसान की photo के साथ इनाम का message आता है।",
    '"lottery manager" से बात करवाई जाती है, जो नकली certificate या cheque की photo भेजता है।',
    'इनाम "release" करने के लिए किसी खाते या UPI ID पर fee या tax भरने को कहा जाता है।',
    'हर भुगतान के बाद नया बहाना: "transfer charge", "customs", "RBI fee"।',
    "यही तरीका दूसरे नामों से भी: policy का bonus, scholarship, विदेश से आया gift या parcel, refund। हर बार 'पाने के लिए पहले fee'।",
  ],
  signsHi: [
    "ऐसी लॉटरी या इनाम, जिसमें आपने कभी हिस्सा ही नहीं लिया",
    "इनाम पाने से पहले fee, tax या GST माँगना",
    "मशहूर शो, कंपनी या बड़े इंसान का नाम और photo",
    'किसी आम mobile नंबर या WhatsApp से बात करने वाला "lottery manager"',
    'जल्दी का दबाव: "आज ही claim करें"',
  ],
  examplesHi: [
    '"Congratulations! आपके नंबर ने KBC lucky draw में ₹25,00,000 जीते हैं। इनाम पाने के लिए ₹12,500 processing fee जमा करें।"',
    '"आपके इनाम का cheque तैयार है। transfer के लिए ₹18,000 tax पहले भरें।"',
  ],
  rulesHi: [
    "जिस लॉटरी या draw में आपने हिस्सा नहीं लिया, उसका इनाम नहीं आता।",
    "इनाम के नाम पर कभी पहले पैसे न भेजें, ख़ासकर किसी अनजान खाते या UPI ID पर।",
    "message में दिए नंबर पर call न करें, और अपनी bank details या OTP किसी को न दें।",
  ],
  faq: [
    {
      qHi: "उन्होंने RBI या किसी बड़ी कंपनी की मोहर वाला काग़ज़ भेजा है।",
      aHi: "ऐसे काग़ज़ आसानी से नकली बनते हैं। RBI आम लोगों को इनाम या लॉटरी का पैसा नहीं भेजता, और न उसके लिए fee माँगता है।",
    },
    {
      qHi: "मैंने fee भर दी है, अब वे और माँग रहे हैं।",
      aHi: "और न भेजें। 1930 पर call करें, और जितना भेजा है उसका लेन-देन नंबर (UTR) सँभालकर रखें।",
      link: { href: "/turant", labelHi: "पैसे गए हों तो अभी क्या करें →" },
    },
    {
      qHi: "lottery नहीं, policy bonus, scholarship या gift parcel की बात है। वह भी ठगी है?",
      aHi: "हाँ, अगर पाने के लिए पहले fee, tax, GST या customs के पैसे माँगे जाएँ। असली bonus, scholarship या refund सीधे खाते में आता है, उसके लिए किसी को पहले पैसे नहीं भेजने पड़ते। policy या scholarship की जानकारी उसकी अपनी official वेबसाइट या दफ़्तर से लें।",
    },
  ],
  turantSlug: "upi",
  author: "ठगी रक्षक टीम",
  reviewer: null,
  lastCheckedOn: "2026-11-23",
};
