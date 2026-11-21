// ठगी के 7 आम निशान (/pucho, checker के नीचे; बिना JS के भी) और /bharosa की "हम कभी नहीं करेंगे" सूची। text plan A2a से जस का तस।

export const SCAM_SIGNS: readonly { titleHi: string; bodyHi: string }[] = [
  { titleHi: 'जल्दबाज़ी: "आज ही", "अभी नहीं तो खाता बंद"', bodyHi: "ठग सोचने का समय नहीं देते। रुकें और किसी अपने से बात करें।" },
  { titleHi: "OTP, PIN या password माँगना", bodyHi: "बैंक, पुलिस या कोई कंपनी यह कभी नहीं माँगती।" },
  { titleHi: "पैसे पाने के लिए PIN डालना या QR scan करना", bodyHi: "पैसा पाने के लिए कभी PIN या QR की ज़रूरत नहीं होती।" },
  { titleHi: "कोई ऐप या APK फ़ाइल डलवाना", bodyHi: "AnyDesk जैसे ऐप या अनजान APK से वे आपका फ़ोन चला सकते हैं।" },
  { titleHi: "पुलिस, CBI या कोर्ट की धमकी, वह भी video call पर", bodyHi: "असली पुलिस video call पर गिरफ़्तार नहीं करती। call काटें।" },
  { titleHi: "बहुत ज़्यादा कमाई का वादा", bodyHi: '"घर बैठे like करो, रोज़ हज़ारों कमाओ" या "पैसे दुगने" ठगी का चारा है।' },
  { titleHi: 'Google या social media पर मिला "customer care" नंबर', bodyHi: "नंबर सिर्फ़ कंपनी के अपने ऐप या वेबसाइट से लें।" },
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
