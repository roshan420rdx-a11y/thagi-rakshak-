import type { GyanPage } from "@/modules/gyan/types";

// नौकरी के नाम पर ठगी: चयन/joining के लिए पहले पैसे। सरकारी भर्ती की असली application fee से फ़र्क़ साफ़ रखना है।
export const naukriFee: GyanPage = {
  slug: "naukri-fee",
  navTitleHi: "नौकरी के नाम पर fee",
  titleHi: 'नौकरी के नाम पर ठगी: "चयन हो गया, पहले fee भरें"',
  descriptionHi: "नकली नौकरी का offer, फिर registration, training या visa के नाम पर पैसे। पहचान के निशान, असली भर्ती कैसे पहचानें, और पैसे भेज दिए तो क्या करें।",
  summaryHi: [
    "ठग सरकारी, railway, बड़ी कंपनी या विदेश की नौकरी का offer भेजते हैं, अक्सर बिना interview के 'चयन हो गया'।",
    "फिर joining से पहले registration, training, uniform, security deposit या visa के नाम पर पैसे माँगते हैं, और माँग बढ़ती जाती है।",
    "चयन या joining के लिए पैसे माँगना ठगी का पक्का निशान है। सरकारी भर्ती की fee सिर्फ़ उसकी official वेबसाइट पर, notification के हिसाब से भरी जाती है।",
  ],
  howHi: [
    "WhatsApp, Telegram, SMS या job वाली साइट पर message: ज़्यादा तनख़्वाह, कम काम, तुरंत joining।",
    "बिना interview, या एक छोटी call के बाद, 'आपका चयन हो गया' कहा जाता है। नकली offer letter पर कंपनी या सरकार का logo होता है।",
    "joining से पहले registration, training kit, ID card, uniform, verification या security deposit के पैसे माँगे जाते हैं।",
    "एक बार पैसे देने के बाद नई-नई fees माँगी जाती हैं, फिर नंबर बंद।",
    "विदेश की नौकरी में visa, ticket या medical के नाम पर बड़ी रकम; कुछ मामलों में लोगों को विदेश पहुँचाकर ज़बरदस्ती ठगी के काम में लगाया गया है।",
  ],
  signsHi: [
    "बिना interview या परीक्षा के 'चयन हो गया'",
    "joining से पहले registration, training या security deposit के पैसे",
    "Gmail या WhatsApp से offer letter, कंपनी की official email से नहीं",
    "काम के हिसाब से बहुत ज़्यादा तनख़्वाह, और 'आज ही' का दबाव",
    "विदेश की नौकरी, पर agent का registration नहीं, या वह passport अपने पास रखना चाहे",
  ],
  examplesHi: [
    '"बधाई हो! आपका चयन Railway में Clerk पद पर हुआ है। joining letter के लिए ₹4,500 registration fee आज ही जमा करें।"',
    '"Congratulations! You are selected for Data Entry job at Amazon. Pay Rs 1,999 for training kit and ID card to confirm your joining."',
    '"Dubai में hotel की नौकरी, salary ₹80,000। visa और ticket के लिए ₹35,000 पहले भेजें, offer letter तुरंत मिलेगा।"',
  ],
  rulesHi: [
    "नौकरी के चयन या joining के लिए पैसे न दें; असली कंपनी या दफ़्तर इसके लिए पैसे नहीं माँगता।",
    "सरकारी नौकरी की ख़बर और fee सिर्फ़ उस भर्ती की official वेबसाइट या notification से देखें, message के link से नहीं।",
    "विदेश की नौकरी सिर्फ़ registered agent से; agent का नाम eMigrate (emigrate.gov.in) पर जाँचें, और passport किसी को न सौंपें।",
  ],
  faq: [
    {
      qHi: "मैंने fee भर दी है। अब?",
      aHi: "और पैसे न भेजें, चाहे वे 'आख़िरी fee' कहें। तुरंत 1930 पर call करें और अपने बैंक को बताएँ। offer letter, chat और भुगतान के screenshot सँभालकर रखें।",
      link: { href: "/turant", labelHi: "पैसे गए हों तो अभी क्या करें →" },
    },
    {
      qHi: "सरकारी भर्ती में तो application fee लगती है?",
      aHi: "हाँ, कई सरकारी भर्तियों में आवेदन के समय application fee लगती है, पर वह सिर्फ़ उस भर्ती की official वेबसाइट पर, notification में लिखी रकम के हिसाब से भरी जाती है। चयन के बाद 'joining fee' या 'पक्की नौकरी' के लिए पैसे माँगना ठगी है।",
    },
    {
      qHi: "विदेश की नौकरी का offer असली है या नहीं, कैसे जाँचूँ?",
      aHi: "agent का नाम और registration विदेश मंत्रालय (MEA) की eMigrate साइट (emigrate.gov.in) पर देखें; वहाँ उन agencies की सूची भी है जिनके ख़िलाफ़ शिकायतें आई हैं। अपना passport किसी agent को न सौंपें। विदेश में फँस गए हों, तो वहाँ के भारतीय दूतावास से संपर्क करें।",
    },
  ],
  turantSlug: "upi",
  author: "ठगी रक्षक टीम",
  reviewer: null,
  lastCheckedOn: "2026-11-23",
};
