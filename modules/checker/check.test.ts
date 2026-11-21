import { expect, test } from "vitest";
import { checkMessage } from "@/modules/checker";

const ids = (t: string) => checkMessage(t).hits.map((h) => h.id);

// हर नियम: [id, पकड़ने वाले उदाहरण, न-पकड़ने वाले उदाहरण]
const CASES: [string, string[], string[]][] = [
  ["otp_request", ["Sir apna OTP bata dijiye verification ke liye", "कृपया आपके मोबाइल पर आया OTP बताइए", "Please share the OTP received on your phone"], ["123456 is your OTP for login. Do not share it with anyone. -SBI", "आपका OTP 4567 है। इसे किसी को न बताएँ।"]],
  ["receive_pin_qr", ["यह QR scan करके PIN डालिए, आपका cashback आपके खाते में आ जाएगा", "Scan this QR code to receive your refund"], ["दुकान पर QR scan करके भुगतान करें"]],
  ["upi_request_pin", ["मैंने आपको ₹5,000 की request भेजी है, बस PIN डालकर accept कर लीजिए", "I have sent a collect request, approve it with your UPI PIN to receive money"], ["आपकी UPI payment सफल रही"]],
  ["digital_arrest", ["मैं पुलिस से बोल रहा हूँ। आपके नाम से भेजे गए पार्सल में ड्रग्स मिले हैं। आपको अभी digital arrest किया जा रहा है", "This is CBI officer, your Aadhaar is linked to a money laundering case, stay on video call"], ["पुलिस भर्ती की परीक्षा कल है"]],
  ["apk_file", ["हमारी बेटी की शादी में ज़रूर आइए, कार्ड भेज रहे हैं: Wedding_Invitation.apk"], ["ऐप Play Store से डाउनलोड करें"]],
  ["remote_app", ["AnyDesk download kariye, main theek kar dunga", "please install TeamViewer QuickSupport"], ["कल मिलते हैं"]],
  ["electricity_cut", ["प्रिय ग्राहक, आज रात 9:30 बजे आपकी बिजली काट दी जाएगी। तुरंत अधिकारी से संपर्क करें 98XXXXXX21", "Dear consumer your electricity power will be disconnected tonight at 9.30 pm please contact electricity officer"], ["कल सुबह 10 से 2 बजे तक मरम्मत के कारण बिजली बंद रहेगी"]],
  ["lottery_fee", ["Congratulations! You won Rs 25 lakh in KBC lottery. Pay Rs 15,000 processing fee", "आपने 25 लाख की लॉटरी जीती है, टैक्स जमा करें"], ["लॉटरी का टिकट मत ख़रीदना"]],
  ["blackmail", ["तुम्हारा video सबको भेज दूँगा, पैसे भेजो", "your video will be viral, pay now"], ["video call पर बात करते हैं"]],
  ["loan_threat", ["loan नहीं भरा तो तेरी photo तेरे सारे contacts को भेज देंगे", "repay the loan or we will send your photos to all your contacts"], ["home loan की EMI इस महीने 5 तारीख़ को कटेगी"]],
  ["withdraw_fee", ["आपका मुनाफ़ा ₹1,20,000 हो गया है। निकालने के लिए 10% tax पहले जमा कीजिए।", "To withdraw your profit of Rs 80,000 pay 15% unlock fee"], ["ATM से पैसे निकालने पर 5 बार के बाद शुल्क लगता है"]],
  ["new_number", ["Hi Mummy, ye mera new number hai, purana kharab ho gaya", "पापा, मेरा नंबर बदल गया है"], ["गाड़ी की नंबर प्लेट बदलवानी है"]],
  ["kyc_block", ["Your account will be blocked today, update KYC by clicking the link", "आपका खाता बंद हो जाएगा, तुरंत KYC अपडेट करें"], ["KYC के लिए शाखा में आधार लाएँ"]],
  ["task_job", ["Part-time job: video like कीजिए, हर like पर ₹50", "Work from home and earn 3000 daily by giving 5 star review"], ["कल office में meeting है"]],
  ["investment", ["पैसे दुगने करें 30 दिन में", "Join our VIP stock tips group, 300% return daily"], ["FD पर ब्याज दर 7% है"]],
  ["wrong_transfer", ["गलती से आपके खाते में ₹5000 भेज दिए, प्लीज़ वापस कर दो", "I sent money to you by mistake, please return it"], ["मैंने तुम्हें पैसे भेज दिए हैं"]],
  ["customer_care", ["Customer care: refund के लिए 9876543210 पर call करें", "For refund call our helpline 9876543210"], ["refund 3 दिन में आपके खाते में आ जाएगा"]],
  ["urgency", ["तुरंत करें, वरना आज ही बंद हो जाएगा", "URGENT: last chance to claim"], ["आराम से देख लेना"]],
  ["link", ["details: http://bit.ly/abc123", "visit www.sbi-kyc-update.com now"], ["website का पता बाद में बताऊँगा"]],
];

test.each(CASES.flatMap(([id, yes]) => yes.map((t) => [id, t] as const)))("%s पकड़े: %s", (id, t) => expect(ids(t)).toContain(id));
test.each(CASES.flatMap(([id, , no]) => no.map((t) => [id, t] as const)))("%s न पकड़े: %s", (id, t) => expect(ids(t)).not.toContain(id));

test("स्तर: कोई danger → danger; सिर्फ़ warn → warn; कुछ नहीं → no_signals", () => {
  expect(checkMessage("AnyDesk download kariye, turant").level).toBe("danger");
  expect(checkMessage("URGENT: last chance to claim").level).toBe("warn");
  expect(checkMessage("कल शाम मिलते हैं").level).toBe("no_signals");
  expect(checkMessage("").level).toBe("no_signals");
});

test("danger वाले निशान पहले, कोई दोहराव नहीं", () => {
  const r = checkMessage("URGENT! AnyDesk डालो, तुरंत, तुरंत");
  expect(r.hits[0].level).toBe("danger");
  expect(new Set(r.hits.map((h) => h.id)).size).toBe(r.hits.length);
});

test("नुक़्ता वाले और बिना नुक़्ता वाले शब्द एक जैसे (गिरफ़्तार / गिरफ्तार)", () => {
  expect(ids("CBI: आपको गिरफ्तार किया जाएगा, video call पर रहिए")).toContain("digital_arrest");
  expect(ids("CBI: आपको गिरफ़्तार किया जाएगा, video call पर रहिए")).toContain("digital_arrest");
});

test("बहुत लंबा text भी जल्दी (20,000 अक्षर, 50ms से कम)", () => {
  const t = "नमस्ते ".repeat(3000);
  const start = performance.now();
  checkMessage(t);
  expect(performance.now() - start).toBeLessThan(50);
});
