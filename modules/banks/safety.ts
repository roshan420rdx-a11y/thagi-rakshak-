// बैंक से जुड़े सुरक्षा-सुझाव। हर सुझाव (एक को छोड़कर) RBI के मूल text पर टिका है; quote की जाँच safety.test.ts करता है।
const SRC_2026 = "docs/sources/rbi/2026-06-24-commercial-banks-rbc-third-amendment.txt";
const SRC_BANK_IN = "docs/sources/rbi/2025-04-22-bank-in-domain.txt";

export type BankTip = { id: string; textHi: string; source: { file: string; paragraph: string; quote: string } | null };

export const BANK_TIPS: readonly BankTip[] = [
  {
    id: "bank_in",
    textHi:
      'बैंक की असली वेबसाइट का पता ".bank.in" पर ख़त्म होता है। RBI ने बैंकों को 31 अक्टूबर 2025 तक इसी पते पर आने को कहा था। ".com" या मिलता-जुलता कोई और पता हो, तो सावधान रहें।',
    source: {
      file: SRC_BANK_IN,
      paragraph: "RBI/2025-26/28, para 3",
      quote:
        "All banks are advised to commence the migration of their existing domains to the ‘.bank.in’ domain and complete the process at the earliest and in any case, not later than October 31, 2025.",
    },
  },
  {
    id: "card_back",
    textHi: 'बैंक का नंबर अपने debit card के पीछे, passbook में, या बैंक के अपने ऐप में देखें। Google पर न खोजें, क्योंकि वहाँ नकली "customer care" नंबर बहुत हैं।',
    source: null,
  },
  {
    id: "home_link",
    textHi: "1 जनवरी 2027 से हर बैंक की वेबसाइट और ऐप के पहले पन्ने पर ठगी report करने का सीधा link होना ज़रूरी है।",
    source: {
      file: SRC_2026,
      paragraph: "76G(3)",
      quote: "provide a direct link on the home page of its website and mobile application, if available, for reporting fraudulent EBTs.",
    },
  },
  {
    id: "channels_24x7",
    textHi: "बैंक को 24 घंटे ठगी report करने के रास्ते देने होते हैं: फ़ोन, SMS, email, toll-free नंबर, या अपनी शाखा।",
    source: {
      file: SRC_2026,
      paragraph: "76G(1)",
      quote:
        "provide customers with 24x7 access through channels such as phone banking, SMS, instant messaging, dedicated email address, IVR, a dedicated toll-free helpline, reporting to home branch, etc., for reporting fraudulent EBTs",
    },
  },
  {
    id: "sms_reply",
    textHi: "लेन-देन वाले SMS में ही एक नंबर होना चाहिए, जिस पर SMS भेजकर आप तुरंत आपत्ति दर्ज कर सकें।",
    source: {
      file: SRC_2026,
      paragraph: "76G(2)",
      quote: "provide a number in the transaction alert SMS itself, to which the customer can immediately send an SMS to notify her / his objection, if any",
    },
  },
  {
    id: "ack",
    textHi: "शिकायत करते ही बैंक को शिकायत नंबर, तारीख़ और समय के साथ तुरंत पावती भेजनी होती है। उसे सँभालकर रखें।",
    source: {
      file: SRC_2026,
      paragraph: "76I",
      quote: "sends an immediate acknowledgement to the customer, along with the complaint number and the date and time of receipt of the complaint",
    },
  },
];
