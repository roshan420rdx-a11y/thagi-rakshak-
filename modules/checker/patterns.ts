import type { GyanSlug } from "@/modules/gyan";
import type { TurantSlug } from "@/modules/scams";
import { isBankLookalike, isGovDomain } from "./links";
import { normalizePattern } from "./normalize";

// "पहले पूछो" के तय नियम (spec भाग 2, खंड 6.3, 7)। ये सिर्फ़ पहचान के लिए हैं, user को दिखने वाली बात नहीं,
// इसलिए "guarantee" जैसे ठगों के शब्द यहाँ हैं (copy-lint की allow-सूची में दर्ज)।
// हर pattern normalize होकर बनता है: नुक़्ता हटाकर, ँ को ं मानकर। "i" flag से अंग्रेज़ी में छोटे-बड़े अक्षर एक जैसे।

export type RuleLevel = "danger" | "warn";

export type CheckedText = {
  text: string; // normalize किया हुआ पूरा message
  stripped: string; // "किसी को न बताएँ / do not share" जैसे नकार हटाकर (OTP/PIN वाले नियमों के लिए)
  domains: string[]; // message में आए पते
};

export type CheckerRule = {
  id: string;
  level: RuleLevel;
  labelHi: string;
  explainHi: string;
  gyan?: GyanSlug;
  turant?: TurantSlug;
  test: (t: CheckedText) => boolean;
};

const END = "[^.!?\\n\\u0964]"; // वाक्य के अंदर (। = U+0964)

function rx(src: string): RegExp {
  return new RegExp(normalizePattern(src), "i");
}

function near(a: string, b: string, gap: number): RegExp {
  return rx(`(?:${a})${END}{0,${gap}}(?:${b})|(?:${b})${END}{0,${gap}}(?:${a})`);
}

// नकार: बैंक के असली SMS में "OTP किसी को न बताएँ / do not share" होता है, उसे माँगना न समझें
const NEGATIONS: RegExp[] = [
  rx(
    "\\b(?:do\\s*not|don'?t|dont|never|not\\s+to|nobody\\s+will|no\\s+one\\s+will)\\s+(?:(?:ever|it|this|your|the|you|to|with|anyone|any\\s*one|for)\\s+){0,3}(?:share|disclose|tell|give|send|forward|reveal|ask|enter|type|receive|scan|click|open|install|download)\\w*" +
      `${END}{0,40}`,
  ),
  rx("(?<![\\u0900-\\u097f])(?:न|ना|मत|नहीं|कभी\\s*न)\\s+(?:बता|बोल|भेज|शेयर|साझा|दें|दे|डाल|लिख)\\S*"),
  rx("(?:शेयर|साझा|share)\\s*(?:न|मत|नहीं|na|mat|nahi|nhi)\\s+(?:कर|kar)\\S*"),
  // "बताएँ नहीं" (उल्टा क्रम); पर "बताओ नहीं तो…" धमकी है, उसे नकार न मानें
  rx("(?:बता|बोल|भेज|शेयर|साझा|दें|दे)\\S*\\s+(?:नहीं|मत)(?![\\u0900-\\u097f])(?!\\s*(?:तो|to\\b))"),
  rx("\\b(?:na|mat|nahi|nhi)\\s+(?:bata|bol|bhej|share|de|daal|dal)\\w*"),
].map((r) => new RegExp(r.source, "gi"));

export function stripNegations(text: string): string {
  return NEGATIONS.reduce((t, r) => t.replace(r, " "), text);
}

const OTP = "\\botp\\b|ओटीपी|one\\s*time\\s*password|verification\\s*code|वेरिफिकेशन\\s*कोड|\\d\\s*(?:digit|अंक)\\S*\\s*(?:का\\s*)?(?:code|कोड)";
const ASK = "\\b(?:share|send|tell|give|provide|forward|read\\s*out)\\b|बता|बोल|भेज|शेयर|साझा|दे\\s*दो|दे\\s*दीजिए|दीजिए|दीजिये|\\bbata|\\bbol(?:o|iye|\\s*do)\\b|\\bbhej|\\bde\\s*do\\b|\\bdedo\\b|\\bdijiye|\\bdijie";
const RECEIVE =
  "\\breceive|\\bto\\s+get\\b|\\bget\\s+(?:your|the)\\b|credited|cash\\s*back|refund|reward|prize|पाने|प्राप्त|मिलेगा|मिलेंगे|मिल\\s*जा|खाते\\s*में\\s*आ|पैसे\\s*आ|कैशबैक|रिफंड|इनाम|\\bmilega|\\bmilenge|\\bmil\\s*ja|paise\\s*aa|khate\\s*me";
// "मैं आपको 1 रुपया भेजता हूँ, QR scan करो" (OLX वाला 'army officer'): पैसे भेजने का वादा = पैसे पाने का झाँसा।
// पैसे वाला शब्द पहले चाहिए ("QR भेज रहा हूँ, scan करके payment करो" दुकानदार की असली बात है)
const MONEY_WORD = "पैसे|पैसा|\\brupa(?:y|ya|ye)\\b|\\brupees?\\b|रुपया|रुपये|रुपए|₹\\s*\\d[\\d,]*|\\brs\\.?\\s*\\d[\\d,]*";
const WILL_SEND = "भेजता|भेज\\s*रहा|भेज\\s*रही|भेजूंगा|भेजूंगी|\\bbhejta|\\bbhej\\s*raha|\\bbhej\\s*rahi|\\bbhejunga|\\bbhejungi";
const RECEIVE_PROMISE = `(?:${MONEY_WORD})\\s*(?:\\S+\\s*){0,2}?(?:${WILL_SEND})|\\bsend(?:ing)?\\s+you\\s+(?:₹|rs\\b|rupees|money|payment|\\d)|\\bi\\s+(?:will|am\\s+going\\s+to)\\s+send\\s+you\\s+(?:₹|rs\\b|rupees|money|payment|\\d)`;
const QR = "\\bqr\\b|क्यू\\s*आर|\\bscan|स्कैन";
const PIN = "(?<![a-z])pin(?![\\s-]*code|[a-z])|पिन(?![\\s-]*कोड)|\\bmpin\\b";
const REQUEST = "request|रिक्वेस्ट|collect|approve|accept|स्वीकार|एक्सेप्ट|अप्रूव";

const ARREST_DIRECT = "digital\\s*arrest|डिजिटल\\s*(?:अरेस्ट|गिरफ़्तार|हिरासत)|बेगुनाह|ज़मानत\\s*(?:के\\s*लिए|राशि)";
// "safe/सरकारी/RBI account" तभी, जब उसमें पैसे डलवाने की बात हो ("to secure account" वाला WhatsApp message digital arrest नहीं)
const SAFE_ACCOUNT = "सरकारी\\s*खात|safe\\s*account|secure\\s*account|सुरक्षित\\s*खात|government\\s*account|rbi\\s*(?:के\\s*)?(?:खात|account)";
const MOVE_MONEY = "transfer|ट्रांसफ़र|भेज|जमा|\\bmove\\b|shift|\\bbhej|\\bjama|deposit";
// ठग का message हमेशा पढ़ने वाले से बात करता है ("आपके नाम से…"); ख़बर वाले text पर danger न लगे
const YOU = "आप|तुम|तेरा|तेरे|तेरी|\\byou|\\byour|\\baap|\\btum|\\btera|\\btere|\\bmam\\b|\\bmadam|\\bsir\\b";
const AUTHORITY =
  "पुलिस|police|\\bcbi\\b|सीबीआई|\\bncb\\b|narcotics|नारकोटिक्स|customs|कस्टम|\\btrai\\b|ट्राई|enforcement\\s*directorate|प्रवर्तन\\s*निदेशालय|crime\\s*branch|क्राइम\\s*ब्रांच|cyber\\s*cell|साइबर\\s*सेल|income\\s*tax\\s*officer|supreme\\s*court|सुप्रीम\\s*कोर्ट|\\bjudge\\b|fedex|फेडेक्स";
const THREAT =
  "arrest|अरेस्ट|गिरफ़्तार|warrant|वारंट|money\\s*laundering|मनी\\s*लॉन्ड्रिंग|मनी\\s*लांड्रिंग|drugs|ड्रग्स|नशीले|narcotic|parcel|पार्सल|video\\s*call|वीडियो\\s*कॉल|skype|स्काइप|हिरासत|custody|\\bjail\\b|जेल|एफ़आईआर|ग़ैरक़ानूनी|illegal|अवैध|ग़लत\\s*इस्तेमाल|misuse|दुरुपयोग|पकड़\\s*लिया|पकड़ा\\s*गया|छुड़ाने|disconnect";

const APK = "\\.apk\\b|\\bapk\\b|एपीके";
const REMOTE =
  "any\\s*desk|एनी\\s*डेस्क|team\\s*viewer|टीम\\s*व्यूअर|quick\\s*support|rust\\s*desk|air\\s*droid|screen\\s*shar|स्क्रीन\\s*शेयर|screen\\s*(?:पर|par)\\s*(?:देख|dekh)|स्क्रीन\\s*पर\\s*देख|(?:support|सपोर्ट|help|हेल्प)\\s*(?:app|ऐप|एप)";

const MOBILE = "(?<!\\d)(?:\\+?91[\\s-]?)?[6-9]\\d{4}[\\s-]?\\d{5}(?!\\d)";
const MASKED_NUMBER = "\\d{2}x{4,}\\d{2}";

const ELECTRICITY = "बिजली|\\bbijli|\\bbijlee|electricity|electric|\\bpower\\b|लाइट\\s*(?:बिल|कनेक्शन)|light\\s*(?:bill|connection)";
const CUT =
  "काट|कट\\s*जा|कट\\s*दी|\\bcut\\b|disconnect|\\bkaat|\\bkat\\s*(?:di|jayegi|jaegi)|बंद\\s*कर\\s*दी\\s*जाएगी|band\\s*kar\\s*di\\s*jayegi";
const CONTACT = `संपर्क|सम्पर्क|contact|\\bcall\\b|कॉल|officer|अधिकारी|whatsapp|व्हाट्सएप|${MOBILE}|${MASKED_NUMBER}`;

const PRIZE =
  "lottery|लॉटरी|लाटरी|lucky\\s*draw|लकी\\s*ड्रॉ|\\bkbc\\b|केबीसी|करोड़पति|winner|prize|इनाम|पुरस्कार|\\binam\\b";
const WIN = "जीत|\\bjeet|\\bwon\\b";
const AMOUNT = "लाख|करोड़|हज़ार|₹|\\brs\\.?\\s*\\d|\\binr\\b|\\blakh|\\bcrore";
const FEE =
  "\\bfees?\\b|फ़ीस|शुल्क|\\btax|टैक्स|processing|प्रोसेसिंग|\\bcharges?\\b|चार्ज|जमा\\s*कर|deposit|\\bgst\\b|registration|रजिस्ट्रेशन|\\bpay\\b|भुगतान";

const MEDIA =
  "video|वीडियो|विडियो|photo|फ़ोटो|\\bpics?\\b|तस्वीर|\\bclip|क्लिप|recording|रिकॉर्डिंग|nude|न्यूड|morph|मॉर्फ";
// सिर्फ़ "YouTube" शब्द धमकी नहीं ("YouTube video like करो" वाला काम भी उसमें आता है); "डाल दूँगा", "upload" जैसे शब्द चाहिए
const SPREAD =
  "viral|वायरल|\\bleak|लीक|सबको|सब\\s*को|सबके\\s*पास|everyone|everybody|family|परिवार|घरवालों|रिश्तेदार|relatives|contacts|कॉन्टैक्ट|upload|अपलोड|भेज\\s*दूंगा|भेज\\s*दूंगी|भेज\\s*देंगे|send\\s*(?:it\\s*)?to\\s*(?:all|your)|डाल\\s*दूंगा|फैला";
const MONEY =
  "पैसे|पैसा|\\bpaise|\\bpaisa|\\bpay\\b|payment|money|रुपये|रुपए|rupees|₹|\\brs\\.?\\s*\\d|transfer|भेजो|\\bbhejo|\\bupi\\b";

const LOAN = "\\bloan|लोन|ऋण|\\bemi\\b|ईएमआई|\\bkarz|क़र्ज़|\\bqarz|\\budhar|उधार";
const LOAN_MEDIA = "photo|फ़ोटो|morph|मॉर्फ|nude|न्यूड|गाली|viral|वायरल|बदनाम|badnaam|धमकी";
const LOAN_PEOPLE = "contacts?\\b|कॉन्टैक्ट|रिश्तेदार|relatives|family|परिवार|सबको|सब\\s*को|सबके\\s*पास";
const LOAN_SEND = "भेज|\\bsend|\\bbhej|बता|\\btell|\\bcall|कॉल|message|मैसेज";

const KYC = "\\bkyc\\b|केवाईसी|\\bpan\\b|पैन";
const ACCOUNT = "account|\\ba/c\\b|खाता|खाते|अकाउंट|\\bsim\\b|सिम|\\byono\\b|net\\s*banking|नेट\\s*बैंकिंग|\\bcard\\b|कार्ड|wallet|वॉलेट";
const BLOCK =
  "block|ब्लॉक|suspend|सस्पेंड|deactivat|freeze|फ़्रीज़|बंद\\s*हो\\s*जा|बंद\\s*कर\\s*दिया\\s*जा|बंद\\s*कर\\s*दी\\s*जा|band\\s*ho\\s*ja|expire|एक्सपायर|on\\s*hold|blacklist|ब्लैकलिस्ट|रुक\\s*(?:गई|गया|गयी|जाएगी|जाएगा)|रुकी\\s*(?:है|हुई)|रोक\\s*(?:दी|दिया)|withheld";
// असली बैंक message में "block" धमकी नहीं होता: "SMS BLOCK 1234 to …" (बैंक का निर्देश), "to block your card",
// "blocked as requested"। kyc_block इन्हें हटाकर ही "block" देखता है।
const BLOCK_NOT_THREAT =
  "\\bsms\\s+block\\b|\\bto\\s+block\\b|blocked\\s+as\\s+(?:per\\s+(?:your\\s+)?)?request(?:ed)?|ब्लॉक\\s+करने\\s+के\\s+लिए|ब्लॉक\\s+करवाने";
const ACTION = "update|अपडेट|click|क्लिक|\\blink|लिंक|verify|वेरीफ़ाई|वेरिफ़ाई|सत्यापित|\\bcall\\b|कॉल|download|डाउनलोड";

const JOB =
  "part[\\s-]*time|पार्ट\\s*टाइम|work\\s*from\\s*home|\\bwfh\\b|घर\\s*बैठे|ghar\\s*baithe|\\bjob\\b|जॉब|नौकरी|naukri|\\btasks?\\b|टास्क|\\bearn|कमाई|कमाएं|कमाओ|\\bkamai|\\bkamao";
const JOB_SIGN =
  "\\blikes?\\b|लाइक|review|रिव्यू|rating|रेटिंग|subscribe|सब्सक्राइब|\\d\\s*star|five\\s*star|\\bfollow|फ़ॉलो|\\bdaily\\b|per\\s*day|प्रतिदिन|हर\\s*दिन|रोज़|\\broz\\b|commission|कमीशन|prepaid|प्रीपेड|telegram|टेलीग्राम|हर\\s*\\S+\\s*पर\\s*₹|₹\\s*(?<!\\d)\\d+\\s*(?:per|हर|प्रति)";

const MULTIPLY = "double|डबल|दुगन|दोगुन|दुगुन|\\bdoguna|\\bdugna|(?<!\\d)\\d+\\s*x\\b|(?<!\\d)\\d+\\s*गुना";
const MONEY_GAIN = "पैसे|पैसा|money|amount|रक़म|निवेश|invest|return|रिटर्न|profit|प्रॉफ़िट|मुनाफ़ा|लाभ";
const INVEST_DIRECT =
  "guarantee|गारंटी|assured\\s*return|fixed\\s*return|\\b\\d{2,4}\\s*%\\s*(?:return|रिटर्न|profit|प्रॉफ़िट|मुनाफ़ा|लाभ|daily|monthly|रोज़)|stock\\s*tips|स्टॉक\\s*टिप्स|trading\\s*(?:group|tips)|ट्रेडिंग\\s*ग्रुप|vip\\s*group|वीआईपी\\s*ग्रुप|crypto|क्रिप्टो|bitcoin|बिटकॉइन|ipo\\s*allot|institutional\\s*account|forex|फ़ॉरेक्स|daily\\s*profit|रोज़\\s*का\\s*मुनाफ़ा";

const WITHDRAW = "निकाल|निकासी|withdraw|unlock|release";
const WITHDRAW_FEE = "\\bfees?\\b|फ़ीस|शुल्क|\\btax|टैक्स|चार्ज|\\bcharges?\\b|जमा|deposit|\\bgst\\b";
// सिर्फ़ "पैसे/₹" काफ़ी नहीं (ATM के असली शुल्क वाले message पर निशान न लगे); मुनाफ़ा/balance/wallet जैसा शब्द चाहिए
const GAINS = "मुनाफ़ा|मुनाफ़े|profit|earning|कमाई|balance|बैलेंस|wallet|वॉलेट|commission|कमीशन|reward|bonus|बोनस";

const NEW_NUMBER = "नया\\s*नंबर|नए\\s*नंबर|new\\s*(?:number|no\\b)|\\bnaya\\s*(?:number|no\\b)|नंबर\\s*बदल|number\\s*(?:badal|change)|changed\\s*my\\s*number";

const LOAN_FEE = "\\bfees?\\b|फ़ीस|शुल्क|\\bcharges?\\b|चार्ज|insurance|बीमा|\\bgst\\b|stamp\\s*duty";
const LOAN_ADVANCE =
  "\\bto\\s+get\\b|to\\s+receive|disburs|\\brelease|before|advance|पहले|पाने\\s*के\\s*लिए|मिलने\\s*से\\s*पहले|approval\\s*के\\s*लिए|\\bpehle|file\\s*charge|फ़ाइल\\s*चार्ज|भेजो|भेज\\s*दो|\\bbhejo\\b|\\bbhej\\s*do\\b";
const LOAN_OFFER = "pre[\\s-]*approved|\\bapprove|sanction|मंज़ूर|स्वीकृत|instant|तुरंत\\s*loan|\\blakh|लाख|₹|\\brs\\b";

const WRONG =
  "ग़लती\\s*से|\\bgalti\\s*se|\\bghalti\\s*se|by\\s*mistake|mistakenly|wrongly|accidentally|wrong\\s*(?:number|account|transfer)|भूल\\s*से|ग़लत\\s*(?:नंबर|खाते)";
const SENT = "भेज|\\bsent\\b|transfer|ट्रांसफ़र|पैसे|money|₹|\\brs\\b|credited|\\bbhej";
const BACK = "वापस|\\bwapas|\\bvapas|\\breturn|refund|लौटा|\\blauta|\\bback\\b";

const CARE =
  "customer\\s*care|कस्टमर\\s*केयर|customer\\s*support|helpline|हेल्पलाइन|toll\\s*free|टोल\\s*फ़्री|support\\s*team|refund\\s*(?:department|team)|care\\s*number";
const REFUND_HOOK = "refund|रिफंड|cash\\s*back|कैशबैक|complaint|शिकायत";
const CARE_HOOK = `${REFUND_HOOK}|whatsapp|व्हाट्सएप|google|गूगल`;

const URGENT =
  "तुरंत|तुरन्त|फ़ौरन|\\bturant\\b|urgent|immediately|\\basap\\b|last\\s*chance|आख़िरी\\s*मौका|अंतिम\\s*मौका|within\\s*(?<!\\d)\\d+\\s*(?:hours?|hrs?|minutes?|mins?)\\b|(?<!\\d)\\d+\\s*(?:घंटे|मिनट)\\s*(?:में|के\\s*अंदर|के\\s*भीतर)|(?<!\\d)\\d+\\s*(?:ghante|ghanton|ghanto|minute|minutes|min)\\s*(?:me|mein|main|ke\\s*andar)\\b|वरना|\\bwarna\\b|\\bvarna\\b|otherwise|जल्दी\\s*(?:करें|करो|कीजिए)|\\bjaldi\\s*kar|अभी\\s*के\\s*अभी|today\\s*itself|expires?\\s*today|आज\\s*ही\\s*(?:बंद|ब्लॉक|अंतिम|आख़िरी)";

// नौकरी के नाम पर ठगी: "चयन हो गया / joining / offer letter" + registration, training, deposit, visa वगैरह + रकम।
// सरकारी भर्ती की असली application fee ("Application fee ₹500…") में "चयन/joining" नहीं होता, उस पर निशान नहीं।
const JOB_SELECTED =
  "selected|चयन|चुन\\s*लिया|shortlisted|joining|जॉइनिंग|ज्वाइनिंग|offer\\s*letter|ऑफ़र\\s*लेटर|appointment\\s*letter|नियुक्ति\\s*पत्र|नौकरी\\s*पक्की|confirm\\s*your\\s*(?:job|joining|seat)";
const JOB_FEE =
  "registration|रजिस्ट्रेशन|\\bfees?\\b|फ़ीस|शुल्क|deposit|डिपॉज़िट|जमा|training|ट्रेनिंग|uniform|यूनिफ़ॉर्म|\\bkit\\b|किट|\\bcharges?\\b|चार्ज|verification|वेरिफ़िकेशन|security|सिक्योरिटी|\\bvisa\\b|वीज़ा|ticket|टिकट";
// "work from home / part time / data entry" वाली निजी नौकरी में चयन शब्द के बिना भी (सरकारी "भर्ती" की असली fee पर नहीं)
const JOB_INFORMAL =
  "work\\s*from\\s*home|\\bwfh\\b|घर\\s*बैठे|part[\\s-]*time|पार्ट\\s*टाइम|data\\s*entry|डाटा\\s*एंट्री|typing\\s*(?:job|work)|copy\\s*paste\\s*(?:job|work)";
// पैसे भेजने का कहना ज़रूरी ("Pay is ₹25,000 per month" तनख़्वाह है, "kit will be provided free" मुफ़्त है)
const JOB_PAY =
  "जमा\\s*कर|भेज|\\bpay\\s+(?:rs|₹|inr|\\d|on|via|to|at|through|now|this)|deposit|transfer\\b|भुगतान\\s*कर|\\bbhej|\\bjama\\s*kar|\\bsend\\b";

// कुछ पाने (bonus, gift, scholarship, refund) के लिए पहले पैसे: आम advance-fee ठगी। शाखा/counter पर जमा वाली असली बात नहीं।
const CLAIM =
  "पाने\\s*के\\s*लिए|पाने\\s*हेतु|मिलने\\s*के\\s*लिए|लेने\\s*के\\s*लिए|छुड़ाने\\s*के\\s*लिए|\\bto\\s+(?:receive|get|claim|release|collect)\\b|\\bfor\\s+(?:release|clearance)\\b|clearance|\\bpane\\s*ke\\s*liye|\\bmilne\\s*ke\\s*liye";
const ADV_FEE =
  "\\bfees?\\b|फ़ीस|शुल्क|\\btax|टैक्स|\\bgst\\b|\\bcharges?\\b|चार्ज|processing|प्रोसेसिंग|registration|रजिस्ट्रेशन|clearance|deposit|जमा";
const IN_PERSON = "शाखा|branch|counter|काउंटर|दफ़्तर\\s*में|office\\s*में";

// किसी अपने की मुसीबत (accident, hospital, पुलिस) बताकर तुरंत पैसे: नक़ली आवाज़ वाले call भी
const RELATIVE =
  "बेटे|बेटा|बेटी|\\bbete\\b|\\bbeta\\b|\\bbeti\\b|\\bsons?\\b|daughter|पति|पत्नी|husband|wife|भाई|\\bbhai\\b|बहन|\\bbehen\\b|पापा|\\bpapa\\b|मम्मी|\\bmummy\\b|पिता|father|mother|brother|sister|रिश्तेदार|relative|दोस्त|friend";
const EMERGENCY =
  "accident|एक्सीडेंट|दुर्घटना|hospital|अस्पताल|\\bicu\\b|आईसीयू|operation|ऑपरेशन|emergency|इमरजेंसी|पकड़\\s*लिया|पकड़ा\\s*गया|arrested|custody|हिरासत|जेल|\\bjail\\b";
const SEND_NOW = "भेजो|भेज\\s*दो|भेजिए|भेज\\s*दीजिए|भेजें|\\bbhejo\\b|\\bbhej\\s*do\\b|\\bsend\\b|transfer|ट्रांसफ़र";

// "यह आपने नहीं किया तो…" वाला हिस्सा: असली alert की जल्दी (तुरंत बताएँ) धमकी नहीं, इसलिए urgency इसे हटाकर देखी जाती है।
// पर उसी हिस्से में mobile नंबर हो, तो नकली alert का निशान (ठग अपने नंबर पर call करवाते हैं)।
const NOT_YOU_CORE =
  "if\\s+(?:this\\s+(?:was|is)\\s+)?not\\s+(?:done\\s+by\\s+)?you|\\bnot\\s+you\\b|if\\s+you\\s+(?:have\\s+not|did\\s+not|didn'?t)|आपने\\s+नहीं\\s+किया|अगर\\s+आपने\\s+नहीं|\\baapne\\s+nahi\\s+kiya";
const DEBITED =
  "debited|deducted|withdrawn|transferred|spent|कट\\s*गए|कटे|काटे|निकाले\\s*गए|निकल\\s*गए|डेबिट|\\bkat\\s*gaye|\\bdebit";
// बैंक का "SMS BLOCK 1234 to 92230…" (SMS भेजने का अपना नंबर) call करवाना नहीं; नकली alert "call करें" कहता है
const SMS_BLOCK_TO = "\\bsms\\s+block\\s+\\S+\\s+to\\s+\\+?\\d[\\d\\s-]{6,}";
// UPI ID का हिस्सा वाला नंबर (9876543210@ybl) नहीं गिना जाता
const ALERT_NUMBER = `(?<![\\d@.])(?:\\+?91[\\s-]?)?[6-9]\\d{4}[\\s-]?\\d{5}(?![\\d@])|${MASKED_NUMBER}`;

// AePS: आधार नंबर + अंगूठे के निशान से बिना OTP निकासी। "भेजो/share" साथ हो तभी (आधार केंद्र पर अंगूठा लगाने की सलाह पर नहीं)
const BIOMETRIC =
  "अंगूठ|\\bang(?:u|oo)tt?h(?:a|e)\\b|fingerprint|finger\\s*print|फ़िंगर\\s*प्रिंट|बायोमेट्रिक|biometric|thumb\\s*(?:impression|print|scan)";
const SEND_BIO = "भेज|\\bsend|\\bshare|शेयर|साझा|upload|अपलोड|\\bbhej|\\bforward|फ़ॉरवर्ड";

// SIM swap: "upgrade/eSIM" के बहाने SMS या नए SIM का 20 अंकों का नंबर भिजवाना
const SIM = "\\bsim\\b|सिम|\\be-?sim\\b|ई-?\\s*सिम";
const SMS_WORD = "\\bsms|एसएमएस|मैसेज|\\bmessage";
const SMS_SEND = "भेज|\\bsend|\\bbhej|\\bforward|फ़ॉरवर्ड|\\btype|टाइप";
const SIM_NUMBER = "(?<!\\d)20\\s*(?:अंक|digit)|(?<!\\d)89\\d{17,18}(?!\\d)";
const SIM_CHANGE =
  "upgrade|अपग्रेड|(?<!\\d)[345]\\s*g\\b|activat|एक्टिव|चालू|बंद|\\bblock|ब्लॉक|swap|स्वैप|replace|बदल|deactivat|expire|एक्सपायर|\\bband\\s*ho";

// call forwarding: *401* (Jio) या **21* / **61* / **62* / **67* / **002* / **004* (GSM) जैसे code
const CALL_FORWARD = "\\*\\s*40[1-9]\\s*\\*|\\*\\*\\s*(?:21|61|62|67|002|004)\\s*\\*|(?<![*\\d])\\*\\s*21\\s*\\*";

// सरकारी कामों के नाम (इनकी असली साइटें .gov.in / .nic.in पर); बिजली कंपनियाँ इसमें नहीं (उनकी साइटें अलग-अलग)
const GOV_NAME =
  "income\\s*tax|आयकर|\\bitr\\b|tax\\s*refund|challan|चालान|parivahan|परिवहन|traffic\\s*police|ट्रैफ़िक\\s*पुलिस|\\buidai\\b|\\baadhaa?r\\b|आधार|\\bpan\\s*card|पैन\\s*कार्ड|\\bepfo\\b|पीएफ|pm[\\s-]*kisan|पीएम\\s*किसान|किसान\\s*सम्मान|ration\\s*card|राशन\\s*कार्ड|passport|पासपोर्ट|digilocker|डिजीलॉकर|सरकारी\\s*योजना|government\\s*scheme";

const LINK =
  "https?://|\\bwww\\.|\\bbit\\.ly\\b|tinyurl|\\b(?:t|wa)\\.me/|\\b[a-z0-9-]{2,}\\.(?:com|in|net|org|xyz|top|info|ly|me|link|site|online|live|club|vip|shop|cc|co|io|app|biz)\\b(?!\\.\\d)";

const R = {
  otp: near(OTP, ASK, 40),
  receive: rx(RECEIVE),
  qr: rx(QR),
  pin: rx(PIN),
  request: rx(REQUEST),
  arrestDirect: rx(ARREST_DIRECT),
  authority: rx(AUTHORITY),
  threat: rx(THREAT),
  apk: rx(APK),
  remote: rx(REMOTE),
  electricity: rx(ELECTRICITY),
  cut: rx(CUT),
  contact: rx(CONTACT),
  prize: rx(PRIZE),
  winAmount: near(WIN, AMOUNT, 30),
  you: rx(YOU),
  fee: rx(FEE),
  media: rx(MEDIA),
  spread: rx(SPREAD),
  money: rx(MONEY),
  loan: rx(LOAN),
  loanMedia: rx(LOAN_MEDIA),
  loanPeople: rx(LOAN_PEOPLE),
  loanSend: rx(LOAN_SEND),
  newNumber: rx(NEW_NUMBER),
  kyc: rx(KYC),
  account: rx(ACCOUNT),
  block: rx(BLOCK),
  action: rx(ACTION),
  job: rx(JOB),
  jobSign: rx(JOB_SIGN),
  multiply: near(MULTIPLY, MONEY_GAIN, 25),
  investDirect: rx(INVEST_DIRECT),
  withdraw: rx(WITHDRAW),
  withdrawFee: rx(WITHDRAW_FEE),
  gains: rx(GAINS),
  loanFee: rx(LOAN_FEE),
  loanAdvance: rx(LOAN_ADVANCE),
  loanOffer: rx(LOAN_OFFER),
  wrong: rx(WRONG),
  sent: rx(SENT),
  back: rx(BACK),
  care: rx(CARE),
  careHook: rx(CARE_HOOK),
  refundHook: rx(REFUND_HOOK),
  mobile: rx(MOBILE),
  blockNotThreat: new RegExp(normalizePattern(BLOCK_NOT_THREAT), "gi"),
  notYouClause: new RegExp(normalizePattern(`(?:${NOT_YOU_CORE})${END}*`), "gi"),
  fakeAlert: rx(`(?:${NOT_YOU_CORE})[^\\n]{0,80}?(?:${ALERT_NUMBER})`),
  debited: rx(DEBITED),
  jobSelected: rx(JOB_SELECTED),
  jobFee: rx(JOB_FEE),
  jobPay: rx(JOB_PAY),
  jobInformal: rx(JOB_INFORMAL),
  claimFee: near(CLAIM, ADV_FEE, 40),
  inPerson: rx(IN_PERSON),
  relative: rx(RELATIVE),
  emergency: rx(EMERGENCY),
  sendNow: rx(SEND_NOW),
  receivePromise: rx(RECEIVE_PROMISE),
  safeAccount: near(SAFE_ACCOUNT, MOVE_MONEY, 40),
  amount: rx(AMOUNT),
  smsBlockTo: new RegExp(normalizePattern(SMS_BLOCK_TO), "gi"),
  biometricSend: near(BIOMETRIC, SEND_BIO, 50),
  sim: rx(SIM),
  simSend: near(SMS_WORD, SMS_SEND, 20),
  simNumber: rx(SIM_NUMBER),
  simChange: rx(SIM_CHANGE),
  callForward: rx(CALL_FORWARD),
  urgent: rx(URGENT),
  link: rx(LINK),
  govName: rx(GOV_NAME),
};

// कुछ नियम दूसरे नियमों में भी काम आते हैं (आम "पहले पैसे" वाला निशान सिर्फ़ तब, जब इनमें से कोई ठीक-ठीक न मिले)
const isLotteryFee = (t: CheckedText) => (R.prize.test(t.text) || R.winAmount.test(t.text)) && R.fee.test(t.text);
const isWithdrawFee = (t: CheckedText) => R.withdraw.test(t.text) && R.withdrawFee.test(t.text) && R.gains.test(t.text);
const isLoanAdvanceFee = (t: CheckedText) =>
  R.loan.test(t.text) && R.loanFee.test(t.text) && R.loanAdvance.test(t.text) && R.loanOffer.test(t.text);
const isJobFee = (t: CheckedText) =>
  (R.jobSelected.test(t.text) || R.jobInformal.test(t.text)) && R.jobFee.test(t.text) && R.amount.test(t.text) && R.jobPay.test(t.stripped);

// क्रम: पहले सारे danger, फिर warn (नतीजे में इसी क्रम से दिखते हैं)
export const CHECKER_RULES: readonly CheckerRule[] = [
  {
    id: "otp_request",
    level: "danger",
    labelHi: "OTP माँगा जा रहा है",
    explainHi: "बैंक, पुलिस या कोई असली कंपनी कभी OTP नहीं माँगती। OTP बताते ही खाते से पैसे जा सकते हैं।",
    gyan: "customer-care-fake",
    test: (t) => R.otp.test(t.stripped),
  },
  {
    id: "receive_pin_qr",
    level: "danger",
    labelHi: "पैसे पाने के लिए QR scan करवाना",
    explainHi: "पैसे पाने के लिए कभी QR scan नहीं करना पड़ता। QR scan करके PIN डालने से पैसे आपके खाते से जाते हैं।",
    gyan: "upi-pin-qr",
    turant: "upi",
    test: (t) => R.qr.test(t.stripped) && (R.receive.test(t.stripped) || R.receivePromise.test(t.stripped)),
  },
  {
    id: "upi_request_pin",
    level: "danger",
    labelHi: "पैसे पाने के लिए PIN डालने को कहना",
    explainHi: "UPI PIN सिर्फ़ पैसे भेजने के लिए डलता है, पाने के लिए कभी नहीं। 'request' पर PIN डाला तो पैसे कटेंगे।",
    gyan: "upi-pin-qr",
    turant: "upi",
    test: (t) =>
      R.pin.test(t.stripped) && (R.request.test(t.stripped) || R.receive.test(t.stripped) || R.receivePromise.test(t.stripped)),
  },
  {
    id: "digital_arrest",
    level: "danger",
    labelHi: "पुलिस/CBI बनकर डराना ('digital arrest')",
    explainHi: "'digital arrest' जैसी कोई कानूनी कार्रवाई नहीं होती। असली पुलिस video call पर पूछताछ नहीं करती, और न पैसे माँगती है।",
    gyan: "digital-arrest",
    turant: "digital-arrest",
    test: (t) =>
      R.arrestDirect.test(t.text) ||
      R.safeAccount.test(t.text) ||
      (R.authority.test(t.text) && R.threat.test(t.text) && R.you.test(t.text)),
  },
  {
    id: "apk_file",
    level: "danger",
    labelHi: ".apk फ़ाइल भेजी गई है",
    explainHi: "शादी का कार्ड, बिल या बैंक ऐप के नाम पर आई .apk फ़ाइल खोलने से फ़ोन ठगों के हाथ में जा सकता है। ऐप सिर्फ़ Play Store से लें।",
    gyan: "apk-file",
    test: (t) => R.apk.test(t.text),
  },
  {
    id: "remote_app",
    level: "danger",
    labelHi: "AnyDesk या TeamViewer जैसा ऐप डलवाना",
    explainHi: "इन ऐप से सामने वाला आपका पूरा फ़ोन देख और चला सकता है। कोई असली बैंक या कंपनी ऐसा ऐप नहीं डलवाती।",
    gyan: "customer-care-fake",
    turant: "customer-care-fake",
    test: (t) => R.remote.test(t.text),
  },
  {
    id: "electricity_cut",
    level: "danger",
    labelHi: "बिजली कटने का डर दिखाकर नंबर पर call करवाना",
    gyan: "bijli-bill",
    turant: "customer-care-fake",
    explainHi: "यह ठगी का आम तरीका है। बिल सिर्फ़ अपनी बिजली कंपनी के ऐप, वेबसाइट या दफ़्तर से जाँचें, message में दिए नंबर से नहीं।",
    test: (t) => R.electricity.test(t.text) && R.cut.test(t.text) && R.contact.test(t.text),
  },
  {
    id: "lottery_fee",
    level: "danger",
    labelHi: "इनाम या लॉटरी के लिए पहले पैसे माँगना",
    gyan: "lottery-inaam",
    turant: "upi",
    explainHi: "जिस लॉटरी का टिकट आपने ख़रीदा ही नहीं, वह नहीं लगती। इनाम के नाम पर 'fee' या 'tax' माँगना ठगी है।",
    test: isLotteryFee,
  },
  {
    id: "blackmail",
    level: "danger",
    labelHi: "video या photo फैलाने की धमकी देकर पैसे माँगना",
    explainHi: "पैसे देने से धमकी बंद नहीं होती, माँग बढ़ती जाती है। पैसे न भेजें, chat का सबूत रखें, और 1930 पर शिकायत करें।",
    gyan: "sextortion",
    turant: "sextortion",
    test: (t) => R.media.test(t.text) && R.spread.test(t.text) && R.money.test(t.text),
  },
  {
    id: "loan_threat",
    level: "danger",
    labelHi: "loan के नाम पर photo या रिश्तेदारों को भेजने की धमकी",
    explainHi: "ऐसी धमकी देकर वसूली करना ग़ैरक़ानूनी है। पैसे न भेजें, सबूत रखें, और 1930 पर शिकायत करें।",
    gyan: "loan-app",
    turant: "loan-app",
    test: (t) =>
      R.loan.test(t.text) && (R.loanMedia.test(t.text) || (R.loanPeople.test(t.text) && R.loanSend.test(t.text))),
  },
  {
    id: "withdraw_fee",
    level: "danger",
    labelHi: "अपना पैसा निकालने के लिए पहले fee या tax माँगना",
    explainHi: "यह task या निवेश वाली ठगी का आख़िरी कदम है। fee भरने से पैसा नहीं निकलता, और पैसे जाते हैं। आगे कुछ न भेजें।",
    gyan: "task-investment",
    turant: "investment-task",
    test: isWithdrawFee,
  },
  {
    id: "loan_advance_fee",
    level: "danger",
    labelHi: "loan देने से पहले fee माँगना",
    gyan: "loan-app",
    explainHi: "loan के नाम पर पहले 'processing fee', 'insurance' या 'GST' माँगकर ग़ायब हो जाना ठगी का आम तरीका है। loan सिर्फ़ अपने बैंक या उसके अपने ऐप से लें।",
    turant: "upi",
    test: isLoanAdvanceFee,
  },
  {
    id: "job_fee",
    level: "danger",
    labelHi: "नौकरी के चयन या joining के लिए पहले पैसे माँगना",
    explainHi: "असली नौकरी में चयन या joining के लिए पैसे नहीं लगते। registration, training, deposit या visa के नाम पर पहले पैसे माँगना ठगी का आम तरीका है।",
    gyan: "naukri-fee",
    turant: "upi",
    test: isJobFee,
  },
  {
    id: "advance_fee",
    level: "danger",
    labelHi: "कुछ पाने के लिए पहले पैसे माँगना (bonus, gift, scholarship…)",
    explainHi: "bonus, refund, gift या scholarship पाने के लिए पहले fee, tax या GST माँगना ठगी का पक्का निशान है। पैसे न भेजें।",
    gyan: "lottery-inaam",
    turant: "upi",
    test: (t) =>
      R.claimFee.test(t.stripped) &&
      R.amount.test(t.text) &&
      R.jobPay.test(t.stripped) &&
      !R.inPerson.test(t.text) &&
      !isLotteryFee(t) &&
      !isLoanAdvanceFee(t) &&
      !isJobFee(t) &&
      !isWithdrawFee(t),
  },
  {
    id: "new_number_money",
    level: "danger",
    labelHi: "'नया नंबर' से पैसे माँगना",
    explainHi: "ठग किसी अपने के नाम से नए नंबर से मुसीबत बताकर पैसे माँगते हैं। पैसे भेजने से पहले उस इंसान को उसके पुराने नंबर पर call करके पक्का करें।",
    gyan: "apna-bankar",
    turant: "upi",
    test: (t) => R.newNumber.test(t.text) && R.money.test(t.text),
  },
  {
    id: "biometric_ask",
    level: "danger",
    labelHi: "आधार नंबर या अंगूठे का निशान भिजवाना",
    explainHi: "आधार नंबर और अंगूठे के निशान से AePS वाली मशीन पर बिना OTP आपके खाते से पैसे निकाले जा सकते हैं। ये किसी को न भेजें, और UIDAI की myAadhaar साइट पर अपना biometric lock करें।",
    gyan: "aeps-angootha",
    turant: "pata-nahi",
    test: (t) => R.biometricSend.test(t.stripped),
  },
  {
    id: "sim_swap",
    level: "danger",
    labelHi: "'SIM upgrade' या eSIM के नाम पर SMS भिजवाना",
    explainHi: "ऐसे SMS से आपका नंबर ठग के SIM पर चालू हो सकता है, फिर बैंक के OTP उसी के पास जाते हैं। SIM या eSIM सिर्फ़ अपनी कंपनी के store या अपने ऐप से बदलवाएँ।",
    gyan: "sim-swap",
    turant: "pata-nahi",
    test: (t) => R.sim.test(t.stripped) && (R.simSend.test(t.stripped) || R.simNumber.test(t.stripped)) && R.simChange.test(t.stripped),
  },
  {
    id: "call_forward",
    level: "danger",
    labelHi: "*401* जैसा code dial करवाना (call forwarding)",
    explainHi: "ऐसे code से आपकी calls, और OTP वाली calls भी, ठग के नंबर पर जाने लगती हैं। कर दिया हो, तो फ़ोन की settings में call forwarding बंद करें और अपने बैंक को बताएँ।",
    gyan: "sim-swap",
    turant: "pata-nahi",
    test: (t) => R.callForward.test(t.text),
  },
  {
    id: "kyc_block",
    level: "warn",
    labelHi: "KYC या खाता बंद होने का डर",
    gyan: "kyc-link",
    explainHi: "बैंक का नाम लेकर SMS के link या call से KYC करवाना ठगी का आम तरीका है। KYC अपने बैंक की शाखा या उसके अपने ऐप में ही करें।",
    test: (t) => R.block.test(t.text.replace(R.blockNotThreat, " ")) && (R.kyc.test(t.text) || (R.account.test(t.text) && R.action.test(t.text))),
  },
  {
    id: "task_job",
    level: "warn",
    labelHi: "like या review करके कमाई वाला काम",
    explainHi: "शुरू में छोटी कमाई दिखाकर फिर 'task' के नाम पर बड़े पैसे जमा करवाए जाते हैं। असली नौकरी में पहले पैसे नहीं देने पड़ते।",
    gyan: "task-investment",
    turant: "investment-task",
    test: (t) => R.job.test(t.text) && R.jobSign.test(t.text),
  },
  {
    id: "investment",
    level: "warn",
    labelHi: "पैसे दुगने या बहुत ज़्यादा मुनाफ़े का वादा",
    explainHi: "कम समय में बहुत ज़्यादा मुनाफ़े का वादा ठगी का आम निशान है। निवेश सिर्फ़ SEBI में दर्ज broker से करें।",
    gyan: "task-investment",
    turant: "investment-task",
    test: (t) => R.investDirect.test(t.text) || R.multiply.test(t.text),
  },
  {
    id: "wrong_transfer",
    level: "warn",
    labelHi: "'ग़लती से पैसे भेज दिए, वापस करो'",
    gyan: "galti-se-paise",
    explainHi: "पहले अपने बैंक ऐप में ख़ुद देखें कि पैसे सच में आए हैं या नहीं। अक्सर यह नकली SMS होता है। पैसे आए हों, तो भी वापसी अपने बैंक के ज़रिए करें।",
    turant: "upi",
    test: (t) => R.wrong.test(t.text) && R.sent.test(t.text) && R.back.test(t.text),
  },
  {
    id: "fake_alert_number",
    level: "warn",
    labelHi: "पैसे कटने का message, और call के लिए mobile नंबर",
    explainHi: "ठग पैसे कटने का नकली SMS भेजकर अपने नंबर पर call करवाते हैं। पहले बैंक के ऐप में ख़ुद देखें कि पैसे सच में कटे हैं या नहीं। call करना हो, तो card के पीछे या बैंक के ऐप में लिखे नंबर पर करें।",
    gyan: "customer-care-fake",
    test: (t) => R.debited.test(t.text) && R.fakeAlert.test(t.text.replace(R.smsBlockTo, " ")),
  },
  {
    id: "relative_emergency",
    level: "warn",
    labelHi: "किसी अपने की मुसीबत बताकर तुरंत पैसे माँगना",
    explainHi: "पैसे भेजने से पहले उसी इंसान को, या घर के किसी और को, उनके जाने-पहचाने नंबर पर call करके पक्का करें। आजकल आवाज़ की नक़ल करके भी call आते हैं।",
    gyan: "apna-bankar",
    test: (t) => R.relative.test(t.text) && R.emergency.test(t.text) && R.sendNow.test(t.stripped) && R.money.test(t.text),
  },
  {
    id: "customer_care",
    level: "warn",
    labelHi: "customer care के नाम पर mobile नंबर",
    explainHi: "असली customer care का नंबर सिर्फ़ कंपनी की अपनी वेबसाइट या ऐप से लें। Google या SMS में मिला नंबर नकली हो सकता है।",
    gyan: "customer-care-fake",
    turant: "customer-care-fake",
    test: (t) =>
      (R.care.test(t.text) && (R.mobile.test(t.text) || R.careHook.test(t.text))) ||
      (R.mobile.test(t.text) && R.refundHook.test(t.text)),
  },
  {
    id: "new_number",
    level: "warn",
    labelHi: "'मेरा नया नंबर है' वाला message",
    gyan: "apna-bankar",
    explainHi: "ठग किसी अपने के नाम से नए नंबर से लिखते हैं, फिर पैसे माँगते हैं। उस इंसान को उसके पुराने नंबर पर call करके पक्का करें।",
    test: (t) => R.newNumber.test(t.text) && !R.money.test(t.text),
  },
  {
    id: "urgency",
    level: "warn",
    labelHi: "जल्दबाज़ी करवाना",
    explainHi: "ठग सोचने का समय नहीं देते। रुकें, किसी अपने से पूछें, फिर कुछ करें।",
    test: (t) => R.urgent.test(t.text.replace(R.notYouClause, " ")),
  },
  {
    id: "bank_lookalike",
    level: "warn",
    labelHi: "बैंक के नाम वाला पता, पर .bank.in नहीं",
    gyan: "kyc-link",
    explainHi: "RBI के निर्देश से भारत के बैंकों की वेबसाइट .bank.in पर है, और यह पता सिर्फ़ बैंक ले सकते हैं। बैंक के नाम वाला कोई और पता नकली हो सकता है। link न खोलें।",
    test: (t) => t.domains.some(isBankLookalike),
  },
  {
    id: "gov_lookalike",
    level: "warn",
    labelHi: "सरकारी काम का नाम, पर पता .gov.in का नहीं",
    explainHi: "आयकर, चालान, आधार, PF या किसान योजना जैसे सरकारी कामों की साइटें आम तौर पर .gov.in या .nic.in पर होती हैं। ऐसा link न खोलें; विभाग की साइट का पता ख़ुद टाइप करें।",
    test: (t) => R.govName.test(t.text) && t.domains.some((d) => !isGovDomain(d)),
  },
  {
    id: "link",
    level: "warn",
    labelHi: "message में link है",
    explainHi: "अनजान link न खोलें। बैंक या कंपनी का पता ख़ुद टाइप करके खोलें।",
    test: (t) => R.link.test(t.text),
  },
];

// कई शक वाले निशान एक साथ: आम message में इतने निशान एक साथ नहीं होते
export const MANY_SIGNALS_MIN = 3;
export const MANY_SIGNALS = {
  id: "many_signals",
  level: "danger",
  labelHi: "कई शक वाले निशान एक साथ",
  explainHi: "एक ही message में इतने निशान आम तौर पर ठगी में ही होते हैं। इसे ठगी मानकर चलें: link न खोलें, call न करें, पैसे न भेजें।",
} as const satisfies Omit<CheckerRule, "test">;
