import { RBI_BANK_IN } from "@/modules/gyan/refs";
import type { GyanPage } from "@/modules/gyan/types";

export const kycLink: GyanPage = {
  slug: "kyc-link",
  navTitleHi: "KYC और बैंक के नाम पर नकली link",
  titleHi: 'KYC वाली ठगी: "आज आपका खाता बंद हो जाएगा"',
  descriptionHi: "KYC, PAN या खाता बंद होने का डर दिखाकर नकली link से बैंक की जानकारी चुराने वाली ठगी। असली पता कैसे पहचानें, और पैसे गए हों तो क्या करें।",
  summaryHi: [
    'SMS या WhatsApp आता है: "आपका KYC या PAN update नहीं है, आज खाता बंद हो जाएगा, इस link पर update करें"।',
    "link बैंक जैसी दिखने वाली नकली वेबसाइट खोलता है, जहाँ user ID, password और OTP भरवाए जाते हैं।",
    "जो भी भरा, वह सीधे ठग के पास जाता है, और कुछ ही मिनट में खाते से पैसे निकल जाते हैं।",
  ],
  howHi: [
    'डराने वाला message आता है: खाता, card, SIM या wallet "आज ही बंद" होने वाला है।',
    'message में एक link होता है, जिसका पता बैंक जैसा दिखता है पर असली नहीं होता (बैंक का नाम, साथ में "kyc", "update" या "verify" जैसे शब्द)।',
    "link खोलने पर बैंक जैसा login पन्ना खुलता है, जहाँ user ID, password, card नंबर या OTP भरवाया जाता है।",
    "भरते ही ठग उसी जानकारी से असली बैंक में login करके पैसे निकाल लेते हैं।",
  ],
  signsHi: [
    '"आज ही खाता, card या SIM बंद हो जाएगा" जैसी धमकी',
    "KYC, PAN या आधार update करने के लिए SMS या WhatsApp में link",
    'link का पता बैंक के नाम जैसा, पर ".bank.in" पर ख़त्म नहीं होता',
    "login के साथ OTP, card नंबर या CVV माँगना",
    "message किसी आम mobile नंबर से आया है",
  ],
  examplesHi: [
    '"प्रिय ग्राहक, आपका KYC update नहीं है, आज रात आपका खाता बंद हो जाएगा। तुरंत update करें: http://sbi-kyc-update.xyz"',
    '"Dear Customer, your PAN is not updated. Your account will be blocked today. Update immediately: bit.ly/kyc-upd8"',
  ],
  rulesHi: [
    "KYC update के लिए SMS या WhatsApp में आए link पर कभी न जाएँ। KYC सिर्फ़ बैंक की शाखा में, या बैंक के अपने ऐप में करें।",
    'बैंक की असली वेबसाइट का पता ".bank.in" पर ख़त्म होता है। फिर भी link न खोलें, पता ख़ुद टाइप करें।',
    "OTP, password या card का CVV किसी link वाली वेबसाइट पर न भरें, और किसी को न बताएँ।",
  ],
  faq: [
    {
      qHi: "मैंने link खोलकर जानकारी भर दी है, पर अभी पैसे नहीं कटे।",
      aHi: "देर न करें: बैंक के अपने ऐप या असली नंबर से net banking और card block करवाएँ, फिर password और UPI PIN बदलें। पैसे कट गए हों, तो 1930 पर call करें।",
      link: { href: "/gyan/bank", labelHi: "अपने बैंक का सही रास्ता देखें →" },
    },
    {
      qHi: "मुझे कैसे पता चलेगा कि link असली बैंक का है?",
      aHi: 'RBI के निर्देश से भारत के बैंकों की वेबसाइट ".bank.in" पर है, और यह पता सिर्फ़ बैंक ले सकते हैं। फिर भी सबसे अच्छा यही है कि link न खोलें, और बैंक का ऐप या पता ख़ुद खोलें।',
      source: RBI_BANK_IN,
    },
  ],
  turantSlug: "netbanking",
  author: "ठगी रक्षक टीम",
  reviewer: null,
  lastCheckedOn: "2026-11-22",
};
