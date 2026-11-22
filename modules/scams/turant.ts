// /turant (इमरजेंसी, पहले 60 मिनट) पन्नों का content।
// text spec और plan A1 (Task 5) की तालिकाओं से जस का तस है। copy बदले तो TURANT_CONTENT_VERSION बढ़ाएँ
// (service worker इसी से पुराना cache हटाता है)।

export const TURANT_CONTENT_VERSION = "2026-11-22.1";

export const TURANT_SLUGS = [
  "upi",
  "card",
  "netbanking",
  "wallet",
  "digital-arrest",
  "sextortion",
  "loan-app",
  "investment-task",
  "customer-care-fake",
  "pata-nahi",
] as const;

export type TurantSlug = (typeof TURANT_SLUGS)[number];

export type TurantAction =
  | { kind: "tel"; number: string; labelHi: string }
  | { kind: "link"; href: string; labelHi: string; external: boolean };

export type StepId =
  | "call_1930"
  | "tell_bank"
  | "block_card"
  | "written_complaint"
  | "keep_evidence"
  | "remove_app"
  | "stop_paying"
  | "dont_pay_threat"
  | "warn_contacts"
  | "report_women_child";

export type TurantStep = {
  id: StepId;
  titleHi: string;
  urgencyHi?: string;
  bodyHi: string;
  warningHi?: string;
  actions: TurantAction[];
};

export type TurantPage = {
  slug: TurantSlug;
  titleHi: string;
  banner?: { tone: "danger" | "warn"; textHi: string };
  steps: TurantStep[];
  showTeleManas: boolean;
  uploadAllowed: false;
};

export const TELE_MANAS: TurantAction = { kind: "tel", number: "14416", labelHi: "Tele-MANAS: 14416 (मुफ़्त)" };

const CALL_1930: TurantAction = { kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" };
const MY_BANK_LINK: TurantAction = { kind: "link", href: "/gyan/bank", labelHi: "अपने बैंक का सही रास्ता देखें", external: false };
const GOOGLE_WARNING = 'नंबर Google पर न खोजें। नकली "customer care" नंबर ठगी का बड़ा जाल हैं।';

const STEPS: Record<StepId, TurantStep> = {
  call_1930: {
    id: "call_1930",
    titleHi: "1930 पर call करें",
    urgencyHi: "पहले 30 मिनट सबसे कीमती",
    bodyHi: "लाइन न लगे तो रुकें नहीं, नीचे वाले link से online शिकायत करें।",
    actions: [
      CALL_1930,
      { kind: "link", href: "https://cybercrime.gov.in", labelHi: "cybercrime.gov.in पर शिकायत", external: true },
    ],
  },
  tell_bank: {
    id: "tell_bank",
    titleHi: "बैंक को आज ही बताएँ",
    bodyHi: 'बैंक के ऐप में "Report fraud" या "Block" वाला विकल्प खोलें, या बैंक की अपनी वेबसाइट पर दिया नंबर लगाएँ।',
    warningHi: GOOGLE_WARNING,
    actions: [MY_BANK_LINK],
  },
  block_card: {
    id: "block_card",
    titleHi: "Card तुरंत block करें",
    bodyHi: "बैंक के ऐप में card को block करें, फिर बैंक को बताएँ।",
    warningHi: GOOGLE_WARNING,
    actions: [MY_BANK_LINK],
  },
  written_complaint: {
    id: "written_complaint",
    titleHi: "बैंक को लिखित शिकायत भेजें (मुफ़्त)",
    bodyHi:
      "बैंक को email में लिखें: क्या हुआ, कब हुआ, कितने पैसे गए, और लेन-देन नंबर (UTR)। जवाब में मिली पावती सँभालकर रखें।",
    actions: [{ kind: "link", href: "/shikayat-rasta", labelHi: "शिकायत का पूरा रास्ता देखें", external: false }],
  },
  keep_evidence: {
    id: "keep_evidence",
    titleHi: "ये सँभालकर रखें",
    bodyHi: "लेन-देन नंबर (UTR) · ठग का नंबर या UPI ID · SMS, chat और call के screenshot · पैसे कटने का SMS",
    actions: [],
  },
  remove_app: {
    id: "remove_app",
    titleHi: "डलवाया गया ऐप हटाएँ",
    bodyHi:
      "AnyDesk, TeamViewer या जो भी ऐप उन्होंने डलवाया, उसे हटाएँ। फ़ोन का internet कुछ देर बंद रखें। फिर UPI PIN और banking password बदलें।",
    actions: [],
  },
  stop_paying: {
    id: "stop_paying",
    titleHi: "और पैसे न भेजें",
    bodyHi: '"withdraw fee", "tax" या "account unlock" के नाम पर माँगे गए पैसे भी ठगी हैं।',
    actions: [],
  },
  dont_pay_threat: {
    id: "dont_pay_threat",
    titleHi: "पैसे न भेजें, धमकी से न डरें",
    bodyHi: "धमकी देने वालों को पैसे देने से माँगें और बढ़ती हैं। बातचीत के screenshot सँभालकर रखें।",
    actions: [],
  },
  warn_contacts: {
    id: "warn_contacts",
    titleHi: "अपने लोगों को पहले से बता दें",
    bodyHi: "परिवार और दोस्तों को बता दें कि आपके नाम से आए अजीब संदेश या तस्वीरें नकली हो सकती हैं।",
    actions: [],
  },
  report_women_child: {
    id: "report_women_child",
    titleHi: "cybercrime.gov.in पर शिकायत करें",
    bodyHi: 'वहाँ "महिला/बच्चों से जुड़े अपराध" वाला हिस्सा चुनें। कोई भी तस्वीर किसी को न भेजें, हमें भी नहीं।',
    actions: [
      { kind: "link", href: "https://cybercrime.gov.in", labelHi: "cybercrime.gov.in खोलें", external: true },
      CALL_1930,
    ],
  },
};

const MONEY_GONE: StepId[] = ["call_1930", "tell_bank", "written_complaint", "keep_evidence"];

type PageDef = {
  titleHi: string;
  banner?: TurantPage["banner"];
  steps: StepId[];
  showTeleManas: boolean;
};

const PAGES: Record<TurantSlug, PageDef> = {
  upi: { titleHi: "UPI से पैसे गए", steps: MONEY_GONE, showTeleManas: false },
  card: {
    titleHi: "Card से पैसे कटे",
    steps: ["block_card", "call_1930", "written_complaint", "keep_evidence"],
    showTeleManas: false,
  },
  netbanking: { titleHi: "Net banking से पैसे गए", steps: MONEY_GONE, showTeleManas: false },
  wallet: { titleHi: "Wallet ऐप से पैसे गए", steps: MONEY_GONE, showTeleManas: false },
  "digital-arrest": {
    titleHi: "Digital arrest (पुलिस या CBI का डर)",
    banner: {
      tone: "danger",
      textHi: "कोई पुलिस, CBI या कोर्ट video call पर गिरफ़्तार नहीं करती। call काटिए। पैसे न भेजें।",
    },
    steps: MONEY_GONE,
    showTeleManas: false,
  },
  sextortion: {
    titleHi: "Video call से ब्लैकमेल",
    banner: { tone: "warn", textHi: "पैसे न दें। आप अकेले नहीं हैं, और यह आपकी गलती नहीं है।" },
    steps: ["dont_pay_threat", "report_women_child", "warn_contacts"],
    showTeleManas: true,
  },
  "loan-app": {
    titleHi: "Loan ऐप से धमकी",
    steps: ["dont_pay_threat", "warn_contacts", "call_1930", "keep_evidence"],
    showTeleManas: false,
  },
  "investment-task": {
    titleHi: "निवेश या task वाली कमाई में पैसे गए",
    steps: ["stop_paying", ...MONEY_GONE],
    showTeleManas: false,
  },
  "customer-care-fake": {
    titleHi: "नकली customer care या ऐप डलवाया",
    steps: ["remove_app", ...MONEY_GONE],
    showTeleManas: false,
  },
  "pata-nahi": { titleHi: "पता नहीं, बस पैसे कट गए", steps: MONEY_GONE, showTeleManas: false },
};

export function isTurantSlug(v: string): v is TurantSlug {
  return (TURANT_SLUGS as readonly string[]).includes(v);
}

// हर बार नया object, ताकि कोई ग़लती से साझा data न बदल दे
export function getTurantPage(slug: TurantSlug): TurantPage {
  const def = PAGES[slug];
  return structuredClone({
    slug,
    titleHi: def.titleHi,
    ...(def.banner ? { banner: def.banner } : {}),
    steps: def.steps.map((id) => STEPS[id]),
    showTeleManas: def.showTeleManas,
    uploadAllowed: false as const,
  });
}
