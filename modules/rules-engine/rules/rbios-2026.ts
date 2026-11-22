// बैंक जवाब न दे या जवाब ठीक न लगे: RBI Ombudsman कब से और कब तक (RB-IOS 2026, 1 जुलाई 2026 से)।
// बैंक के जवाब का समय: 30 दिन, या RBI के नियमों में दिया ज़्यादा समय (2027 वाली ठगी: 76Q के 45/60 दिन;
// उससे पहले की: 2025 directions के 90 दिन)। उसके बाद 90 दिन के अंदर। तारीख़ें "संभावित": बैंक का कोई
// जवाब आया हो, तो 90 दिन उसकी तारीख़ से गिने जाते हैं, और वह तारीख़ हमें पता नहीं।
import { addDays, daysBetween } from "../dates";
import { SRC_RBIOS_2026 } from "../sources";
import type { FraudInput, RightResult, Rule } from "../types";

const RBIOS_MIN_WAIT = 30;
const RBIOS_WINDOW = 90;

function bankReplyDays(input: FraudInput): number {
  if (input.txnDate >= "2027-01-01") return input.crossBorder ? 60 : 45; // 76Q
  return 90; // 2025 directions: शिकायत का हल 90 दिन में
}

export const ombudsmanWindow: Rule = {
  id: "rbios2026.ombudsmanWindow",
  version: 1,
  titleHi: "बैंक जवाब न दे तो: RBI Ombudsman",
  txnFrom: null,
  txnTo: null,
  verifiedBy: ["claude"],
  source: {
    ...SRC_RBIOS_2026,
    paragraph: "RB-IOS 2026, FAQ 17",
    quote:
      "The complaint must be made to the RBI Ombudsman within 90 days from the date on which the above timeline expires or the date of the last communication from the concerned Regulated Entity, whichever is later.",
  },
  evaluate(input: FraudInput, today: string): RightResult | null {
    if (!input.reportedToBankOn) return null; // पहले बैंक को शिकायत ज़रूरी
    const opens = addDays(input.reportedToBankOn, Math.max(RBIOS_MIN_WAIT, bankReplyDays(input)));
    const closes = addDays(opens, RBIOS_WINDOW);
    const base = { ruleId: this.id, ruleVersion: this.version, titleHi: this.titleHi, source: this.source, verifiedBy: this.verifiedBy };
    const deadlines = [
      { labelHi: "बैंक का जवाब न आए, तो इस तारीख़ से RBI Ombudsman जा सकते हैं", date: opens, status: "likely" as const },
      { labelHi: "RBI Ombudsman की आख़िरी तारीख़ (अगर बैंक से कोई जवाब न आया हो)", date: closes, status: "likely" as const },
    ];
    const how = "शिकायत मुफ़्त है: cms.rbi.org.in पर (मदद: 14448)। साथ में बैंक वाली शिकायत का नंबर या पावती रखें।";
    if (daysBetween(closes, today) > 0) {
      return {
        ...base,
        status: "unclear",
        reasonsHi: [
          "बैंक से कोई जवाब न आया हो, तो 90 दिन की सीमा निकल चुकी लगती है। बैंक से बाद में कोई जवाब या बातचीत हुई हो, तो 90 दिन उस आख़िरी बातचीत की तारीख़ से गिने जाते हैं।",
          how,
        ],
        deadlines,
      };
    }
    return {
      ...base,
      status: "likely",
      reasonsHi: [
        "बैंक का जवाब ठीक न लगे, तो जवाब आने के बाद भी जा सकते हैं; तब 90 दिन उस जवाब की तारीख़ से गिने जाते हैं।",
        how,
      ],
      deadlines,
    };
  },
};
