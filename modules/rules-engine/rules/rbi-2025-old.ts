// 1 जनवरी 2027 से पहले के लेन-देन: RBI (Commercial Banks - Responsible Business Conduct) Directions, 2025, paragraphs 67-73
// (मूल text: docs/sources/rbi/2025-commercial-banks-rbc-directions-paras-67-73.txt)
import { addDays, addWorkingDays, workingDaysBetween } from "../dates";
import { SRC_2025 } from "../sources";
import type { AccountKind, Deadline, FraudInput, RightResult, Rule } from "../types";

// Table 1: 4 से 7 कार्य-दिवस में बताने पर ग्राहक की ज़्यादा से ज़्यादा ज़िम्मेदारी (प्रति लेन-देन)
const TABLE_1: Record<Exclude<AccountKind, "unknown">, number> = {
  bsbd: 5000,
  savings: 10000,
  small_current_or_card: 10000,
  other_current_or_big_card: 25000,
};

const COUNTING_NOTE = "दिन उस दिन से गिने गए हैं जब बैंक का SMS या alert आया (लेन-देन का दिन माना गया); रविवार और दूसरे/चौथे शनिवार नहीं गिने, सरकारी छुट्टियाँ नहीं घटाईं।";

export const liability2025: Rule = {
  id: "rbi2025.liability",
  version: 1,
  titleHi: "आपकी ज़िम्मेदारी कितनी (2027 से पहले के लेन-देन)",
  txnFrom: null,
  txnTo: "2026-12-31",
  verifiedBy: ["claude"],
  source: {
    ...SRC_2025,
    paragraph: "67, 68, 70, 72, 73",
    quote:
      "Third party breach where the deficiency lies neither with the bank nor with the customer but lies elsewhere in the system, and the customer notifies the bank within three working days of receiving the communication from the bank regarding the unauthorised transaction.",
  },
  evaluate(input: FraudInput, today: string) {
    const make = (partial: Pick<RightResult, "status" | "reasonsHi" | "deadlines"> & { amount?: number; amountLabelHi?: string }): RightResult => ({
      ruleId: this.id,
      ruleVersion: this.version,
      titleHi: this.titleHi,
      source: this.source,
      verifiedBy: this.verifiedBy,
      ...partial,
    });

    const deadlines: Deadline[] = [];
    if (input.reportedToBankOn) {
      deadlines.push({ labelHi: "अस्थायी वापसी (shadow credit), बैंक को बताने से 10 कार्य-दिवस में", date: addWorkingDays(input.reportedToBankOn, 10), status: "likely" });
      deadlines.push({ labelHi: "शिकायत का हल, ज़्यादा से ज़्यादा", date: addDays(input.reportedToBankOn, 90), status: "confirmed" });
    }

    if (input.fault === "bank") {
      return make({ status: "likely", reasonsHi: ["बैंक की गलती पर ज़ीरो ज़िम्मेदारी, रिपोर्ट करें या न करें (para 67(1))।"], deadlines });
    }
    if (input.fault === "customer") {
      return make({
        status: "likely",
        reasonsHi: [
          "OTP/PIN जैसी जानकारी देने पर, बैंक को बताने तक का नुकसान ग्राहक का माना जाता है; बताने के बाद का बैंक का (para 68(1))।",
          "2027 वाला ₹25,000 का मुआवज़ा 2027 से पहले की ठगी पर लागू नहीं है। फिर भी 1930 पर शिकायत ज़रूर करें; ठग के खाते में पैसा रुका हो तो वापस आ सकता है।",
        ],
        deadlines,
      });
    }
    if (input.fault === "unknown") {
      return make({
        status: "unclear",
        reasonsHi: [
          "बैंक की, या बीच की किसी कंपनी की गलती निकली, तो जल्दी बताने पर ज़िम्मेदारी ज़ीरो या सीमित है।",
          "गलती किसकी है, यह बैंक तय करेगा; साबित करने का बोझ बैंक पर है (para 75)।",
        ],
        deadlines,
      });
    }

    // third-party (बीच की कंपनी) की गलती: 3 / 4-7 / 7+ कार्य-दिवस (para 67(2), 68(2), 70)
    // बैंक को अभी बताया ही न हो, तो "आज बताने पर" का हिसाब दिखता है (और शब्द भी वैसे): "बताया" लिखना ग़लत होता
    const reported = input.reportedToBankOn !== null;
    const w = workingDaysBetween(input.txnDate, input.reportedToBankOn ?? today);
    const when = reported ? "बताया" : "आज बताएँ तो";
    if (w <= 3) {
      if (!reported) {
        deadlines.unshift({ labelHi: "ज़ीरो ज़िम्मेदारी के लिए बैंक को इस तारीख़ तक बताएँ", date: addWorkingDays(input.txnDate, 3), status: "likely" });
      }
      return make({ status: "likely", reasonsHi: ["3 कार्य-दिवस के अंदर बताने पर ज़िम्मेदारी ज़ीरो है।", COUNTING_NOTE], deadlines });
    }
    if (w <= 7) {
      // 3 कार्य-दिवस की ज़ीरो-ज़िम्मेदारी वाली खिड़की निकल चुकी; जो बचा है वह है 7 कार्य-दिवस तक की सीमित ज़िम्मेदारी: उसकी आख़िरी तारीख़
      if (!reported) {
        deadlines.unshift({ labelHi: "ज़िम्मेदारी सीमित रहे, इसके लिए बैंक को इस तारीख़ तक बताएँ", date: addWorkingDays(input.txnDate, 7), status: "likely" });
      }
      if (input.accountKind === "unknown") {
        return make({ status: "unclear", reasonsHi: [`4 से 7 कार्य-दिवस में ${reported ? "बताने पर" : "बताने पर (आज बताएँ तो यही हालत है)"} ज़िम्मेदारी सीमित है: खाते के प्रकार के हिसाब से ₹5,000, ₹10,000 या ₹25,000 तक (Table 1)।`, COUNTING_NOTE], deadlines });
      }
      const cap = Math.min(TABLE_1[input.accountKind], input.grossLoss);
      const urgency = reported ? [] : ["जितनी देर होगी, ज़िम्मेदारी उतनी बढ़ सकती है (7 कार्य-दिवस के बाद बैंक की नीति के हिसाब से तय होती है), इसलिए आज ही बैंक को बताएँ।"];
      return make({ status: "likely", amount: cap, amountLabelHi: "आपकी ज़्यादा से ज़्यादा ज़िम्मेदारी", reasonsHi: [`4 से 7 कार्य-दिवस में ${when}, ${reported ? "इसलिए " : ""}आपकी ज़िम्मेदारी ज़्यादा से ज़्यादा ₹${cap.toLocaleString("en-IN")} (प्रति लेन-देन, Table 1); बाकी बैंक का।`, ...urgency, COUNTING_NOTE], deadlines });
    }
    return make({ status: "unclear", reasonsHi: [`7 कार्य-दिवस के बाद ${reported ? "बताया" : "बता रहे हैं"}, इसलिए ज़िम्मेदारी बैंक की नीति के हिसाब से तय होगी (para 69)।${reported ? "" : " फिर भी देर न करें: आज ही बैंक को लिखकर बताएँ।"}`, COUNTING_NOTE], deadlines });
  },
};
