// 1 जनवरी 2027 या बाद के लेन-देन: RBI (Responsible Business Conduct) Amendment Directions, 24 जून 2026
// (सातों तरह के बैंकों के लिए एक जैसे नियम; मूल text: docs/sources/rbi/)
import { addDays, daysBetween } from "../dates";
import { SRC_2026 } from "../sources";
import type { Deadline, FraudInput, RightResult, Rule } from "../types";

const VERIFIED = ["claude"];
const REPORT_DAYS = 5;

function result(rule: Rule, partial: Omit<RightResult, "ruleId" | "ruleVersion" | "titleHi" | "source" | "verifiedBy">): RightResult {
  return { ruleId: rule.id, ruleVersion: rule.version, titleHi: rule.titleHi, source: rule.source, verifiedBy: rule.verifiedBy, ...partial };
}

const withinDays = (from: string, to: string, n: number) => daysBetween(from, to) <= n;

export const zeroLiability: Rule = {
  id: "rbi2027.zeroLiability",
  version: 1,
  titleHi: "पूरा पैसा वापस (ज़ीरो ज़िम्मेदारी)",
  txnFrom: "2027-01-01",
  txnTo: null,
  verifiedBy: VERIFIED,
  source: {
    ...SRC_2026,
    paragraph: "76L, 76M, 76R",
    quote:
      "A customer shall be entitled to zero liability and reversal of the transaction in cases of third-party breach where the customer reports the unauthorised fraudulent EBT to the bank within five calendar days from the date of its occurrence.",
  },
  evaluate(input: FraudInput, today: string) {
    if (input.fault === "customer") return null;
    const deadlines: Deadline[] = [];
    if (input.instrument === "credit_card" && input.reportedToBankOn) {
      deadlines.push({ labelHi: "credit card पर अस्थायी वापसी (shadow reversal)", date: addDays(input.reportedToBankOn, REPORT_DAYS), status: "confirmed" });
    }
    if (input.fault === "bank") {
      return result(this, {
        status: "likely",
        reasonsHi: ["बैंक की गलती हो तो, रिपोर्ट करें या न करें, ज़िम्मेदारी ज़ीरो है और पूरा पैसा लौटता है (76L)।"],
        deadlines,
      });
    }
    if (input.fault === "unknown") {
      return result(this, {
        status: "unclear",
        reasonsHi: [
          "अगर गलती बैंक की, या बीच की किसी कंपनी (जैसे UPI ऐप, payment gateway, मोबाइल कंपनी) की निकली, तो पूरा पैसा वापस बनता है।",
          "गलती किसकी है, यह बैंक जाँच से तय करेगा, और साबित करने का बोझ बैंक पर है (76K)।",
        ],
        deadlines,
      });
    }
    // third-party (बीच की कंपनी) की गलती: 5 calendar days में बैंक को बताना ज़रूरी (76M)
    const lastDay = addDays(input.txnDate, REPORT_DAYS);
    if (input.reportedToBankOn) {
      if (withinDays(input.txnDate, input.reportedToBankOn, REPORT_DAYS)) {
        return result(this, { status: "likely", reasonsHi: ["5 दिन के अंदर बैंक को बताया गया, इसलिए ज़ीरो ज़िम्मेदारी बनती है (76M)।"], deadlines });
      }
      return result(this, { status: "unclear", reasonsHi: ["5 दिन के बाद बताया गया, इसलिए ज़िम्मेदारी बैंक की नीति के हिसाब से तय होगी (76M)।"], deadlines });
    }
    if (daysBetween(input.txnDate, today) <= REPORT_DAYS) {
      return result(this, {
        status: "likely",
        reasonsHi: ["अभी समय है: 5 दिन के अंदर बैंक को बताने पर ज़ीरो ज़िम्मेदारी बनती है (76M)।"],
        deadlines: [{ labelHi: "बैंक को इस तारीख़ तक बताएँ", date: lastDay, status: "confirmed" }, ...deadlines],
      });
    }
    return result(this, { status: "unclear", reasonsHi: ["5 दिन बीत चुके हैं, इसलिए ज़िम्मेदारी बैंक की नीति के हिसाब से तय होगी (76M)। फिर भी बैंक को तुरंत बताएँ।"], deadlines });
  },
};

export const smallValueCompensation: Rule = {
  id: "rbi2027.smallValueCompensation",
  version: 1,
  titleHi: "छोटी ठगी पर मुआवज़ा (ज़्यादा से ज़्यादा ₹25,000)",
  txnFrom: "2027-01-01",
  txnTo: "2028-01-01",
  verifiedBy: VERIFIED,
  source: {
    ...SRC_2026,
    paragraph: "76T(1), 76U",
    quote:
      "A bona fide victim, being an individual person, including a sole proprietor, and having lodged a complaint involving gross loss of an amount up to ₹50,000 on account of fraudulent EBT(s) covered under paragraph 76N above, shall be compensated 85 per cent of the net loss amount (calculated after reducing recoveries made, whether before or after paying the compensation, from the gross loss amount), or ₹25,000, whichever is less, once during her / his lifetime, subject to the following:",
  },
  evaluate(input: FraudInput, today: string) {
    if (input.fault === "bank" || input.fault === "third_party") return null; // उनके लिए ज़ीरो ज़िम्मेदारी वाला नियम
    const no = (reason: string) => result(this, { status: "not_eligible", reasonsHi: [reason], deadlines: [] });

    if (input.txnDate === "2028-01-01") {
      return result(this, { status: "unclear", reasonsHi: ['यह मुआवज़ा नियम लागू होने से "एक साल तक" की ठगी पर है (76U); आख़िरी दिन साफ़ नहीं।'], deadlines: [] });
    }
    if (input.customerType === "other") return no("यह मुआवज़ा सिर्फ़ व्यक्ति या sole proprietor के लिए है।");
    if (input.instrument === "wallet") {
      return result(this, { status: "unclear", reasonsHi: ["ये नियम बैंकों पर हैं; wallet कंपनी बैंक न हो तो साफ़ नहीं।"], deadlines: [] });
    }
    if (input.grossLoss > 50000) return no("कुल नुकसान ₹50,000 से ज़्यादा है।");
    if (input.priorCompensation) return no("यह मुआवज़ा ज़िंदगी में एक ही बार मिलता है।");
    const net = input.grossLoss - input.recovered;
    if (net <= 0) return no("कोई नुकसान बाकी नहीं।");

    // 1930/NCRP और बैंक, दोनों को 5 calendar days में (76T(1)(b))
    const lastDay = addDays(input.txnDate, REPORT_DAYS);
    const reports = [input.reportedTo1930On, input.reportedToBankOn];
    if (reports.some((d) => d !== null && !withinDays(input.txnDate, d, REPORT_DAYS))) {
      return no("1930 और बैंक, दोनों को 5 दिन के अंदर बताना ज़रूरी है।");
    }
    const deadlines: Deadline[] = [];
    if (reports.some((d) => d === null)) {
      if (daysBetween(input.txnDate, today) > REPORT_DAYS) return no("1930 और बैंक, दोनों को 5 दिन के अंदर बताना ज़रूरी है।");
      deadlines.push({ labelHi: "1930 और बैंक, दोनों को इस तारीख़ तक बताएँ", date: lastDay, status: "confirmed" });
    }

    const amount = Math.min(Math.round(net * 0.85), 25000);
    const common = [
      "बैंक जाँच करेगा कि नुकसान सही (bona fide) है; उसके बाद बैंक अर्ज़ी का फ़ॉर्म देगा, और अर्ज़ी मिलने के 5 दिन में भुगतान करना होता है (76T(4), 76T(5))।",
      "यह मुआवज़ा 2027 में हुई ठगी पर ही है (76U)।",
    ];
    if (input.howHappened === "self_sent_deceived") {
      return result(this, {
        status: "unclear",
        amount,
        amountLabelHi: "संभावित मुआवज़ा",
        reasonsHi: [
          "RBI की परिभाषा में धोखे से लिए गए OTP/PIN और दबाव या धमकी में दी गई मंज़ूरी शामिल है; बिना दबाव के ख़ुद भेजे पैसे पर नियम साफ़ नहीं (4(15A))।",
          ...common,
        ],
        deadlines,
      });
    }
    return result(this, { status: "likely", amount, amountLabelHi: "संभावित मुआवज़ा", reasonsHi: common, deadlines });
  },
};

export const bankResponseTime: Rule = {
  id: "rbi2027.bankResponseTime",
  version: 1,
  titleHi: "बैंक को कब तक जवाब देना है",
  txnFrom: "2027-01-01",
  txnTo: null,
  verifiedBy: VERIFIED,
  source: {
    ...SRC_2026,
    paragraph: "76Q",
    quote:
      "However, this timeline shall not exceed 45 calendar days from the date of receipt of the complaint by the bank in case of a complaint arising out of domestic fraudulent EBT(s) and 60 calendar days from the date of receipt of the complaint by the bank in case of a complaint arising out of cross-border fraudulent EBT(s).",
  },
  evaluate(input: FraudInput) {
    if (!input.reportedToBankOn) return null;
    return result(this, {
      status: "confirmed",
      reasonsHi: ["इसके बाद भी जवाब न आए या आप संतुष्ट न हों, तो RBI Ombudsman (cms.rbi.org.in) पर शिकायत कर सकते हैं।"],
      deadlines: [{ labelHi: "बैंक का जवाब", date: addDays(input.reportedToBankOn, input.crossBorder ? 60 : 45), status: "confirmed" }],
    });
  },
};

export const RBI_2027_RULES: readonly Rule[] = [zeroLiability, smallValueCompensation, bankResponseTime];
