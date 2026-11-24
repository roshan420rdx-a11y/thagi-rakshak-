// "क्या हुआ, अपने शब्दों में" लिखने में मदद (plan A2h): ठगी का तरीका चुनें, तो एक सीधा-सादा नमूना डिब्बे में आ जाए।
// नमूना सिर्फ़ शुरुआत है: [ ] वाली जगहें पीड़ित अपनी बात से भरे या बदले। कोई क़ानूनी धारा, कोई वादा नहीं; पहले पुरुष में
// (पत्र पीड़ित की तरफ़ से है)। तारीख़, रकम और UTR पत्र में अलग से आते हैं, इसलिए यहाँ नहीं।
import type { HowMoneyWent, LetterLang } from "./letters";

export const WHAT_MAX = 600;

// textEn: English वाले पत्र के लिए वही बात (plan A2i)
export type WhatTemplate = { id: string; labelHi: string; textHi: string; textEn: string; how: Exclude<HowMoneyWent, ""> };

export const WHAT_TEMPLATES: readonly WhatTemplate[] = [
  {
    id: "bank_call_otp",
    labelHi: "बैंक वाला बनकर call, OTP ले लिया",
    textHi:
      "[नंबर] से एक व्यक्ति ने call करके ख़ुद को बैंक का कर्मचारी बताया और [KYC / card बंद होने] की बात कही। उसके कहने पर मैंने अपने फ़ोन पर आया OTP बता दिया, जिसके बाद मेरे खाते से पैसे कट गए।",
    textEn:
      "A person called me from [number], said he was a bank employee and talked about [KYC / my card being blocked]. On his asking, I told him the OTP that came on my phone, after which money was debited from my account.",
    how: "deceived",
  },
  {
    id: "link_details",
    labelHi: "link पर जानकारी भरवाई",
    textHi:
      "मुझे [SMS / WhatsApp] पर [बैंक / KYC / बिजली बिल] के नाम से एक link आया। उस link पर मैंने अपनी जानकारी भरी, जिसके बाद मेरे खाते से पैसे कट गए।",
    textEn:
      "I received a link on [SMS / WhatsApp] in the name of [the bank / KYC / electricity bill]. I filled in my details on that link, after which money was debited from my account.",
    how: "deceived",
  },
  {
    id: "remote_app",
    labelHi: "AnyDesk जैसा ऐप डलवाया",
    textHi:
      "[नंबर] से एक व्यक्ति ने ख़ुद को [बैंक / कंपनी] का कर्मचारी बताकर मेरे फ़ोन में [AnyDesk / कोई ऐप] डलवाया। उसके बाद मेरे खाते से पैसे कट गए।",
    textEn:
      "A person called me from [number], said he was from [the bank / a company] and got me to install [AnyDesk / an app] on my phone. After that, money was debited from my account.",
    how: "deceived",
  },
  {
    id: "fake_customer_care",
    labelHi: "internet पर मिला नकली customer care",
    textHi:
      "मैंने internet पर [कंपनी] का customer care नंबर खोजकर [नंबर] पर call किया। वहाँ के व्यक्ति के कहने पर मैंने [ऐप डाला / जानकारी दी / पैसे भेजे], जिसके बाद मेरे खाते से पैसे कट गए।",
    textEn:
      "I searched the internet for the customer care number of [company] and called [number]. On the advice of the person there, I [installed an app / shared details / sent money], after which money was debited from my account.",
    how: "deceived",
  },
  {
    id: "upi_receive",
    labelHi: "पैसे देने के बहाने UPI PIN या QR",
    textHi:
      "एक व्यक्ति ने [सामान ख़रीदने / पैसे लौटाने] के बहाने मुझे पैसे भेजने की बात कही और [UPI request / QR] भेजा। पैसे पाने के लिए मैंने UPI PIN डाला, पर पैसे आने की जगह मेरे खाते से कट गए।",
    textEn:
      "A person said he would send me money on the pretext of [buying my item / returning money] and sent me a [UPI request / QR code]. To receive the money I entered my UPI PIN, but instead money was debited from my account.",
    how: "deceived",
  },
  {
    id: "digital_arrest",
    labelHi: "पुलिस/CBI बनकर डराया (digital arrest)",
    textHi:
      "[नंबर] से एक व्यक्ति ने ख़ुद को [पुलिस / CBI / customs] का अधिकारी बताकर video call किया और [पार्सल / केस] के नाम पर गिरफ़्तारी का डर दिखाया। डर के कारण मैंने उसके बताए खाते में पैसे भेज दिए।",
    textEn:
      "A person called me on video from [number], said he was an officer of [police / CBI / customs] and threatened me with arrest over [a parcel / a case]. Out of fear, I sent money to the account he gave.",
    how: "deceived",
  },
  {
    id: "task_job",
    labelHi: "online काम या task के नाम पर",
    textHi:
      "[WhatsApp / Telegram] पर [online काम / task] के नाम पर पहले मुझे थोड़े पैसे दिए गए, फिर बड़ा काम देने के नाम पर मुझसे पैसे जमा करवाए गए, जो वापस नहीं मिले।",
    textEn:
      "On [WhatsApp / Telegram], I was first paid a small amount for [online work / tasks], and then made to deposit money in the name of bigger tasks, which I did not get back.",
    how: "deceived",
  },
  {
    id: "investment",
    labelHi: "निवेश या trading में मुनाफ़े का लालच",
    textHi:
      "[ऐप / group] पर ज़्यादा मुनाफ़े का लालच देकर मुझसे निवेश के नाम पर पैसे जमा करवाए गए। अब [पैसे निकालने नहीं दिए जा रहे / और पैसे माँगे जा रहे हैं]।",
    textEn:
      "On [app / group], I was lured with high profits and made to deposit money in the name of investment. Now [I am not allowed to withdraw / more money is being demanded from me].",
    how: "deceived",
  },
  {
    id: "nothing_done",
    labelHi: "मैंने कुछ नहीं किया, फिर भी पैसे कटे",
    textHi:
      "मैंने न कोई लेन-देन किया, न किसी को OTP या PIN बताया। फिर भी मेरे खाते से पैसे कट गए, जिसका पता मुझे [SMS / statement] से चला।",
    textEn:
      "I neither made any transaction nor told anyone my OTP or PIN. Still, money was debited from my account, which I came to know from [SMS / statement].",
    how: "unauthorised",
  },
];

// डिब्बा ख़ाली हो या उसमें बिना बदला कोई नमूना हो, तो नया नमूना; अपना लिखा हो तो उसे मिटाए बिना नीचे जोड़ना
// पत्र English में हो तो English नमूना; किसी भी भाषा का बिना बदला नमूना "बिना बदला" ही गिना जाता है
export function applyWhatTemplate(current: string, t: WhatTemplate, lang: LetterLang = "hi"): string {
  const text = lang === "en" ? t.textEn : t.textHi;
  const now = current.trim();
  if (!now || WHAT_TEMPLATES.some((x) => x.textHi === now || x.textEn === now)) return text;
  return `${now}\n${text}`.slice(0, WHAT_MAX);
}
