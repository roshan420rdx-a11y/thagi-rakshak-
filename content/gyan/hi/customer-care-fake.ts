import { RBI_BANK_IN } from "@/modules/gyan/refs";
import type { GyanPage } from "@/modules/gyan/types";

export const customerCareFake: GyanPage = {
  slug: "customer-care-fake",
  navTitleHi: "नकली customer care नंबर",
  titleHi: "नकली customer care नंबर: Google पर मिला नंबर क्यों ख़तरनाक है",
  descriptionHi: "Google या social media पर मिले नकली customer care नंबर से होने वाली ठगी। असली नंबर कहाँ मिलेगा, और ऐप डाल दिया हो तो अभी क्या करें।",
  summaryHi: [
    "किसी कंपनी या बैंक का नंबर Google, YouTube या social media पर खोजकर call करते हैं।",
    "वहाँ मिला नंबर ठग का होता है, जो बैंक या कंपनी वाला बनकर बात करता है।",
    "फिर वह कोई ऐप डलवाता है, या OTP या PIN लेकर खाता खाली कर देता है।",
  ],
  howHi: [
    'आपको refund, gas booking, बिजली बिल या किसी ऐप में दिक्कत होती है, और आप Google पर "customer care number" खोजते हैं।',
    "ठग अपने नंबर Google, नकली वेबसाइट या social media पर ऐसे डालते हैं कि वे ऊपर दिखें।",
    'call पर वे बहुत मदद करने वाले लगते हैं, और "दिक्कत ठीक करने" के लिए कोई ऐप या link भेजते हैं।',
    'उस ऐप से वे आपका फ़ोन देख लेते हैं, या आपसे OTP, PIN या ₹1-₹10 का "verification" भुगतान करवाते हैं।',
    "फिर आपके खाते से पैसे निकल जाते हैं।",
  ],
  signsHi: [
    "नंबर Google, YouTube comment या social media से मिला",
    "call पर कोई ऐप (जैसे AnyDesk या कोई \"support\" ऐप) डलवाना",
    "refund के लिए UPI PIN डलवाना या QR scan करवाना",
    "OTP, PIN, password या card का पूरा नंबर माँगना",
    '"₹1 या ₹10 भेजकर verify करें" कहना',
  ],
  examplesHi: [
    '"आपका refund अटका है। यह support ऐप डाउनलोड कीजिए, मैं screen पर देखकर ठीक कर दूँगा।"',
    '"refund पाने के लिए UPI में अपना PIN डालिए, पैसा आपके खाते में आ जाएगा।"',
  ],
  rulesHi: [
    "बैंक या कंपनी का नंबर सिर्फ़ उसके अपने ऐप, अपनी वेबसाइट, debit card के पीछे, या bill और passbook से लें।",
    "call पर कहे जाने पर कभी कोई ऐप न डालें, और screen-share न करें।",
    "पैसा पाने के लिए कभी PIN डालने या QR scan करने की ज़रूरत नहीं होती।",
  ],
  faq: [
    {
      qHi: "बैंक का असली नंबर कहाँ मिलेगा?",
      aHi: 'debit card के पीछे, passbook में, बैंक के अपने ऐप में, या बैंक की वेबसाइट पर, जिसका पता ".bank.in" पर ख़त्म होता है। RBI ने बैंकों को 31 अक्टूबर 2025 तक इसी पते पर आने को कहा था।',
      link: { href: "/gyan/bank", labelHi: "अपने बैंक का सही रास्ता देखें →" },
      source: RBI_BANK_IN,
    },
    {
      qHi: "उनके कहने पर ऐप डाल दिया है। अब क्या करूँ?",
      aHi: "तुरंत ऐप हटाएँ और फ़ोन का internet बंद करें। बैंक को बताएँ और 1930 पर शिकायत करें। फिर UPI PIN और banking password बदलें।",
      link: { href: "/turant", labelHi: "पहले 60 मिनट के कदम देखें →" },
    },
  ],
  turantSlug: "customer-care-fake",
  author: "ठगी रक्षक टीम",
  reviewer: null,
  lastCheckedOn: "2026-11-21",
};
