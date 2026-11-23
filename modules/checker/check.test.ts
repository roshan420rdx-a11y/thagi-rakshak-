import { expect, test } from "vitest";
import { checkMessage } from "@/modules/checker";

const ids = (t: string) => checkMessage(t).hits.map((h) => h.id);

// हर नियम: [id, पकड़ने वाले उदाहरण, न-पकड़ने वाले उदाहरण]
const CASES: [string, string[], string[]][] = [
  ["otp_request", ["Sir apna OTP bata dijiye verification ke liye", "कृपया आपके मोबाइल पर आया OTP बताइए", "Please share the OTP received on your phone"], ["123456 is your OTP for login. Do not share it with anyone. -SBI", "आपका OTP 4567 है। इसे किसी को न बताएँ।"]],
  ["receive_pin_qr", ["यह QR scan करके PIN डालिए, आपका cashback आपके खाते में आ जाएगा", "Scan this QR code to receive your refund", "Sir main army se hoon, aapka sofa kharidna hai, pehle main aapko 1 rupaya bhejta hoon, aap QR scan karke confirm karo"], ["दुकान पर QR scan करके भुगतान करें", "मैं आपको QR भेज रहा हूँ, scan करके ₹250 payment कर दीजिए"]],
  ["upi_request_pin", ["मैंने आपको ₹5,000 की request भेजी है, बस PIN डालकर accept कर लीजिए", "I have sent a collect request, approve it with your UPI PIN to receive money"], ["आपकी UPI payment सफल रही"]],
  ["digital_arrest", ["मैं पुलिस से बोल रहा हूँ। आपके नाम से भेजे गए पार्सल में ड्रग्स मिले हैं। आपको अभी digital arrest किया जा रहा है", "This is CBI officer, your Aadhaar is linked to a money laundering case, stay on video call"], ["पुलिस भर्ती की परीक्षा कल है"]],
  ["apk_file", ["हमारी बेटी की शादी में ज़रूर आइए, कार्ड भेज रहे हैं: Wedding_Invitation.apk"], ["ऐप Play Store से डाउनलोड करें"]],
  ["remote_app", ["AnyDesk download kariye, main theek kar dunga", "please install TeamViewer QuickSupport"], ["कल मिलते हैं"]],
  ["electricity_cut", ["प्रिय ग्राहक, आज रात 9:30 बजे आपकी बिजली काट दी जाएगी। तुरंत अधिकारी से संपर्क करें 98XXXXXX21", "Dear consumer your electricity power will be disconnected tonight at 9.30 pm please contact electricity officer"], ["कल सुबह 10 से 2 बजे तक मरम्मत के कारण बिजली बंद रहेगी"]],
  ["lottery_fee", ["Congratulations! You won Rs 25 lakh in KBC lottery. Pay Rs 15,000 processing fee", "आपने 25 लाख की लॉटरी जीती है, टैक्स जमा करें"], ["लॉटरी का टिकट मत ख़रीदना"]],
  ["blackmail", ["तुम्हारा video सबको भेज दूँगा, पैसे भेजो", "your video will be viral, pay now", "पैसे भेजो वरना तेरा video YouTube पर डाल दूँगा"], ["video call पर बात करते हैं", "Part time job: YouTube video like कीजिए, हर like पर ₹50", "YouTube पर नया video डाला है, देखकर बताना ₹500 का gift मिलेगा"]],
  ["loan_threat", ["loan नहीं भरा तो तेरी photo तेरे सारे contacts को भेज देंगे", "repay the loan or we will send your photos to all your contacts"], ["home loan की EMI इस महीने 5 तारीख़ को कटेगी"]],
  ["withdraw_fee", ["आपका मुनाफ़ा ₹1,20,000 हो गया है। निकालने के लिए 10% tax पहले जमा कीजिए।", "To withdraw your profit of Rs 80,000 pay 15% unlock fee"], ["ATM से पैसे निकालने पर 5 बार के बाद शुल्क लगता है"]],
  ["loan_advance_fee", ["Pre-approved loan of Rs 5 lakh! Pay Rs 2,999 processing fee to get disbursement today", "आपका ₹2 लाख का loan मंज़ूर है, पाने के लिए ₹1,500 फ़ीस पहले जमा करें", "Hello, aapke number par 2 lakh ka loan approve hua hai, sirf 2,000 file charge bhejo"], ["Your loan EMI of Rs 5,000 is due on 5th. Pay via the bank app to avoid late fee."]],
  ["biometric_ask", ["योजना का पैसा पाने के लिए अपना आधार नंबर और अंगूठे का निशान WhatsApp पर भेजें", "Send your Aadhaar number and fingerprint photo to verify"], ["आधार केंद्र पर जाकर अंगूठा लगाकर eKYC करवाएँ"]],
  ["sim_swap", ["आपका SIM 5G में upgrade होगा, अभी यह SMS भेजें: SIMUPG 20 अंकों का नंबर", "Your eSIM activation is pending, please send SMS with your 20 digit SIM number"], ["Jio: 5G अब आपके इलाके में उपलब्ध है"]],
  ["call_forward", ["delivery के लिए अभी *401* के बाद यह नंबर dial करें: 98XXXXXX12", "Please dial **21*9876543210# to reschedule your parcel", "dial *401*98XXXXXX12 now"], ["बैलेंस देखने के लिए *123# dial करें", "Dial *121*1# for offers"]],
  ["fake_alert_number", ["Dear customer, Rs 10,000 debited from your account. If not you, call 9876543210 immediately to block your card.", "आपके खाते से ₹25,000 कट गए हैं। यह आपने नहीं किया तो तुरंत 98XXXXXX21 पर call करें।"], ["Dear Customer, Rs.500.00 debited from A/c XX1234 on 20-11-26 to VPA shop@okaxis. Not you? Call 18001234567 -Bank"]],
  ["job_fee", ["बधाई हो! आपका चयन Railway में Clerk पद पर हुआ है। joining letter के लिए ₹4,500 registration fee आज ही जमा करें।", "Congratulations! You are selected for Data Entry job at Amazon. Pay Rs 1,999 for training kit and ID card to confirm your joining.", "Dubai में hotel की नौकरी, salary ₹80,000। visa और ticket के लिए ₹35,000 पहले भेजें, offer letter तुरंत मिलेगा।", "Work from home job, registration fee ₹999 only, earn ₹30,000 per month. Pay on this UPI."], ["RRB NTPC: Application fee ₹500 for General candidates. Apply only at the official website.", "आपका चयन हो गया है। joining 1 तारीख़ को है, कोई फ़ीस नहीं लगेगी।", "Interview call: You are shortlisted. Report on 5 Dec with documents.", "Congratulations! You are selected for the interview round. Pay is ₹25,000 per month.", "Selected! Salary ₹25,000, joining kit will be provided free."]],
  ["advance_fee", ["आपकी LIC policy का bonus ₹2,40,000 तैयार है। पाने के लिए ₹12,000 GST आज जमा करें।", "Hi dear, I sent you a gift with $50,000 cash. The courier company says pay ₹35,000 customs clearance fee to receive it.", "आपकी बेटी को ₹25,000 की scholarship मिली है, पाने के लिए ₹1,500 registration fee भेजें।"], ["Pay your LIC premium of ₹12,000 before 30 Nov to keep the policy active.", "To get your new card, visit the branch. No charges.", "नया passbook पाने के लिए ₹100 शुल्क शाखा के counter पर जमा करें।"]],
  ["relative_emergency", ["आपके बेटे का accident हो गया है, hospital में भर्ती है, तुरंत ₹50,000 भेजो", "Your son met with an accident, he is in ICU. Send Rs 40,000 immediately for operation."], ["Papa ka operation kal hai, hospital ka bill 40,000 aaya hai, maine bhar diya", "बेटा, शाम को सब्ज़ी लेते आना"]],
  ["recovery_fee", ["आपकी ठगी की रकम वापस दिलाने के लिए cyber cell की ओर से ₹5,000 processing fee जमा करें।", "We are a fund recovery agency. We can recover your lost money. Pay 10% advance fee of Rs 8,000 to start.", "Aapka paisa wapas dilwa denge, bas 2000 file charge bhejo", "मैं cyber cell से advocate बोल रहा हूँ। आपका ठगी वाला पैसा वापस दिला दूँगा, बस ₹5,000 fee पहले जमा करें।"], ["आपकी शिकायत पर ₹5,000 वापस आपके खाते में आ गए हैं।", "बैंक ने कहा है कि जाँच के बाद पैसा वापस मिलेगा, कोई fee नहीं लगेगी।", "गलती से आपके खाते में ₹5000 भेज दिए, प्लीज़ वापस कर दो"]],
  ["new_number_money", ["पापा, मेरा फ़ोन ख़राब हो गया, यह मेरा नया नंबर है। अभी ₹15,000 भेज दो", "Hi Mom, this is my new number, please send money urgently"], ["पापा, मेरा फ़ोन नंबर बदल गया है, नया नंबर सेव कर लो"]],
  ["new_number", ["Hi Mummy, ye mera new number hai, purana kharab ho gaya", "पापा, मेरा नंबर बदल गया है"], ["गाड़ी की नंबर प्लेट बदलवानी है"]],
  ["kyc_block", ["Your account will be blocked today, update KYC by clicking the link", "आपका खाता बंद हो जाएगा, तुरंत KYC अपडेट करें", "आपकी गैस subsidy रुकी है, KYC के लिए इस नंबर पर call करें 98XXXXXX21"], ["KYC के लिए शाखा में आधार लाएँ"]],
  ["task_job", ["Part-time job: video like कीजिए, हर like पर ₹50", "Work from home and earn 3000 daily by giving 5 star review"], ["कल office में meeting है"]],
  ["investment", ["पैसे दुगने करें 30 दिन में", "Join our VIP stock tips group, 300% return daily"], ["FD पर ब्याज दर 7% है"]],
  ["wrong_transfer", ["गलती से आपके खाते में ₹5000 भेज दिए, प्लीज़ वापस कर दो", "I sent money to you by mistake, please return it"], ["मैंने तुम्हें पैसे भेज दिए हैं"]],
  ["customer_care", ["Customer care: refund के लिए 9876543210 पर call करें", "For refund call our helpline 9876543210"], ["refund 3 दिन में आपके खाते में आ जाएगा"]],
  ["urgency", ["तुरंत करें, वरना आज ही बंद हो जाएगा", "URGENT: last chance to claim"], ["आराम से देख लेना"]],
  ["gov_lookalike", ["Your vehicle challan of Rs 500 is pending. Pay now at echallan-parivahan.xyz to avoid court action.", "Income Tax Dept: You are eligible for a refund of Rs 15,490. Click to verify your account: http://itr-refund.in", "PM Kisan की अगली किस्त पाने के लिए e-KYC करें: pmkisan-ekyc.online"], ["आपका ITR process हो गया है। देखें: incometax.gov.in", "Your challan has been paid. Receipt: echallan.parivahan.gov.in", "Your Amazon order has been shipped: amazon.in/track"]],
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

test("3 या ज़्यादा शक वाले निशान एक साथ → danger, 'कई निशान एक साथ' कारण सबसे ऊपर", () => {
  const r = checkMessage("Dear user your PAN card is blocked. Update immediately: bit.ly/xyz12");
  expect(r.level).toBe("danger");
  expect(r.hits[0].id).toBe("many_signals");
  expect(r.hits.filter((h) => h.level === "warn").length).toBeGreaterThanOrEqual(3);
});

test("2 शक वाले निशान → अब भी warn", () => {
  const r = checkMessage("URGENT: update KYC, account will be blocked");
  expect(r.hits.filter((h) => h.level === "warn").length).toBe(2);
  expect(r.level).toBe("warn");
  expect(r.hits.map((h) => h.id)).not.toContain("many_signals");
});

test("Hinglish समय-सीमा भी जल्दबाज़ी: '2 ghante me'", () => {
  expect(checkMessage("aapka SIM 2 ghante me band ho jayega").hits.map((h) => h.id)).toContain("urgency");
});

test.each([
  ["एक लंबा शब्द", "a".repeat(20_000)],
  ["बिंदु वाले टुकड़े", "a.".repeat(10_000)],
  ["बार-बार OTP", "otp ".repeat(5_000)],
  ["बार-बार link", "http://x.com ".repeat(1_600)],
  ["अंक ही अंक", "9".repeat(20_000)],
])("अजीब लंबा text भी जल्दी (%s, 200ms से कम)", (_n, t) => {
  const start = performance.now();
  checkMessage(t);
  expect(performance.now() - start).toBeLessThan(200);
});

test("'बताओ नहीं तो…' वाली धमकी में OTP माँगना अब भी पकड़ा जाए", () => {
  expect(checkMessage("OTP बताओ नहीं तो खाता बंद हो जाएगा").hits.map((h) => h.id)).toContain("otp_request");
});

// असली बैंक/कंपनी वाले message पर ग़लत निशान नहीं (भरोसा टूटता है): "SMS BLOCK" वाला निर्देश, "आपके कहने पर block हुआ",
// और "यह आपने नहीं किया तो तुरंत बताएँ" वाली असली जल्दी
test.each([
  "Your A/c XX1234 is debited for Rs.500.00 on 23-11-26. If not done by you, call 18001234567 or SMS BLOCK 1234 to 567676 -Bank",
  "Dear Customer, your debit card ending 1234 has been blocked as requested. For help call 18001234567.",
  "आपके खाते से ₹1,500 ATM से निकाले गए। यह आपने नहीं किया तो तुरंत 1800-XXX-XXXX पर संपर्क करें।",
  "Rs 10,000 has been transferred to Ramesh via IMPS. If not you, report fraud in the app immediately.",
  "Dear Customer, Your A/c XX1234 is debited for Rs.500.00 by UPI. If not done by you, call 18001234567 or SMS BLOCK 1234 to 9223008333 -Bank",
])("असली alert पर कोई निशान नहीं: %s", (m) => expect(ids(m)).toEqual([]));

test("पर ख़तरे वाली बातें अब भी: खाता बंद करने की धमकी, और धमकी वाली जल्दी", () => {
  expect(ids("Your account will be blocked today. Call 9876543210 to unblock")).toContain("kyc_block");
  expect(ids("आपका खाता बंद हो जाएगा, तुरंत KYC अपडेट करें")).toEqual(expect.arrayContaining(["kyc_block", "urgency"]));
});

test("WhatsApp का code माँगना: OTP वाला निशान, 'पुलिस/CBI' वाला नहीं ('secure account' अकेला digital arrest नहीं)", () => {
  const r = ids("We noticed unusual login on your WhatsApp. Share the 6 digit code sent to you to secure account");
  expect(r).toContain("otp_request");
  expect(r).not.toContain("digital_arrest");
  expect(ids("जाँच के लिए अपने सारे पैसे RBI के safe account में transfer करें")).toContain("digital_arrest");
});

test("advance_fee तभी, जब ज़्यादा ठीक निशान (लॉटरी, loan, नौकरी, निकासी) न मिले", () => {
  for (const m of ["बधाई हो! आपने KBC lottery में ₹25 लाख जीते हैं। इनाम पाने के लिए ₹12,500 GST जमा करें।", "आपका ₹2 लाख का loan मंज़ूर है, पाने के लिए ₹1,500 फ़ीस पहले जमा करें"]) {
    expect(ids(m), m).not.toContain("advance_fee");
  }
});
