// ठगी के 8 आम निशान (/pucho, checker के नीचे; बिना JS के भी) और /bharosa की "हम कभी नहीं करेंगे" सूची। मूल text plan A2a से;
// 2026-11-23: दूसरे में CVV, तीसरे में "request accept" जोड़ा ("पहले पूछो" के नए निशानों के साथ)।

export const SCAM_SIGNS: readonly { titleHi: string; bodyHi: string }[] = [
  { titleHi: 'जल्दबाज़ी: "आज ही", "अभी नहीं तो खाता बंद"', bodyHi: "ठग सोचने का समय नहीं देते। रुकें और किसी अपने से बात करें।" },
  { titleHi: "OTP, PIN, password या card का CVV माँगना", bodyHi: "बैंक, पुलिस या कोई कंपनी यह कभी नहीं माँगती, न card का पूरा नंबर।" },
  {
    titleHi: 'पैसे पाने के लिए PIN डालना, QR scan करना या "request" accept करना',
    bodyHi: "पैसा पाने के लिए कभी PIN, QR या request की ज़रूरत नहीं होती। इनसे पैसे आपके खाते से जाते हैं।",
  },
  { titleHi: "कोई ऐप या APK फ़ाइल डलवाना", bodyHi: "AnyDesk जैसे ऐप या अनजान APK से वे आपका फ़ोन चला सकते हैं।" },
  { titleHi: "पुलिस, CBI या कोर्ट की धमकी, वह भी video call पर", bodyHi: "असली पुलिस video call पर गिरफ़्तार नहीं करती। call काटें।" },
  {
    titleHi: "बहुत ज़्यादा कमाई का वादा, या नौकरी के लिए fee",
    bodyHi: '"घर बैठे like करो, रोज़ हज़ारों कमाओ", "पैसे दुगने", या "चयन हो गया, पहले fee भरो": सब ठगी का चारा है।',
  },
  { titleHi: 'Google या social media पर मिला "customer care" नंबर', bodyHi: "नंबर सिर्फ़ कंपनी के अपने ऐप या वेबसाइट से लें।" },
  {
    titleHi: 'आधार, अंगूठे का निशान या "SIM upgrade" वाला SMS माँगना',
    bodyHi: "इनसे बिना OTP खाते से पैसे निकल सकते हैं, या आपका नंबर ठग के SIM पर जा सकता है। किसी के कहने पर न भेजें।",
  },
];

export const NEVER_LIST: readonly string[] = [
  "OTP, PIN, password या CVV माँगना",
  "AnyDesk, screen-share या कोई APK डलवाना",
  "आपसे किसी को पैसे भिजवाना",
  "पैसा वापस आने का पक्का वादा करना",
  "पहले ख़ुद आपको call करना",
  "आपका data बेचना",
  "सरकारी दफ़्तर होने का दिखावा करना",
];
