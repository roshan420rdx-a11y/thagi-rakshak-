// ठगी से बचाव का पोस्टर (plan A3g): दुकान, बैंक, पंचायत में छापकर लगाने के लिए। बातें वही जो साइट के
// "आम निशान" और ज्ञानकोश में हैं। QR code जानबूझकर नहीं: हम "QR scan न करें" सिखाते हैं।
export const POSTER_RULES: readonly string[] = [
  "OTP, PIN या password कभी किसी को न बताएँ, बैंक या पुलिस को भी नहीं।",
  "पैसे पाने के लिए कभी PIN डालना या QR scan करना नहीं पड़ता।",
  "“digital arrest” कुछ नहीं होता। पुलिस video call पर पूछताछ नहीं करती।",
  "अनजान link, .apk फ़ाइल या AnyDesk जैसा ऐप न खोलें, न डालें।",
  "customer care का नंबर Google से नहीं, कंपनी के अपने ऐप से लें।",
  "“नया नंबर है, पैसे भेजो”? पहले उसे पुराने नंबर पर call करें।",
  "आधार, अंगूठे का निशान या “SIM upgrade” वाला SMS किसी को न भेजें।",
  "घर बैठे कमाई, पैसे दुगने, lottery का इनाम: ये सब ठगी का चारा हैं।",
];

// पहली लाइन में "1930" बड़ा छपता है (पन्ना उसे बाँटकर दिखाता है)
export const POSTER_HELP: readonly string[] = [
  "ठगी हो जाए तो तुरंत 1930 पर call करें",
  "या cybercrime.gov.in पर शिकायत करें",
  "अपने बैंक को भी उसी दिन बताएँ",
];

export function posterHost(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}
