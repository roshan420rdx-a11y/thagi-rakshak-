// rules engine के types। engine शुद्ध है: कोई database, network या Date.now() नहीं (आज की तारीख़ input में आती है)।

// confirmed = पक्का · likely = संभावित · unclear = साफ़ नहीं · not_eligible = हक़ नहीं बनता
export type Status = "confirmed" | "likely" | "unclear" | "not_eligible";

// ठगी कैसे हुई (RBI 4(15A) की परिभाषा से मिलाने के लिए)
export type HowHappened =
  | "credentials_taken" // OTP/PIN/password धोखे से लिया गया
  | "coerced" // दबाव या धमकी में ख़ुद मंज़ूरी दी (जैसे digital arrest)
  | "self_sent_deceived" // बिना दबाव, धोखे में ख़ुद पैसे भेजे (निवेश/task वाली ठगी)
  | "unauthorised" // बिना किसी मंज़ूरी के कटे
  | "unknown";

// गलती किसकी (आख़िरी फ़ैसला बैंक की जाँच से)
export type Fault = "bank" | "third_party" | "customer" | "unknown";
export type Instrument = "bank_account" | "credit_card" | "wallet";
// 2025 directions की Table 1 के लिए
export type AccountKind = "bsbd" | "savings" | "small_current_or_card" | "other_current_or_big_card" | "unknown";

export type FraudInput = {
  txnDate: string;
  grossLoss: number;
  recovered: number;
  customerType: "individual" | "sole_proprietor" | "other";
  howHappened: HowHappened;
  fault: Fault;
  instrument: Instrument;
  accountKind: AccountKind;
  reportedTo1930On: string | null;
  reportedToBankOn: string | null;
  priorCompensation: boolean;
  crossBorder: boolean;
};

export type Source = { file: string; url: string; paragraph: string; quote: string };
export type Deadline = { labelHi: string; date: string; status: "confirmed" | "likely" };

export type RightResult = {
  ruleId: string;
  ruleVersion: number;
  titleHi: string;
  status: Status;
  amount?: number;
  reasonsHi: string[];
  deadlines: Deadline[];
  source: Source;
  verifiedBy: string[];
};

export type Rule = {
  id: string;
  version: number;
  titleHi: string;
  txnFrom: string | null; // इस तारीख़ या बाद के लेन-देन पर
  txnTo: string | null; // इस तारीख़ तक के लेन-देन पर
  source: Source;
  verifiedBy: string[]; // "claude" = मूल text से मिलाया · "owner" = मालिक की दूसरी जाँच
  evaluate(input: FraudInput, today: string): RightResult | null;
};
