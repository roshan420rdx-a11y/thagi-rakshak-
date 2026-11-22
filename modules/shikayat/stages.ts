import type { Source } from "@/modules/rules-engine";
import { SRC_RBIOS_2026 } from "@/modules/rules-engine/sources";
import type { TurantAction } from "@/modules/scams";

// ठगी की शिकायत का पूरा रास्ता, क्रम से। RBI वाली हर बात का quote मूल text (docs/sources/rbi) में है, test जाँचता है।
// कोई वादा नहीं: Ombudsman मुआवज़ा "दे सकता है", देगा ही, ऐसा नहीं।

export type ShikayatStageId = "call_1930" | "ncrp" | "bank" | "police" | "ombudsman";

export type ShikayatStage = {
  id: ShikayatStageId;
  titleHi: string;
  whenHi: string; // कब करें
  stepsHi: string[]; // क्या करें, क्रम से
  keepHi: string[]; // क्या सँभालें / साथ रखें
  noteHi?: string; // ध्यान देने वाली बात
  actions: TurantAction[];
  sources: Source[];
};

const RBIOS_FILE = SRC_RBIOS_2026.file;
const RBIOS_URL = SRC_RBIOS_2026.url;

export const RBIOS_FIRST_BANK: Source = {
  file: RBIOS_FILE,
  url: RBIOS_URL,
  paragraph: "RB-IOS 2026, FAQ 17",
  quote:
    "The complainant must first approach the concerned Regulated Entity. A complaint can be filed before the RBI Ombudsman if the complainant has not received any reply within 30 days or within the time specified by RBI, NPCI or Card Network guidelines, if any, whichever is higher, after the Regulated Entity received the complaint; or if the complainant is not satisfied with the reply/resolution provided by the Regulated Entity.",
};

export const RBIOS_90_DAYS: Source = {
  file: RBIOS_FILE,
  url: RBIOS_URL,
  paragraph: "RB-IOS 2026, FAQ 17",
  quote:
    "The complaint must be made to the RBI Ombudsman within 90 days from the date on which the above timeline expires or the date of the last communication from the concerned Regulated Entity, whichever is later.",
};

export const RBIOS_FREE: Source = {
  file: RBIOS_FILE,
  url: RBIOS_URL,
  paragraph: "RB-IOS 2026, FAQ 1",
  quote:
    "The Reserve Bank - Integrated Ombudsman Scheme, 2026 (RB-IOS, 2026 / the Scheme) is a cost-free, expeditious and non-adversarial alternate grievance redress mechanism for customer complaints involving deficiency in service by Regulated Entities covered under the Scheme.",
};

export const RBIOS_COMPENSATION: Source = {
  file: RBIOS_FILE,
  url: RBIOS_URL,
  paragraph: "RB-IOS 2026, FAQ 22",
  quote:
    "However, for any consequential loss suffered by the complainant, the RBI Ombudsman has the power to provide compensation up to Rs 30 lakh. In addition, the RBI Ombudsman may provide compensation up to Rs 3 lakh for loss of the complainant’s time, expenses incurred, harassment / mental anguish suffered, etc.",
};

export const SHIKAYAT_STAGES: readonly ShikayatStage[] = [
  {
    id: "call_1930",
    titleHi: "1930 पर call (सबसे पहले)",
    whenHi: "पैसे कटते ही, हो सके तो पहले घंटे में। जितनी जल्दी, ठग के खाते में पैसा रुकने की उम्मीद उतनी ज़्यादा।",
    stepsHi: [
      "1930 मिलाएँ। यह National Cyber Crime Helpline है, call मुफ़्त है।",
      "बताएँ: कब हुआ, कितने पैसे गए, किस बैंक या ऐप से, लेन-देन नंबर (UTR), और ठग का नंबर या UPI ID।",
      "call के अंत में जो शिकायत नंबर (acknowledgement) बताया जाए, उसे लिख लें।",
    ],
    keepHi: ["1930 का शिकायत नंबर", "लेन-देन नंबर (UTR)", "पैसे कटने का SMS"],
    noteHi: "लाइन न लगे तो रुकें नहीं: नीचे वाली online शिकायत करें, और बीच-बीच में 1930 फिर मिलाते रहें।",
    actions: [{ kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" }],
    sources: [],
  },
  {
    id: "ncrp",
    titleHi: "cybercrime.gov.in पर online शिकायत",
    whenHi: "1930 न लगे तो तुरंत; लग जाए, तब भी लिखित रिकॉर्ड के लिए उसी दिन।",
    stepsHi: [
      "cybercrime.gov.in खोलें (यह सरकार का National Cyber Crime Reporting Portal है)।",
      "पैसे वाली ठगी (financial fraud) की शिकायत वाला रास्ता चुनें।",
      "अपने mobile नंबर और उस पर आए OTP से login करें। यह OTP आपका अपना है, इसे किसी और को न बताएँ।",
      "ठगी की जानकारी भरें: तारीख़ और समय, रकम, लेन-देन नंबर (UTR), बैंक; फिर ठग की जानकारी (नंबर, UPI ID, link) और screenshots।",
      "भेजने (submit) के बाद मिला शिकायत नंबर (acknowledgement) सँभालें। इसी से शिकायत की हालत देख सकते हैं।",
    ],
    keepHi: ["portal का शिकायत नंबर", "भरी हुई जानकारी का screenshot"],
    noteHi: "portal के बटनों के नाम समय-समय पर बदल सकते हैं; ऊपर आम क्रम लिखा है। portal मुफ़्त है, कोई fee नहीं लगती।",
    actions: [{ kind: "link", href: "https://cybercrime.gov.in", labelHi: "cybercrime.gov.in खोलें", external: true }],
    sources: [],
  },
  {
    id: "bank",
    titleHi: "अपने बैंक को लिखित शिकायत",
    whenHi: "उसी दिन। RBI के नियमों में बैंक को जितनी जल्दी बताएँगे, आपकी ज़िम्मेदारी उतनी कम हो सकती है।",
    stepsHi: [
      'बैंक के ऐप में "Report fraud" या "Block" वाला विकल्प, या बैंक की अपनी वेबसाइट पर दिया नंबर। नंबर Google पर न खोजें।',
      "फिर email या शाखा में लिखित शिकायत दें: क्या हुआ, कब, कितने पैसे, लेन-देन नंबर (UTR), और 1930 या portal का शिकायत नंबर।",
      "बैंक से शिकायत नंबर या पावती (receipt) ज़रूर लें। आगे RBI Ombudsman के पास जाने के लिए यह ज़रूरी है।",
    ],
    keepHi: ["बैंक का शिकायत नंबर या पावती", "भेजे गए email या पत्र की copy", "बैंक statement"],
    noteHi: "पूरा card नंबर, OTP, PIN या password शिकायत में भी कभी न लिखें; बैंक ये नहीं माँगता।",
    actions: [
      { kind: "link", href: "/gyan/bank", labelHi: "अपने बैंक का सही रास्ता देखें", external: false },
      { kind: "link", href: "/haq/thagi", labelHi: "RBI के नियमों से अपना हक़ देखें", external: false },
      { kind: "link", href: "/arzi", labelHi: "बैंक का पत्र बनाएँ (print/PDF)", external: false },
    ],
    sources: [],
  },
  {
    id: "police",
    titleHi: "पुलिस: थाने या cyber cell में लिखित शिकायत",
    whenHi: "बड़ी रकम हो, धमकी या blackmail हो, या portal या बैंक कहे। ठग के खाते में पैसा रुका हो तो उसे वापस पाने में भी पुलिस की रिपोर्ट काम आती है।",
    stepsHi: [
      "पास के थाने या ज़िले के cyber cell में लिखित शिकायत दें।",
      "साथ ले जाएँ: 1930 या portal का शिकायत नंबर, बैंक की पावती, statement और screenshots।",
      "घटना किसी और इलाके की हो, तब भी शिकायत दी जा सकती है (Zero FIR)। शिकायत की पावती या FIR की copy लें।",
    ],
    keepHi: ["शिकायत या FIR की copy", "थाने का नाम और तारीख़"],
    noteHi: '"पुलिस" या "वकील" बनकर फ़ोन करने वाले, या "पैसा वापस दिलाने" का दावा करके fee माँगने वाले भी ठग होते हैं। असली पुलिस पैसे नहीं माँगती।',
    actions: [
      { kind: "link", href: "/arzi", labelHi: "थाने का पत्र बनाएँ (print/PDF)", external: false },
      { kind: "link", href: "/haq/frozen-money", labelHi: "ठग के खाते में पैसा रुका: वापस कैसे माँगें", external: false },
    ],
    sources: [],
  },
  {
    id: "ombudsman",
    titleHi: "RBI Ombudsman: जब बैंक जवाब न दे",
    whenHi:
      "बैंक को शिकायत के बाद 30 दिन (या RBI, NPCI या card के नियमों में दिया ज़्यादा समय) में जवाब न आए, या जवाब ठीक न लगे। उसके बाद 90 दिन के अंदर।",
    stepsHi: [
      "पहले बैंक को शिकायत होनी चाहिए, और उसका सबूत (शिकायत नंबर या पावती) आपके पास हो।",
      "शिकायत मुफ़्त है: online cms.rbi.org.in पर, या email crpc@rbi.org.in पर, या डाक से RBI के CRPC, चंडीगढ़ को।",
      "भरें: अपनी जानकारी, बैंक और शाखा, बैंक की शिकायत का नंबर और तारीख़, लेन-देन की जानकारी, बैंक का जवाब (हो तो), पूरी बात, और आप क्या चाहते हैं।",
      "शिकायत नंबर मिलता है; उससे और mobile नंबर से cms.rbi.org.in पर हालत देख सकते हैं। मदद: RBI का toll-free 14448।",
    ],
    keepHi: ["RBI का शिकायत नंबर", "बैंक वाली शिकायत का सबूत"],
    noteHi:
      "Ombudsman बैंक की सेवा में कमी देखता है। ज़रूरत पर वह नुकसान के लिए ₹30 लाख तक, और समय व परेशानी के लिए ₹3 लाख तक मुआवज़े का फ़ैसला दे सकता है। जो मामला कोर्ट में चल रहा हो, वह यहाँ नहीं लिया जाता (पुलिस जाँच से रोक नहीं)।",
    actions: [
      { kind: "link", href: "https://cms.rbi.org.in", labelHi: "cms.rbi.org.in खोलें", external: true },
      { kind: "tel", number: "14448", labelHi: "RBI मदद: 14448 (मुफ़्त)" },
    ],
    sources: [RBIOS_FIRST_BANK, RBIOS_90_DAYS, RBIOS_FREE, RBIOS_COMPENSATION],
  },
];

// बैंक को भेजने का नमूना email: सिर्फ़ सीधी बात और ख़ाली जगहें [ ]। कोई क़ानूनी धारा नहीं (DISHA: वह वकील की
// जाँच के बाद ही)। पूरा खाता/card नंबर, OTP, PIN या password कभी न लिखें।
export const BANK_EMAIL_SAMPLES: readonly { lang: "hi" | "en"; labelHi: string; text: string }[] = [
  {
    lang: "hi",
    labelHi: "नमूना email (हिंदी)",
    text: `विषय: अनधिकृत लेन-देन / ठगी की शिकायत, खाता नंबर के आख़िरी 4 अंक [XXXX]

महोदय/महोदया,

मेरे खाते (आख़िरी 4 अंक [XXXX]) से [तारीख़] को [समय] बजे ₹[रकम] का लेन-देन हुआ, जो ठगी से हुआ है / जो मैंने नहीं किया।
लेन-देन नंबर (UTR): [UTR नंबर]
मैंने इसकी शिकायत 1930 / cybercrime.gov.in पर की है, शिकायत नंबर: [नंबर]

कृपया:
1. मेरे खाते/card पर आगे के लेन-देन तुरंत रोकें।
2. इस शिकायत का नंबर और पावती दें।
3. RBI के नियमों के अनुसार जाँच करके मेरी रकम लौटाने की कार्रवाई करें।

साथ में: पैसे कटने के SMS / statement के screenshot

नाम: [आपका नाम]
mobile: [आपका नंबर]`,
  },
  {
    lang: "en",
    labelHi: "नमूना email (English, अगर बैंक अंग्रेज़ी माँगे)",
    text: `Subject: Complaint of unauthorised / fraudulent transaction, account ending [XXXX]

Dear Sir/Madam,

A transaction of Rs [amount] was made from my account (ending [XXXX]) on [date] at [time]. This was a fraud / was not done by me.
Transaction reference (UTR): [UTR number]
I have reported it on 1930 / cybercrime.gov.in, complaint number: [number]

Please:
1. Block further transactions on my account/card immediately.
2. Give me a complaint number and acknowledgement.
3. Investigate as per RBI rules and take action to refund my money.

Attached: screenshots of the debit SMS / statement

Name: [your name]
Mobile: [your number]`,
  },
];
