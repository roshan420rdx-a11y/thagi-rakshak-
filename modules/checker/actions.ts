// "पहले पूछो" के नतीजे में "अभी यह करें" (TR-35): हर निशान के साथ उसी ठगी के हिसाब से 1-2 सीधे कदम।
// बातें वही जो ज्ञानकोश और /turant में हैं; कोई वादा नहीं। नंबर सिर्फ़ वे जो मूल स्रोत से मिलाए गए (1930, 112, 14416)।
import type { Hit } from "./check";

const NOW_1930 = "अभी 1930 पर call करें; जितनी जल्दी करेंगे, पैसा रुकने का उतना ज़्यादा मौका।";
const BLOCK_ALL = "अपने बैंक को बताकर card, UPI और net banking block करवाएँ, और शिकायत का नंबर सँभालकर रखें।";
const GONE_1930 = "पैसे जा चुके हों, तो अभी 1930 पर call करें।";
const NO_OTP = "OTP, PIN, CVV या password किसी को न बताएँ, चाहे वह ख़ुद को बैंक या पुलिस बताए।";
const TOLD_BANK = "बता दिया हो, तो तुरंत बैंक के अपने ऐप से या card के पीछे वाले नंबर पर call करके card और UPI block करवाएँ।";
const NO_QR = "QR scan न करें, PIN न डालें, और कोई request accept न करें।";
const RECEIVE_ID = "पैसे लेने हों, तो सिर्फ़ अपना UPI ID या नंबर दें; पैसा आया या नहीं, अपने बैंक के ऐप में ख़ुद देखें।";
const NO_APP = "किसी के कहने पर कोई ऐप या फ़ाइल न डालें।";
const APP_INSTALLED = "डाल लिया हो, तो फ़ोन का internet बंद करें, वह ऐप हटाएँ, फिर बैंक को बताएँ और UPI PIN व password बदलें।";
const HANG_UP = "call काटें, video call पर न रहें, और कोई पैसा न भेजें।";
const TELL_FAMILY = "घर में किसी को तुरंत बताएँ; डर लगे तो 112 पर call करें।";
const NO_LINK = "link न खोलें और उस पर कुछ न भरें; बैंक या विभाग की साइट का पता ख़ुद टाइप करें।";
const FILLED = "भर दिया हो, तो बैंक से card और net banking block करवाएँ, और password बदलें।";
const NO_FEE = "कोई fee या \"पहले पैसे\" न भेजें, चाहे वे \"आख़िरी बार\" कहें।";
const NO_MSG_NUMBER = "message में दिए नंबर पर call न करें; कंपनी का नंबर उसके अपने ऐप, बिल या दफ़्तर से लें।";
const BLACKMAIL = "पैसे न दें; chat और नंबर के screenshot रखें, फिर उस नंबर को block करें।";
const REPORT = "cybercrime.gov.in पर शिकायत करें, या 1930 पर call करें।";
const TELE_MANAS = "मन भारी हो, तो Tele-MANAS 14416 पर बात करें (मुफ़्त)।";
const VERIFY_PERSON = "पैसे भेजने से पहले उसी इंसान को उसके पुराने, जाने-पहचाने नंबर पर call करके पक्का करें।";
const NO_ACCOUNT = "अपना खाता, ATM card, UPI या SIM किसी को न दें, commission के लालच में भी नहीं।";
const NO_DIAL = "किसी के कहने पर कोई code (जैसे *401*) dial न करें, न कोई SMS भेजें।";
const SIM_GONE = "अचानक network चला जाए, तो अपनी mobile कंपनी के store या ऐप से SIM block करवाएँ और बैंक को बताएँ।";
const AADHAAR = "आधार नंबर या अंगूठे के निशान की photo न भेजें; myAadhaar में biometric lock करें।";
const CHECK_OWN = "बैंक या कंपनी के अपने ऐप या शाखा से जाँचें, message के link या नंबर से नहीं।";
const CHECK_GOV = "विभाग की .gov.in साइट या उसका toll-free नंबर ख़ुद खोलकर जाँचें, message के link या नंबर से नहीं।";
const NO_INVEST = "पैसे न लगाएँ; \"पहले थोड़ा कमाओ, फिर बड़ा लगाओ\" ठगी का आम तरीका है।";
const WRONG_TRANSFER = "पैसे वापस न भेजें; पहले अपने बैंक के ऐप में देखें कि सच में आए हैं या नहीं, और आए हों तो बैंक को बताएँ।";
const REASSURE = "\"कोई ख़तरा नहीं\" सुनकर जल्दी में कुछ न करें; पहले किसी अपने से पूछ लें।";
const GENERIC = "जवाब न दें, link न खोलें, कोई पैसा न भेजें; पहले किसी अपने से पूछ लें।";

export const RULE_ACTIONS: Readonly<Record<string, readonly string[]>> = {
  money_lost: [NOW_1930, BLOCK_ALL],
  otp_request: [NO_OTP, TOLD_BANK],
  card_secret_ask: [NO_OTP, TOLD_BANK],
  receive_pin_qr: [NO_QR, RECEIVE_ID],
  upi_request_pin: [NO_QR, RECEIVE_ID],
  request_accept: [NO_QR, RECEIVE_ID],
  digital_arrest: [HANG_UP, TELL_FAMILY],
  details_link: [NO_LINK, FILLED],
  app_install_ask: [NO_APP, APP_INSTALLED],
  apk_file: [NO_APP, APP_INSTALLED],
  remote_app: [NO_APP, APP_INSTALLED],
  electricity_cut: [NO_MSG_NUMBER],
  lottery_fee: [NO_FEE, GONE_1930],
  withdraw_fee: [NO_FEE, GONE_1930],
  loan_advance_fee: [NO_FEE, GONE_1930],
  job_fee: [NO_FEE, GONE_1930],
  recovery_fee: [NO_FEE, GONE_1930],
  advance_fee: [NO_FEE, GONE_1930],
  blackmail: [BLACKMAIL, REPORT, TELE_MANAS],
  loan_threat: [BLACKMAIL, REPORT],
  account_rent: [NO_ACCOUNT],
  new_number_money: [VERIFY_PERSON],
  relative_emergency: [VERIFY_PERSON],
  new_number: [VERIFY_PERSON],
  biometric_ask: [AADHAAR],
  sim_swap: [NO_DIAL, SIM_GONE],
  call_forward: [NO_DIAL, SIM_GONE],
  kyc_block: [CHECK_OWN],
  bank_lookalike: [CHECK_OWN],
  customer_care: [CHECK_OWN],
  fake_alert_number: [CHECK_OWN],
  gov_lookalike: [CHECK_GOV],
  gov_number: [CHECK_GOV],
  task_job: [NO_INVEST],
  investment: [NO_INVEST],
  reassurance: [REASSURE],
  wrong_transfer: [WRONG_TRANSFER],
  urgency: [GENERIC],
  link: [GENERIC],
  many_signals: [GENERIC],
};

// नतीजे के निशानों के क्रम में, दोहराव हटाकर, ज़्यादा से ज़्यादा 4 कदम
export function actionsFor(hits: readonly Pick<Hit, "id">[], max = 4): string[] {
  const out: string[] = [];
  for (const h of hits) for (const line of RULE_ACTIONS[h.id] ?? []) if (!out.includes(line)) out.push(line);
  return out.slice(0, max);
}
