import type { GyanPage } from "@/modules/gyan/types";

// SIM swap: आपका नंबर ठग के SIM पर चला जाए, तो OTP भी उसी के पास। call forwarding (*401*) भी इसी परिवार की ठगी है।
export const simSwap: GyanPage = {
  slug: "sim-swap",
  navTitleHi: "SIM बदलवाकर ठगी (SIM swap)",
  titleHi: "SIM बदलवाकर या call forward करवाकर ठगी: आपके नंबर के OTP ठग के पास",
  descriptionHi: "'5G upgrade' या 'eSIM' के बहाने SMS भिजवाकर आपका नंबर अपने SIM पर ले लेना, या code dial करवाकर calls मोड़ना। निशान, बचाव, और फ़ोन बंद हो तो क्या करें।",
  summaryHi: [
    "ठग telecom कंपनी बनकर '5G upgrade', 'SIM बंद होने वाला है' या 'eSIM' के बहाने आपसे कोई SMS या 20 अंकों का नंबर भिजवाते हैं।",
    "इससे आपका नंबर उनके SIM पर चला जाता है: आपके फ़ोन में network ग़ायब, और बैंक के OTP उनके पास।",
    "SIM या eSIM सिर्फ़ कंपनी के अपने store या ऐप से बदलवाएँ, और किसी के कहने पर कोई SMS या code (*401*) न भेजें।",
  ],
  howHi: [
    "ठग पहले किसी leak या दूसरी ठगी से आपका नाम, नंबर और बैंक की कुछ जानकारी जुटाते हैं।",
    "फिर telecom कंपनी का कर्मचारी बनकर call या SMS करते हैं: '5G upgrade', 'SIM की KYC', 'eSIM चालू करनी है'।",
    "आपसे कोई तय SMS, या नए SIM के पीछे लिखा 20 अंकों का नंबर, कंपनी के नंबर पर भिजवाते हैं। इससे आपका नंबर उनके नए SIM या eSIM पर चालू हो जाता है।",
    "आपके फ़ोन में अचानक network चला जाता है। उसी समय वे आपके नंबर पर OTP मँगाकर net banking या UPI से पैसे निकाल लेते हैं।",
    "दूसरा तरीका: courier या delivery के बहाने *401* जैसा code और एक नंबर dial करवाना। फिर आपकी calls, और OTP वाली calls भी, उनके नंबर पर जाने लगती हैं।",
  ],
  signsHi: [
    "telecom कंपनी के नाम से 'SIM upgrade', '5G' या 'eSIM' के लिए कोई SMS भिजवाने को कहना",
    "SIM के पीछे लिखा 20 अंकों का नंबर माँगना या भिजवाना",
    "*401* या **21* जैसा code और कोई नंबर dial करवाना",
    "फ़ोन में अचानक देर तक network नहीं, जबकि आसपास दूसरों के फ़ोन चल रहे हों",
    "'SIM बदलने का request मिला है' वाला SMS, जबकि आपने कहा ही नहीं",
  ],
  examplesHi: [
    '"आपका SIM 5G में upgrade होगा, वरना कल से बंद हो जाएगा। अभी 121 पर यह SMS भेजें: SIM और मेरा बताया 20 अंकों का नंबर।"',
    '"Dear customer, your eSIM activation is pending. Please send SMS ESIM with your email ID to 121 to activate, otherwise your number will be blocked."',
    '"आपका courier पता अधूरा है। delivery के लिए अभी *401* के बाद यह नंबर dial करें: 98XXXXXX12"',
  ],
  rulesHi: [
    "SIM upgrade, नया SIM या eSIM सिर्फ़ अपनी कंपनी के store या उसके अपने ऐप से, ख़ुद जाकर करवाएँ; किसी call पर कोई SMS या नंबर न भेजें।",
    "किसी के कहने पर *401*, **21* जैसा कोई code dial न करें।",
    "फ़ोन में अचानक देर तक network न आए, तो दूसरे फ़ोन से तुरंत अपनी telecom कंपनी और अपने बैंक को बताएँ।",
  ],
  faq: [
    {
      qHi: "मेरे फ़ोन में अचानक network चला गया है और लौट नहीं रहा। क्या करूँ?",
      aHi: "दूसरे फ़ोन से अपनी telecom कंपनी के helpline पर पूछें कि आपके नंबर पर नया SIM तो चालू नहीं हुआ, और उसे रुकवाएँ। अपने बैंक को भी तुरंत बताएँ, ताकि net banking और UPI रुक जाएँ। पैसे कट गए हों, तो 1930 पर call करें।",
      link: { href: "/turant", labelHi: "पैसे गए हों तो अभी क्या करें →" },
    },
    {
      qHi: "मैंने किसी के कहने पर *401* वाला code dial कर दिया। अब?",
      aHi: "फ़ोन की Settings में Calls (या Call settings) के अंदर Call forwarding खोलें, और सब बंद कर दें। समझ न आए, तो अपनी telecom कंपनी के helpline से बंद करवाएँ। फिर अपने बैंक को बताएँ, और पैसे कटे हों तो 1930 पर call करें।",
    },
    {
      qHi: "मेरे नाम पर कौन-कौन से mobile नंबर चल रहे हैं, यह कैसे देखूँ?",
      aHi: "दूरसंचार विभाग (DoT) की Sanchar Saathi साइट (sancharsaathi.gov.in) या उसके ऐप पर अपने नंबर से देख सकते हैं। जो नंबर आपका नहीं, उसकी वहीं शिकायत करें। ठगी वाले call या SMS की शिकायत भी वहाँ 'चक्षु' में होती है।",
    },
  ],
  turantSlug: "pata-nahi",
  author: "ठगी रक्षक टीम",
  reviewer: null,
  lastCheckedOn: "2026-11-23",
};
